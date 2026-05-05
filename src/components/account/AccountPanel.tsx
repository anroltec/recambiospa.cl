"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Building2,
  ChevronRight,
  Loader2,
  LogOut,
  MapPin,
  Receipt,
  Save,
  ShieldCheck,
  ShoppingBag,
  UserRound,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
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
  pageInfo: {
    hasNextPage: boolean;
    endCursor: string | null;
  };
}

const EMPTY_LOGIN = {
  email: "",
  password: "",
};

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

function toFormValues(profile: CustomerCompanyProfile): CustomerCompanyProfileInput {
  return {
    firstName: profile.firstName ?? "",
    lastName: profile.lastName ?? "",
    phone: profile.phone ?? "",
    rut: profile.rut ?? "",
    razonSocial: profile.razonSocial ?? "",
    giro: profile.giro ?? "",
    billingAddressLine1: profile.billingAddressLine1 ?? "",
    billingAddressLine2: profile.billingAddressLine2 ?? "",
    billingComuna: profile.billingComuna ?? "",
    billingCity: profile.billingCity ?? "",
    billingRegion: profile.billingRegion ?? "",
    billingPostalCode: profile.billingPostalCode ?? "",
    billingCountryCode: profile.billingCountryCode ?? "CL",
    billingNotes: profile.billingNotes ?? "",
  };
}

function formatMoney(amount: string, currencyCode: string): string {
  const parsed = Number(amount);

  if (Number.isNaN(parsed)) {
    return `${amount} ${currencyCode}`;
  }

  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: currencyCode === "CLP" ? 0 : 2,
    maximumFractionDigits: currencyCode === "CLP" ? 0 : 2,
  }).format(parsed);
}

function getProfileBadgeVariant(status: CustomerCompanyProfile["profileStatus"]) {
  return status === "complete" ? "success" : "primary";
}

function getProfileStatusLabel(status: CustomerCompanyProfile["profileStatus"]) {
  return status === "complete" ? "Perfil listo" : "Perfil incompleto";
}

function getFinancialStatusLabel(status: string | null) {
  if (!status) return "Sin estado";

  const labels: Record<string, string> = {
    PAID: "Pagado",
    PARTIALLY_PAID: "Pago parcial",
    PENDING: "Pendiente",
    AUTHORIZED: "Autorizado",
    PARTIALLY_REFUNDED: "Reembolso parcial",
    REFUNDED: "Reembolsado",
    VOIDED: "Anulado",
  };

  return labels[status] ?? status;
}

function getFulfillmentStatusLabel(status: string | null) {
  if (!status) return "Preparando";

  const labels: Record<string, string> = {
    FULFILLED: "Despachado",
    PARTIALLY_FULFILLED: "Despacho parcial",
    UNFULFILLED: "Pendiente",
    IN_PROGRESS: "En proceso",
    ON_HOLD: "En espera",
    OPEN: "Abierto",
    SCHEDULED: "Programado",
  };

  return labels[status] ?? status;
}

function getAccountName(profile: CustomerCompanyProfile): string {
  const fullName = `${profile.firstName ?? ""} ${profile.lastName ?? ""}`.trim();
  return fullName || profile.email;
}

