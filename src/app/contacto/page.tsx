"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronRight, Phone, Mail, MapPin, Clock,
  MessageCircle, ChevronDown, ArrowRight, Send,
} from "lucide-react";
import Container from "@/components/ui/Container";

const WA_NUMBER = "569xxxxxxxx";

const contactCards = [
  {
    icon: Phone,
    label: "WhatsApp / Teléfono",
    value: "+569 xxxx xxxx",
    sub: "Respuesta rápida",
    href: `https://wa.me/${WA_NUMBER}`,
    bg: "bg-[#25D366]",
    textColor: "text-white",
  },
  {
    icon: Mail,
    label: "Correo electrónico",
    value: "ventas@recambiospa.cl",
    sub: "Respuesta en 24 h hábiles",
    href: "mailto:ventas@recambiospa.cl",
    bg: "bg-primary",
    textColor: "text-white",
  },
  {
    icon: Clock,
    label: "Horario de atención",
    value: "Lun – Vie, 9:00 – 18:00",
    sub: "Hora de Chile continental",
    href: null,
    bg: "bg-primary-dark",
    textColor: "text-white",
  },
  {
    icon: MapPin,
    label: "Despachos",
    value: "Todo Chile",
    sub: "Vía empresas de transporte",
    href: null,
    bg: "bg-light",
    textColor: "text-dark",
  },
];

const faqs = [
  {
    q: "¿Cuánto demora el despacho?",
    a: "Normalmente entre 2 y 5 días hábiles dependiendo de la región. Para zonas extremas puede extenderse hasta 7 días.",
  },
  {
    q: "¿Emiten facturas a empresa?",
    a: "Sí, emitimos boletas y facturas electrónicas a nombre de empresa o persona natural. El RUT se solicita al momento de confirmar el pedido.",
  },
  {
    q: "¿Puedo pedir una cotización sin compromiso?",
    a: "Por supuesto. Escríbenos por WhatsApp o completa el formulario y te enviaremos la cotización sin ningún costo ni obligación de compra.",
  },
  {
    q: "¿Tienen stock disponible o hay que encargar?",
    a: "La mayoría de los productos del catálogo están en stock. Si un producto no está disponible, te lo informamos y coordinamos el plazo de reposición.",
  },
  {
    q: "¿Hacen precios especiales para compras en volumen?",
    a: "Sí. Para flotas y compras frecuentes aplicamos tarifas preferenciales. Contáctanos para coordinar una cuenta corporativa.",
  },
];

