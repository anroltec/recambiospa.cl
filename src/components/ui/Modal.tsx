"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
  maxWidth?: string;
}

export default function Modal({ children, onClose, maxWidth = "max-w-4xl" }: ModalProps) {
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
      <div className={`bg-white w-full ${maxWidth} max-h-[90vh] overflow-y-auto relative shadow-2xl`}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-white border border-gray-200 hover:bg-gray-100 transition-colors rounded-full shadow-md"
          aria-label="Cerrar"
        >
          <X size={20} className="text-dark" />
        </button>
        {children}
      </div>
    </div>
  );
}