export default function AccountPanel({ view }: AccountPanelProps) {
  const [panelStatus, setPanelStatus] = useState<PanelStatus>("loading");
  const [profile, setProfile] = useState<CustomerCompanyProfile | null>(null);
  const [formValues, setFormValues] = useState<CustomerCompanyProfileInput>(EMPTY_FORM);
  const [orders, setOrders] = useState<CustomerOrderSummary[]>([]);
  const [ordersCursor, setOrdersCursor] = useState<string | null>(null);
  const [hasMoreOrders, setHasMoreOrders] = useState(false);
  const [loginValues, setLoginValues] = useState(EMPTY_LOGIN);
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      try {
        const response = await fetch("/api/customer/profile", {
          method: "GET",
          cache: "no-store",
        });

        if (!isMounted) return;

        if (response.status === 401) {
          setPanelStatus("guest");
          setProfile(null);
          setFormValues(EMPTY_FORM);
          return;
        }

        const data = (await response.json()) as ProfileResponse | ApiErrorResponse;

        if (!response.ok || !data.ok) {
          throw new Error(data.ok ? "Unable to fetch customer profile." : data.error);
        }

        setProfile(data.profile);
        setFormValues(toFormValues(data.profile));
        setPanelStatus("ready");
      } catch (error) {
        if (!isMounted) return;

        setPanelStatus("guest");
        setLoginError(
          error instanceof Error
            ? error.message
            : "No fue posible cargar la cuenta del cliente."
        );
      }
    }

    void loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (panelStatus !== "ready" || (view !== "dashboard" && view !== "orders")) {
      return;
    }

    const first = view === "dashboard" ? 5 : 12;
    void loadOrders(first);
  }, [panelStatus, view]);

  async function loadOrders(first: number, after?: string | null, append = false) {
    setIsLoadingOrders(true);
    setOrdersError(null);

    try {
      const searchParams = new URLSearchParams({ first: String(first) });

      if (after) {
        searchParams.set("after", after);
      }

      const response = await fetch(`/api/customer/orders?${searchParams.toString()}`, {
        method: "GET",
        cache: "no-store",
      });

      if (response.status === 401) {
        setPanelStatus("guest");
        setProfile(null);
        setOrders([]);
        return;
      }

      const data = (await response.json()) as OrdersResponse | ApiErrorResponse;

      if (!response.ok || !data.ok) {
        throw new Error(data.ok ? "Unable to fetch customer orders." : data.error);
      }

      setOrders((currentOrders) =>
        append ? [...currentOrders, ...data.orders] : data.orders
      );
      setOrdersCursor(data.pageInfo.endCursor);
      setHasMoreOrders(data.pageInfo.hasNextPage);
    } catch (error) {
      setOrdersError(
        error instanceof Error ? error.message : "No fue posible cargar los pedidos."
      );
    } finally {
      setIsLoadingOrders(false);
    }
  }

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmittingLogin(true);
    setLoginError(null);

    try {
      const response = await fetch("/api/customer/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginValues),
      });

      const data = (await response.json()) as ProfileResponse | ApiErrorResponse;

      if (!response.ok || !data.ok) {
        throw new Error(data.ok ? "Unable to log in customer." : data.error);
      }

      setProfile(data.profile);
      setFormValues(toFormValues(data.profile));
      setPanelStatus("ready");
      setLoginValues(EMPTY_LOGIN);
      setProfileMessage(null);
    } catch (error) {
      setLoginError(
        error instanceof Error ? error.message : "No fue posible iniciar sesion."
      );
    } finally {
      setIsSubmittingLogin(false);
    }
  }

  async function handleLogout() {
    setIsLoggingOut(true);

    try {
      await fetch("/api/customer/auth/logout", {
        method: "POST",
      });
    } finally {
      setIsLoggingOut(false);
      setPanelStatus("guest");
      setProfile(null);
      setOrders([]);
      setOrdersCursor(null);
      setHasMoreOrders(false);
      setFormValues(EMPTY_FORM);
      setProfileMessage(null);
    }
  }

  async function handleSaveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSavingProfile(true);
    setProfileMessage(null);

    try {
      const response = await fetch("/api/customer/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });

      const data = (await response.json()) as ProfileResponse | ApiErrorResponse;

      if (!response.ok || !data.ok) {
        throw new Error(data.ok ? "Unable to update customer profile." : data.error);
      }

      setProfile(data.profile);
      setFormValues(toFormValues(data.profile));
      setProfileMessage("Los datos de empresa y facturacion fueron guardados en Shopify.");
    } catch (error) {
      setProfileMessage(
        error instanceof Error ? error.message : "No fue posible guardar el perfil."
      );
    } finally {
      setIsSavingProfile(false);
    }
  }

  function handleFormChange(field: keyof CustomerCompanyProfileInput, value: string) {
    setFormValues((current) => ({
      ...current,
      [field]: value,
    }));
  }

  if (panelStatus === "loading") {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex min-h-[320px] items-center justify-center border border-gray-200 bg-white">
          <div className="flex items-center gap-3 text-sm text-dark/60">
            <Loader2 size={18} className="animate-spin text-primary" />
            Cargando panel del cliente...
          </div>
        </div>
      </div>
    );
  }

  if (panelStatus === "guest" || !profile) {
    return (
      <AccountGuestState
        loginValues={loginValues}
        onLoginValuesChange={setLoginValues}
        onSubmit={handleLogin}
        isSubmittingLogin={isSubmittingLogin}
        loginError={loginError}
      />
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <AccountSidebar
          view={view}
          profile={profile}
          isLoggingOut={isLoggingOut}
          onLogout={handleLogout}
        />

        <section className="space-y-6">
          {view === "dashboard" ? (
            <DashboardView
              profile={profile}
              orders={orders}
              isLoadingOrders={isLoadingOrders}
              ordersError={ordersError}
            />
          ) : null}

          {view === "company" ? (
            <CompanyView
              profile={profile}
              formValues={formValues}
              isSavingProfile={isSavingProfile}
              profileMessage={profileMessage}
              onFormChange={handleFormChange}
              onSubmit={handleSaveProfile}
            />
          ) : null}

          {view === "orders" ? (
            <OrdersView
              orders={orders}
              isLoadingOrders={isLoadingOrders}
              ordersError={ordersError}
              hasMoreOrders={hasMoreOrders}
              canLoadMore={Boolean(ordersCursor)}
              onLoadMore={() => void loadOrders(12, ordersCursor, true)}
            />
          ) : null}
        </section>
      </div>
    </div>
  );
}

