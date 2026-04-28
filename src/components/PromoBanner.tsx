import { Truck, BadgeCheck, Headset, Medal } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Envíos a todo Chile",
    desc: "Despacho rápido y seguro a todas las regiones.",
  },
  {
    icon: BadgeCheck,
    title: "Garantía de fábrica",
    desc: "Productos certificados y originales.",
  },
  {
    icon: Headset,
    title: "Asesoría técnica",
    desc: "Equipo especializado en transporte.",
  },
  {
    icon: Medal,
    title: "Distribuidor oficial",
    desc: "Braslux, Loctite, Moura y Wurth.",
  },
];

export default function PromoBanner() {
  return (
    <section className="relative z-20 -mt-5 px-4 pb-8 sm:-mt-7 lg:-mt-8">
      <div className="max-w-7xl mx-auto">
        <div className="border border-slate-200 bg-white shadow-[0_16px_38px_rgba(21,37,56,0.08)]">
          <div className="grid gap-px bg-slate-200 sm:grid-cols-2 xl:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.title}
                  className="flex items-start gap-4 bg-white px-5 py-5 sm:px-6 sm:py-6"
                >
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center border border-primary/20 bg-primary/5 text-primary">
                    <Icon size={22} strokeWidth={1.8} />
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-base font-bold leading-tight text-primary-dark">
                      {feature.title}
                    </h2>
                    <p className="mt-1.5 text-sm leading-6 text-dark/62">
                      {feature.desc}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
