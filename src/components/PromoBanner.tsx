import { Truck, BadgeCheck, Headset, Medal } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Envíos a Todo Chile",
    desc: "Despacho rápido y seguro a todas las regiones",
  },
  {
    icon: BadgeCheck,
    title: "Garantía de Fábrica",
    desc: "Productos certificados y originales",
  },
  {
    icon: Headset,
    title: "Asesoría Técnica",
    desc: "Equipo especializado en transporte",
  },
  {
    icon: Medal,
    title: "Distribuidor Oficial",
    desc: "Braslux, Loctite, Moura, Wurth",
  },
];

export default function PromoBanner() {
  return (
    <section className="bg-primary-dark border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="flex items-center gap-3 bg-primary-dark px-5 py-4"
              >
                {/* Square icon block — contrasts with the rounded circles */}
                <div className="flex-shrink-0 w-11 h-11 bg-primary/15 border border-primary/30 flex items-center justify-center">
                  <Icon size={22} className="text-primary" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-bold text-white text-sm leading-tight">{f.title}</p>
                  <p className="text-[11px] text-steel leading-tight mt-0.5">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