function AccountGuestState({
  loginValues,
  onLoginValuesChange,
  onSubmit,
  isSubmittingLogin,
  loginError,
}: {
  loginValues: { email: string; password: string };
  onLoginValuesChange: React.Dispatch<
    React.SetStateAction<{ email: string; password: string }>
  >;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  isSubmittingLogin: boolean;
  loginError: string | null;
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid gap-6 lg:grid-cols-[420px_minmax(0,1fr)]">
        <div className="border border-gray-200 bg-white p-8">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <UserRound size={30} className="text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight text-dark">
                Inicia sesion
              </h2>
              <p className="mt-1 text-sm text-dark/60">
                Usa la misma cuenta de cliente que tienes en Shopify.
              </p>
            </div>
          </div>

          <form className="space-y-4" onSubmit={onSubmit}>
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.18em] text-dark/60">
                Email
              </span>
              <input
                type="email"
                value={loginValues.email}
                onChange={(event) =>
                  onLoginValuesChange((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
                placeholder="cliente@empresa.cl"
                className="w-full border border-gray-300 px-4 py-3 text-sm text-dark focus:border-primary focus:outline-none"
                autoComplete="email"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.18em] text-dark/60">
                Contraseña
              </span>
              <input
                type="password"
                value={loginValues.password}
                onChange={(event) =>
                  onLoginValuesChange((current) => ({
                    ...current,
                    password: event.target.value,
                  }))
                }
                placeholder="••••••••"
                className="w-full border border-gray-300 px-4 py-3 text-sm text-dark focus:border-primary focus:outline-none"
                autoComplete="current-password"
              />
            </label>

            {loginError ? (
              <div className="flex items-start gap-2 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{loginError}</span>
              </div>
            ) : null}

            <Button
              type="submit"
              fullWidth
              size="lg"
              disabled={isSubmittingLogin}
              className="flex items-center justify-center gap-2"
            >
              {isSubmittingLogin ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Ingresando
                </>
              ) : (
                "Iniciar sesion"
              )}
            </Button>
          </form>
        </div>

        <div className="border border-gray-200 bg-white p-8">
          <div className="mb-8 flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                Panel B2B
              </p>
              <h3 className="mt-2 text-3xl font-black uppercase leading-tight text-dark">
                Compra, factura y consulta tu historial desde un mismo lugar
              </h3>
            </div>
            <ShieldCheck size={34} className="hidden text-primary lg:block" />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: ShoppingBag,
                title: "Historial de compras",
                description: "Revisa pedidos pagados, montos y estados de despacho.",
              },
              {
                icon: Building2,
                title: "Datos empresa",
                description: "Actualiza RUT, razon social, giro y direccion de facturacion.",
              },
              {
                icon: Receipt,
                title: "Base para ERP",
                description: "La informacion queda lista para alimentar el flujo con Defontana.",
              },
            ].map((item) => (
              <div key={item.title} className="border border-gray-200 bg-light p-5">
                <item.icon size={22} className="text-primary" />
                <h4 className="mt-3 text-sm font-bold uppercase tracking-wide text-dark">
                  {item.title}
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-dark/60">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 border-l-4 border-primary bg-primary/5 px-5 py-4 text-sm text-dark/70">
            Si aun no tienes acceso como cliente, primero debes existir como customer en
            Shopify con email y contraseña activos.
          </div>
        </div>
      </div>
    </div>
  );
}

