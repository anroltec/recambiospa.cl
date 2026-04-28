import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Phone, Mail, MapPin, Clock } from "lucide-react";
import Container from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Contacto | Recambio SPA",
  description: "Contáctanos para cotizaciones, consultas y envíos a todo Chile.",
};

const info = [
  { icon: Phone, label: "Teléfono / WhatsApp", value: "+569 xxxx xxxx", href: "https://wa.me/569xxxxxxxx" },
  { icon: Mail, label: "Correo electrónico", value: "ventas@recambiospa.cl", href: "mailto:ventas@recambiospa.cl" },
  { icon: MapPin, label: "Región", value: "Chile — despachos a todo el país", href: null },
  { icon: Clock, label: "Horario", value: "Lunes a Viernes, 9:00 – 18:00", href: null },
];

export default function ContactoPage() {
  return (
    <div className="bg-light min-h-screen">
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

      {/* Hero */}
      <div className="bg-primary-dark text-white py-14">
        <Container>
          <h1 className="text-3xl font-bold uppercase tracking-wide mb-3">Contacto</h1>
          <p className="text-white/70 text-sm">
            Escríbenos o llámanos. Te respondemos a la brevedad.
          </p>
        </Container>
      </div>

      <Container className="py-14">
        <div className="lg:grid lg:grid-cols-2 gap-8">
          {/* Info de contacto */}
          <div className="mb-8 lg:mb-0">
            <h2 className="text-lg font-bold text-dark uppercase tracking-wide mb-6">
              Información de contacto
            </h2>
            <div className="space-y-4">
              {info.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-4 bg-white border border-gray-200 p-5">
                  <div className="w-9 h-9 bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-0.5">{label}</p>
                    {href ? (
                      <a href={href} className="text-sm font-medium text-dark hover:text-primary transition-colors">
                        {value}
                      </a>
                    ) : (
                      <p className="text-sm font-medium text-dark">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <a
              href="https://wa.me/569xxxxxxxx"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20b858] text-white font-bold px-6 py-4 transition-colors text-sm uppercase tracking-wider"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Chatear por WhatsApp
            </a>
          </div>

          {/* Formulario */}
          <div>
            <h2 className="text-lg font-bold text-dark uppercase tracking-wide mb-6">
              Envíanos un mensaje
            </h2>
            <form
              action={`https://wa.me/569xxxxxxxx`}
              className="bg-white border border-gray-200 p-6 space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-dark uppercase tracking-wide mb-1.5">
                  Nombre
                </label>
                <input
                  type="text"
                  name="nombre"
                  required
                  placeholder="Tu nombre"
                  className="w-full border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-dark uppercase tracking-wide mb-1.5">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="correo@ejemplo.cl"
                  className="w-full border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-dark uppercase tracking-wide mb-1.5">
                  Asunto
                </label>
                <input
                  type="text"
                  name="asunto"
                  placeholder="¿En qué te podemos ayudar?"
                  className="w-full border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-dark uppercase tracking-wide mb-1.5">
                  Mensaje
                </label>
                <textarea
                  name="mensaje"
                  required
                  rows={4}
                  placeholder="Escribe tu consulta o solicitud de cotización..."
                  className="w-full border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                />
              </div>
              <a
                href="https://wa.me/569xxxxxxxx"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 text-center text-sm uppercase tracking-wider transition-colors"
              >
                Enviar por WhatsApp
              </a>
              <p className="text-[10px] text-gray-400 text-center">
                El formulario de email estará disponible próximamente.
              </p>
            </form>
          </div>
        </div>
      </Container>
    </div>
  );
}