export default function ContactoPage() {
  const [form, setForm] = useState({ nombre: "", email: "", telefono: "", asunto: "", mensaje: "" });
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function buildWhatsAppURL() {
    const lines = [
      `Hola, soy ${form.nombre || "un cliente"}.`,
      form.email ? `Email: ${form.email}` : "",
      form.telefono ? `Teléfono: ${form.telefono}` : "",
      form.asunto ? `Asunto: ${form.asunto}` : "",
      form.mensaje ? `\nMensaje:\n${form.mensaje}` : "",
    ].filter(Boolean).join("\n");
    return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(lines)}`;
  }

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <Container className="py-3">
          <nav className="flex items-center gap-1.5 text-xs text-gray-400">
            <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
            <ChevronRight size={12} />
            <span className="text-dark font-medium">Contacto</span>
          </nav>
        </Container>
      </div>

      {/* ── HERO ────────────────────────────────────────── */}
      <section className="relative bg-primary-dark overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary" />
        <Container className="relative py-16 lg:py-24">
          <div className="lg:flex items-end justify-between gap-12">
            <div className="max-w-xl">
              <p className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-4">
                Estamos para ayudarte
              </p>
              <h1 className="text-4xl lg:text-5xl font-black text-white uppercase leading-tight tracking-tight mb-4">
                Hablemos
              </h1>
              <p className="text-white/60 text-sm leading-relaxed">
                ¿Necesitas una cotización, tienes dudas sobre un producto o quieres conocer
                más de nuestros servicios? Escríbenos y te respondemos a la brevedad.
              </p>
            </div>
            {/* Quick WhatsApp CTA */}
            <div className="mt-8 lg:mt-0 flex-shrink-0">
              <a
                href={`https://wa.me/${WA_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#20b858] text-white font-bold px-7 py-4 transition-colors text-sm uppercase tracking-wider"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Contactar por WhatsApp
              </a>
              <p className="text-white/30 text-[10px] mt-2 text-center">Respuesta en minutos</p>
            </div>
          </div>
        </Container>
      </section>

      {/* ── CONTACT CARDS ───────────────────────────────── */}
      <section className="bg-white">
        <Container>
          <div className="grid grid-cols-2 lg:grid-cols-4 -mt-1 border-b border-gray-200">
            {contactCards.map(({ icon: Icon, label, value, sub, href, bg, textColor }) => {
              const inner = (
                <div className={`${bg} p-6 lg:p-8 h-full flex flex-col gap-4 group`}>
                  <div className={`w-10 h-10 flex items-center justify-center ${textColor === "text-white" ? "bg-white/15" : "bg-primary/10"}`}>
                    <Icon size={18} className={textColor} />
                  </div>
                  <div>
                    <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${textColor === "text-white" ? "text-white/50" : "text-gray-400"}`}>
                      {label}
                    </p>
                    <p className={`font-bold text-sm leading-snug ${textColor}`}>{value}</p>
                    <p className={`text-[11px] mt-1 ${textColor === "text-white" ? "text-white/50" : "text-gray-400"}`}>{sub}</p>
                  </div>
                  {href && (
                    <ArrowRight
                      size={16}
                      className={`mt-auto ${textColor === "text-white" ? "text-white/40 group-hover:text-white" : "text-gray-300 group-hover:text-primary"} transition-colors`}
                    />
                  )}
                </div>
              );
              return href ? (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="block border-r border-gray-200 last:border-r-0">
                  {inner}
                </a>
              ) : (
                <div key={label} className="border-r border-gray-200 last:border-r-0">{inner}</div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ── FORM + SECONDARY INFO ────────────────────────── */}
      <section className="bg-light py-20">
        <Container>
          <div className="lg:grid lg:grid-cols-5 gap-12">

            {/* FORM — 3 columns */}
            <div className="lg:col-span-3 mb-12 lg:mb-0">
              <p className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-3">
                Formulario de contacto
              </p>
              <h2 className="text-2xl font-black text-dark uppercase tracking-tight mb-2">
                Envíanos tu consulta
              </h2>
              <p className="text-gray-500 text-sm mb-8">
                Completa el formulario y se abrirá WhatsApp con tu mensaje pre-redactado.
              </p>

              <div className="bg-white border border-gray-200 p-6 lg:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block text-[10px] font-bold text-dark uppercase tracking-wider mb-1.5">
                      Nombre completo <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.nombre}
                      onChange={(e) => update("nombre", e.target.value)}
                      placeholder="Tu nombre"
                      className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-dark uppercase tracking-wider mb-1.5">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      value={form.telefono}
                      onChange={(e) => update("telefono", e.target.value)}
                      placeholder="+569 xxxx xxxx"
                      className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <label className="block text-[10px] font-bold text-dark uppercase tracking-wider mb-1.5">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder="correo@empresa.cl"
                    className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="mb-5">
                  <label className="block text-[10px] font-bold text-dark uppercase tracking-wider mb-1.5">
                    Asunto / Tipo de consulta
                  </label>
                  <select
                    value={form.asunto}
                    onChange={(e) => update("asunto", e.target.value)}
                    className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white text-dark"
                  >
                    <option value="">Selecciona una opción</option>
                    <option value="Cotización de productos">Cotización de productos</option>
                    <option value="Consulta de stock">Consulta de stock</option>
                    <option value="Información de despacho">Información de despacho</option>
                    <option value="Cuenta corporativa / flota">Cuenta corporativa / flota</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>

                <div className="mb-6">
                  <label className="block text-[10px] font-bold text-dark uppercase tracking-wider mb-1.5">
                    Mensaje <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={form.mensaje}
                    onChange={(e) => update("mensaje", e.target.value)}
                    rows={5}
                    placeholder="Describe tu consulta, los productos que necesitas o cualquier detalle relevante..."
                    className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                  />
                </div>

                <a
                  href={buildWhatsAppURL()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full bg-[#25D366] hover:bg-[#20b858] text-white font-bold py-4 text-sm uppercase tracking-wider transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Enviar por WhatsApp
                </a>

                <div className="flex items-center gap-3 mt-4">
                  <div className="h-px flex-1 bg-gray-200" />
                  <span className="text-xs text-gray-400">o</span>
                  <div className="h-px flex-1 bg-gray-200" />
                </div>

                <a
                  href={`mailto:ventas@recambiospa.cl?subject=${encodeURIComponent(form.asunto || "Consulta desde el sitio web")}&body=${encodeURIComponent(
                    [form.nombre && `Nombre: ${form.nombre}`, form.telefono && `Teléfono: ${form.telefono}`, "", form.mensaje].filter(Boolean).join("\n")
                  )}`}
                  className="flex items-center justify-center gap-2 w-full border border-gray-300 hover:border-primary text-dark hover:text-primary font-bold py-3.5 text-sm uppercase tracking-wider transition-colors mt-4"
                >
                  <Mail size={16} />
                  Enviar por correo electrónico
                </a>
              </div>
            </div>

            {/* SIDE INFO — 2 columns */}
            <div className="lg:col-span-2">
              {/* Horario destacado */}
              <div className="bg-primary-dark text-white p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Clock size={16} className="text-primary" />
                  <p className="text-xs font-bold uppercase tracking-wider text-white/60">Horario de atención</p>
                </div>
                <div className="space-y-2">
                  {[
                    { day: "Lunes – Viernes", hours: "9:00 – 18:00" },
                    { day: "Sábado", hours: "Cerrado" },
                    { day: "Domingo", hours: "Cerrado" },
                  ].map(({ day, hours }) => (
                    <div key={day} className="flex justify-between text-sm">
                      <span className="text-white/60">{day}</span>
                      <span className={`font-bold ${hours === "Cerrado" ? "text-white/30" : "text-white"}`}>{hours}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-[10px] text-white/40">
                    Consultas fuera de horario pueden dejarse por WhatsApp y serán respondidas el próximo día hábil.
                  </p>
                </div>
              </div>

              {/* Canales de contacto */}
              <div className="bg-white border border-gray-200 p-6 mb-6">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-4">Contáctanos directamente</p>
                <div className="space-y-3">
                  <a
                    href={`https://wa.me/${WA_NUMBER}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 group"
                  >
                    <div className="w-9 h-9 bg-[#25D366]/10 flex items-center justify-center flex-shrink-0">
                      <MessageCircle size={16} className="text-[#25D366]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-dark group-hover:text-primary transition-colors">+569 xxxx xxxx</p>
                      <p className="text-[10px] text-gray-400">WhatsApp</p>
                    </div>
                  </a>
                  <a
                    href="mailto:ventas@recambiospa.cl"
                    className="flex items-center gap-3 group"
                  >
                    <div className="w-9 h-9 bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Mail size={16} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-dark group-hover:text-primary transition-colors">ventas@recambiospa.cl</p>
                      <p className="text-[10px] text-gray-400">Correo electrónico</p>
                    </div>
                  </a>
                </div>
              </div>

              {/* CTA catálogo */}
              <div className="bg-primary p-6 text-white">
                <Send size={20} className="mb-3 text-white/60" />
                <h3 className="font-bold text-sm uppercase tracking-wide mb-2">¿Ya sabes qué necesitas?</h3>
                <p className="text-white/60 text-xs mb-4">
                  Revisa el catálogo completo y agrega al carrito. Te enviamos la cotización por WhatsApp.
                </p>
                <Link
                  href="/collections"
                  className="inline-flex items-center gap-2 bg-white text-primary font-bold px-5 py-2.5 text-xs uppercase tracking-wider hover:bg-light transition-colors"
                >
                  Ver catálogo <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── FAQ ─────────────────────────────────────────── */}
      <section className="bg-white py-20 border-t border-gray-200">
        <Container className="max-w-3xl">
          <div className="text-center mb-12">
            <p className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-3">
              Preguntas frecuentes
            </p>
            <h2 className="text-2xl font-black text-dark uppercase tracking-tight">
              Resolvemos tus dudas
            </h2>
          </div>

          <div className="divide-y divide-gray-200 border border-gray-200">
            {faqs.map(({ q, a }, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-light transition-colors gap-4"
                >
                  <span className="font-bold text-sm text-dark">{q}</span>
                  <ChevronDown
                    size={18}
                    className={`text-gray-400 flex-shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-180 text-primary" : ""}`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4 bg-light">
                    {a}
                  </div>
                )}
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-gray-400 mt-8">
            ¿No encontraste tu respuesta?{" "}
            <a href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noopener noreferrer" className="text-primary font-bold hover:underline">
              Pregúntanos por WhatsApp
            </a>
          </p>
        </Container>
      </section>
    </div>
  );
}
