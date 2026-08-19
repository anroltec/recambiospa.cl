"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import Modal from "@/components/ui/Modal";
import RecoverModal from "@/components/account/RecoverModal";

type Mode = "login" | "register";

interface LoginModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const EMPTY_LOGIN = { email: "", password: "" };
const EMPTY_REGISTER = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirm: "",
};

export default function LoginModal({ onClose, onSuccess }: LoginModalProps) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [showRecover, setShowRecover] = useState(false);
  const [recoverEmail, setRecoverEmail] = useState("");

  const handleSuccess = useCallback(() => {
    onClose();
    if (onSuccess) {
      onSuccess();
    } else {
      router.push("/cuenta");
    }
  }, [onClose, onSuccess, router]);

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
    fetch("/api/customer/auth/status", { method: "GET", cache: "no-store" })
      .then(async (res) => {
        const data = (await res.json()) as {
          ok: boolean;
          authenticated: boolean;
        };
        if (res.ok && data.ok && data.authenticated) handleSuccess();
      })
      .catch(() => {})
      .finally(() => setCheckingAuth(false));
  }, [handleSuccess]);

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
      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? "No fue posible iniciar sesión.");
      }
      handleSuccess();
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : "No fue posible iniciar sesión.");
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
      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? "No fue posible crear la cuenta.");
      }
      handleSuccess();
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
    <>
      <Modal
        onClose={onClose}
        maxWidth="max-w-[1080px]"
        panelClassName="max-h-[94vh] overflow-hidden"
        closeButtonClassName="top-5 right-5 h-11 w-11 rounded-none border-[#e7dfd4] bg-white/94 shadow-none hover:bg-[#f3eee7]"
      >
        <div className="overflow-hidden bg-[#10151b]">
          <div className="grid min-h-[600px] lg:min-h-[560px] lg:grid-cols-[360px_minmax(0,1fr)]">
            {/* Sidebar imagen */}
            <aside className="relative min-h-[220px] overflow-hidden border-b border-black/10 bg-[#10151b] lg:min-h-[560px] lg:border-b-0 lg:border-r">
              <div className="absolute -inset-px bg-[#10151b] bg-[url('/banners/login-sidebar.jpg')] bg-cover bg-no-repeat [background-position:60%_center]" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,14,18,0.08)_0%,rgba(10,14,18,0.58)_68%,rgba(10,14,18,0.92)_100%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,14,18,0.82)_0%,rgba(10,14,18,0.52)_54%,rgba(10,14,18,0.14)_100%)]" />
              <div className="absolute left-0 top-0 h-full w-1 bg-primary" />
              <div className="relative flex h-full items-end p-5 sm:p-6 lg:p-8">
                <div className="border border-white/16 bg-black/25 px-4 py-4 backdrop-blur-[2px]">
                  <Image
                    src="/logo.svg"
                    alt="Recambio SpA"
                    width={170}
                    height={58}
                    className="h-auto w-[136px] sm:w-[160px]"
                  />
                  <p className="mt-3 text-[10px] font-medium uppercase tracking-[0.2em] text-white/58">
                    Acceso clientes
                  </p>
                </div>
              </div>
            </aside>

            {/* Contenido */}
            <div className="flex flex-1 flex-col bg-white px-6 py-5 sm:px-8 sm:py-6 lg:px-10 lg:py-7">
              <div className="flex items-center justify-between gap-4">
                <div className="inline-flex border border-[#e6ddd1] bg-[#f5f0e8]">
                  <TabBtn active={mode === "login"} onClick={() => switchMode("login")}>
                    Entrar
                  </TabBtn>
                  <TabBtn active={mode === "register"} onClick={() => switchMode("register")}>
                    Crear cuenta
                  </TabBtn>
                </div>
                <div className="hidden h-px w-16 bg-dark/10 sm:block" />
              </div>

              <div className="mt-8 lg:mt-10">
                <h3 className="text-3xl font-black tracking-tight text-dark sm:text-[2.15rem]">
                  {mode === "login" ? "Acceder" : "Crear cuenta"}
                </h3>
              </div>

              {mode === "login" ? (
                <form
                  onSubmit={(e) => void handleLogin(e)}
                  className="mt-7 flex flex-1 flex-col justify-between"
                >
                  <div className="space-y-5">
                    <Field label="Correo">
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
                          placeholder="Ingresa tu contraseña"
                          autoComplete="current-password"
                          required
                          className="pr-14"
                        />
                        <PwToggle
                          show={showLoginPw}
                          onToggle={() => setShowLoginPw((v) => !v)}
                        />
                      </div>
                      <div className="mt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            setRecoverEmail(loginValues.email);
                            setShowRecover(true);
                          }}
                          className="text-xs font-semibold uppercase tracking-[0.12em] text-primary transition-colors hover:text-primary-light"
                        >
                          ¿Olvidé mi contraseña?
                        </button>
                      </div>
                    </Field>

                    {loginError ? <ErrorBanner message={loginError} /> : null}
                  </div>

                  <div className="mt-7">
                    <SubmitBtn loading={isSubmittingLogin} loadingText="Entrando...">
                      Entrar
                    </SubmitBtn>
                    <p className="mt-4 text-center text-sm text-dark/46">
                      ¿Sin cuenta todavía?{" "}
                      <button
                        type="button"
                        onClick={() => switchMode("register")}
                        className="font-semibold text-primary transition-colors hover:text-primary-light"
                      >
                        Crear una
                      </button>
                    </p>
                  </div>
                </form>
              ) : (
                <form
                  onSubmit={(e) => void handleRegister(e)}
                  className="mt-7 flex flex-1 flex-col justify-between"
                >
                  <div className="space-y-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Nombre">
                        <Input
                          type="text"
                          value={regValues.firstName}
                          onChange={(e) =>
                            setRegValues((v) => ({ ...v, firstName: e.target.value }))
                          }
                          placeholder="Juan"
                          autoComplete="given-name"
                        />
                      </Field>
                      <Field label="Apellido">
                        <Input
                          type="text"
                          value={regValues.lastName}
                          onChange={(e) =>
                            setRegValues((v) => ({ ...v, lastName: e.target.value }))
                          }
                          placeholder="Pérez"
                          autoComplete="family-name"
                        />
                      </Field>
                    </div>

                    <Field label="Correo">
                      <Input
                        type="email"
                        value={regValues.email}
                        onChange={(e) => setRegValues((v) => ({ ...v, email: e.target.value }))}
                        placeholder="cliente@empresa.cl"
                        autoComplete="email"
                        required
                      />
                    </Field>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Contraseña">
                        <div className="relative">
                          <Input
                            type={showRegPw ? "text" : "password"}
                            value={regValues.password}
                            onChange={(e) =>
                              setRegValues((v) => ({ ...v, password: e.target.value }))
                            }
                            placeholder="Crea una contraseña"
                            autoComplete="new-password"
                            required
                            minLength={5}
                            className="pr-14"
                          />
                          <PwToggle
                            show={showRegPw}
                            onToggle={() => setShowRegPw((v) => !v)}
                          />
                        </div>
                        <HelperText>Mínimo 5 caracteres.</HelperText>
                      </Field>

                      <Field label="Confirmar contraseña">
                        <Input
                          type={showRegPw ? "text" : "password"}
                          value={regValues.confirm}
                          onChange={(e) =>
                            setRegValues((v) => ({ ...v, confirm: e.target.value }))
                          }
                          placeholder="Repite tu contraseña"
                          autoComplete="new-password"
                          required
                        />
                      </Field>
                    </div>

                    {regError ? <ErrorBanner message={regError} /> : null}
                  </div>

                  <div className="mt-7">
                    <SubmitBtn loading={isSubmittingReg} loadingText="Creando cuenta...">
                      Crear cuenta
                    </SubmitBtn>
                    <p className="mt-4 text-center text-sm text-dark/46">
                      ¿Ya tienes acceso?{" "}
                      <button
                        type="button"
                        onClick={() => switchMode("login")}
                        className="font-semibold text-primary transition-colors hover:text-primary-light"
                      >
                        Entrar
                      </button>
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </Modal>

      {showRecover && (
        <RecoverModal
          initialEmail={recoverEmail}
          onClose={() => setShowRecover(false)}
        />
      )}
    </>
  );
}

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
      aria-pressed={active}
      className={`border-r border-[#e6ddd1] px-5 py-2.5 text-sm font-semibold transition-colors last:border-r-0 sm:px-7 ${
        active ? "bg-white text-dark" : "text-dark/46 hover:text-dark/76"
      }`}
    >
      {children}
    </button>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[13px] font-medium text-dark/70">{label}</span>
      {children}
    </label>
  );
}

function Input({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full border border-[#e5ddd2] bg-[#f6f2eb] px-4 py-3 text-[15px] text-dark transition-colors placeholder:text-dark/34 focus:border-primary focus:bg-white focus:outline-none ${className}`}
      {...props}
    />
  );
}

function HelperText({ children }: { children: React.ReactNode }) {
  return <p className="mt-1.5 text-xs text-dark/44">{children}</p>;
}

function PwToggle({ show, onToggle }: { show: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
      className="absolute right-4 top-1/2 -translate-y-1/2 text-dark/30 transition-colors hover:text-dark/60"
    >
      {show ? <EyeOff size={17} /> : <Eye size={17} />}
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
      className="flex w-full items-center justify-center gap-2 bg-primary px-6 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? (
        <>
          <Loader2 size={16} className="animate-spin" />
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
    <div className="flex items-start gap-2 border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
      <AlertCircle size={15} className="mt-0.5 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
