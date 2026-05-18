"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  ChevronRight,
  Loader2,
  MapPin,
  Receipt,
  Save,
  ShoppingBag,
} from "lucide-react";
import Button from "@/components/ui/Button";
import OrderDetailsModal from "@/components/account/OrderDetailsModal";
import { formatDate } from "@/lib/format";
import type {
  CustomerCompanyProfile,
  CustomerCompanyProfileInput,
  CustomerOrderDetail,
  CustomerOrderSummary,
} from "@/types/customer";

type AccountView = "dashboard" | "company" | "orders";
type PanelStatus = "loading" | "guest" | "ready";

interface AccountPanelProps {
  view: AccountView;
}

interface ApiErrorResponse {
  ok: false;
  error: string;
}

interface ProfileResponse {
  ok: true;
  profile: CustomerCompanyProfile;
}

interface OrdersResponse {
  ok: true;
  orders: CustomerOrderSummary[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
}

interface OrderDetailResponse {
  ok: true;
  order: CustomerOrderDetail;
}

const EMPTY_FORM: CustomerCompanyProfileInput = {
  firstName: "",
  lastName: "",
  phone: "",
  documentType: "boleta",
  rut: "",
  razonSocial: "",
  giro: "",
  billingAddressLine1: "",
  billingAddressLine2: "",
  billingComuna: "",
  billingCity: "",
  billingRegion: "",
  billingPostalCode: "",
  billingCountryCode: "CL",
  billingNotes: "",
};

function toFormValues(p: CustomerCompanyProfile): CustomerCompanyProfileInput {
  return {
    firstName:          p.firstName          ?? "",
    lastName:           p.lastName           ?? "",
    phone:              p.phone              ?? "",
    documentType:       p.documentType       ?? "boleta",
    rut:                p.rut                ?? "",
    razonSocial:        p.razonSocial        ?? "",
    giro:               p.giro               ?? "",
    billingAddressLine1: p.billingAddressLine1 ?? "",
    billingAddressLine2: p.billingAddressLine2 ?? "",
    billingComuna:      p.billingComuna      ?? "",
    billingCity:        p.billingCity        ?? "",
    billingRegion:      p.billingRegion      ?? "",
    billingPostalCode:  p.billingPostalCode  ?? "",
    billingCountryCode: p.billingCountryCode ?? "CL",
    billingNotes:       p.billingNotes       ?? "",
  };
}

function formatMoney(amount: string, currency: string): string {
  const n = Number(amount);
  if (Number.isNaN(n)) return `${amount} ${currency}`;
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency,
    minimumFractionDigits: currency === "CLP" ? 0 : 2,
    maximumFractionDigits: currency === "CLP" ? 0 : 2,
  }).format(n);
}

function getProfileStatusLabel(s: CustomerCompanyProfile["profileStatus"]) {
  return s === "complete" ? "Perfil completo" : "Perfil incompleto";
}

function getFinancialStatusLabel(s: string | null) {
  const map: Record<string, string> = {
    PAID: "Pagado", PARTIALLY_PAID: "Pago parcial", PENDING: "Pendiente",
    AUTHORIZED: "Autorizado", PARTIALLY_REFUNDED: "Reembolso parcial",
    REFUNDED: "Reembolsado", VOIDED: "Anulado",
  };
  return s ? (map[s] ?? s) : "Sin estado";
}

function getFulfillmentStatusLabel(s: string | null) {
  const map: Record<string, string> = {
    FULFILLED: "Despachado", PARTIALLY_FULFILLED: "Parcial", UNFULFILLED: "Pendiente",
    IN_PROGRESS: "En proceso", ON_HOLD: "En espera",
  };
  return s ? (map[s] ?? s) : "Preparando";
}

/* ───────────────────────────────── Main panel ── */

