import { Truck, ShieldCheck, Headphones, CreditCard } from "lucide-react";

const features = [
  { icon: Truck, title: "Envíos a Todo Chile", desc: "Despacho rápido y seguro" },
  { icon: ShieldCheck, title: "Productos Certificados", desc: "Calidad garantizada" },
  { icon: Headphones, title: "Asesoría Técnica", desc: "Atención personalizada" },
  { icon: CreditCard, title: "Pago Seguro", desc: "Transferencia y más" },
];

export default function PromoBanner() {
  return (
    <section className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="flex items-center gap-3">
                <Icon size={28} className="text-primary flex-shrink-0" strokeWidth={1.5} />
                <div>
                  <h3 className="font-bold text-dark text-sm">{f.title}</h3>
                  <p className="text-xs text-gray-400">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
