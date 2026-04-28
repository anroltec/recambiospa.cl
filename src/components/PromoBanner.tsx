import { Truck, BadgeCheck, Headset, Medal } from "lucide-react";

const features = [
  {
    icon: Truck,
    eyebrow: "Cobertura nacional",
    title: "Env\u00edos a todo Chile",
    desc: "Despacho r\u00e1pido, seguro y coordinado para todas las regiones.",
  },
  {
    icon: BadgeCheck,
    eyebrow: "Respaldo original",
    title: "Garant\u00eda de f\u00e1brica",
    desc: "Productos certificados, trazables y respaldados por marcas l\u00edderes.",
  },
  {
    icon: Headset,
    eyebrow: "Soporte experto",
    title: "Asesor\u00eda t\u00e9cnica",
    desc: "Acompa\u00f1amiento comercial y t\u00e9cnico para transporte y flotas.",
  },
  {
    icon: Medal,
    eyebrow: "Marcas oficiales",
    title: "Distribuidor autorizado",
    desc: "Braslux, Loctite, Moura y Wurth con atenci\u00f3n especializada.",
  },
];

export default function PromoBanner() {
  return (
    <section className="relative z-20 -mt-7 px-4 pb-6 sm:-mt-10 lg:-mt-12">
      <div className="max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,#213143_0%,#162230_52%,#101923_100%)] shadow-[0_24px_70px_rgba(10,18,28,0.38)]">
          <div className="pointer-events-none absolute -left-16 top-0 h-44 w-44 rounded-full bg-primary/18 blur-3xl" />
          <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-white/6 blur-3xl" />

          <div className="relative border-b border-white/10 px-6 py-5 sm:px-8 lg:px-10">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-primary-light/90">
                  Por qu\u00e9 elegir Recambio SpA
                </p>
                <h2 className="mt-2 text-xl font-bold text-white sm:text-2xl">
                  Respaldo comercial para transporte, talleres y flotas
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-relaxed text-steel">
                Selecci\u00f3n t\u00e9cnica, despacho confiable y marcas que responden cuando la operaci\u00f3n no puede detenerse.
              </p>
            </div>
          </div>

          <div className="relative grid gap-3 p-4 sm:grid-cols-2 sm:gap-4 sm:p-5 xl:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.title}
                  className="group relative overflow-hidden rounded-2xl border border-white/8 bg-white/[0.04] px-5 py-5 transition-colors duration-200 hover:bg-white/[0.07] sm:px-6 sm:py-6"
                >
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-70" />

                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl border border-primary/30 bg-primary/12 text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                      <Icon size={24} strokeWidth={1.7} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary-light/80">
                        {feature.eyebrow}
                      </p>
                      <h3 className="mt-2 text-base font-bold leading-tight text-white">
                        {feature.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-steel">
                        {feature.desc}
                      </p>
                    </div>
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
