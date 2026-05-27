"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, Mail } from "lucide-react";
import Modal from "@/components/ui/Modal";

interface RecoverModalProps {
  initialEmail?: string;
  onClose: () => void;
}

export default function RecoverModal({ initialEmail = "", onClose }: RecoverModalProps) {
  const [email, setEmail] = useState(initialEmail);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/customer/auth/recover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? "No fue posible enviar el enlace.");
      }
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No fue posible enviar el enlace.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal onClose={onClose} maxWidth="max-w-md" panelClassName="rounded-sm">
      <div className="px-8 pb-10 pt-14">
        {sent ? (
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-600">
              <CheckCircle2 size={28} />
            </span>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight text-primary-dark">
                Enlace enviado
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-dark/60">
                Si existe una cuenta con ese correo, recibirás un enlace para
                restablecer tu contraseña.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="mt-2 flex h-11 w-full items-center justify-center rounded-sm bg-primary px-4 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-primary-light"
            >
              Cerrar
            </button>
          </div>
        ) : (
          <form onSubmit={(e) => void handleSubmit(e)} className="flex flex-col gap-6">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Mail size={17} />
              </span>
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight text-primary-dark">
                  Recuperar acceso
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-dark/56">
                  Ingresa tu correo y te enviaremos un enlace para restablecer
                  tu contraseña.
                </p>
              </div>
            </div>

            <div>
              <label className="block">
                <span className="mb-2 block text-[13px] font-medium text-dark/70">
                  Correo
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="cliente@empresa.cl"
                  autoComplete="email"
                  required
                  className="w-full border border-[#e5ddd2] bg-[#f6f2eb] px-4 py-3 text-[15px] text-dark transition-colors placeholder:text-dark/34 focus:border-primary focus:bg-white focus:outline-none"
                />
              </label>
            </div>

            {error && (
              <div className="flex items-start gap-2 border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
                <AlertCircle size={15} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex h-11 w-full items-center justify-center gap-2 bg-primary px-4 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Enviando enlace...
                  </>
                ) : (
                  "Enviar enlace"
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="text-center text-sm text-dark/46 hover:text-dark/70"
              >
                Volver al inicio de sesión
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}
