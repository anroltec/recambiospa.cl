# Panel de clientes B2B

## Objetivo

Implementar un panel de clientes en este proyecto Next.js para que cada cliente pueda:

- iniciar sesion con su cuenta de Shopify
- ver su historial de compras
- completar y editar su perfil empresa/facturacion
- dejar disponible esa informacion para la integracion con Defontana

## Decisiones cerradas

1. No se agregara un backend intermedio separado. La logica server-side vive en el mismo Next.js mediante Route Handlers y modulos `server-only`.
2. La autenticacion del cliente vive en Shopify.
3. El perfil empresa/facturacion se guarda en Shopify, no en una base externa.
4. El historial de pedidos se consulta desde Shopify.
5. Los datos se reparten entre `customer`, `defaultAddress` y `customer metafields`.

## Alcance del MVP

El MVP resuelve:

- login de cliente
- sesion segura en Next
- perfil empresa/facturacion
- historial de compras
- uso del perfil en el webhook `orders-paid`

Queda fuera del MVP:

- favoritos
- cotizaciones
- multiples empresas por usuario
- multiples direcciones administradas desde el panel
- roles por empresa

## Arquitectura propuesta

### Shopify

Responsable de:

- identidad del cliente
- email y datos base del customer
- direccion principal del cliente
- pedidos
- metafields del cliente para datos tributarios

### Next.js

Responsable de:

- renderizar `/cuenta`
- verificar sesion en cada request protegida
- exponer endpoints internos para perfil y pedidos
- orquestar llamadas a Shopify

## Estrategia de autenticacion

### Recomendacion de producto

Shopify hoy recomienda `Customer Account API` como objetivo para customer accounts headless.

### Decision para este repo

Para este proyecto se implementa primero:

1. **MVP rapido**: autenticacion con `Storefront API` usando `customerAccessTokenCreate`.
2. **Evolucion**: migrar despues a `Customer Account API` si se necesita el flujo moderno de cuentas.

### Motivo

El repo ya esta integrado a Shopify via Storefront API y Admin API. Eso hace mas eficiente partir con `customerAccessTokenCreate`.

### Sesion en Next

No se debe guardar el token de Shopify en `localStorage`.

Se debe:

- autenticar al cliente en un Route Handler server-side
- guardar una cookie `HttpOnly`, `Secure`, `SameSite=Lax`
- firmar la sesion con `SESSION_SECRET`
- guardar al menos:
  - `shopifyCustomerAccessToken`
  - `shopifyCustomerId`
  - `email`
  - `expiresAt`

## Modelo de datos en Shopify

### Estados del perfil

El perfil puede nacer incompleto al primer login y pasar por estos estados:

- `draft`
- `complete`

### Customer

- `email`
- `firstName`
- `lastName`
- `phone`

### Default address

- `company` -> `razon_social`
- `address1`
- `address2`
- `city` -> `billing_city`
- `province` -> `billing_region`
- `zip`
- `country`

### Customer metafields

- `rut`
- `giro`
- `billing_comuna`
- `billing_notes`

## Nota importante para Chile

Shopify no trae un campo nativo separado para `comuna`. En esta implementacion:

- `billing_city` va en `defaultAddress.city`
- `billing_comuna` va en un `metafield`

## Fuentes de verdad

### Datos que se leen desde Shopify

- identidad del cliente
- pedidos
- nombre y email base
- direccion principal
- datos tributarios via metafields

## Estructura actual del codigo

```text
src/
  app/
    api/
      customer/
        auth/
          login/
            route.ts
          logout/
            route.ts
        orders/
          route.ts
        profile/
          route.ts
  lib/
    customer-account/
      session.ts
      shopify.ts
  types/
    customer.ts
```

## Data access layer

La capa `src/lib/customer-account/*` es `server-only`.

Responsabilidades:

- resolver sesion actual
- obtener el customer actual desde Shopify
- leer metafields del customer
- actualizar customer, default address y metafields
- mapear DTOs seguros hacia la UI

## Rutas internas implementadas

### `POST /api/customer/auth/login`

Entrada:

```json
{
  "email": "cliente@empresa.cl",
  "password": "******"
}
```

Responsabilidad:

