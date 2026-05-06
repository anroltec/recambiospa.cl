"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
  maxWidth?: string;
  panelClassName?: string;
  closeButtonClassName?: string;
}

export default function Modal({
  children,
  onClose,
  maxWidth = "max-w-4xl",
  panelClassName = "",
  closeButtonClassName = "rounded-full",
}: ModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`relative max-h-[90vh] w-full overflow-y-auto bg-white shadow-2xl ${maxWidth} ${panelClassName}`}
      >
        <button
          onClick={onClose}
          className={`absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center border border-gray-200 bg-white shadow-md transition-colors hover:bg-gray-100 ${closeButtonClassName}`}
          aria-label="Cerrar"
        >
          <X size={20} className="text-dark" />
        </button>
        {children}
      </div>
    </div>
  );
}
