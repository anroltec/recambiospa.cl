import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { technicalServiceIntro, technicalServices } from "@/data/technical-services";

const serviceTitles = technicalServices.map((service) => service.title);

export default function TechnicalServiceSection() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-10 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.85fr)] xl:items-center">
          <div className="relative min-h-[400px] overflow-hidden bg-primary-dark sm:min-h-[500px] lg:min-h-[600px]">
            <Image
              src="/banners/technical-services-home.png"
              alt="Servicios t&eacute;cnicos especializados de Recambio SpA"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1279px) 100vw, 62vw"
            />
          </div>

          <div className="max-w-xl">
            <h2 className="text-2xl font-bold uppercase tracking-wide text-primary-dark">
              Soluciones electr&oacute;nicas para veh&iacute;culos pesados
            </h2>

            <div className="mt-6 space-y-5 text-base leading-8 text-dark/72">
              <p>
                En <strong>Recambio SpA</strong> entregamos soporte especializado para
                electr&oacute;nica aplicada al transporte pesado, abordando diagn&oacute;stico,
                reparaci&oacute;n y programaci&oacute;n de sistemas cr&iacute;ticos.
              </p>
              <p>{technicalServiceIntro.description}</p>
            </div>

            <div className="mt-7 space-y-3">
              {serviceTitles.map((title) => (
                <div key={title} className="flex items-start gap-3">
                  <CheckCircle2
                    size={18}
                    strokeWidth={1.9}
                    className="mt-1 flex-shrink-0 text-primary"
                  />
                  <p className="text-sm leading-7 text-dark/68">{title}</p>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Link
                href="/servicio-tecnico"
                className="inline-flex items-center gap-2 border-2 border-primary-dark px-7 py-3 text-sm font-bold uppercase tracking-[0.16em] text-primary-dark transition-colors hover:bg-primary-dark hover:text-white"
              >
                Ver servicios t&eacute;cnicos
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
