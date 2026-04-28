import { Truck, ShieldCheck, Headphones, Award } from "lucide-react";

const features = [
  { icon: Truck, title: "Env\u00edos a Todo Chile", desc: "Despacho r\u00e1pido y seguro a todas las regiones" },
  { icon: ShieldCheck, title: "Garant\u00eda de F\u00e1brica", desc: "Productos certificados y originales" },
  { icon: Headphones, title: "Asesor\u00eda T\u00e9cnica", desc: "Equipo especializado en transporte" },
  { icon: Award, title: "Distribuidor Oficial", desc: "Braslux, Loctite, Moura, Wurth" },
];

export default function PromoBanner() {
  return (
    <section className="bg-primary-dark">
      <div className="max-w-7xl mx-auto px-4 py-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon size={20} className="text-primary" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm leading-tight">{f.title}</h3>
                  <p className="text-xs text-steel leading-tight mt-0.5">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
