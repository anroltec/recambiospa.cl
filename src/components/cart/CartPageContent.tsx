"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CreditCard,
  LoaderCircle,
  MessageCircle,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import { getProductListKey } from "@/lib/product";
import type { Product } from "@/types/product";

const termsList = [
  "Venta minima de $5.000.",
  "Cantidad maxima por pedido: 25 productos.",
  "Los valores no incluyen despacho.",
  "La cotizacion tiene una validez referencial de 5 dias calendario.",
];

function buildWhatsAppHref(
  items: ReturnType<typeof useCart>["items"],
  subtotal: number,
  totalWithIva: number
) {
  if (items.length === 0) {
    return `https://wa.me/?text=${encodeURIComponent(
      "Hola, quiero cotizar repuestos en recambiospa.cl."
    )}`;
  }

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

interface SummaryRowProps {
  label: string;
  value: string;
  labelClassName?: string;
  valueClassName?: string;
}

function SummaryRow({
  label,
  value,
  labelClassName = "",
  valueClassName = "",
}: SummaryRowProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className={`text-[1.05rem] text-[#5b5147] ${labelClassName}`.trim()}>{label}</span>
      <span className={`text-[1.05rem] text-[#5b5147] ${valueClassName}`.trim()}>{value}</span>
    </div>
  );
}

interface CartPageContentProps {
  catalogProducts: Product[];
  catalogUnavailable?: boolean;
}