function AccountSidebar({
  view,
  profile,
  isLoggingOut,
  onLogout,
}: {
  view: AccountView;
  profile: CustomerCompanyProfile;
  isLoggingOut: boolean;
  onLogout: () => Promise<void>;
}) {
  return (
    <aside className="space-y-4">
      <div className="border border-gray-200 bg-white p-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <UserRound size={26} className="text-primary" />
        </div>
        <h2 className="mt-4 text-xl font-black uppercase text-dark">
          {getAccountName(profile)}
        </h2>
        <p className="mt-1 text-sm text-dark/60">{profile.email}</p>
        <div className="mt-4">
          <Badge
            label={getProfileStatusLabel(profile.profileStatus)}
            variant={getProfileBadgeVariant(profile.profileStatus)}
          />
        </div>

        <button
          type="button"
          onClick={() => void onLogout()}
          disabled={isLoggingOut}
          className="mt-6 flex items-center gap-2 text-sm font-semibold text-dark/70 transition-colors hover:text-primary disabled:opacity-60"
        >
          {isLoggingOut ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} />}
          Cerrar sesion
        </button>
      </div>

      <nav className="border border-gray-200 bg-white p-3">
        {[
          { href: "/cuenta", label: "Resumen", icon: ShieldCheck, active: view === "dashboard" },
          { href: "/cuenta/empresa", label: "Datos empresa", icon: Building2, active: view === "company" },
          { href: "/cuenta/pedidos", label: "Pedidos", icon: ShoppingBag, active: view === "orders" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center justify-between px-4 py-3 text-sm font-semibold uppercase tracking-wide transition-colors ${
              item.active
                ? "bg-primary text-white"
                : "text-dark/70 hover:bg-light hover:text-primary"
            }`}
          >
            <span className="flex items-center gap-2">
              <item.icon size={16} />
              {item.label}
            </span>
            <ChevronRight size={14} />
          </Link>
        ))}
      </nav>
    </aside>
  );
}

function DashboardView({
  profile,
  orders,
  isLoadingOrders,
  ordersError,
}: {
  profile: CustomerCompanyProfile;
  orders: CustomerOrderSummary[];
  isLoadingOrders: boolean;
  ordersError: string | null;
}) {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="border border-gray-200 bg-white p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-dark/50">
            Estado del perfil
          </p>
          <h3 className="mt-3 text-lg font-black uppercase text-dark">
            {profile.profileStatus === "complete" ? "Listo para facturar" : "Faltan datos"}
          </h3>
          <p className="mt-2 text-sm text-dark/60">
            {profile.profileStatus === "complete"
              ? "El cliente ya tiene razon social, direccion y datos tributarios cargados."
              : "Completa el perfil para dejar lista la facturacion empresa."}
          </p>
        </div>

        <div className="border border-gray-200 bg-white p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-dark/50">
            Razón social
          </p>
          <h3 className="mt-3 text-lg font-black uppercase text-dark">
            {profile.razonSocial || "Sin definir"}
          </h3>
          <p className="mt-2 text-sm text-dark/60">RUT: {profile.rut || "Aun no informado"}</p>
        </div>

        <div className="border border-gray-200 bg-white p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-dark/50">
            Direccion principal
          </p>
          <h3 className="mt-3 text-lg font-black uppercase text-dark">
            {profile.billingCity || "Sin ciudad"}
          </h3>
          <p className="mt-2 text-sm text-dark/60">
            {profile.billingAddressLine1 || "Aun no existe una direccion registrada"}
          </p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)]">
        <div className="border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <div>
              <h3 className="text-lg font-black uppercase text-dark">Ultimos pedidos</h3>
              <p className="text-sm text-dark/60">Resumen rapido del historial mas reciente.</p>
            </div>
            <Link
              href="/cuenta/pedidos"
              className="text-sm font-bold uppercase tracking-wide text-primary hover:text-primary-dark"
            >
              Ver todos
            </Link>
          </div>

          <div className="p-6">
            <OrdersBlock
              orders={orders}
              isLoading={isLoadingOrders}
              error={ordersError}
              compact
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="border border-gray-200 bg-white p-6">
            <h3 className="text-lg font-black uppercase text-dark">Datos guardados en Shopify</h3>
            <p className="mt-2 text-sm leading-relaxed text-dark/60">
              Esta version guarda identidad, direccion principal y datos tributarios
              directamente en Shopify. No depende de una base de datos adicional.
            </p>
          </div>

          <div className="border border-gray-200 bg-primary-dark p-6 text-white">
            <div className="flex items-center gap-3">
              <MapPin size={20} className="text-primary" />
              <h3 className="text-lg font-black uppercase">Siguiente acción</h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              {profile.profileStatus === "complete"
                ? "Tu perfil esta listo. Lo siguiente es conectar estos datos con el flujo de pedidos pagados."
                : "Completa razon social, RUT, giro y direccion para dejar listo el flujo funcional."}
            </p>
            <Link
              href="/cuenta/empresa"
              className="mt-5 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-primary"
            >
              Ir a datos empresa
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

function CompanyView({
  profile,
  formValues,
  isSavingProfile,
  profileMessage,
  onFormChange,
  onSubmit,
}: {
  profile: CustomerCompanyProfile;
  formValues: CustomerCompanyProfileInput;
  isSavingProfile: boolean;
  profileMessage: string | null;
  onFormChange: (field: keyof CustomerCompanyProfileInput, value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
}) {
  return (
    <div className="border border-gray-200 bg-white">
      <div className="border-b border-gray-200 px-6 py-5">
        <h2 className="text-2xl font-black uppercase tracking-tight text-dark">
          Datos de empresa y facturación
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-dark/60">
          Estos datos se guardan en Shopify usando el customer, su direccion principal y
          metafields tributarios. Son la base para el flujo de facturacion y para la
          integracion con Defontana.
        </p>
      </div>

      <form className="space-y-6 p-6" onSubmit={onSubmit}>
        <div className="grid gap-5 md:grid-cols-2">
          <FormField label="Nombre" value={formValues.firstName} onChange={(value) => onFormChange("firstName", value)} />
          <FormField label="Apellido" value={formValues.lastName} onChange={(value) => onFormChange("lastName", value)} />
          <FormField label="Telefono" value={formValues.phone} onChange={(value) => onFormChange("phone", value)} />
          <FormField label="RUT" value={formValues.rut} onChange={(value) => onFormChange("rut", value)} required />
          <FormField label="Razón social" value={formValues.razonSocial} onChange={(value) => onFormChange("razonSocial", value)} required />
          <FormField label="Giro" value={formValues.giro} onChange={(value) => onFormChange("giro", value)} required />
          <FormField label="Direccion" value={formValues.billingAddressLine1} onChange={(value) => onFormChange("billingAddressLine1", value)} required />
          <FormField label="Direccion complementaria" value={formValues.billingAddressLine2 ?? ""} onChange={(value) => onFormChange("billingAddressLine2", value)} />
          <FormField
            label="Comuna"
            value={formValues.billingComuna}
            onChange={(value) => onFormChange("billingComuna", value)}
            required
            helperText="Se guarda como metafield porque Shopify no la maneja como campo nativo."
          />
          <FormField label="Ciudad" value={formValues.billingCity} onChange={(value) => onFormChange("billingCity", value)} required />
          <FormField label="Region" value={formValues.billingRegion ?? ""} onChange={(value) => onFormChange("billingRegion", value)} />
          <FormField label="Codigo postal" value={formValues.billingPostalCode ?? ""} onChange={(value) => onFormChange("billingPostalCode", value)} />
        </div>

        <div className="grid gap-5 md:grid-cols-[220px_minmax(0,1fr)]">
          <FormField label="Pais" value={formValues.billingCountryCode ?? "CL"} onChange={(value) => onFormChange("billingCountryCode", value)} />
          <TextAreaField label="Notas de facturación" value={formValues.billingNotes ?? ""} onChange={(value) => onFormChange("billingNotes", value)} />
        </div>

        {profileMessage ? (
          <div
            className={`flex items-start gap-2 px-4 py-3 text-sm ${
              profileMessage.includes("guardados")
                ? "border border-green-200 bg-green-50 text-green-700"
                : "border border-red-200 bg-red-50 text-red-700"
            }`}
          >
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{profileMessage}</span>
          </div>
        ) : null}

        <div className="flex flex-col gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-dark/55">
            Estado actual:{" "}
            <span className="font-semibold text-dark">
              {getProfileStatusLabel(profile.profileStatus)}
            </span>
          </div>
          <Button
            type="submit"
            size="lg"
            disabled={isSavingProfile}
            className="flex items-center justify-center gap-2"
          >
            {isSavingProfile ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Guardando
              </>
            ) : (
              <>
                <Save size={16} />
                Guardar datos
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

function OrdersView({
  orders,
  isLoadingOrders,
  ordersError,
  hasMoreOrders,
  canLoadMore,
  onLoadMore,
}: {
  orders: CustomerOrderSummary[];
  isLoadingOrders: boolean;
  ordersError: string | null;
  hasMoreOrders: boolean;
  canLoadMore: boolean;
  onLoadMore: () => void;
}) {
  return (
    <div className="border border-gray-200 bg-white">
      <div className="border-b border-gray-200 px-6 py-5">
        <h2 className="text-2xl font-black uppercase tracking-tight text-dark">
          Historial de compras
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-dark/60">
          Este listado se carga desde Shopify usando la sesion autenticada del cliente.
        </p>
      </div>

      <div className="p-6">
        <OrdersBlock orders={orders} isLoading={isLoadingOrders} error={ordersError} />

        {hasMoreOrders ? (
          <div className="mt-6 flex justify-center">
            <Button
              type="button"
              variant="outline"
              size="md"
              disabled={isLoadingOrders || !canLoadMore}
              onClick={onLoadMore}
            >
              {isLoadingOrders ? "Cargando..." : "Cargar más pedidos"}
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
  required = false,
  helperText,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  helperText?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.18em] text-dark/60">
        {label}
        {required ? " *" : ""}
      </span>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full border border-gray-300 px-4 py-3 text-sm text-dark focus:border-primary focus:outline-none"
      />
      {helperText ? (
        <span className="mt-2 block text-xs leading-relaxed text-dark/45">{helperText}</span>
      ) : null}
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.18em] text-dark/60">
        {label}
      </span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className="w-full resize-none border border-gray-300 px-4 py-3 text-sm text-dark focus:border-primary focus:outline-none"
      />
    </label>
  );
}

function StatusPill({ label, tone = "neutral" }: { label: string; tone?: "neutral" | "success" }) {
  const className =
    tone === "success" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600";

  return (
    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${className}`}>
      {label}
    </span>
  );
}

function OrdersBlock({
  orders,
  isLoading,
  error,
  compact = false,
}: {
  orders: CustomerOrderSummary[];
  isLoading: boolean;
  error: string | null;
  compact?: boolean;
}) {
  if (isLoading && !orders.length) {
    return (
      <div className="flex min-h-[180px] items-center justify-center text-sm text-dark/60">
        <Loader2 size={18} className="mr-2 animate-spin text-primary" />
        Cargando pedidos...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-start gap-2 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        <AlertCircle size={16} className="mt-0.5 shrink-0" />
        <span>{error}</span>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="border border-dashed border-gray-300 bg-light px-6 py-10 text-center">
        <ShoppingBag size={26} className="mx-auto text-primary" />
        <h3 className="mt-4 text-lg font-black uppercase text-dark">Aun no hay pedidos</h3>
        <p className="mt-2 text-sm text-dark/60">
          Cuando el cliente compre en Shopify, su historial aparecera aqui.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <article
          key={order.id}
          className={`border border-gray-200 ${compact ? "px-4 py-4" : "px-5 py-5"}`}
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h4 className="text-lg font-black uppercase text-dark">{order.name}</h4>
                <StatusPill
                  label={getFinancialStatusLabel(order.financialStatus)}
                  tone={order.financialStatus === "PAID" ? "success" : "neutral"}
                />
                <StatusPill label={getFulfillmentStatusLabel(order.fulfillmentStatus)} />
              </div>
              <p className="mt-2 text-sm text-dark/60">
                Fecha:{" "}
                <span className="font-medium text-dark">
                  {order.processedAt ? formatDate(order.processedAt) : "Sin fecha"}
                </span>
              </p>
            </div>

            <div className="flex items-center gap-3 text-right">
              <Receipt size={18} className="text-primary" />
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-dark/45">
                  Total
                </p>
                <p className="text-base font-black uppercase text-dark">
                  {formatMoney(order.totalAmount, order.currencyCode)}
                </p>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
