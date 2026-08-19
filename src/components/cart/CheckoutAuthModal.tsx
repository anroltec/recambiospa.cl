"use client";

import { useEffect, useState } from "react";
import { LogIn, UserCheck } from "lucide-react";
import Modal from "@/components/ui/Modal";

interface CheckoutAuthModalProps {
  checkoutUrl: string;
  onClose: () => void;
  onShowLogin: () => void;
}

export default function CheckoutAuthModal({
  checkoutUrl,
  onClose,
  onShowLogin,
}: CheckoutAuthModalProps) {
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch("/api/customer/auth/status", { cache: "no-store" })
      .then(async (res) => {
        const data = (await res.json()) as {
          ok: boolean;
          authenticated: boolean;
        };
        if (res.ok && data.ok && data.authenticated) {
          // Already logged in — go straight to checkout
          window.open(checkoutUrl, "_blank", "noopener,noreferrer");
          onClose();
        }
      })
      .catch(() => {})
      .finally(() => setChecking(false));
  }, [checkoutUrl, onClose]);

  if (checking) return null;

  return (
    <Modal onClose={onClose} maxWidth="max-w-sm" panelClassName="rounded-sm">
      <div className="flex flex-col gap-6 px-8 pb-10 pt-14 text-center">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tight text-primary-dark">
            ¿Cómo deseas continuar?
          </h2>
          <p className="mt-2 text-sm text-dark/60">
            Con una cuenta puedes revisar el historial de tus pedidos.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => {
              onClose();
              onShowLogin();
            }}
            className="flex h-12 items-center justify-center gap-2 rounded-sm bg-primary px-4 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-primary-light"
          >
            <LogIn size={16} />
            Iniciar sesión / Crear cuenta
          </button>

          <button
            onClick={() => {
              window.open(checkoutUrl, "_blank", "noopener,noreferrer");
              onClose();
            }}
            className="flex h-12 items-center justify-center gap-2 rounded-sm border border-primary-dark px-4 text-sm font-semibold uppercase tracking-wide text-primary-dark transition-colors hover:bg-primary-dark hover:text-white"
          >
            <UserCheck size={16} />
            Continuar como invitado
          </button>
        </div>
      </div>
    </Modal>
  );
}
