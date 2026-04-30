"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  CreditCard,
  Mail,
  MessageCircle,
  Minus,
  Phone,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Trash2,
  Truck,
  Wrench,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import Badge from "@/components/ui/Badge";
import type { Product } from "@/types/product";

const processSteps = [
  {
    title: "Revisa tu carrito",
    description: "Confirma productos, cantidades y referencias antes de salir al checkout.",
    icon: ClipboardList,
  },
  {
    title: "Completa el checkout",
    description: "Finaliza el pedido en Shopify con tus datos, despacho y metodo de pago.",
    icon: CreditCard,
  },
  {
    title: "Coordinamos despacho",
    description: "Con la compra confirmada, seguimos con la preparacion y entrega del pedido.",
    icon: Truck,
  },
];

const supportCards = [
  {
    title: "Soporte tecnico",
    description: "Si tienes dudas de compatibilidad, te ayudamos a validar la referencia correcta antes de pagar.",
    icon: Wrench,
    tone: "dark" as const,
  },
  {
    title: "Cobertura nacional",
    description: "Despachamos a Santiago y regiones, con coordinacion segun volumen y disponibilidad.",
    icon: ShieldCheck,
    tone: "sand" as const,
  },
];

const emptyHighlights = [
  "Busqueda rapida por SKU, marca o nombre de producto.",
  "Checkout Shopify para cerrar el pedido con un flujo mas directo.",
  "Asistencia comercial si necesitas validar compatibilidad antes de pagar.",
];

function buildWhatsAppHref(
  items: ReturnType<typeof useCart>["items"],
  subtotal: number,
  totalWithIva: number
) {
  const lines = [
    "Hola, quiero cotizar los siguientes productos:",
    "",
    ...items.map(
      (item, index) =>
        `${index + 1}. ${item.product.name} | SKU: ${item.product.code} | Cantidad: ${item.quantity}`
    ),
    "",
    `Subtotal neto: ${formatPrice(subtotal)}`,
    `Total aprox. con IVA: ${formatPrice(totalWithIva)}`,
  ];

  return `https://wa.me/?text=${encodeURIComponent(lines.join("\n"))}`;
}

interface CartPageContentProps {
  catalogProducts: Product[];
}

