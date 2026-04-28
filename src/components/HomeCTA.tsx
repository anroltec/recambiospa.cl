import Link from "next/link";
import { ArrowRight, MessageCircle, Phone, Mail } from "lucide-react";

export default function HomeCTA() {
  return (
    <section className="bg-primary relative overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Diagonal accent */}
      <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/[0.05] rotate-12 rounded-3xl" />
      <div className="absolute -right-10 -bottom-20 w-60 h-60 bg-white/[0.04] rotate-12 rounded-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left copy */}
          <div>
            <p className="text-white/60 text-[10px] font-bold uppercase tracking-[0.25em] mb-4">
              Atención B2B · Talleres · Flotas · Empresas
            </p>
            <h2 className="text-3xl lg:text-4xl font-black text-white uppercase tracking-tight leading-[0.9] mb-6">
              ¿Necesita cotizar<br />
              para su flota?
            </h2>
            <p className="text-white/70 text-sm leading-relaxed mb-8 max-w-md">
              Atendemos pedidos al por mayor con precios especiales para empresas,
              talleres y gestores de flotas. Respuesta en menos de 2 horas hábiles.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <a
                href="https://wa.me/569xxxxxxxx"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-primary hover:bg-white/90 font-black px-7 py-4 text-sm uppercase tracking-wider transition-colors"
              >
                <MessageCircle size={16} />
                Cotizar por WhatsApp
              </a>
              <Link
                href="/collections"
                className="inline-flex items-center gap-2 border-2 border-white/40 hover:border-white text-white font-bold px-7 py-4 text-sm uppercase tracking-wider transition-colors"
              >
                Ver catálogo <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          {/* Right: contact channels */}
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
            {[
              {
                icon: MessageCircle,
                label: "WhatsApp",
                value: "+56 9 xxxx xxxx",
                sub: "Lun–Vie 9:00–18:00",
                href: "https://wa.me/569xxxxxxxx",
              },
              {
                icon: Mail,
                label: "Correo electrónico",
                value: "ventas@recambiospa.cl",
                sub: "Respuesta < 2 horas",
                href: "mailto:ventas@recambiospa.cl",
              },
              {
                icon: Phone,
                label: "Teléfono",
                value: "+56 2 xxxx xxxx",
                sub: "Horario comercial",
                href: "tel:+5620000000",
              },
            ].map(({ icon: Icon, label, value, sub, href }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="group flex items-center gap-4 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 px-5 py-4 transition-all"
              >
                <div className="w-10 h-10 bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-white/50 uppercase tracking-wider font-bold mb-0.5">{label}</p>
                  <p className="text-sm font-bold text-white truncate">{value}</p>
                  <p className="text-[10px] text-white/40 mt-0.5">{sub}</p>
                </div>
                <ArrowRight size={14} className="text-white/30 group-hover:text-white/60 ml-auto flex-shrink-0 transition-colors" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
