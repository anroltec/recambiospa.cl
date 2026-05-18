import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  CheckCircle2,
  Gauge,
  MessageCircle,
  PhoneCall,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import Container from "@/components/ui/Container";
import { WHATSAPP_URL } from "@/lib/contact";
import {
  technicalServiceCommitments,
  technicalServiceCoverage,
  technicalServiceHighlights,
  technicalServiceIntro,
  technicalServiceStats,
  technicalServices,
} from "@/data/technical-services";

export const metadata: Metadata = {
  title: "Servicio t\u00e9cnico | Recambio SpA",
  description:
    "Diagn\u00f3stico, reparaci\u00f3n y programaci\u00f3n de m\u00f3dulos electr\u00f3nicos, tableros INS e itinerarios para veh\u00edculos pesados.",
  alternates: { canonical: "/servicio-tecnico" },
};

const commitmentIcons = [Gauge, ShieldCheck, Workflow] as const;

function BulletList({ items }: { items: string[] }) {
  return (
    <div className="mt-8 space-y-4">
      {items.map((item) => (
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
      className={`relative min-h-[300px] overflow-hidden bg-[#d9d4cb] sm:min-h-[360px] ${className}`.trim()}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 1024px) 100vw, 42vw"
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-primary-dark/55 via-primary-dark/18 to-transparent" />
      <div className="absolute left-6 top-6 h-10 w-10 border-l-2 border-t-2 border-white/55" />
      <div className="absolute bottom-6 right-6 h-10 w-10 border-b-2 border-r-2 border-primary/70" />
    </div>
  );
}

function ServiceArticle({
  title,
  focus,
  description,
  image,
  systems,
  index,
}: {
  title: string;
  focus: string;
  description: string;
  image: string;
  systems?: string[];
  index: number;
}) {
  const imageOrderClass = index % 2 === 0 ? "lg:order-2" : "lg:order-3";
  const contentOrderClass = index % 2 === 0 ? "lg:order-3" : "lg:order-2";

  return (
    <article
      className={`grid gap-8 py-12 lg:grid-cols-[88px_minmax(0,0.92fr)_minmax(0,1fr)] lg:items-center ${
        index === 0 ? "" : "border-t border-primary-dark/10"
      }`.trim()}
    >
      <div className="flex items-center gap-4 lg:flex-col lg:items-start">
        <span className="text-[11px] font-bold uppercase tracking-[0.32em] text-primary">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="h-px flex-1 bg-primary/18 lg:h-20 lg:w-px lg:flex-none" />
      </div>

      <ImagePanel
        src={image}
        alt={title}
        className={`min-h-[320px] sm:min-h-[380px] ${imageOrderClass}`.trim()}
      />

      <div className={contentOrderClass}>
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">
          {focus}
        </p>
        <h2 className="mt-4 text-[30px] font-black uppercase tracking-tight text-primary-dark sm:text-[36px]">
          {title}
        </h2>
        <p className="mt-5 text-[15px] leading-8 text-dark/72">{description}</p>
        {systems?.length ? (
          <>
            <p className="mt-6 text-sm font-bold uppercase tracking-[0.18em] text-primary-dark/68">
              Sistemas atendidos
            </p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {systems.map((system) => (
                <span
                  key={system}
                  className="bg-primary-dark px-3 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white"
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
      <section className="relative overflow-hidden border-t-[10px] border-primary bg-primary-dark text-white">
        <div className="absolute inset-0">
          <Image
            src="/banners/service-technical-hero.png"
            alt="Servicio t&eacute;cnico electr&oacute;nico para veh&iacute;culos pesados"
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.84)_0%,rgba(0,0,0,0.66)_38%,rgba(28,42,58,0.28)_72%,rgba(28,42,58,0.14)_100%)]" />
          <div className="absolute inset-0 bg-primary-dark/18" />
        </div>

        <Container className="relative py-12 sm:py-14 lg:py-16">
          <div className="max-w-3xl">
            <div className="flex items-center gap-4">
              <span className="h-px w-14 bg-primary" />
              <p className="text-xs font-bold uppercase tracking-[0.34em] text-white/78">
                Laboratorio profesional
              </p>
            </div>

            <p className="mt-6 text-xs font-bold uppercase tracking-[0.34em] text-primary">
              Recambio SpA
            </p>
            <h1 className="mt-4 text-4xl font-black uppercase leading-none tracking-tight text-white sm:text-5xl lg:text-[64px]">
              Servicio t&eacute;cnico
              <br />
              electr&oacute;nico
            </h1>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-white/78 sm:text-base">
              Diagn&oacute;stico, reparaci&oacute;n y programaci&oacute;n especializada para
              sistemas cr&iacute;ticos de veh&iacute;culos pesados, con foco en continuidad
              operativa, lectura precisa de falla y respuesta t&eacute;cnica confiable.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/contacto"
                className="inline-flex items-center gap-2 bg-primary px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-primary-light"
              >
                <MessageCircle size={16} />
                Solicitar evaluaci&oacute;n
              </Link>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-white/20 px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-white/10"
              >
                <PhoneCall size={16} />
                Hablar por WhatsApp
              </a>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-[#f2efe8] py-16 sm:py-18">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">
                {technicalServiceIntro.eyebrow}
              </p>
              <h2 className="mt-4 text-[32px] font-black uppercase tracking-tight text-primary-dark sm:text-[42px]">
                {technicalServiceIntro.title}
              </h2>
              <div className="mt-6 space-y-5 text-[15px] leading-8 text-dark/72">
                <p>{technicalServiceIntro.description}</p>
                <p>{technicalServiceIntro.supportingText}</p>
              </div>

              <div className="mt-10 grid gap-px bg-primary-dark/10 sm:grid-cols-3">
                {technicalServiceStats.map((stat) => (
                  <div key={stat.label} className="bg-white/88 px-6 py-6">
                    <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-primary">
                      {stat.value}
                    </p>
                    <p className="mt-3 text-base font-black uppercase tracking-tight text-primary-dark">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-l-4 border-primary pl-6 lg:pl-8">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">
                Cobertura t&eacute;cnica
              </p>
              <p className="mt-4 max-w-xl text-[15px] leading-7 text-dark/70">
                La intervenci&oacute;n no se limita al componente: se analiza el rol del sistema
                dentro de la operaci&oacute;n completa de la unidad para orientar mejor cada
                reparaci&oacute;n o programaci&oacute;n.
              </p>
              <div className="mt-8 space-y-5">
                {technicalServiceHighlights.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 border-b border-primary-dark/8 pb-5 last:border-b-0 last:pb-0"
                  >
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

      <section className="py-16 sm:py-18">
        <Container>
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">
              Cobertura por sistema
            </p>
            <h2 className="mt-4 text-[32px] font-black uppercase tracking-tight text-primary-dark sm:text-[42px]">
              Servicios pensados para electr&oacute;nica de transporte pesado
            </h2>
            <p className="mt-5 text-[15px] leading-8 text-dark/72">
              La oferta se organiza seg&uacute;n la funci&oacute;n real del sistema dentro de la
              unidad, para que la lectura del servicio sea m&aacute;s clara y menos gen&eacute;rica.
            </p>
          </div>

          <div className="mt-10">
            {technicalServices.map((service, index) => (
              <ServiceArticle
                key={service.title}
                title={service.title}
                focus={service.focus}
                description={service.description}
                image={service.image}
                systems={service.systems}
                index={index}
              />
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-[#f7f4ee] py-16 sm:py-18">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:items-start">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">
                Alcance
              </p>
              <h2 className="mt-4 text-[30px] font-black uppercase tracking-tight text-primary-dark sm:text-[38px]">
                Soporte pensado para operaci&oacute;n real, talleres y flotas
              </h2>
              <p className="mt-5 text-[15px] leading-8 text-dark/72">
                Cubrimos sistemas y situaciones que impactan directamente la disponibilidad
                de la unidad, la lectura en cabina y la continuidad del servicio.
              </p>
              <BulletList items={technicalServiceCoverage} />
            </div>

            <div className="space-y-8">
              {technicalServiceCommitments.map((item, index) => {
                const Icon = commitmentIcons[index % commitmentIcons.length];

                return (
                  <article
                    key={item.title}
                    className="grid gap-4 border-b border-primary-dark/10 pb-8 last:border-b-0 last:pb-0 sm:grid-cols-[auto_1fr]"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon size={20} strokeWidth={1.8} />
                    </div>
                    <div>
                      <h3 className="text-lg font-black uppercase tracking-tight text-primary-dark">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-[15px] leading-7 text-dark/72">
                        {item.description}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container className="max-w-6xl">
          <div className="relative overflow-hidden bg-primary-dark px-6 py-8 text-white sm:px-10 sm:py-10 lg:px-12">
            <div className="absolute inset-y-0 left-0 w-1 bg-primary" />
            <div className="absolute right-0 top-0 h-full w-40 bg-gradient-to-l from-white/10 to-transparent" />

            <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
                  Contacto directo
                </p>
                <h2 className="mt-3 text-2xl font-black uppercase tracking-tight text-white sm:text-[30px]">
                  Revisemos tu caso y definamos la mejor ruta t&eacute;cnica
                </h2>
                <p className="mt-4 max-w-2xl text-[15px] leading-7 text-white/76">
                  Si ya tienes identificado el m&oacute;dulo, tablero o sistema comprometido,
                  podemos ayudarte a ordenar el caso y orientar una soluci&oacute;n confiable.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-white/18 px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-white/10"
                >
                  <PhoneCall size={16} />
                  WhatsApp
                </a>
                <Link
                  href="/contacto"
                  className="inline-flex items-center gap-2 border border-primary px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-primary transition-colors hover:bg-primary hover:text-white"
                >
                  <ArrowUpRight size={16} />
                  Contacto
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