- llamar a Shopify
- crear sesion en cookie
- devolver el perfil actual del cliente

### `POST /api/customer/auth/logout`

Responsabilidad:

- invalidar cookie local
- intentar revocar el customer access token en Shopify

### `POST /api/customer/auth/recover`

Entrada:

```json
{
  "email": "cliente@empresa.cl"
}
```

Responsabilidad:

- disparar `customerRecover` en Shopify
- devolver respuesta generica para no exponer si el correo existe o no

### `POST /api/customer/auth/reset`

Entrada:

```json
{
  "resetUrl": "https://tienda.myshopify.com/account/reset/...",
  "password": "******",
  "confirmPassword": "******"
}
```

Responsabilidad:

- consumir `customerResetByUrl`
- crear una nueva sesion local con el token devuelto por Shopify

### `POST /api/customer/auth/password`

Entrada:

```json
{
  "currentPassword": "******",
  "newPassword": "******",
  "confirmPassword": "******"
}
```

Responsabilidad:

- exigir sesion activa
- reautenticar al cliente con su password actual
- cambiar password con `customerUpdate`
- rotar la cookie local porque Shopify invalida los tokens anteriores

### `GET /api/customer/profile`

Responsabilidad:

- validar sesion
- leer `customer`
- leer `defaultAddress`
- leer metafields tributarios

### `PUT /api/customer/profile`

Entrada:

```json
{
  "firstName": "Juan",
  "lastName": "Perez",
  "phone": "+56911111111",
  "rut": "76.123.456-7",
  "razonSocial": "Transportes Perez SpA",
  "giro": "Transporte de carga",
  "billingAddressLine1": "Av. Siempre Viva 123",
  "billingAddressLine2": "Oficina 4",
  "billingComuna": "Quilicura",
  "billingCity": "Santiago",
  "billingRegion": "RM",
  "billingPostalCode": "0000000",
  "billingCountryCode": "CL",
  "billingNotes": "Recibir factura por correo"
}
```

Responsabilidad:

- validar sesion
- validar payload
- normalizar RUT
- actualizar `customer`
- crear o actualizar `defaultAddress`
- actualizar metafields

### `GET /api/customer/orders`

Responsabilidad:

- validar sesion
- leer pedidos del customer autenticado desde Shopify
- devolver resumen paginado

## Variables de entorno

Definidas en [.env.example](</D:/work/recambiospa.cl/.env.example:1>):

- `SESSION_SECRET`
- `SHOPIFY_CUSTOMER_AUTH_MODE`
- `SHOPIFY_CUSTOMER_SESSION_COOKIE`
- `SHOPIFY_CUSTOMER_METAFIELD_NAMESPACE`

## Integracion con Defontana

El webhook [src/app/api/shopify/webhooks/orders-paid/route.ts](</D:/work/recambiospa.cl/src/app/api/shopify/webhooks/orders-paid/route.ts:1>) debe enriquecerse asi:

1. recibir pedido pagado
2. obtener el order desde Shopify Admin API
3. resolver `shopify_customer_id`
4. leer customer, direccion principal y metafields
5. mezclar:
   - datos del pedido
   - datos empresa/facturacion
6. enviar a Defontana

## Limitaciones de esta variante

- Shopify no garantiza unicidad global de `rut` como lo haria una BD propia.
- `comuna` requiere metafield porque no existe como campo nativo.
- si despues quieren auditoria, validaciones avanzadas o multiples empresas, convendra volver a evaluar una BD propia.

## Estado actual

Implementado en el repo:

1. handlers de login, logout, profile y orders
2. sesion segura en cookie `HttpOnly`
3. UI funcional en:
   - `/cuenta`
   - `/cuenta/empresa`
   - `/cuenta/pedidos`

## Lo que falta para el flujo funcional completo

1. cargar variables reales en Vercel
2. validar scopes y configuracion de la app de Shopify
3. probar con customers reales de Shopify
4. enriquecer el webhook `orders-paid` con customer, direccion y metafields
5. el storefront ahora intercepta links nativos de Shopify con formato `/account/reset/...`
   - redirige server-side hacia `/cuenta/restablecer?reset_url=...`
   - personalizar la plantilla del email sigue siendo opcional, pero ya no es requisito para que el flujo funcione
