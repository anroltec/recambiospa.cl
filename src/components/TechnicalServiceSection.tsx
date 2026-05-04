import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Play } from "lucide-react";

const servicePoints = [
  "Asesor\u00eda en selecci\u00f3n de productos seg\u00fan aplicaci\u00f3n y necesidad.",
  "Respaldo t\u00e9cnico y comercial para talleres, flotas y clientes particulares.",
  "Soporte postventa sobre nuestras l\u00edneas y marcas distribuidas.",
];

export default function TechnicalServiceSection() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-10 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.85fr)] xl:items-center">
          <div className="relative min-h-[360px] overflow-hidden bg-primary-dark sm:min-h-[460px] lg:min-h-[560px]">
            <Image
              src="/banners/banner1.jpg"
              alt="Servicio t&eacute;cnico Recambio SpA"
              fill
              className="object-cover object-[68%_center]"
              sizes="(max-width: 1279px) 100vw, 62vw"
            />
            <div className="absolute inset-0 bg-black/35" />

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/30 bg-black/20 text-white backdrop-blur-[2px]">
                <Play size={30} className="ml-1" fill="currentColor" />
              </div>
            </div>
          </div>

          <div className="max-w-xl">
            <div>
              <h2 className="text-2xl font-bold uppercase tracking-wide text-primary-dark">
                Respaldo y soporte para cada l&iacute;nea de producto
              </h2>
            </div>

            <div className="mt-6 space-y-5 text-base leading-8 text-dark/72">
              <p>
                En <strong>Recambio SpA</strong> brindamos respaldo y soporte de excelencia para
                que nuestros clientes trabajen de forma eficiente y con mayor seguridad en cada
                operaci&oacute;n.
              </p>
              <p>
                Nuestro equipo est&aacute; calificado y en constante capacitaci&oacute;n para entregar
                asesor&iacute;a, selecci&oacute;n de productos y soporte postventa con criterio t&eacute;cnico y
                atenci&oacute;n cercana.
              </p>
            </div>

            <div className="mt-7 space-y-3">
              {servicePoints.map((point) => (
                <div key={point} className="flex items-start gap-3">
                  <CheckCircle2
                    size={18}
                    strokeWidth={1.9}
                    className="mt-1 flex-shrink-0 text-primary"
                  />
                  <p className="text-sm leading-7 text-dark/68">{point}</p>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Link
                href="/servicio-tecnico"
                className="inline-flex items-center gap-2 border-2 border-primary-dark px-7 py-3 text-sm font-bold uppercase tracking-[0.16em] text-primary-dark transition-colors hover:bg-primary-dark hover:text-white"
              >
                Saber m&aacute;s
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
