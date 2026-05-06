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
import { formatDate } from "@/lib/format";
import type {
  CustomerCompanyProfile,
  CustomerCompanyProfileInput,
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

const EMPTY_FORM: CustomerCompanyProfileInput = {
  firstName: "",
  lastName: "",
  phone: "",
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
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="flex flex-col gap-4 border-b border-gray-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
            Panel B2B
          </p>
          <h1 className="mt-1 text-2xl font-black uppercase text-dark">{displayName}</h1>
          <p className="mt-0.5 text-sm text-dark/50">{profile.email}</p>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 self-start rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wider ${
            complete
              ? "bg-green-100 text-green-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${complete ? "bg-green-500" : "bg-amber-500"}`} />
          {getProfileStatusLabel(profile.profileStatus)}
        </span>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Razón social"
          value={profile.razonSocial || "Sin definir"}
          sub={profile.rut ? `RUT: ${profile.rut}` : "RUT no informado"}
          accent={!!profile.razonSocial}
        />
        <StatCard
          label="Giro"
          value={profile.giro || "Sin definir"}
          sub="Actividad tributaria"
          accent={!!profile.giro}
        />
        <StatCard
          label="Dirección"
          value={profile.billingCity || "Sin ciudad"}
          sub={profile.billingAddressLine1 || "Sin dirección registrada"}
          accent={!!profile.billingAddressLine1}
        />
      </div>

      {/* CTA if incomplete */}
      {!complete && (
        <div className="flex items-center justify-between border border-amber-200 bg-amber-50 px-5 py-4">
          <div className="flex items-center gap-3">
            <MapPin size={18} className="shrink-0 text-amber-600" />
            <p className="text-sm text-amber-800">
              Completa tu perfil con RUT, razón social y dirección para habilitar la facturación.
            </p>
          </div>
          <Link
            href="/cuenta/empresa"
            className="ml-4 flex shrink-0 items-center gap-1 text-sm font-bold text-amber-700 hover:text-amber-900"
          >
            Completar
            <ChevronRight size={15} />
          </Link>
        </div>
      )}

      {/* Recent orders */}
      <div>
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

function StatCard({
  label, value, sub, accent,
}: {
  label: string; value: string; sub: string; accent: boolean;
}) {
  return (
    <div className={`border bg-white p-5 ${accent ? "border-gray-200" : "border-dashed border-gray-300"}`}>
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-dark/40">{label}</p>
      <p className={`mt-2 truncate text-base font-black uppercase ${accent ? "text-dark" : "text-dark/30"}`}>
        {value}
      </p>
      <p className="mt-1 truncate text-xs text-dark/40">{sub}</p>
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
      <FormSection title="Datos tributarios" sub="RUT, razón social y giro para facturación electrónica.">
        <div className="grid gap-5 sm:grid-cols-3">
          <FormField label="RUT *"          value={formValues.rut}         onChange={(v) => onFormChange("rut", v)} />
          <FormField label="Razón social *" value={formValues.razonSocial} onChange={(v) => onFormChange("razonSocial", v)} />
          <FormField label="Giro *"         value={formValues.giro}        onChange={(v) => onFormChange("giro", v)} />
        </div>
      </FormSection>

      {/* ── Dirección ── */}
      <FormSection title="Dirección de facturación" sub="Dirección que aparecerá en las facturas emitidas.">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Calle y número *"     value={formValues.billingAddressLine1}  onChange={(v) => onFormChange("billingAddressLine1", v)} />
          <FormField label="Complemento"           value={formValues.billingAddressLine2 ?? ""} onChange={(v) => onFormChange("billingAddressLine2", v)} />
          <FormField
            label="Comuna *"
            value={formValues.billingComuna}
            onChange={(v) => onFormChange("billingComuna", v)}
            helperText="Se guarda como metafield en Shopify."
          />
          <FormField label="Ciudad *"             value={formValues.billingCity}          onChange={(v) => onFormChange("billingCity", v)} />
          <RegionSelect value={formValues.billingRegion ?? ""}   onChange={(v) => onFormChange("billingRegion", v)} />
          <FormField label="Código postal"        value={formValues.billingPostalCode ?? ""} onChange={(v) => onFormChange("billingPostalCode", v)} />
        </div>
      </FormSection>

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
            {saved ? "Datos guardados correctamente en Shopify." : profileMessage}
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
    <div className="divide-y divide-gray-100 border border-gray-200 bg-white">
      {orders.map((order) => (
        <div
          key={order.id}
          className={`flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between ${
            compact ? "px-5 py-4" : "px-6 py-5"
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/8">
              <Receipt size={15} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-black uppercase text-dark">{order.name}</p>
              <p className="mt-0.5 text-xs text-dark/40">
                {order.processedAt ? formatDate(order.processedAt) : "Sin fecha"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 pl-13 sm:pl-0">
            <OrderBadge
              label={getFinancialStatusLabel(order.financialStatus)}
              tone={order.financialStatus === "PAID" ? "green" : "gray"}
            />
            <OrderBadge label={getFulfillmentStatusLabel(order.fulfillmentStatus)} tone="blue" />
            <p className="ml-2 min-w-[90px] text-right text-sm font-black text-dark">
              {formatMoney(order.totalAmount, order.currencyCode)}
            </p>
          </div>
        </div>
      ))}
    </div>
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
  label, value, onChange, helperText,
}: {
  label: string; value: string; onChange: (v: string) => void; helperText?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.18em] text-dark/60">
        {label}
      </span>
      <input
        type="text"
        value={value}
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
