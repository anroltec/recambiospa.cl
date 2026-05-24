"use client";

import { useState } from "react";
import { Tag } from "lucide-react";
import Modal from "@/components/ui/Modal";
import type { ServicePriceGroup } from "@/data/technical-services";

function formatCLP(price: number) {
  return price.toLocaleString("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });
}

export default function PricingModalButton({
  title,
  priceGroups,
}: {
  title: string;
  priceGroups: ServicePriceGroup[];
}) {
  const [open, setOpen] = useState(false);

  if (!priceGroups.length) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="mt-6 inline-flex items-center gap-2 border border-primary px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-primary transition-colors hover:bg-primary hover:text-white"
      >
        <Tag size={13} strokeWidth={2} />
        Ver precios
      </button>

      {open && (
        <Modal onClose={() => setOpen(false)} maxWidth="max-w-2xl">
          <div className="px-6 pb-8 pt-6 sm:px-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-primary">
              Lista de precios
            </p>
            <h2 className="mt-2 text-xl font-black uppercase tracking-tight text-primary-dark sm:text-2xl">
              {title}
            </h2>
            <p className="mt-1 text-xs text-red-600">
              Valores netos sin IVA · Sujeto a evaluación técnica
            </p>

            <div className="mt-6 space-y-6">
              {priceGroups.map((group) => (
                <div key={group.category}>
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-primary-dark/55">
                    {group.category}
                  </p>
                  <div className="divide-y divide-primary-dark/8 border border-primary-dark/10">
                    {group.items.map((item) => (
                      <div
                        key={item.code}
                        className="flex items-center justify-between gap-4 px-4 py-3"
                      >
                        <div className="flex items-start gap-3">
                          <span className="mt-0.5 shrink-0 text-[10px] font-bold uppercase tracking-wide text-primary-dark/38">
                            {item.code}
                          </span>
                          <span className="text-[13px] leading-5 text-dark/80">
                            {item.description}
                          </span>
                        </div>
                        <span className="shrink-0 text-sm font-black tracking-tight text-primary-dark">
                          {item.price !== null ? formatCLP(item.price) : "Consultar"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
