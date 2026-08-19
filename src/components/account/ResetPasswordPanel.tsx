"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Eye, EyeOff, Loader2, MailCheck } from "lucide-react";
import Button from "@/components/ui/Button";

type ResetForm = {
  password: string;
  confirmPassword: string;
};

const EMPTY_FORM: ResetForm = {
  password: "",
  confirmPassword: "",
};

interface ResetPasswordPanelProps {
  resetUrl: string | null;
}

export default function ResetPasswordPanel({
  resetUrl,
}: ResetPasswordPanelProps) {
  const router = useRouter();
  const [formValues, setFormValues] = useState<ResetForm>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    try {
      if (!resetUrl) {
        throw new Error("El enlace de recuperación no contiene reset_url.");
      }

      const response = await fetch("/api/customer/auth/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resetUrl,
          password: formValues.password,
          confirmPassword: formValues.confirmPassword,
        }),
      });

      const data = (await response.json()) as {
        ok: boolean;
        error?: string;
      };

      if (!response.ok || !data.ok) {
        throw new Error(data.error ?? "No fue posible restablecer la contraseña.");
      }

      router.replace("/cuenta");
    } catch (error) {
      setFeedback(
        error instanceof Error
          ? error.message
          : "No fue posible restablecer la contraseña."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function updateField(field: keyof ResetForm, value: string) {
    setFormValues((current) => ({ ...current, [field]: value }));
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="border border-gray-200 bg-white">
        <div className="border-b border-gray-100 px-6 py-6">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <MailCheck size={20} />
            </span>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
                Recuperación
              </p>
              <h1 className="mt-1 text-2xl font-black uppercase text-dark">
                Restablecer contraseña
              </h1>
              <p className="mt-2 max-w-xl text-sm text-dark/55">
                Define una nueva contraseña usando el enlace enviado por Shopify
                al correo del cliente.
              </p>
            </div>
          </div>
        </div>

        {!resetUrl ? (
          <div className="px-6 py-6">
            <FeedbackBanner message="El enlace es inválido o incompleto. Revisa el correo de recuperación y vuelve a intentarlo." />
          </div>
        ) : (
          <form onSubmit={(event) => void handleSubmit(event)} className="space-y-0">
            <div className="grid gap-5 px-6 py-6">
              <PasswordField
                label="Nueva contraseña"
                value={formValues.password}
                onChange={(value) => updateField("password", value)}
                show={showPassword}
                onToggle={() => setShowPassword((value) => !value)}
              />
              <PasswordField
                label="Confirmar nueva contraseña"
                value={formValues.confirmPassword}
                onChange={(value) => updateField("confirmPassword", value)}
                show={showConfirmPassword}
                onToggle={() => setShowConfirmPassword((value) => !value)}
              />
            </div>

            <div className="flex flex-col gap-4 border-t border-gray-100 bg-[#faf7f2] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm">
                {feedback ? (
                  <FeedbackBanner message={feedback} />
                ) : (
                  <p className="text-dark/48">
                    Al completar el reset, el cliente queda autenticado con la
                    nueva contraseña y redirigido a su cuenta.
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
                    Restableciendo...
                  </>
                ) : (
                  "Guardar nueva contraseña"
                )}
              </Button>
            </div>
          </form>
        )}
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
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  show: boolean;
  onToggle: () => void;
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
          autoComplete="new-password"
          required
          className="w-full border border-gray-300 bg-white px-4 py-3 pr-14 text-sm text-dark focus:border-primary focus:outline-none"
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-dark/30 transition-colors hover:text-dark/60"
        >
          {show ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>
      <span className="mt-1.5 block text-xs text-dark/40">
        Mínimo 5 caracteres.
      </span>
    </label>
  );
}

function FeedbackBanner({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-2 border border-red-200 bg-red-50 px-4 py-3 text-red-700">
      <AlertCircle size={15} className="mt-0.5 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
