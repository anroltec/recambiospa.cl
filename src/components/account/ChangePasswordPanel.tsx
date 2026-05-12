"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Eye, EyeOff, Loader2, LockKeyhole } from "lucide-react";
import Button from "@/components/ui/Button";

type PanelStatus = "checking" | "ready";

type PasswordForm = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const EMPTY_FORM: PasswordForm = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export default function ChangePasswordPanel() {
  const router = useRouter();
  const [panelStatus, setPanelStatus] = useState<PanelStatus>("checking");
  const [accountEmail, setAccountEmail] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<PasswordForm>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    tone: "success" | "error";
    message: string;
  } | null>(null);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    let mounted = true;

    fetch("/api/customer/profile", { method: "GET", cache: "no-store" })
      .then(async (res) => {
        if (!mounted) return;

        if (res.status === 401) {
          router.replace("/");
          return;
        }

        if (!res.ok) {
          throw new Error("Unable to verify customer session.");
        }

        const data = (await res.json()) as {
          ok: boolean;
          profile?: { email: string };
        };

        if (!data.ok || !data.profile) {
          throw new Error("Unable to verify customer session.");
        }

        setAccountEmail(data.profile.email);
        setPanelStatus("ready");
      })
      .catch(() => {
        if (mounted) {
          router.replace("/");
        }
      });

    return () => {
      mounted = false;
    };
  }, [router]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    try {
      const response = await fetch("/api/customer/auth/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      });

      const data = (await response.json()) as {
        ok: boolean;
        error?: string;
      };

      if (response.status === 401) {
        router.replace("/");
        return;
      }

      if (!response.ok || !data.ok) {
        throw new Error(data.error ?? "No fue posible actualizar la contrasena.");
      }

      setFormValues(EMPTY_FORM);
      setFeedback({
        tone: "success",
        message: "Contrasena actualizada. La sesion sigue abierta con el nuevo token.",
      });
    } catch (error) {
      setFeedback({
        tone: "error",
        message:
          error instanceof Error
            ? error.message
            : "No fue posible actualizar la contrasena.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function updateField(field: keyof PasswordForm, value: string) {
    setFormValues((current) => ({ ...current, [field]: value }));
  }

  if (panelStatus === "checking") {
    return (
      <div className="flex min-h-[48vh] items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-dark/55">
          <Loader2 size={18} className="animate-spin text-primary" />
          Verificando sesion...
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="border border-gray-200 bg-white">
        <div className="border-b border-gray-100 px-6 py-6">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <LockKeyhole size={20} />
            </span>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
                Seguridad
              </p>
              <h1 className="mt-1 text-2xl font-black uppercase text-dark">
                Cambiar contrasena
              </h1>
              <p className="mt-2 max-w-xl text-sm text-dark/55">
                Usa tu contrasena actual para confirmar la identidad y Shopify
                rotara la sesion con un nuevo customer access token.
              </p>
              {accountEmail ? (
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-dark/35">
                  Cuenta: {accountEmail}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <form onSubmit={(event) => void handleSubmit(event)} className="space-y-0">
          <div className="grid gap-5 px-6 py-6">
            <PasswordField
              label="Contrasena actual"
              value={formValues.currentPassword}
              onChange={(value) => updateField("currentPassword", value)}
              show={showCurrent}
              onToggle={() => setShowCurrent((value) => !value)}
              autoComplete="current-password"
            />
            <PasswordField
              label="Nueva contrasena"
              value={formValues.newPassword}
              onChange={(value) => updateField("newPassword", value)}
              show={showNew}
              onToggle={() => setShowNew((value) => !value)}
              autoComplete="new-password"
              helperText="Minimo 5 caracteres."
            />
            <PasswordField
              label="Confirmar nueva contrasena"
              value={formValues.confirmPassword}
              onChange={(value) => updateField("confirmPassword", value)}
              show={showConfirm}
              onToggle={() => setShowConfirm((value) => !value)}
              autoComplete="new-password"
            />
          </div>

          <div className="flex flex-col gap-4 border-t border-gray-100 bg-[#faf7f2] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm">
              {feedback ? (
                <FeedbackBanner tone={feedback.tone} message={feedback.message} />
              ) : (
                <p className="text-dark/48">
                  Si cambias la contrasena, Shopify invalida los tokens anteriores
                  y la sesion local se actualiza automaticamente.
                </p>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="flex shrink-0 items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Actualizando...
                </>
              ) : (
                "Actualizar contrasena"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  show,
  onToggle,
  autoComplete,
  helperText,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  show: boolean;
  onToggle: () => void;
  autoComplete: string;
  helperText?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.18em] text-dark/60">
        {label}
      </span>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete={autoComplete}
          required
          className="w-full border border-gray-300 bg-white px-4 py-3 pr-14 text-sm text-dark focus:border-primary focus:outline-none"
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={show ? "Ocultar contrasena" : "Mostrar contrasena"}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-dark/30 transition-colors hover:text-dark/60"
        >
          {show ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>
      {helperText ? (
        <span className="mt-1.5 block text-xs text-dark/40">{helperText}</span>
      ) : null}
    </label>
  );
}

function FeedbackBanner({
  tone,
  message,
}: {
  tone: "success" | "error";
  message: string;
}) {
  return (
    <div
      className={`flex items-start gap-2 border px-4 py-3 ${
        tone === "success"
          ? "border-green-200 bg-green-50 text-green-700"
          : "border-red-200 bg-red-50 text-red-700"
      }`}
    >
      <AlertCircle size={15} className="mt-0.5 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
