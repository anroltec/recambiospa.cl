"use client";

import {
  AlertCircle,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Receipt,
  Truck,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { formatDate } from "@/lib/format";
import type {
  CustomerOrderAddress,
  CustomerOrderDetail,
  CustomerOrderSummary,
} from "@/types/customer";

interface OrderDetailsModalProps {
  order: CustomerOrderSummary;
  detail: CustomerOrderDetail | null;
  isLoading: boolean;
  error: string | null;
  onClose: () => void;
  onRetry: () => void;
}

function formatMoney(amount: string, currency: string): string {
  const value = Number(amount);

  if (Number.isNaN(value)) {
    return `${amount} ${currency}`;
  }

  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency,
    minimumFractionDigits: currency === "CLP" ? 0 : 2,
    maximumFractionDigits: currency === "CLP" ? 0 : 2,
  }).format(value);
}

function getFinancialStatusLabel(status: string | null): string {
  const map: Record<string, string> = {
    PAID: "Pagado",
    PARTIALLY_PAID: "Pago parcial",
    PENDING: "Pendiente",
    AUTHORIZED: "Autorizado",
    PARTIALLY_REFUNDED: "Reembolso parcial",
    REFUNDED: "Reembolsado",
    VOIDED: "Anulado",
  };

  return status ? map[status] ?? status : "Sin estado";
}

function getFulfillmentStatusLabel(status: string | null): string {
  const map: Record<string, string> = {
    FULFILLED: "Despachado",
    PARTIALLY_FULFILLED: "Parcial",
    UNFULFILLED: "Pendiente",
    IN_PROGRESS: "En proceso",
    ON_HOLD: "En espera",
  };

  return status ? map[status] ?? status : "Preparando";
}

