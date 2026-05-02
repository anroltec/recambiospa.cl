Sitio de Recambio SPA construido con [Next.js](https://nextjs.org) 16, React 19 y Tailwind CSS 4.

## Desarrollo local

1. Crea o completa tus variables en `.env.local`.
2. Levanta el servidor:

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Variables de entorno

### Shopify

- `SHOPIFY_STORE_DOMAIN`: dominio `*.myshopify.com` de la tienda.
- `SHOPIFY_STOREFRONT_ACCESS_TOKEN`: token de Storefront API usado por catalogo, carrito y checkout. Puede ser publico o privado; si es privado, este proyecto lo envia con el header server-side correcto.
- `SHOPIFY_ADMIN_ACCESS_TOKEN`: token de Admin API usado para leer pedidos pagados.
- `SHOPIFY_API_SECRET`: secret de la app, usado para validar la firma HMAC del webhook.
- `SHOPIFY_WEBHOOK_BASE_URL`: URL publica base para los webhooks, por ejemplo `https://recambiospa.cl/api/shopify/webhooks`.

Importante: la `SHOPIFY_API_SECRET` por si sola no habilita la integracion completa. Para que funcionen carrito, checkout y el webhook `orders/paid`, tambien deben existir el dominio y ambos tokens.

### Defontana

- `DEFONTANA_CLIENT`
- `DEFONTANA_COMPANY`
- `DEFONTANA_USER`
- `DEFONTANA_PASSWORD`
- `DEFONTANA_SELLER_CODE`
- `DEFONTANA_WAREHOUSE_CODE`
- `DEFONTANA_PRICE_LIST_CODE`
- `DEFONTANA_DOCUMENT_TYPE`

## Flujo Shopify implementado

- `src/app/api/shopify/cart/route.ts`: crea y consulta carritos en Shopify.
- `src/app/api/shopify/cart/lines/route.ts`: agrega, actualiza y elimina lineas del carrito.
- `src/app/api/shopify/webhooks/orders-paid/route.ts`: valida la firma del webhook y prepara la sincronizacion del pedido pagado hacia Defontana.
- `src/lib/shopify.ts`: cliente Storefront API.
- `src/lib/shopify-admin.ts`: cliente Admin API para pedidos.
- `src/lib/shopify-webhooks.ts`: verificacion HMAC del webhook.

## Pendiente para cerrar la integracion

1. Completar `SHOPIFY_STORE_DOMAIN`, `SHOPIFY_STOREFRONT_ACCESS_TOKEN` y `SHOPIFY_ADMIN_ACCESS_TOKEN`.
2. Configurar en Shopify el webhook `orders/paid` apuntando a `/api/shopify/webhooks/orders-paid`.
3. Completar las credenciales de Defontana para pasar de `draft` a sincronizacion real del pedido.
