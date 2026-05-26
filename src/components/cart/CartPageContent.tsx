"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  CreditCard,
  LoaderCircle,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import { getProductListKey } from "@/lib/product";
import type { Product } from "@/types/product";
import CheckoutAuthModal from "@/components/cart/CheckoutAuthModal";
import LoginModal from "@/components/account/LoginModal";

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
      <span className={`text-[1.05rem] text-dark/72 ${labelClassName}`.trim()}>{label}</span>
      <span className={`text-[1.05rem] text-primary-dark ${valueClassName}`.trim()}>{value}</span>
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
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
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
  const hasUnpricedItems = items.some((item) => item.product.price === null);
  const cartCountLabel = isHydratingCart
    ? "Cargando carrito..."
    : `${totalQuantity} producto(s) en el carro`;

  return (
    <div className="mx-auto max-w-7xl px-4 pb-14 pt-10 md:pb-20 md:pt-12">
      {catalogUnavailable && (
        <section className="border border-[#ead7c8] bg-[#fcf6f0] px-6 py-5 text-sm text-dark/70">
          <p className="font-bold uppercase tracking-wide text-primary-dark">
            No pudimos cargar sugeridos
          </p>
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
              <p className="text-lg font-semibold text-primary-dark">{cartCountLabel}</p>
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
                className="text-xs font-bold uppercase tracking-[0.18em] text-primary-dark/70 transition-colors hover:text-primary"
              >
                Vaciar carrito
              </button>
            ) : null}
          </div>

          {items.length === 0 ? (
            <div className="flex min-h-[420px] items-center border-b border-black/10">
              <div className="max-w-md space-y-4 py-10">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f6f2ed] text-primary-dark">
                  {isHydratingCart ? (
                    <LoaderCircle size={20} className="animate-spin" />
                  ) : (
                    <ShoppingCart size={20} />
                  )}
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-black uppercase tracking-tight text-primary-dark">
                    {isHydratingCart ? "Recuperando tu carrito" : "Tu carrito todavia esta vacio"}
                  </h2>
                  <p className="text-sm leading-relaxed text-dark/60">
                    Agrega productos desde el catalogo y el resumen lateral se actualizara al
                    instante para comprar.
                  </p>
                </div>
                <Link
                  href="/collections"
                  className="inline-flex items-center gap-2 rounded-sm bg-primary px-5 py-3 text-sm font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-primary-light"
                >
                  Explorar catalogo
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:block md:divide-y md:divide-black/8">
              {items.map((item) => {
                const image = item.product.images[0];
                const unitPriceLabel =
                  item.product.price !== null ? formatPrice(item.product.price) : "Por confirmar";
                const lineTotalLabel =
                  item.product.price !== null
                    ? formatPrice(item.product.price * item.quantity)
                    : "Por confirmar";

                return (
                  <article
                    key={item.product.code}
                    className="flex h-full flex-col border border-black/8 bg-white p-3 md:border-0 md:bg-transparent md:px-0 md:py-6 md:first:pt-8"
                  >
                    <div className="flex h-full flex-col gap-3 md:grid md:grid-cols-[112px_minmax(0,1fr)_220px] md:gap-5">
                      <Link
                        href={`/producto/${item.product.code}`}
                        className="relative block aspect-[4/3] overflow-hidden rounded-sm bg-[#f6f2ed] md:aspect-square"
                      >
                        {image ? (
                          <Image
                            src={image}
                            alt={item.product.name}
                            fill
                            className="object-contain p-2.5 md:p-3"
                            sizes="(max-width: 767px) 50vw, 112px"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-[#cbbfb1]">
                            <ShoppingCart size={22} className="md:h-[26px] md:w-[26px]" />
                          </div>
                        )}
                      </Link>

                      <div className="min-w-0">
                        <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-primary/72 md:text-[11px] md:tracking-[0.22em]">
                          {item.product.brand}
                        </p>
                        <Link
                          href={`/producto/${item.product.code}`}
                          className="mt-2 block text-[0.95rem] font-black uppercase leading-tight tracking-tight text-dark transition-colors hover:text-primary md:text-lg"
                        >
                          {item.product.name}
                        </Link>
                        <p className="mt-2 text-xs text-dark/55 md:text-sm">SKU: {item.product.code}</p>
                        <p className="mt-1 text-xs text-dark/45 md:text-sm">
                          {item.product.categoryLabel ?? item.product.category}
                        </p>
                        {!item.product.inStock ? (
                          <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#b07d00] md:mt-3 md:text-xs md:tracking-[0.18em]">
                            Stock por confirmar
                          </p>
                        ) : null}
                        {item.product.price === null ? (
                          <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#b07d00] md:text-xs md:tracking-[0.18em]">
                            Precio sujeto a confirmacion
                          </p>
                        ) : null}
                      </div>

                      <div className="mt-auto flex flex-col gap-3 border-t border-black/8 pt-3 md:mt-0 md:items-end md:border-t-0 md:pt-0">
                        <div className="grid grid-cols-2 gap-3 md:w-full md:grid-cols-1">
                          <div className="w-full text-left md:text-right">
                            <p className="text-[10px] uppercase tracking-[0.14em] text-dark/40 md:text-[11px] md:tracking-[0.18em]">
                              Valor unitario
                            </p>
                            <p className="mt-1 text-sm font-bold text-primary-dark md:text-base">
                              {unitPriceLabel}
                            </p>
                          </div>

                          <div className="w-full text-left md:text-right">
                            <p className="text-[10px] uppercase tracking-[0.14em] text-dark/40 md:text-[11px] md:tracking-[0.18em]">
                              Subtotal
                            </p>
                            <p className="mt-1 text-xl font-black text-primary-dark md:text-2xl">
                              {lineTotalLabel}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-2 md:justify-end md:gap-3">
                          <div className="inline-flex items-center border border-black/10 bg-[#f5f2ec]">
                            <button
                              onClick={() => {
                                void updateQuantity(item.product.code, item.quantity - 1);
                              }}
                              disabled={item.quantity <= 1}
                              className="flex h-8 w-8 items-center justify-center bg-white text-dark transition-colors hover:bg-[#faf8f4] disabled:cursor-not-allowed disabled:opacity-30 md:h-10 md:w-10"
                              aria-label="Reducir cantidad"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="min-w-10 px-2 text-center text-sm font-bold text-dark md:min-w-12 md:px-3">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => {
                                void updateQuantity(item.product.code, item.quantity + 1);
                              }}
                              className="flex h-8 w-8 items-center justify-center bg-white text-dark transition-colors hover:bg-[#faf8f4] md:h-10 md:w-10"
                              aria-label="Aumentar cantidad"
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          <button
                            onClick={() => {
                              void removeItem(item.product.code);
                            }}
                            className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.12em] text-dark/45 transition-colors hover:text-primary md:gap-1.5 md:text-xs md:tracking-[0.18em]"
                          >
                            <Trash2 size={13} className="md:h-[14px] md:w-[14px]" />
                            Quitar
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <aside className="xl:sticky xl:top-28">
          <section className="border border-black/10 bg-white px-6 py-6">
            <h2 className="text-[2rem] font-black uppercase tracking-tight text-primary-dark">
              Resumen
            </h2>

            <div className="mt-8 space-y-3">
              <SummaryRow label="Neto:" value={formatPrice(totalPrice)} />
              <SummaryRow
                label="Despacho:"
                value="Por confirmar"
                valueClassName="text-primary"
              />
              <SummaryRow label="Subtotal:" value={formatPrice(totalPrice)} />
              <SummaryRow label="IVA 19%:" value={formatPrice(estimatedIva)} />

              <div className="border-t border-black/10 pt-3">
                <SummaryRow
                  label="Total"
                  value={formatPrice(totalWithIva)}
                  labelClassName="text-primary-dark text-[1.15rem] font-semibold"
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
                ? "Hay productos con precio por confirmar. El total final puede ajustarse al validar el pedido."
                : "Despacho, impuestos finales y eventuales ajustes se confirman antes del pago."}
            </p>

            <div className="mt-8 space-y-4">
              {checkoutUrl ? (
                <button
                  type="button"
                  onClick={() => setShowCheckoutModal(true)}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-sm bg-primary px-4 text-lg font-bold uppercase tracking-wide text-white transition-colors hover:bg-primary-light"
                >
                  <CreditCard size={18} />
                  Comprar
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-sm bg-primary/45 px-4 text-lg font-bold uppercase tracking-wide text-white/85"
                >
                  <CreditCard size={18} />
                  {isLoading ? "Cargando..." : "Comprar"}
                </button>
              )}

              <Link
                href="/collections"
                className="flex h-11 items-center justify-center rounded-sm border border-primary-dark px-4 text-sm font-semibold uppercase tracking-[0.18em] text-primary-dark transition-colors hover:bg-primary-dark hover:text-white"
              >
                Seguir comprando
              </Link>
            </div>
          </section>
        </aside>
      </div>

      {suggestedProducts.length > 0 && !isHydratingCart && (
        <section className="mt-12 border-t border-black/8 pt-10">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary/72">
                Sigue armando el pedido
              </p>
              <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-primary-dark">
                Productos sugeridos
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-dark/55">
              Seleccion rapida relacionada con las marcas o categorias que ya estas mirando.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 md:gap-4 xl:grid-cols-4">
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
                    className="object-contain p-3 md:p-4"
                    sizes="(max-width: 767px) 50vw, (max-width: 1280px) 50vw, 25vw"
                  />
                </div>
                <div className="flex flex-1 flex-col p-3 md:p-4">
                  <h4 className="text-sm font-bold uppercase leading-tight tracking-tight text-dark transition-colors group-hover:text-primary md:text-base">
                    {product.name}
                  </h4>
                  <p className="mt-1 text-[11px] text-dark/45 md:text-xs">SKU: {product.code}</p>
                  <div className="mt-auto flex items-end justify-between gap-2 pt-3 md:gap-3 md:pt-4">
                    <div>
                      <p className="text-base font-black text-dark md:text-lg">
                        {product.price !== null ? formatPrice(product.price) : "Consultar"}
                      </p>
                      <p className="text-[9px] uppercase tracking-wide text-dark/40 md:text-[10px]">
                        {product.price !== null ? "Precio neto" : "Precio por confirmar"}
                      </p>
                    </div>
                    <ArrowRight
                      size={14}
                      className="text-dark/35 transition-colors group-hover:text-primary"
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {showCheckoutModal && checkoutUrl && (
        <CheckoutAuthModal
          checkoutUrl={checkoutUrl}
          onClose={() => setShowCheckoutModal(false)}
          onShowLogin={() => setShowLoginModal(true)}
        />
      )}

      {showLoginModal && checkoutUrl && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onSuccess={() => {
            setShowLoginModal(false);
            window.open(checkoutUrl, "_blank", "noopener,noreferrer");
          }}
        />
      )}
    </div>
  );
}