export default function CartPageContent({
  catalogProducts,
  catalogUnavailable = false,
}: CartPageContentProps) {
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
  const isHydratingCart = isLoading && items.length === 0;
  const estimatedIva = Math.round(totalPrice * 0.19);
  const totalWithIva = totalPrice + estimatedIva;
  const whatsappHref = buildWhatsAppHref(items, totalPrice, totalWithIva);
  const hasUnpricedItems = items.some((item) => item.product.price === null);
  const cartCountLabel = isHydratingCart
    ? "Cargando carrito..."
    : `${totalQuantity} producto(s) en el carro`;

  return (
    <div className="mx-auto max-w-7xl px-4 pb-14 pt-10 md:pb-20 md:pt-12">
      {catalogUnavailable && (
        <section className="border border-[#ead7c8] bg-[#fcf6f0] px-6 py-5 text-sm text-dark/70">
          <p className="font-bold uppercase tracking-wide text-dark">No pudimos cargar sugeridos</p>
          <p className="mt-2">
            Shopify no esta respondiendo en este momento. Puedes seguir usando el carrito, pero las
            recomendaciones del catalogo podrian no aparecer hasta que se restablezca la conexion.
          </p>
        </section>
      )}

      <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
        <section className="min-w-0">
          <div className="flex flex-col gap-3 border-b border-black/10 pb-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-lg font-semibold text-[#5b5147]">{cartCountLabel}</p>
              <p className="mt-1 text-sm text-dark/50">
                {items.length > 0
                  ? "Revisa cantidades y subtotales antes de continuar."
                  : isHydratingCart
                    ? "Estamos recuperando la seleccion guardada."
                    : "Aqui veras las referencias agregadas, sus cantidades y el resumen del pedido."}
              </p>
            </div>
            {items.length > 0 ? (
              <button
                onClick={() => {
                  void clearCart();
                }}
                className="text-xs font-bold uppercase tracking-[0.18em] text-dark/45 transition-colors hover:text-primary"
              >
                Vaciar carrito
              </button>
            ) : null}
          </div>

          {items.length === 0 ? (
            <div className="flex min-h-[420px] items-center border-b border-black/10">
              <div className="max-w-md space-y-4 py-10">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f6f2ed] text-[#5b5147]">
                  {isHydratingCart ? (
                    <LoaderCircle size={20} className="animate-spin" />
                  ) : (
                    <ShoppingCart size={20} />
                  )}
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-black uppercase tracking-tight text-[#5b5147]">
                    {isHydratingCart ? "Recuperando tu carrito" : "Tu carrito todavia esta vacio"}
                  </h2>
                  <p className="text-sm leading-relaxed text-dark/60">
                    Agrega productos desde el catalogo y el resumen lateral se actualizara al
                    instante para comprar o cotizar.
                  </p>
                </div>
                <Link
                  href="/collections"
                  className="inline-flex items-center gap-2 rounded-sm bg-[#ff473d] px-5 py-3 text-sm font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#f0372f]"
                >
                  Explorar catalogo
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-black/8">
              {items.map((item) => {
                const image = item.product.images[0];
                const unitPriceLabel =
                  item.product.price !== null ? formatPrice(item.product.price) : "Por confirmar";
                const lineTotalLabel =
                  item.product.price !== null
                    ? formatPrice(item.product.price * item.quantity)
                    : "Por confirmar";

                return (
                  <article key={item.product.code} className="py-6 first:pt-8">
                    <div className="grid gap-5 md:grid-cols-[112px_minmax(0,1fr)_220px]">
                      <Link
                        href={`/producto/${item.product.code}`}
                        className="relative block aspect-square overflow-hidden rounded-sm bg-[#f6f2ed]"
                      >
                        {image ? (
                          <Image
                            src={image}
                            alt={item.product.name}
                            fill
                            className="object-contain p-3"
                            sizes="112px"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-[#cbbfb1]">
                            <ShoppingCart size={26} />
                          </div>
                        )}
                      </Link>

                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8f7d68]">
                          {item.product.brand}
                        </p>
                        <Link
                          href={`/producto/${item.product.code}`}
                          className="mt-2 block text-lg font-black uppercase tracking-tight text-dark transition-colors hover:text-primary"
                        >
                          {item.product.name}
                        </Link>
                        <p className="mt-2 text-sm text-dark/55">SKU: {item.product.code}</p>
                        <p className="mt-1 text-sm text-dark/45">
                          {item.product.categoryLabel ?? item.product.category}
                        </p>
                        {!item.product.inStock ? (
                          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#b07d00]">
                            Stock por confirmar
                          </p>
                        ) : null}
                        {item.product.price === null ? (
                          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#b07d00]">
                            Precio sujeto a confirmacion
                          </p>
                        ) : null}
                      </div>

                      <div className="flex flex-col gap-4 md:items-end">
                        <div className="w-full text-left md:text-right">
                          <p className="text-[11px] uppercase tracking-[0.18em] text-dark/40">
                            Valor unitario
                          </p>
                          <p className="mt-1 text-base font-bold text-[#5b5147]">
                            {unitPriceLabel}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 md:justify-end">
                          <div className="inline-flex items-center border border-black/10 bg-[#f5f2ec]">
                            <button
                              onClick={() => {
                                void updateQuantity(item.product.code, item.quantity - 1);
                              }}
                              disabled={item.quantity <= 1}
                              className="flex h-10 w-10 items-center justify-center bg-white text-dark transition-colors hover:bg-[#faf8f4] disabled:cursor-not-allowed disabled:opacity-30"
                              aria-label="Reducir cantidad"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="min-w-12 px-3 text-center text-sm font-bold text-dark">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => {
                                void updateQuantity(item.product.code, item.quantity + 1);
                              }}
                              className="flex h-10 w-10 items-center justify-center bg-white text-dark transition-colors hover:bg-[#faf8f4]"
                              aria-label="Aumentar cantidad"
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          <button
                            onClick={() => {
                              void removeItem(item.product.code);
                            }}
                            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.18em] text-dark/45 transition-colors hover:text-primary"
                          >
                            <Trash2 size={14} />
                            Quitar
                          </button>
                        </div>

                        <div className="w-full text-left md:text-right">
                          <p className="text-[11px] uppercase tracking-[0.18em] text-dark/40">
                            Subtotal
                          </p>
                          <p className="mt-1 text-2xl font-black text-[#5b5147]">
                            {lineTotalLabel}
                          </p>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <aside className="space-y-4 xl:sticky xl:top-28">
          <section className="border border-black/10 bg-white px-6 py-6">
            <h2 className="text-[2rem] font-black uppercase tracking-tight text-[#5b5147]">
              Resumen
            </h2>

            <div className="mt-8 space-y-3">
              <SummaryRow label="Neto:" value={formatPrice(totalPrice)} />
              <SummaryRow
                label="Despacho:"
                value="Por confirmar"
                valueClassName="text-[#d39d00]"
              />
              <SummaryRow label="Subtotal:" value={formatPrice(totalPrice)} />
              <SummaryRow label="IVA 19%:" value={formatPrice(estimatedIva)} />

              <div className="border-t border-black/10 pt-3">
                <SummaryRow
                  label="Total"
                  value={formatPrice(totalWithIva)}
                  labelClassName="text-primary text-[1.15rem]"
                  valueClassName="text-primary text-[2rem] font-black"
                />
              </div>
            </div>

            <p
              className={`mt-4 text-xs leading-relaxed ${
                hasUnpricedItems ? "text-[#b07d00]" : "text-dark/45"
              }`}
            >
              {hasUnpricedItems
                ? "Hay productos con precio por confirmar. El total final puede ajustarse cuando se valide la cotizacion."
                : "Despacho, impuestos finales y eventuales ajustes se confirman antes del pago."}
            </p>

            <div className="mt-8 space-y-4">
              {checkoutUrl ? (
                <a
                  href={checkoutUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 items-center justify-center gap-2 rounded-sm bg-[#ff473d] px-4 text-lg font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#f0372f]"
                >
                  <CreditCard size={18} />
                  Comprar
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-sm bg-[#ff473d]/45 px-4 text-lg font-bold uppercase tracking-wide text-white/85"
                >
                  <CreditCard size={18} />
                  {isLoading ? "Cargando..." : "Comprar"}
                </button>
              )}

              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 items-center justify-center gap-2 rounded-sm bg-[#72695f] px-4 text-lg font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#655c53]"
              >
                <MessageCircle size={18} />
                Cotizar
              </a>

              <Link
                href="/collections"
                className="flex h-11 items-center justify-center rounded-sm border border-black/10 px-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#5b5147] transition-colors hover:bg-[#f7f3ef]"
              >
                Seguir comprando
              </Link>
            </div>
          </section>

          <section className="border border-[#b8dde6] bg-[#d8eef5] px-6 py-5">
            <h3 className="text-[1.65rem] font-semibold text-[#0a5166]">Condiciones Generales</h3>
            <div className="mt-4 h-px bg-[#98cad6]" />
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-[#0f5568]">
              {termsList.map((term) => (
                <li key={term}>* {term}</li>
              ))}
            </ul>
          </section>
        </aside>
      </div>

      {suggestedProducts.length > 0 && !isHydratingCart && (
        <section className="mt-12 border-t border-black/8 pt-10">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#a28c74]">
                Sigue armando el pedido
              </p>
              <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-[#5b5147]">
                Productos sugeridos
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-dark/55">
              Seleccion rapida relacionada con las marcas o categorias que ya estas mirando.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {suggestedProducts.map((product) => (
              <Link
                key={getProductListKey(product)}
                href={`/producto/${product.code}`}
                className="group flex h-full flex-col overflow-hidden border border-black/8 bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(18,18,18,0.08)]"
              >
                <div className="relative aspect-[4/3] bg-[#f6f2ed]">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-contain p-4"
                    sizes="(max-width: 1280px) 50vw, 25vw"
                  />
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h4 className="font-bold uppercase tracking-tight text-dark transition-colors group-hover:text-primary">
                    {product.name}
                  </h4>
                  <p className="text-xs text-dark/45 mt-1">SKU: {product.code}</p>
                  <div className="mt-auto pt-4 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-lg font-black text-dark">
                        {product.price !== null ? formatPrice(product.price) : "Consultar"}
                      </p>
                      <p className="text-[10px] uppercase tracking-wide text-dark/40">
                        {product.price !== null ? "Precio neto" : "Precio por confirmar"}
                      </p>
                    </div>
                    <ArrowRight
                      size={16}
                      className="text-dark/35 transition-colors group-hover:text-primary"
                    />
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
