"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  Receipt,
  ShieldCheck,
  ShoppingBag,
  UserRound,
} from "lucide-react";
import Modal from "@/components/ui/Modal";

type Mode = "login" | "register";

interface LoginModalProps {
  onClose: () => void;
}

const EMPTY_LOGIN = { email: "", password: "" };
const EMPTY_REGISTER = { firstName: "", lastName: "", email: "", password: "", confirm: "" };

const FEATURES = [
  {
    icon: ShoppingBag,
    title: "Historial de compras",
    desc: "Pedidos, montos y estados de despacho en un solo lugar.",
  },
  {
    icon: Receipt,
    title: "Datos de facturación",
    desc: "RUT, razón social, giro y dirección siempre actualizados.",
  },
  {
    icon: ShieldCheck,
    title: "Base para ERP",
    desc: "Integración lista para Defontana y facturación electrónica.",
  },
];

export default function LoginModal({ onClose }: LoginModalProps) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [loginValues, setLoginValues] = useState(EMPTY_LOGIN);
  const [showLoginPw, setShowLoginPw] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);

  const [regValues, setRegValues] = useState(EMPTY_REGISTER);
  const [showRegPw, setShowRegPw] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);
  const [isSubmittingReg, setIsSubmittingReg] = useState(false);

  useEffect(() => {
    fetch("/api/customer/profile", { method: "GET", cache: "no-store" })
      .then((res) => {
        if (res.ok) {
          onClose();
          router.push("/cuenta");
        }
      })
      .catch(() => {})
      .finally(() => setCheckingAuth(false));
  }, [router, onClose]);

  function switchMode(next: Mode) {
    setMode(next);
    setLoginError(null);
    setRegError(null);
  }

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmittingLogin(true);
    setLoginError(null);

    try {
      const res = await fetch("/api/customer/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginValues.email, password: loginValues.password }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error ?? "No fue posible iniciar sesion.");
      onClose();
      router.push("/cuenta");
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : "No fue posible iniciar sesion.");
    } finally {
      setIsSubmittingLogin(false);
    }
  }

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (regValues.password !== regValues.confirm) {
      setRegError("Las contraseñas no coinciden.");
      return;
    }
    setIsSubmittingReg(true);
    setRegError(null);

    try {
      const res = await fetch("/api/customer/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: regValues.email,
          password: regValues.password,
          firstName: regValues.firstName || undefined,
          lastName: regValues.lastName || undefined,
        }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error ?? "No fue posible crear la cuenta.");
      onClose();
      router.push("/cuenta");
    } catch (err) {
      setRegError(err instanceof Error ? err.message : "No fue posible crear la cuenta.");
    } finally {
      setIsSubmittingReg(false);
    }
  }

  if (checkingAuth) {
    return (
      <Modal onClose={onClose} maxWidth="max-w-sm">
        <div className="flex h-48 items-center justify-center">
          <Loader2 size={24} className="animate-spin text-primary" />
        </div>
      </Modal>
    );
  }

  return (
    <Modal onClose={onClose} maxWidth="max-w-2xl">
      <div className="flex min-h-[520px] flex-col lg:flex-row">
        {/* ── Brand panel ── */}
        <div className="flex flex-col justify-between bg-primary-dark p-8 lg:w-64 lg:shrink-0">
          {/* Top */}
          <div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
              <UserRound size={20} className="text-primary-light" />
            </div>

            <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.25em] text-primary">
              Panel B2B
            </p>
            <h2 className="mt-2 text-xl font-black uppercase leading-snug text-white">
              Recambio SPA
            </h2>
            <p className="mt-3 text-xs leading-relaxed text-white/40">
              Compra, factura y gestiona tu historial desde un mismo lugar.
            </p>

            <div className="mt-8 space-y-5">
              {FEATURES.map((f) => (
                <div key={f.title} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded bg-white/10">
                    <f.icon size={13} className="text-white/70" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wide text-white/80">
                      {f.title}
                    </p>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-white/35">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom accent */}
          <div className="mt-8 h-px w-10 bg-primary" />
        </div>

        {/* ── Form panel ── */}
        <div className="flex flex-1 flex-col p-8">
          {/* Pill tab switcher */}
          <div className="mb-7 flex rounded-full bg-gray-100 p-1">
            <TabBtn active={mode === "login"} onClick={() => switchMode("login")}>
              Iniciar Sesión
            </TabBtn>
            <TabBtn active={mode === "register"} onClick={() => switchMode("register")}>
              Crear Cuenta
            </TabBtn>
          </div>

          {mode === "login" ? (
            <form
              onSubmit={(e) => void handleLogin(e)}
              className="flex flex-1 flex-col justify-between"
            >
              <div className="space-y-5">
                <Field label="Email corporativo">
                  <Input
                    type="email"
                    value={loginValues.email}
                    onChange={(e) => setLoginValues((v) => ({ ...v, email: e.target.value }))}
                    placeholder="cliente@empresa.cl"
                    autoComplete="email"
                    required
                  />
                </Field>

                <Field label="Contraseña">
                  <div className="relative">
                    <Input
                      type={showLoginPw ? "text" : "password"}
                      value={loginValues.password}
                      onChange={(e) =>
                        setLoginValues((v) => ({ ...v, password: e.target.value }))
                      }
                      placeholder="••••••••"
                      autoComplete="current-password"
                      required
                      className="pr-11"
                    />
                    <PwToggle show={showLoginPw} onToggle={() => setShowLoginPw((v) => !v)} />
                  </div>
                </Field>

                {loginError ? <ErrorBanner message={loginError} /> : null}
              </div>

              <div className="mt-8">
                <SubmitBtn loading={isSubmittingLogin} loadingText="Ingresando…">
                  Iniciar Sesión
                </SubmitBtn>
                <p className="mt-4 text-center text-xs text-dark/40">
                  ¿Sin cuenta?{" "}
                  <button
                    type="button"
                    onClick={() => switchMode("register")}
                    className="font-semibold text-primary hover:underline"
                  >
                    Crear una ahora
                  </button>
                </p>
              </div>
            </form>
          ) : (
            <form
              onSubmit={(e) => void handleRegister(e)}
              className="flex flex-1 flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Nombre">
                    <Input
                      type="text"
                      value={regValues.firstName}
                      onChange={(e) => setRegValues((v) => ({ ...v, firstName: e.target.value }))}
                      placeholder="Juan"
                      autoComplete="given-name"
                    />
                  </Field>
                  <Field label="Apellido">
                    <Input
                      type="text"
                      value={regValues.lastName}
                      onChange={(e) => setRegValues((v) => ({ ...v, lastName: e.target.value }))}
                      placeholder="Pérez"
                      autoComplete="family-name"
                    />
                  </Field>
                </div>

                <Field label="Email corporativo">
                  <Input
                    type="email"
                    value={regValues.email}
                    onChange={(e) => setRegValues((v) => ({ ...v, email: e.target.value }))}
                    placeholder="cliente@empresa.cl"
                    autoComplete="email"
                    required
                  />
                </Field>

                <Field label="Contraseña">
                  <div className="relative">
                    <Input
                      type={showRegPw ? "text" : "password"}
                      value={regValues.password}
                      onChange={(e) =>
                        setRegValues((v) => ({ ...v, password: e.target.value }))
                      }
                      placeholder="Mínimo 5 caracteres"
                      autoComplete="new-password"
                      required
                      minLength={5}
                      className="pr-11"
                    />
                    <PwToggle show={showRegPw} onToggle={() => setShowRegPw((v) => !v)} />
                  </div>
                </Field>

                <Field label="Confirmar contraseña">
                  <Input
                    type={showRegPw ? "text" : "password"}
                    value={regValues.confirm}
                    onChange={(e) => setRegValues((v) => ({ ...v, confirm: e.target.value }))}
                    placeholder="Repite la contraseña"
                    autoComplete="new-password"
                    required
                  />
                </Field>

                {regError ? <ErrorBanner message={regError} /> : null}
              </div>

              <div className="mt-6">
                <SubmitBtn loading={isSubmittingReg} loadingText="Creando cuenta…">
                  Crear Cuenta
                </SubmitBtn>
                <p className="mt-4 text-center text-xs text-dark/40">
                  ¿Ya tienes cuenta?{" "}
                  <button
                    type="button"
                    onClick={() => switchMode("login")}
                    className="font-semibold text-primary hover:underline"
                  >
                    Inicia sesión
                  </button>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </Modal>
  );
}

/* ── Sub-components ── */

function TabBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded-full py-2 text-[11px] font-bold uppercase tracking-wider transition-all duration-200 ${
        active ? "bg-white text-dark shadow-sm" : "text-dark/40 hover:text-dark/60"
      }`}
    >
      {children}
    </button>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.18em] text-dark/40">
        {label}
      </span>
      {children}
    </label>
  );
}

function Input({
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full border-0 border-b-2 border-gray-200 bg-transparent pb-2 pt-1 text-sm text-dark placeholder:text-dark/25 focus:border-primary focus:outline-none transition-colors ${className}`}
      {...props}
    />
  );
}

function PwToggle({ show, onToggle }: { show: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      tabIndex={-1}
      aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
      className="absolute right-0 top-1/2 -translate-y-1/2 text-dark/30 hover:text-dark/60 transition-colors"
    >
      {show ? <EyeOff size={15} /> : <Eye size={15} />}
    </button>
  );
}

function SubmitBtn({
  loading,
  loadingText,
  children,
}: {
  loading: boolean;
  loadingText: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="flex w-full items-center justify-center gap-2 bg-primary py-3.5 text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-primary-light disabled:opacity-60"
    >
      {loading ? (
        <>
          <Loader2 size={14} className="animate-spin" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-2 rounded bg-red-50 px-3 py-2.5 text-xs text-red-600">
      <AlertCircle size={13} className="mt-0.5 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