export default function CartPageContent({ catalogProducts }: CartPageContentProps) {
  const {
    items,
    totalQuantity,
    totalPrice,
    checkoutUrl,
    isLoading,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();
  const cartCodes = new Set(items.map((item) => item.product.code));
  const uniqueBrands = [...new Set(items.map((item) => item.product.brand))];
  const uniqueCategories = [...new Set(items.map((item) => item.product.category))];
  const suggestedProducts = catalogProducts
    .filter((product) => !cartCodes.has(product.code))
    .filter((product) =>
      items.length === 0
        ? product.price !== null
        : uniqueBrands.includes(product.brand) || uniqueCategories.includes(product.category)
    )
    .slice(0, 4);

  if (items.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="relative overflow-hidden bg-primary-dark px-8 py-10 text-white md:px-10 md:py-12">
            <div className="absolute right-0 top-0 h-28 w-28 bg-white/[0.04]" />
            <div className="absolute bottom-0 right-10 h-20 w-20 bg-primary/15" />
            <div className="relative">
              <h2 className="max-w-2xl text-3xl font-black uppercase tracking-tight leading-tight md:text-4xl">
                Tu carrito todavia esta vacio
              </h2>
              <p className="mt-4 max-w-xl text-sm text-white/70 leading-relaxed">
                Agrega referencias desde el catalogo y deja listo el pedido para continuar a
                checkout cuando quieras.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/collections"
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary-light text-white font-bold px-6 py-3 text-sm uppercase tracking-wide transition-colors"
                >
                  Ir al catalogo
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/contacto"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white font-bold px-6 py-3 text-sm uppercase tracking-wide transition-colors"
                >
                  Hablar con soporte
                </Link>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <div className="bg-white/6 px-4 py-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/35 mb-1">Rapido</p>
                  <p className="text-sm font-bold">Arma el pedido sin rehacer tu seleccion.</p>
                </div>
                <div className="bg-white/6 px-4 py-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/35 mb-1">Claro</p>
                  <p className="text-sm font-bold">SKU, cantidades y checkout quedan listos.</p>
                </div>
                <div className="bg-white/6 px-4 py-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/35 mb-1">Asistido</p>
                  <p className="text-sm font-bold">Seguimos disponibles para validar compatibilidad.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#f7f5f0] px-8 py-8">
            <h3 className="mb-5 text-xl font-black uppercase text-dark">
              Que puedes hacer aqui
            </h3>
            <div className="space-y-5">
              {emptyHighlights.map((highlight) => (
                <div key={highlight} className="flex gap-3">
                  <div className="mt-0.5 h-9 w-9 flex-shrink-0 bg-white text-primary flex items-center justify-center shadow-[0_10px_20px_rgba(18,18,18,0.06)]">
                    <CheckCircle2 size={16} />
                  </div>
                  <p className="text-sm text-dark/70 leading-relaxed">{highlight}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {suggestedProducts.length > 0 && (
          <section className="bg-white px-6 py-8 shadow-[0_18px_60px_rgba(18,18,18,0.06)] md:px-8">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between mb-6">
              <div>
                <h3 className="text-2xl font-black uppercase text-dark tracking-tight">
                  Productos para empezar
                </h3>
              </div>
              <p className="text-sm text-dark/55 max-w-xl">
                Una seleccion rapida para poblar el carrito y probar el flujo real de compra.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {suggestedProducts.map((product) => (
                <Link
                  key={product.code}
                  href={`/producto/${product.code}`}
                  className="group flex h-full flex-col overflow-hidden bg-[#f7f3eb] transition-all duration-200 hover:-translate-y-1 hover:bg-white hover:shadow-[0_18px_40px_rgba(18,18,18,0.08)]"
                >
                  <div className="relative aspect-[4/3] bg-white/75">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-contain p-4"
                      sizes="(max-width: 1280px) 50vw, 25vw"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h4 className="font-bold text-dark leading-snug group-hover:text-primary transition-colors">
                      {product.name}
                    </h4>
                    <p className="text-xs text-dark/45 mt-1">SKU: {product.code}</p>
                    <div className="mt-auto pt-4 flex items-end justify-between gap-3">
                      <div>
                        <p className="text-lg font-black text-dark">
                          {product.price !== null ? formatPrice(product.price) : "Consultar"}
                        </p>
                        <p className="text-[10px] uppercase tracking-wide text-dark/40">
                          {product.price !== null ? "Precio neto" : "Sin precio publico"}
                        </p>
                      </div>
                      <ArrowRight size={16} className="text-dark/35 group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    );
  }

  const estimatedIva = Math.round(totalPrice * 0.19);
  const totalWithIva = totalPrice + estimatedIva;
  const whatsappHref = buildWhatsAppHref(items, totalPrice, totalWithIva);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <section className="overflow-hidden bg-white shadow-[0_18px_60px_rgba(18,18,18,0.06)]">
          <div className="flex flex-col gap-3 px-6 py-6 md:flex-row md:items-center md:justify-between md:px-8">
            <div>
              <h3 className="text-lg font-black uppercase text-dark">Referencias seleccionadas</h3>
              <p className="text-sm text-dark/55">
                {items.length} producto{items.length !== 1 ? "s" : ""} distinto
                {items.length !== 1 ? "s" : ""} en el resumen.
              </p>
            </div>
            <button
              onClick={() => {
                void clearCart();
              }}
              className="text-xs font-bold uppercase tracking-wide text-dark/45 hover:text-primary transition-colors"
            >
              Vaciar carrito
            </button>
          </div>

          <div className="divide-y divide-black/6">
            {items.map((item) => {
              const image = item.product.images[0];
              const lineTotal = (item.product.price ?? 0) * item.quantity;

              return (
                <article key={item.product.code} className="px-6 py-6 md:px-8">
                  <div className="grid gap-5 md:grid-cols-[120px_1fr]">
                    <div className="relative h-28 w-28 overflow-hidden bg-[#f6f1e8] md:h-30 md:w-30">
                      {image ? (
                        <Image
                          src={image}
                          alt={item.product.name}
                          fill
                          className="object-contain p-3"
                          sizes="120px"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                          <ShoppingCart size={28} />
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <Badge label={item.product.brand} />
                            <Badge
                              label={item.product.inStock ? "En stock" : "Sin stock"}
                              variant={item.product.inStock ? "success" : "muted"}
                            />
                          </div>
                          <Link
                            href={`/producto/${item.product.code}`}
                            className="text-lg font-black text-dark hover:text-primary transition-colors leading-tight"
                          >
                            {item.product.name}
                          </Link>
                          <p className="text-xs text-dark/45 mt-1">SKU: {item.product.code}</p>
                        </div>

                        <button
                          onClick={() => {
                            void removeItem(item.product.code);
                          }}
                          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-dark/45 hover:text-primary transition-colors"
                        >
                          <Trash2 size={14} />
                          Quitar
                        </button>
                      </div>

                      <div className="mt-5 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                        <div>
                          <p className="text-xs text-dark/50 uppercase tracking-wide mb-2">Cantidad</p>
                          <div className="inline-flex items-center gap-1 bg-[#f3f0ea] p-1">
                            <button
                              onClick={() => {
                                void updateQuantity(item.product.code, item.quantity - 1);
                              }}
                              disabled={item.quantity <= 1}
                              className="h-9 w-9 flex items-center justify-center bg-white text-dark hover:bg-white/80 disabled:opacity-30 transition-colors"
                              aria-label="Reducir cantidad"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="min-w-10 px-2 text-center text-sm font-bold text-dark">{item.quantity}</span>
                            <button
                              onClick={() => {
                                void updateQuantity(item.product.code, item.quantity + 1);
                              }}
                              className="h-9 w-9 flex items-center justify-center bg-white text-dark hover:bg-white/80 transition-colors"
                              aria-label="Aumentar cantidad"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>

                        <div className="text-left md:text-right">
                          <p className="text-xs text-dark/50 uppercase tracking-wide mb-2">Subtotal</p>
                          <p className="text-lg font-black text-dark">{formatPrice(lineTotal)}</p>
                          <p className="text-xs text-dark/45">Total por linea</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <aside className="lg:sticky lg:top-[220px] h-fit space-y-4">
          <section className="overflow-hidden bg-primary-dark text-white">
            <div className="px-6 py-6 md:px-7 md:py-7">
              <h2 className="text-xl font-black uppercase mb-6">Tu pedido</h2>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between text-white/65">
                  <span>Productos</span>
                  <span>{totalQuantity}</span>
                </div>
                <div className="flex items-center justify-between text-white/65">
                  <span>Subtotal productos</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex items-center justify-between text-white/65">
                  <span>IVA referencial</span>
                  <span>{formatPrice(estimatedIva)}</span>
                </div>
                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="font-bold uppercase tracking-wide">Total estimado</span>
                  <span className="text-2xl font-black">{formatPrice(totalWithIva)}</span>
                </div>
              </div>

              <p className="mt-4 text-xs text-white/45 leading-relaxed">
                El checkout final se completa en Shopify. Despacho, impuestos finales y medios de
                pago se confirman en ese paso.
              </p>

              <div className="mt-6 space-y-3">
                {checkoutUrl ? (
                  <a
                    href={checkoutUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 text-sm uppercase tracking-wide transition-colors"
                  >
                    <CreditCard size={18} />
                    Ir a checkout
                  </a>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="flex items-center justify-center gap-2 w-full bg-white/10 text-white/40 font-bold py-3 text-sm uppercase tracking-wide cursor-not-allowed"
                  >
                    <CreditCard size={18} />
                    {isLoading ? "Cargando carrito..." : "Checkout no disponible"}
                  </button>
                )}
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1da851] text-white font-bold py-3 text-sm uppercase tracking-wide transition-colors"
                >
                  <MessageCircle size={18} />
                  Consultar por WhatsApp
                </a>
                <Link
                  href="/collections"
                  className="flex items-center justify-center gap-2 w-full bg-white/10 hover:bg-white/15 text-white font-bold py-3 text-sm uppercase tracking-wide transition-colors"
                >
                  Seguir comprando
                </Link>
              </div>
            </div>
          </section>

          <section className="bg-[#f7f5f0] px-6 py-6 md:px-7">
            <h3 className="text-lg font-black uppercase text-dark mb-4">Necesitas validar una pieza?</h3>
            <p className="text-sm text-dark/60 leading-relaxed">
              Si tienes dudas con una referencia, uso o compatibilidad, te ayudamos antes de
              cerrar la cotizacion.
            </p>

            <div className="mt-5 space-y-3">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-bold text-dark hover:text-primary transition-colors"
              >
                <Phone size={16} className="text-primary" />
                Abrir este pedido en WhatsApp
              </a>
              <a
                href="mailto:ventas@recambiospa.cl"
                className="flex items-center gap-2 text-sm font-bold text-dark hover:text-primary transition-colors"
              >
                <Mail size={16} className="text-primary" />
                ventas@recambiospa.cl
              </a>
            </div>
          </section>
        </aside>
      </div>

      <section className="bg-[#f7f5f0] px-6 py-8 md:px-8">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between mb-6">
          <div>
            <h3 className="text-2xl font-black uppercase text-dark tracking-tight">
              Que pasa despues
            </h3>
          </div>
          <p className="text-sm text-dark/55 max-w-xl">
            El carrito ya no termina en una cotizacion manual. Desde aqui pasas al checkout y
            luego seguimos con validacion y despacho.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {processSteps.map((step) => (
            <div key={step.title}>
              <div className="mb-4">
                <div className="h-11 w-11 bg-primary-dark text-white flex items-center justify-center">
                  <step.icon size={18} />
                </div>
              </div>
              <h4 className="font-black uppercase text-dark text-sm tracking-wide mb-2">{step.title}</h4>
              <p className="text-sm text-dark/60 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {suggestedProducts.length > 0 && (
        <section className="bg-white px-6 py-8 shadow-[0_18px_60px_rgba(18,18,18,0.06)] md:px-8">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between mb-6">
            <div>
              <h3 className="text-2xl font-black uppercase text-dark tracking-tight">
                Podrias sumar tambien
              </h3>
            </div>
            <p className="text-sm text-dark/55 max-w-xl">
              Sugerencias relacionadas con las marcas o categorias que ya estas considerando.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {suggestedProducts.map((product) => (
              <Link
                key={product.code}
                href={`/producto/${product.code}`}
                className="group flex h-full flex-col overflow-hidden bg-[#f7f3eb] transition-all duration-200 hover:-translate-y-1 hover:bg-white hover:shadow-[0_18px_40px_rgba(18,18,18,0.08)]"
              >
                <div className="relative aspect-[4/3] bg-white/75">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-contain p-4"
                    sizes="(max-width: 1280px) 50vw, 25vw"
                  />
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h4 className="font-bold text-dark leading-snug group-hover:text-primary transition-colors">
                    {product.name}
                  </h4>
                  <p className="text-xs text-dark/45 mt-1">SKU: {product.code}</p>
                  <div className="mt-auto pt-4 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-lg font-black text-dark">
                        {product.price !== null ? formatPrice(product.price) : "Consultar"}
                      </p>
                      <p className="text-[10px] uppercase tracking-wide text-dark/40">
                        {product.price !== null ? "Precio neto" : "Sin precio publico"}
                      </p>
                    </div>
                    <ArrowRight size={16} className="text-dark/35 group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="grid gap-4 md:grid-cols-2">
        {supportCards.map((card) => (
          <div
            key={card.title}
            className={
              card.tone === "dark"
                ? "bg-primary-dark px-6 py-6 text-white"
                : "bg-[#f7f5f0] px-6 py-6 text-dark"
            }
          >
            <div
              className={
                card.tone === "dark"
                  ? "h-11 w-11 bg-white/10 text-primary flex items-center justify-center mb-4"
                  : "h-11 w-11 bg-white text-primary flex items-center justify-center mb-4 shadow-[0_10px_20px_rgba(18,18,18,0.06)]"
              }
            >
              <card.icon size={20} />
            </div>
            <h3 className="text-lg font-black uppercase tracking-wide mb-2">{card.title}</h3>
            <p className={card.tone === "dark" ? "text-sm text-white/65 leading-relaxed" : "text-sm text-dark/65 leading-relaxed"}>
              {card.description}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
