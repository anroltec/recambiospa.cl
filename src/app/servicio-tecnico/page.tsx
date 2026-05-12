import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, MessageCircle, PhoneCall } from "lucide-react";
import Container from "@/components/ui/Container";
import {
  technicalServiceHighlights,
  technicalServiceIntro,
  technicalServices,
} from "@/data/technical-services";

export const metadata: Metadata = {
  title: "Servicio t\u00e9cnico | Recambio SpA",
  description:
    "Diagn\u00f3stico, reparaci\u00f3n y programaci\u00f3n de m\u00f3dulos electr\u00f3nicos, tableros INS e itinerarios para veh\u00edculos pesados.",
  alternates: { canonical: "/servicio-tecnico" },
};

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-6 list-disc space-y-2.5 pl-6 text-[15px] leading-8 text-dark/72 marker:text-primary">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function ImagePanel({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div
      className={`relative min-h-[280px] overflow-hidden bg-[#ebe7e0] sm:min-h-[360px] ${className}`.trim()}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 1024px) 100vw, 48vw"
      />
    </div>
  );
}

function ServiceArticle({
  title,
  description,
  image,
  systems,
  index,
}: {
  title: string;
  description: string;
  image: string;
  systems?: string[];
  index: number;
}) {
  const imageOrderClass = index % 2 === 0 ? "" : "lg:order-2";
  const contentOrderClass = index % 2 === 0 ? "" : "lg:order-1";

  return (
    <article className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:items-center">
      <ImagePanel
        src={image}
        alt={title}
        className={`min-h-[320px] sm:min-h-[380px] ${imageOrderClass}`.trim()}
      />
      <div className={`max-w-xl ${contentOrderClass}`.trim()}>
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">
          Servicio {index + 1}
        </p>
        <h2 className="mt-4 text-[30px] font-black uppercase tracking-tight text-primary-dark sm:text-[34px]">
          {title}
        </h2>
        <p className="mt-5 text-[15px] leading-8 text-dark/72">{description}</p>
        {systems?.length ? (
          <>
            <p className="mt-6 text-sm font-bold uppercase tracking-[0.18em] text-primary-dark/72">
              Sistemas atendidos
            </p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {systems.map((system) => (
                <span
                  key={system}
                  className="border border-primary-dark/12 bg-primary-dark/4 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-primary-dark"
                >
                  {system}
                </span>
              ))}
            </div>
          </>
        ) : null}
      </div>
    </article>
  );
}

export default function ServicioTecnicoPage() {
  return (
    <div className="bg-white">
      <section className="relative border-t-[10px] border-primary">
        <div className="relative min-h-[340px] sm:min-h-[460px] lg:min-h-[560px]">
          <Image
            src="/banners/service-technical-hero.jpeg"
            alt="Banner de servicio t&eacute;cnico Recambio SpA"
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-black/38" />
          <div className="absolute inset-0 flex items-center justify-center px-4 text-center">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.45em] text-white/78">
                Recambio SpA
              </p>
              <h1 className="mt-4 text-4xl font-black uppercase leading-none tracking-tight text-white sm:text-5xl">
                Servicio t&eacute;cnico
                <br />
                electr&oacute;nico
              </h1>
              <p className="mt-6 text-sm leading-7 text-white/78 sm:text-base">
                Diagn&oacute;stico, reparaci&oacute;n y programaci&oacute;n especializada para
                sistemas cr&iacute;ticos de veh&iacute;culos pesados.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f3f1ec] py-14">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] lg:items-start">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">
                {technicalServiceIntro.eyebrow}
              </p>
              <h2 className="mt-4 text-[32px] font-black uppercase tracking-tight text-primary-dark sm:text-[38px]">
                {technicalServiceIntro.title}
              </h2>
              <div className="mt-6 space-y-5 text-[15px] leading-8 text-dark/72">
                <p>{technicalServiceIntro.description}</p>
                <p>
                  Trabajamos sobre sistemas de gesti&oacute;n de motor, cabina, visualizaci&oacute;n
                  e informaci&oacute;n al pasajero, integrando diagn&oacute;stico avanzado,
                  reparaci&oacute;n y optimizaci&oacute;n seg&uacute;n el contexto operativo de cada
                  unidad.
                </p>
              </div>
            </div>

            <div className="bg-white p-8 shadow-[0_14px_40px_rgba(18,18,18,0.05)]">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">
                Cobertura t&eacute;cnica
              </p>
              <div className="mt-6 space-y-4">
                {technicalServiceHighlights.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2
                      size={18}
                      strokeWidth={1.9}
                      className="mt-1 flex-shrink-0 text-primary"
                    />
                    <p className="text-[15px] leading-7 text-dark/72">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="space-y-16">
            {technicalServices.map((service, index) => (
              <ServiceArticle
                key={service.title}
                title={service.title}
                description={service.description}
                image={service.image}
                systems={service.systems}
                index={index}
              />
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-white py-4">
        <Container>
          <div className="grid gap-6 lg:grid-cols-2">
            <article className="border border-primary-dark/10 bg-[#f3f1ec] p-8">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
                Diferencial
              </p>
              <h2 className="mt-4 text-2xl font-black uppercase tracking-tight text-primary-dark">
                Soporte orientado a continuidad operativa
              </h2>
              <div className="mt-5 space-y-4 text-[15px] leading-8 text-dark/72">
                <p>
                  Cada intervenci&oacute;n est&aacute; pensada para recuperar estabilidad
                  electr&oacute;nica, reducir tiempos de detenci&oacute;n y devolver confiabilidad a la
                  unidad.
                </p>
                <p>
                  Combinamos diagn&oacute;stico avanzado, reparaci&oacute;n especializada y
                  configuraci&oacute;n precisa para responder a contextos reales de carretera,
                  faena y operaci&oacute;n de flota.
                </p>
              </div>
            </article>

            <article className="border border-primary-dark/10 bg-[#f3f1ec] p-8">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
                Alcance
              </p>
              <h2 className="mt-4 text-2xl font-black uppercase tracking-tight text-primary-dark">
                Cobertura t&eacute;cnica especializada
              </h2>
              <BulletList
                items={[
                  "M\u00f3dulos de motor y cabina para plataformas pesadas.",
                  "Tableros INS con recuperaci\u00f3n de visualizaci\u00f3n, alertas y monitoreo.",
                  "Itinerarios y letreros electr\u00f3nicos para transporte de pasajeros.",
                  "Integraci\u00f3n y optimizaci\u00f3n de sistemas electr\u00f3nicos de flota.",
                ]}
              />
            </article>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container className="max-w-5xl">
          <div className="flex flex-col gap-4 border border-primary-dark/12 bg-primary-dark px-6 py-7 text-white sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                Contacto directo
              </p>
              <p className="mt-3 max-w-2xl text-[15px] leading-7 text-white/76">
                Si ya tienes un m&oacute;dulo, tablero o sistema identificado, podemos revisar el
                caso y ayudarte a encaminar una soluci&oacute;n t&eacute;cnica confiable.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/contacto"
                className="inline-flex items-center gap-2 bg-primary px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-primary-light"
              >
                <MessageCircle size={16} />
                Contacto
              </Link>
              <a
                href="https://wa.me/"
                className="inline-flex items-center gap-2 border border-white/20 px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-white/10"
              >
                <PhoneCall size={16} />
                WhatsApp
              </a>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