function getAddressLines(address: CustomerOrderAddress | null): string[] {
  if (!address) {
    return [];
  }

  const fullName = [address.firstName, address.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  return [
    fullName || null,
    address.company,
    address.address1,
    address.address2,
    [address.city, address.province].filter(Boolean).join(", ") || null,
    address.zip,
    address.country,
    address.phone,
  ].filter((line): line is string => Boolean(line?.trim()));
}

function DetailCard({
  title,
  children,
  icon,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`border border-black/8 bg-white p-5 ${className}`}>
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary-dark/70">
          {title}
        </h3>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function StatusBadge({
  label,
  tone,
}: {
  label: string;
  tone: "green" | "gray" | "blue";
}) {
  const cls = {
    green: "bg-green-100 text-green-700",
    gray: "bg-gray-100 text-gray-700",
    blue: "bg-blue-100 text-blue-700",
  }[tone];

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] ${cls}`}
    >
      {label}
    </span>
  );
}

function HeaderStat({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="min-w-[150px] border border-black/8 bg-white/90 px-4 py-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary-dark/45">
        {label}
      </p>
      <p className="mt-1 text-lg font-black text-dark">{value}</p>
      <p className="mt-1 text-xs text-dark/45">{helper}</p>
    </div>
  );
}

function SummaryMetric({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={`border border-black/8 bg-[#fcfaf6] px-4 py-3 ${className}`}>
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary-dark/45">
        {label}
      </p>
      <p className="mt-2 text-lg font-black text-dark">{value}</p>
    </div>
  );
}

export default function OrderDetailsModal({
  order,
  detail,
  isLoading,
  error,
  onClose,
  onRetry,
}: OrderDetailsModalProps) {
  const isPaid = order.financialStatus === "PAID";
  const showFulfillment =
    !isPaid ||
    (order.fulfillmentStatus !== "UNFULFILLED" &&
      order.fulfillmentStatus !== null);
  const totalItems = detail?.totalQuantity ?? order.itemCount;
  const totalAmount = detail
    ? formatMoney(detail.totalAmount, detail.currencyCode)
    : formatMoney(order.totalAmount, order.currencyCode);

  return (
    <Modal
      onClose={onClose}
      maxWidth="max-w-6xl"
      panelClassName="overflow-hidden rounded-none border border-[#e7dfd4] bg-[#f7f4ee]"
      closeButtonClassName="rounded-none border-[#e7dfd4] bg-white/94 shadow-none hover:bg-[#f3eee7]"
    >
      <div className="bg-[#f7f4ee]">
        <section className="border-b border-black/10 bg-gradient-to-r from-[#f2ebdf] via-[#fbf8f2] to-white px-6 py-6 sm:px-8">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-end lg:gap-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-primary">
                  Historial de compras
                </p>
                <h2 className="mt-2 text-3xl font-black uppercase tracking-tight text-primary-dark">
                  {order.name}
                </h2>
                <p className="mt-1 text-sm text-dark/60">
                  {order.processedAt
                    ? formatDate(order.processedAt)
                    : "Sin fecha registrada"}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <StatusBadge
                  label={getFinancialStatusLabel(order.financialStatus)}
                  tone={isPaid ? "green" : "gray"}
                />
                {showFulfillment && (
                  <StatusBadge
                    label={getFulfillmentStatusLabel(order.fulfillmentStatus)}
                    tone="blue"
                  />
                )}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <HeaderStat
                label="Productos"
                value={String(totalItems)}
                helper={totalItems === 1 ? "unidad" : "unidades"}
              />
              <HeaderStat
                label="Total"
                value={totalAmount}
                helper="importe del pedido"
              />
            </div>
          </div>
        </section>

        <section className="px-6 py-6 sm:px-8 sm:py-8">
          {isLoading && (
            <div className="flex min-h-[220px] items-center justify-center border border-dashed border-black/10 bg-[#faf7f2] px-6 text-center">
              <div className="space-y-3">
                <Loader2 size={24} className="mx-auto animate-spin text-primary" />
                <p className="text-sm font-semibold text-dark/70">
                  Cargando detalle del pedido...
                </p>
              </div>
            </div>
          )}

          {!isLoading && error && (
            <div className="border border-red-200 bg-red-50 p-5">
              <div className="flex items-start gap-3 text-sm text-red-700">
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold">No fue posible cargar este pedido.</p>
                  <p className="mt-1">{error}</p>
                </div>
              </div>
              <div className="mt-4">
                <Button type="button" size="md" onClick={onRetry}>
                  Reintentar
                </Button>
              </div>
            </div>
          )}

          {!isLoading && !error && detail && (
            <div className="space-y-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
                    Productos del pedido
                  </p>
                  <p className="mt-1 text-sm text-dark/55">
                    {detail.totalQuantity} unidades en total
                  </p>
                </div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-dark/45">
                  {detail.lineItems.length} líneas cargadas
                </p>
              </div>

              <div className="space-y-3">
                {detail.lineItems.map((item) => (
                  <article
                    key={item.id}
                    className="grid gap-4 border border-black/8 bg-[#fcfaf6] p-4 sm:grid-cols-[88px_minmax(0,1fr)_auto] sm:items-center"
                  >
                    <div className="flex h-24 w-full items-center justify-center overflow-hidden border border-black/8 bg-white">
                      {item.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.imageUrl}
                          alt={item.imageAlt ?? item.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-dark/25">
                          <Receipt size={22} />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-black uppercase leading-5 text-primary-dark">
                        {item.title}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-dark/55">
                        <span>
                          {item.quantity} x{" "}
                          {formatMoney(item.unitPriceAmount, item.currencyCode)}
                        </span>
                        {item.sku && <span>SKU {item.sku}</span>}
                        {item.variantTitle && <span>{item.variantTitle}</span>}
                        {item.vendor && <span>{item.vendor}</span>}
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary-dark/45">
                        Total línea
                      </p>
                      <p className="mt-1 text-lg font-black text-dark">
                        {formatMoney(item.linePriceAmount, item.currencyCode)}
                      </p>
                    </div>
                  </article>
                ))}
              </div>

              <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                <DetailCard
                  title="Resumen"
                  icon={<Truck size={16} className="text-primary" />}
                  className="xl:col-span-3"
                >
                  <div className="flex flex-col gap-3 xl:flex-row xl:flex-nowrap">
                    <SummaryMetric
                      label="Subtotal"
                      value={formatMoney(detail.subtotalAmount, detail.currencyCode)}
                      className="xl:flex-1"
                    />
                    <SummaryMetric
                      label="Envío"
                      value={formatMoney(detail.shippingAmount, detail.currencyCode)}
                      className="xl:flex-1"
                    />
                    <SummaryMetric
                      label="Impuestos"
                      value={formatMoney(detail.taxAmount, detail.currencyCode)}
                      className="xl:flex-1"
                    />
                    <div className="border border-black/8 bg-[#fcfaf6] px-4 py-3 xl:flex-[1.05]">
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary-dark/45">
                        Total
                      </p>
                      <p className="mt-2 text-2xl font-black text-dark">
                        {formatMoney(detail.totalAmount, detail.currencyCode)}
                      </p>
                    </div>
                    {detail.shippingMethodTitle && (
                      <div className="border border-black/8 bg-[#fcfaf6] px-4 py-3 xl:flex-[1.5]">
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary-dark/45">
                          Método de envío
                        </p>
                        <p className="mt-2 text-sm font-semibold text-dark">
                          {detail.shippingMethodTitle}
                        </p>
                      </div>
                    )}
                  </div>
                </DetailCard>

                <DetailCard
                  title="Contacto del pedido"
                  icon={<Mail size={16} className="text-primary" />}
                  className="h-full"
                >
                  <div className="space-y-3 text-sm text-dark/70">
                    <p>{detail.email ?? "Sin correo registrado"}</p>
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-primary-dark/45" />
                      <span>{detail.phone ?? "Sin teléfono registrado"}</span>
                    </div>
                  </div>
                </DetailCard>

                <DetailCard
                  title="Dirección de envío"
                  icon={<MapPin size={16} className="text-primary" />}
                  className="h-full"
                >
                  <AddressBlock address={detail.shippingAddress ?? null} />
                </DetailCard>

                <DetailCard
                  title="Dirección de facturación"
                  icon={<MapPin size={16} className="text-primary" />}
                  className="h-full"
                >
                  <AddressBlock address={detail.billingAddress ?? null} />
                </DetailCard>

                {detail.note && (
                  <DetailCard
                    title="Notas"
                    icon={<Receipt size={16} className="text-primary" />}
                    className="lg:col-span-2 xl:col-span-3"
                  >
                    <p className="text-sm leading-6 text-dark/70">{detail.note}</p>
                  </DetailCard>
                )}
              </div>

              <div className="flex flex-col gap-3 border-t border-black/8 pt-6 sm:flex-row sm:justify-end">
                <Button type="button" variant="outline" size="lg" onClick={onClose}>
                  Cerrar
                </Button>
              </div>
            </div>
          )}
        </section>
      </div>
    </Modal>
  );
}

function AddressBlock({ address }: { address: CustomerOrderAddress | null }) {
  const lines = getAddressLines(address);

  if (!lines.length) {
    return <p className="text-sm text-dark/45">Sin información registrada.</p>;
  }

  return (
    <div className="space-y-1.5 text-sm text-dark/72">
      {lines.map((line, index) => (
        <p key={`${index}-${line}`}>{line}</p>
      ))}
    </div>
  );
}