export default function AccountPanel({ view }: AccountPanelProps) {
  const router = useRouter();
  const [panelStatus,    setPanelStatus]    = useState<PanelStatus>("loading");
  const [profile,        setProfile]        = useState<CustomerCompanyProfile | null>(null);
  const [formValues,     setFormValues]     = useState<CustomerCompanyProfileInput>(EMPTY_FORM);
  const [orders,         setOrders]         = useState<CustomerOrderSummary[]>([]);
  const [ordersCursor,   setOrdersCursor]   = useState<string | null>(null);
  const [hasMoreOrders,  setHasMoreOrders]  = useState(false);
  const [isSavingProfile,setIsSavingProfile]= useState(false);
  const [isLoadingOrders,setIsLoadingOrders]= useState(false);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [ordersError,    setOrdersError]    = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    fetch("/api/customer/profile", { method: "GET", cache: "no-store" })
      .then(async (res) => {
        if (!mounted) return;
        if (res.status === 401) { router.replace("/"); return; }
        const data = (await res.json()) as ProfileResponse | ApiErrorResponse;
        if (!res.ok || !data.ok) throw new Error(data.ok ? "" : data.error);
        setProfile(data.profile);
        setFormValues(toFormValues(data.profile));
        setPanelStatus("ready");
      })
      .catch(() => { if (mounted) router.replace("/"); });
    return () => { mounted = false; };
  }, [router]);

  useEffect(() => {
    if (panelStatus !== "ready" || (view !== "dashboard" && view !== "orders")) return;
    void loadOrders(view === "dashboard" ? 5 : 12);
  }, [panelStatus, view]);

  async function loadOrders(first: number, after?: string | null, append = false) {
    setIsLoadingOrders(true);
    setOrdersError(null);
    try {
      const params = new URLSearchParams({ first: String(first) });
      if (after) params.set("after", after);
      const res = await fetch(`/api/customer/orders?${params.toString()}`, { cache: "no-store" });
      if (res.status === 401) { setPanelStatus("guest"); setProfile(null); return; }
      const data = (await res.json()) as OrdersResponse | ApiErrorResponse;
      if (!res.ok || !data.ok) throw new Error(data.ok ? "" : data.error);
      setOrders((prev) => append ? [...prev, ...data.orders] : data.orders);
      setOrdersCursor(data.pageInfo.endCursor);
      setHasMoreOrders(data.pageInfo.hasNextPage);
    } catch (e) {
      setOrdersError(e instanceof Error ? e.message : "No fue posible cargar los pedidos.");
    } finally {
      setIsLoadingOrders(false);
    }
  }

  async function handleSaveProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileMessage(null);
    try {
      const res = await fetch("/api/customer/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      });
      const data = (await res.json()) as ProfileResponse | ApiErrorResponse;
      if (!res.ok || !data.ok) throw new Error(data.ok ? "" : data.error);
      setProfile(data.profile);
      setFormValues(toFormValues(data.profile));
      setProfileMessage("ok");
    } catch (e) {
      setProfileMessage(e instanceof Error ? e.message : "No fue posible guardar el perfil.");
    } finally {
      setIsSavingProfile(false);
    }
  }

  function handleFormChange(field: keyof CustomerCompanyProfileInput, value: string) {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  }

  /* Loading */
  if (panelStatus === "loading") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-dark/50">
          <Loader2 size={20} className="animate-spin text-primary" />
          Cargando...
        </div>
      </div>
    );
  }

  if (panelStatus === "guest" || !profile) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {view === "dashboard" && (
        <DashboardView
          profile={profile}
          orders={orders}
          isLoadingOrders={isLoadingOrders}
          ordersError={ordersError}
        />
      )}
      {view === "company" && (
        <CompanyView
          profile={profile}
          formValues={formValues}
          isSavingProfile={isSavingProfile}
          profileMessage={profileMessage}
          onFormChange={handleFormChange}
          onSubmit={handleSaveProfile}
        />
      )}
      {view === "orders" && (
        <OrdersView
          orders={orders}
          isLoadingOrders={isLoadingOrders}
          ordersError={ordersError}
          hasMoreOrders={hasMoreOrders}
          canLoadMore={Boolean(ordersCursor)}
          onLoadMore={() => void loadOrders(12, ordersCursor, true)}
        />
      )}
    </div>
  );
}

/* ─────────────────────────────── Dashboard ── */

function DashboardView({
  profile, orders, isLoadingOrders, ordersError,
}: {
  profile: CustomerCompanyProfile;
  orders: CustomerOrderSummary[];
  isLoadingOrders: boolean;
  ordersError: string | null;
}) {
  const complete = profile.profileStatus === "complete";
  const displayName = [profile.firstName, profile.lastName].filter(Boolean).join(" ") || profile.email;

  return (
    <div className="space-y-0">
      {/* Identity header */}
      <div className="flex flex-col gap-3 pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Panel B2B</p>
          <h1 className="mt-1 text-2xl font-black uppercase text-dark">{displayName}</h1>
          <p className="mt-0.5 text-sm text-dark/50">{profile.email}</p>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 self-start rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wider ${
            complete ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${complete ? "bg-green-500" : "bg-amber-500"}`} />
          {getProfileStatusLabel(profile.profileStatus)}
        </span>
      </div>

      {/* Company info strip */}
      <div className="grid border-t border-gray-200 sm:grid-cols-3 sm:divide-x sm:divide-gray-200">
        <ProfileField
          label="Razón social"
          value={profile.razonSocial}
          sub={profile.rut ? `RUT ${profile.rut}` : "RUT no informado"}
          fallback="Sin definir"
        />
        <ProfileField
          label="Giro"
          value={profile.giro}
          sub="Actividad tributaria"
          fallback="Sin definir"
        />
        <ProfileField
          label="Dirección"
          value={profile.billingCity}
          sub={profile.billingAddressLine1 || "Sin dirección registrada"}
          fallback="Sin ciudad"
        />
      </div>

      {/* Incomplete CTA */}
      {!complete && (
        <Link
          href="/cuenta/empresa"
          className="flex items-center justify-between border-t border-amber-200 bg-amber-50 px-0 py-3 transition-colors hover:bg-amber-100"
        >
          <div className="flex items-center gap-2">
            <MapPin size={14} className="shrink-0 text-amber-600" />
            <p className="text-xs text-amber-800">
              Completa tu perfil con RUT, razón social y dirección para habilitar la facturación.
            </p>
          </div>
          <span className="ml-4 flex shrink-0 items-center gap-1 text-xs font-bold text-amber-700">
            Completar <ChevronRight size={13} />
          </span>
        </Link>
      )}

      {/* Recent orders */}
      <div className="pt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-dark/60">
            Últimos pedidos
          </h2>
          <Link
            href="/cuenta/pedidos"
            className="text-xs font-bold uppercase tracking-wide text-primary hover:underline"
          >
            Ver todos
          </Link>
        </div>
        <OrdersBlock orders={orders} isLoading={isLoadingOrders} error={ordersError} compact />
      </div>
    </div>
  );
}

function ProfileField({
  label, value, sub, fallback,
}: {
  label: string; value: string | null; sub: string; fallback: string;
}) {
  const hasValue = Boolean(value);
  return (
    <div className="py-5 pr-6 sm:pl-6">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-dark/40">{label}</p>
      <p className={`mt-2 truncate text-sm font-black uppercase ${hasValue ? "text-dark" : "text-dark/25"}`}>
        {value || fallback}
      </p>
      <p className="mt-0.5 truncate text-xs text-dark/40">{sub}</p>
    </div>
  );
}

/* ─────────────────────────────── Company form ── */

function CompanyView({
  profile, formValues, isSavingProfile, profileMessage, onFormChange, onSubmit,
}: {
  profile: CustomerCompanyProfile;
  formValues: CustomerCompanyProfileInput;
  isSavingProfile: boolean;
  profileMessage: string | null;
  onFormChange: (field: keyof CustomerCompanyProfileInput, value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}) {
  const saved = profileMessage === "ok";

  return (
    <form onSubmit={onSubmit} className="space-y-0">
      {/* ── Contacto ── */}
      <FormSection title="Contacto personal" sub="Nombre, apellido y teléfono de contacto.">
        <div className="grid gap-5 sm:grid-cols-3">
          <FormField label="Nombre" value={formValues.firstName} onChange={(v) => onFormChange("firstName", v)} />
          <FormField label="Apellido" value={formValues.lastName} onChange={(v) => onFormChange("lastName", v)} />
          <PhoneField value={formValues.phone} onChange={(v) => onFormChange("phone", v)} />
        </div>
      </FormSection>

      {/* ── Tributario ── */}
      <FormSection
        title="Datos tributarios"
        sub="Selecciona el tipo de documento que recibirás con cada compra."
      >
        {/* Document type toggle */}
        <div className="mb-6">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-dark/60">
            Tipo de documento
          </p>
          <div className="inline-flex border border-gray-300">
            {(["boleta", "factura"] as const).map((type, i) => (
              <button
                key={type}
                type="button"
                onClick={() => onFormChange("documentType", type)}
                className={`px-6 py-2.5 text-xs font-bold uppercase tracking-[0.15em] transition-colors ${
                  i > 0 ? "border-l border-gray-300" : ""
                } ${
                  formValues.documentType === type
                    ? "bg-dark text-white"
                    : "text-dark/50 hover:text-dark"
                }`}
              >
                {type === "boleta" ? "Boleta" : "Factura"}
              </button>
            ))}
          </div>
          {formValues.documentType === "factura" && (
            <p className="mt-2 text-xs text-dark/40">
              Los campos marcados con <span className="text-primary">*</span> son obligatorios para emitir facturas.
            </p>
          )}
        </div>

        {/* Company fields — always visible, required only for factura */}
        {formValues.documentType === "factura" && (
          <div className="grid gap-5 sm:grid-cols-3">
            <RutField value={formValues.rut} onChange={(v) => onFormChange("rut", v)} />
            <FormField label="Razón social *" value={formValues.razonSocial} onChange={(v) => onFormChange("razonSocial", v)} required />
            <FormField label="Giro *"         value={formValues.giro}        onChange={(v) => onFormChange("giro", v)}         required />
          </div>
        )}
      </FormSection>

      {/* ── Dirección ── */}
      {formValues.documentType === "factura" && (
        <FormSection title="Dirección de facturación" sub="Dirección que aparecerá en las facturas emitidas.">
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Calle y número *"  value={formValues.billingAddressLine1}       onChange={(v) => onFormChange("billingAddressLine1", v)} required />
            <FormField label="Complemento"        value={formValues.billingAddressLine2 ?? ""} onChange={(v) => onFormChange("billingAddressLine2", v)} />
            <FormField
              label="Comuna *"
              value={formValues.billingComuna}
              onChange={(v) => onFormChange("billingComuna", v)}
              required
            />
            <FormField label="Ciudad *"          value={formValues.billingCity}               onChange={(v) => onFormChange("billingCity", v)} required />
            <RegionSelect value={formValues.billingRegion ?? ""} onChange={(v) => onFormChange("billingRegion", v)} />
            <FormField label="Código postal"     value={formValues.billingPostalCode ?? ""}   onChange={(v) => onFormChange("billingPostalCode", v)} />
          </div>
        </FormSection>
      )}

      {/* ── Notas ── */}
      <FormSection title="Notas de facturación" sub="Información adicional para el equipo de facturación.">
        <TextAreaField
          label=""
          value={formValues.billingNotes ?? ""}
          onChange={(v) => onFormChange("billingNotes", v)}
        />
      </FormSection>

      {/* ── Footer ── */}
      <div className="flex flex-col gap-4 border-t border-gray-200 bg-white px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        {profileMessage && (
          <div
            className={`flex items-center gap-2 text-sm ${
              saved ? "text-green-700" : "text-red-600"
            }`}
          >
            <AlertCircle size={15} className="shrink-0" />
            {saved ? "Datos guardados correctamente." : profileMessage}
          </div>
        )}
        {!profileMessage && (
          <p className="text-xs text-dark/40">
            Estado:{" "}
            <span className="font-semibold text-dark">
              {getProfileStatusLabel(profile.profileStatus)}
            </span>
          </p>
        )}
        <Button
          type="submit"
          size="lg"
          disabled={isSavingProfile}
          className="flex shrink-0 items-center justify-center gap-2"
        >
          {isSavingProfile ? (
            <><Loader2 size={15} className="animate-spin" /> Guardando…</>
          ) : (
            <><Save size={15} /> Guardar datos</>
          )}
        </Button>
      </div>
    </form>
  );
}

function FormSection({
  title, sub, children,
}: {
  title: string; sub: string; children: React.ReactNode;
}) {
  return (
    <div className="border-b border-gray-100 bg-white px-6 py-6">
      <div className="mb-5">
        <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-dark">{title}</h3>
        <p className="mt-0.5 text-xs text-dark/40">{sub}</p>
      </div>
      {children}
    </div>
  );
}

/* ─────────────────────────────── Orders ── */

function OrdersView({
  orders, isLoadingOrders, ordersError, hasMoreOrders, canLoadMore, onLoadMore,
}: {
  orders: CustomerOrderSummary[];
  isLoadingOrders: boolean;
  ordersError: string | null;
  hasMoreOrders: boolean;
  canLoadMore: boolean;
  onLoadMore: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[10px] font-bold uppercase tracking-[0.2em] text-dark/40">
            {orders.length > 0 ? `${orders.length} pedidos cargados` : ""}
          </h1>
        </div>
      </div>
      <OrdersBlock orders={orders} isLoading={isLoadingOrders} error={ordersError} />
      {hasMoreOrders && (
        <div className="flex justify-center pt-2">
          <Button
            type="button"
            variant="outline"
            size="md"
            disabled={isLoadingOrders || !canLoadMore}
            onClick={onLoadMore}
          >
            {isLoadingOrders ? "Cargando…" : "Cargar más pedidos"}
          </Button>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────── Shared blocks ── */

function OrdersBlock({
  orders, isLoading, error, compact = false,
}: {
  orders: CustomerOrderSummary[];
  isLoading: boolean;
  error: string | null;
  compact?: boolean;
}) {
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrderSummary | null>(null);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState<CustomerOrderDetail | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [detailVersion, setDetailVersion] = useState(0);
  const selectedOrderId = selectedOrder?.id;

  useEffect(() => {
    if (!selectedOrderId) {
      return;
    }

    const orderId = selectedOrderId;
    const controller = new AbortController();

    async function loadOrderDetail() {
      setIsLoadingDetail(true);
      setDetailError(null);

      try {
        const params = new URLSearchParams({ orderId });
        const res = await fetch(`/api/customer/orders/detail?${params.toString()}`, {
          cache: "no-store",
          signal: controller.signal,
        });

        const data = (await res.json()) as OrderDetailResponse | ApiErrorResponse;

        if (!res.ok || !data.ok) {
          throw new Error(data.ok ? "" : data.error);
        }

        setSelectedOrderDetail(data.order);
      } catch (e) {
        if (controller.signal.aborted) {
          return;
        }

        setSelectedOrderDetail(null);
        setDetailError(
          e instanceof Error ? e.message : "No fue posible cargar el detalle del pedido."
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingDetail(false);
        }
      }
    }

    void loadOrderDetail();

    return () => {
      controller.abort();
    };
  }, [selectedOrderId, detailVersion]);

  if (isLoading && !orders.length) {
    return (
      <div className="flex min-h-[160px] items-center justify-center text-sm text-dark/50">
        <Loader2 size={18} className="mr-2 animate-spin text-primary" />
        Cargando pedidos…
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-start gap-2 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        <AlertCircle size={15} className="mt-0.5 shrink-0" />
        {error}
      </div>
    );
  }
  if (!orders.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 border border-dashed border-gray-300 bg-light py-14 text-center">
        <ShoppingBag size={28} className="text-dark/20" />
        <p className="text-sm font-bold uppercase text-dark/30">Aún no hay pedidos</p>
        <p className="text-xs text-dark/30">Cuando realices una compra aparecerá aquí.</p>
      </div>
    );
  }

  return (
    <>
      <div className="divide-y divide-gray-100 border border-gray-200 bg-white">
        {orders.map((order) => (
          <OrderRow
            key={order.id}
            order={order}
            compact={compact}
            onSelect={() => {
              setSelectedOrder(order);
              setSelectedOrderDetail(null);
              setDetailError(null);
            }}
          />
        ))}
      </div>

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          detail={selectedOrderDetail}
          isLoading={isLoadingDetail}
          error={detailError}
          onClose={() => {
            setSelectedOrder(null);
            setSelectedOrderDetail(null);
            setDetailError(null);
            setIsLoadingDetail(false);
          }}
          onRetry={() => {
            setSelectedOrderDetail(null);
            setDetailError(null);
            setDetailVersion((prev) => prev + 1);
          }}
        />
      )}
    </>
  );
}

function OrderRow({
  order,
  compact,
  onSelect,
}: {
  order: CustomerOrderSummary;
  compact: boolean;
  onSelect: () => void;
}) {
  const isPaid = order.financialStatus === "PAID";
  const showFulfillment = !isPaid || (order.fulfillmentStatus !== "UNFULFILLED" && order.fulfillmentStatus !== null);

  const itemLabel = order.itemCount === 1
    ? "1 producto"
    : `${order.itemCount} productos`;

  const firstItems = order.lineItems.slice(0, 2);
  const remaining = order.itemCount - firstItems.length;

  const inner = (
    <div
      className={`flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between ${
        compact ? "px-5 py-4" : "px-6 py-5"
      } transition-colors hover:bg-gray-50`}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/8">
          <Receipt size={15} className="text-primary" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-black uppercase text-dark">{order.name}</p>
          <p className="mt-0.5 text-xs text-dark/40">
            {order.processedAt ? formatDate(order.processedAt) : "Sin fecha"}
            {order.itemCount > 0 && (
              <span className="ml-2 text-dark/30">· {itemLabel}</span>
            )}
          </p>
          {!compact && firstItems.length > 0 && (
            <p className="mt-1 truncate text-xs text-dark/40">
              {firstItems.map((i) => `${i.quantity}× ${i.title}`).join(" · ")}
              {remaining > 0 && ` · +${remaining} más`}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 pl-13 sm:pl-0">
        <OrderBadge
          label={getFinancialStatusLabel(order.financialStatus)}
          tone={isPaid ? "green" : "gray"}
        />
        {showFulfillment && (
          <OrderBadge label={getFulfillmentStatusLabel(order.fulfillmentStatus)} tone="blue" />
        )}
        <p className="ml-2 min-w-[90px] text-right text-sm font-black text-dark">
          {formatMoney(order.totalAmount, order.currencyCode)}
        </p>
        <ChevronRight size={16} className="hidden text-dark/25 sm:block" />
      </div>
    </div>
  );

  return (
    <button
      type="button"
      onClick={onSelect}
      className="block w-full text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
    >
      {inner}
    </button>
  );
}

function OrderBadge({ label, tone }: { label: string; tone: "green" | "gray" | "blue" }) {
  const cls = {
    green: "bg-green-100 text-green-700",
    gray:  "bg-gray-100  text-gray-600",
    blue:  "bg-blue-100  text-blue-700",
  }[tone];
  return (
    <span className={`hidden rounded-full px-2.5 py-1 text-[11px] font-semibold sm:inline-flex ${cls}`}>
      {label}
    </span>
  );
}

/* ─────────────────────────────── Form primitives ── */

// ── RUT helpers ──────────────────────────────────────────────────────────────

function rutToRaw(v: string): string {
  return v.replace(/[^0-9kK]/g, "").toUpperCase();
}

function rutToDisplay(raw: string): string {
  if (raw.length <= 1) return raw;
  return `${raw.slice(0, -1)}-${raw.slice(-1)}`;
}

function isValidRut(raw: string): boolean {
  if (raw.length < 2) return false;
  const body = raw.slice(0, -1);
  const dv = raw.slice(-1);
  if (!/^\d+$/.test(body) || !/^[0-9K]$/.test(dv)) return false;
  let sum = 0;
  let m = 2;
  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i]) * m;
    m = m === 7 ? 2 : m + 1;
  }
  const r = 11 - (sum % 11);
  const expected = r === 11 ? "0" : r === 10 ? "K" : String(r);
  return dv === expected;
}

function RutField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [error, setError] = useState<string | null>(null);
  const raw = rutToRaw(value);
  const displayValue = rutToDisplay(raw);

  function handleChange(inputVal: string) {
    const newRaw = rutToRaw(inputVal);
    onChange(rutToDisplay(newRaw));
    if (error) validate(newRaw);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (
      ["Backspace", "Delete", "Tab", "Escape", "Enter",
       "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown",
       "Home", "End"].includes(e.key)
    ) return;
    if (e.ctrlKey || e.metaKey) return;
    if (/^\d$/.test(e.key) || e.key === "k" || e.key === "K") return;
    e.preventDefault();
  }

  function validate(r: string) {
    if (!r) { setError(null); return; }
    setError(isValidRut(r) ? null : "RUT inválido — verifica el dígito verificador");
  }

  return (
    <div>
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.18em] text-dark/60">
        RUT *
      </span>
      <input
        type="text"
        value={displayValue}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => validate(raw)}
        placeholder="12345678-9"
        maxLength={10}
        required
        className={`w-full border px-4 py-3 text-sm text-dark transition-colors focus:border-primary focus:outline-none ${
          error ? "border-red-400" : "border-gray-300"
        }`}
      />
      {error && <span className="mt-1.5 block text-xs text-red-500">{error}</span>}
    </div>
  );
}

const CHILE_PHONE_RE = /^[2-9]\d{8}$/;

function stripCountryCode(raw: string): string {
  const s = raw.replace(/\s+/g, "");
  if (s.startsWith("+56")) return s.slice(3);
  if (s.startsWith("56") && s.length > 9) return s.slice(2);
  return s;
}

function PhoneField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [error, setError] = useState<string | null>(null);
  const local = stripCountryCode(value);

  function handleChange(raw: string) {
    const digits = raw.replace(/\D/g, "").slice(0, 9);
    onChange(digits ? `+56${digits}` : "");
    if (error) validate(digits);
  }

  function validate(digits: string) {
    if (!digits) { setError(null); return; }
    setError(CHILE_PHONE_RE.test(digits) ? null : "9 dígitos válidos — ej: 9 1234 5678");
  }

  return (
    <div>
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.18em] text-dark/60">
        Teléfono
      </span>
      <div className={`flex border transition-colors focus-within:border-primary ${error ? "border-red-400" : "border-gray-300"}`}>
        <span className="flex select-none items-center border-r border-gray-200 bg-gray-50 px-3 text-sm font-semibold text-dark/50">
          +56
        </span>
        <input
          type="tel"
          value={local}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={() => validate(local)}
          placeholder="9 1234 5678"
          maxLength={9}
          autoComplete="tel-national"
          className="flex-1 bg-transparent px-4 py-3 text-sm text-dark focus:outline-none"
        />
      </div>
      {error && <span className="mt-1.5 block text-xs text-red-500">{error}</span>}
    </div>
  );
}

const CHILE_REGIONS = [
  "Arica y Parinacota", "Tarapacá", "Antofagasta", "Atacama", "Coquimbo",
  "Valparaíso", "Metropolitana de Santiago",
  "Libertador General Bernardo O'Higgins",
  "Maule", "Ñuble", "Biobío", "La Araucanía", "Los Ríos", "Los Lagos",
  "Aisén del General Carlos Ibáñez del Campo",
  "Magallanes y de la Antártica Chilena",
];

function RegionSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.18em] text-dark/60">
        Región
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 px-4 py-3 text-sm text-dark focus:border-primary focus:outline-none"
      >
        <option value="">Selecciona una región</option>
        {CHILE_REGIONS.map((r) => (
          <option key={r} value={r}>{r}</option>
        ))}
      </select>
    </label>
  );
}

function FormField({
  label, value, onChange, helperText, required = false,
}: {
  label: string; value: string; onChange: (v: string) => void; helperText?: string; required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.18em] text-dark/60">
        {label}
      </span>
      <input
        type="text"
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 px-4 py-3 text-sm text-dark focus:border-primary focus:outline-none"
      />
      {helperText && (
        <span className="mt-1.5 block text-xs text-dark/40">{helperText}</span>
      )}
    </label>
  );
}

function TextAreaField({
  label, value, onChange,
}: {
  label: string; value: string; onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.18em] text-dark/60">
          {label}
        </span>
      )}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="w-full resize-none border border-gray-300 px-4 py-3 text-sm text-dark focus:border-primary focus:outline-none"
      />
    </label>
  );
}
