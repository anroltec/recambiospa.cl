import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, MessageCircle, PhoneCall } from "lucide-react";
import Container from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Servicio t\u00e9cnico | Recambio SpA",
  description:
    "Servicio t\u00e9cnico y soporte postventa de Recambio SpA para talleres, flotas y clientes particulares en Chile.",
  alternates: { canonical: "/servicio-tecnico" },
};

const preventiveItems = [
  "Revisi\u00f3n de referencias, aplicaci\u00f3n y compatibilidad.",
  "Evaluaci\u00f3n de desgaste y continuidad de l\u00ednea.",
  "Recomendaci\u00f3n de reposici\u00f3n para evitar detenciones.",
  "Orientaci\u00f3n sobre productos y marcas distribuidas.",
];

const correctiveItems = [
  "Levantamiento del requerimiento t\u00e9cnico y comercial.",
  "Revisi\u00f3n de alternativas seg\u00fan disponibilidad y urgencia.",
  "Coordinaci\u00f3n de cotizaci\u00f3n y reposici\u00f3n de piezas.",
  "Seguimiento posterior a la entrega o implementaci\u00f3n.",
];

const laboratorySteps = [
  "Ingreso: recibimos el c\u00f3digo, fotograf\u00eda o contexto de uso del producto.",
  "Revisi\u00f3n: validamos aplicaci\u00f3n, compatibilidad y criticidad operativa.",
  "Propuesta: recomendamos la referencia correcta o una alternativa viable.",
  "Cotizaci\u00f3n: coordinamos disponibilidad, tiempos y respaldo comercial.",
  "Seguimiento: acompa\u00f1amos dudas posteriores y continuidad de compra.",
];

const addedValueItems = [
  "Equipo comercial y t\u00e9cnico con experiencia en transporte.",
  "Respuesta orientada a talleres, flotas y mantenimiento.",
  "Respaldo sobre l\u00edneas y marcas que distribuimos.",
  "Continuidad operacional con foco en reposiciones correctas.",
  "Atenci\u00f3n cercana para compras puntuales o recurrentes.",
];

const teamAreas = [
  "Iluminaci\u00f3n y se\u00f1alizaci\u00f3n LED.",
  "Bater\u00edas y componentes el\u00e9ctricos.",
  "Adhesivos, selladores y qu\u00edmicos t\u00e9cnicos.",
  "Herramientas, seguridad y accesorios de apoyo.",
];

const audienceItems = [
  "Talleres: apoyo para identificar referencias y acelerar reposiciones.",
  "Flotas: continuidad de suministro para operaciones recurrentes.",
  "Clientes particulares: orientaci\u00f3n para comprar con m\u00e1s seguridad.",
];

const faqs = [
  {
    question: "\u00bfD\u00f3nde estamos?",
    answer:
      "Atendemos desde Santiago y coordinamos despachos a todo Chile. Si tu caso requiere validaci\u00f3n previa, podemos revisarlo antes de cotizar.",
  },
  {
    question: "\u00bfC\u00f3mo contactarnos?",
    answer:
      "Puedes escribirnos por el formulario de contacto, correo comercial o WhatsApp para derivar el requerimiento y recibir orientaci\u00f3n t\u00e9cnica.",
  },
  {
    question: "\u00bfCu\u00e1nto demora una respuesta t\u00e9cnica?",
    answer:
      "Depende del tipo de producto y de la informaci\u00f3n disponible, pero priorizamos responder con rapidez para no frenar la operaci\u00f3n.",
  },
  {
    question: "\u00bfAtienden solo productos comprados con ustedes?",
    answer:
      "Damos mejor respaldo cuando se trata de marcas y l\u00edneas que distribuimos, porque ah\u00ed podemos orientar con mayor precisi\u00f3n y continuidad.",
  },
  {
    question: "\u00bfPueden apoyar compras recurrentes o de flota?",
    answer:
      "S\u00ed. Podemos ordenar referencias frecuentes y acompa\u00f1ar procesos de reposici\u00f3n para talleres, empresas y flotas.",
  },
  {
    question: "\u00bfEntregan orientaci\u00f3n antes de cotizar?",
    answer:
      "S\u00ed. Si compartes c\u00f3digo, fotograf\u00eda, marca, modelo o aplicaci\u00f3n, podemos encaminar la b\u00fasqueda antes de emitir la propuesta comercial.",
  },
];

function SectionHeading({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-[30px] font-black uppercase tracking-tight text-primary-dark sm:text-[34px]">
        {title}
      </h2>
      <div className="mt-5 space-y-4 text-[15px] leading-8 text-dark/72">{children}</div>
    </div>
  );
}

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
    <div className={`relative min-h-[280px] overflow-hidden bg-[#ebe7e0] sm:min-h-[360px] ${className}`.trim()}>
      <Image src={src} alt={alt} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 48vw" />
    </div>
  );
}

export default function ServicioTecnicoPage() {
  return (
    <div className="bg-white">
      <section className="relative border-t-[10px] border-primary">
        <div className="relative min-h-[340px] sm:min-h-[460px] lg:min-h-[560px]">
          <Image
            src="/banners/banner1.jpg"
            alt="Servicio t&eacute;cnico Recambio SpA"
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-black/38" />
          <div className="absolute inset-0 flex items-center justify-center px-4 text-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.45em] text-white/78">
                Recambio SpA
              </p>
              <h1 className="mt-4 text-4xl font-black uppercase leading-none tracking-tight text-white sm:text-5xl">
                Servicio
                <br />
                t&eacute;cnico
              </h1>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:items-center">
            <ImagePanel
              src="/banners/banner2.jpg"
              alt="Asesor&iacute;a t&eacute;cnica preventiva Recambio SpA"
            />
            <div className="max-w-xl">
              <SectionHeading title="Mantenci&oacute;n preventiva">
                <p>
                  Nuestro soporte preventivo busca ayudarte a mantener continuidad operacional,
                  anticipando reemplazos y validando la referencia correcta antes de que una
                  falla detenga el trabajo.
                </p>
                <p>
                  Este acompa&ntilde;amiento es especialmente &uacute;til cuando necesitas ordenar
                  compras recurrentes, resolver equivalencias o respaldar decisiones de
                  reposici&oacute;n con criterio t&eacute;cnico.
                </p>
              </SectionHeading>
              <p className="mt-6 text-sm font-bold uppercase tracking-[0.18em] text-primary-dark/72">
                Este servicio incluye:
              </p>
              <BulletList items={preventiveItems} />
            </div>
          </div>

          <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)] lg:items-center">
            <div className="order-2 max-w-xl lg:order-1">
              <SectionHeading title="Mantenci&oacute;n correctiva">
                <p>
                  Cuando un producto presenta desgaste, incompatibilidad o dudas de reemplazo,
                  intervenimos para orientar una soluci&oacute;n clara y reducir el riesgo de una
                  compra incorrecta.
                </p>
                <p>
                  El foco est&aacute; puesto en resolver con rapidez, coordinando referencia,
                  disponibilidad y contexto de uso para que la operaci&oacute;n vuelva a moverse lo
                  antes posible.
                </p>
              </SectionHeading>
              <p className="mt-6 text-sm font-bold uppercase tracking-[0.18em] text-primary-dark/72">
                Este servicio incluye:
              </p>
              <BulletList items={correctiveItems} />
            </div>
            <ImagePanel
              src="/banners/banner5.jpg"
              alt="Soporte correctivo y postventa Recambio SpA"
              className="order-1 lg:order-2"
            />
          </div>

          <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:items-start">
            <ImagePanel
              src="/banners/banner6.jpg"
              alt="Proceso de evaluaci&oacute;n y soporte t&eacute;cnico Recambio SpA"
            />
            <div className="max-w-xl">
              <SectionHeading title="Evaluaci&oacute;n t&eacute;cnica y seguimiento">
                <p>
                  Trabajamos con un proceso ordenado para revisar cada caso, desde la primera
                  consulta hasta la recomendaci&oacute;n final, manteniendo trazabilidad comercial y
                  t&eacute;cnica en todo momento.
                </p>
                <p>
                  Esta metodolog&iacute;a nos permite apoyar decisiones con mejor respaldo y una
                  comunicaci&oacute;n m&aacute;s clara para talleres, flotas y clientes particulares.
                </p>
              </SectionHeading>
              <p className="mt-6 text-sm font-bold uppercase tracking-[0.18em] text-primary-dark/72">
                Paso a paso
              </p>
              <ol className="mt-5 space-y-3 text-[15px] leading-8 text-dark/72">
                {laboratorySteps.map((step, index) => (
                  <li key={step} className="flex gap-3">
                    <span className="font-black text-primary-dark">{index + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-6 text-[15px] leading-8 text-dark/72">
                <strong className="text-primary-dark">Importante:</strong> mientras mejor sea la
                informaci&oacute;n inicial del caso, m&aacute;s precisa y r&aacute;pida ser&aacute; la orientaci&oacute;n.
              </p>
            </div>
          </div>

          <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:items-start">
            <div className="max-w-xl">
              <SectionHeading title="Valor agregado">
                <p>
                  Nuestro diferencial est&aacute; en conectar el soporte t&eacute;cnico con la realidad
                  comercial del cliente: disponibilidad, continuidad de compra y claridad sobre
                  qu&eacute; referencia conviene usar.
                </p>
              </SectionHeading>
              <BulletList items={addedValueItems} />
            </div>

            <div className="space-y-6">
              <ImagePanel
                src="/banners/banner3.jpg"
                alt="Equipo de apoyo Recambio SpA"
                className="min-h-[320px]"
              />
              <div className="max-w-xl">
                <h2 className="text-[30px] font-black uppercase tracking-tight text-primary-dark sm:text-[34px]">
                  Equipo t&eacute;cnico
                </h2>
                <p className="mt-5 text-[15px] leading-8 text-dark/72">
                  Nuestro equipo acompa&ntilde;a requerimientos relacionados con distintas l&iacute;neas
                  del cat&aacute;logo, priorizando recomendaciones claras, respaldo de marcas y
                  continuidad operacional.
                </p>
                <BulletList items={teamAreas} />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-[#f3f1ec] py-14">
        <Container>
          <div className="grid gap-5 lg:grid-cols-2">
            <article className="bg-white p-8 shadow-[0_14px_40px_rgba(18,18,18,0.05)]">
              <h2 className="text-2xl font-black uppercase tracking-tight text-primary-dark">
                Diferencial
              </h2>
              <div className="mt-5 space-y-4 text-[15px] leading-8 text-dark/72">
                <p>
                  Nuestro equipo est&aacute; comprometido con una atenci&oacute;n de excelencia,
                  entregando apoyo y soluciones en cada etapa del proceso.
                </p>
                <p>
                  Respondemos con rapidez, informaci&oacute;n clara y una orientaci&oacute;n pensada para
                  que el cliente compre con m&aacute;s seguridad y mantenga continuidad en su operaci&oacute;n.
                </p>
                <p>
                  Combinamos respaldo comercial, conocimiento de producto y seguimiento posterior
                  para sostener relaciones de largo plazo con talleres, flotas y empresas.
                </p>
              </div>
            </article>

            <article className="bg-white p-8 shadow-[0_14px_40px_rgba(18,18,18,0.05)]">
              <h2 className="text-2xl font-black uppercase tracking-tight text-primary-dark">
                P&uacute;blico
              </h2>
              <div className="mt-5">
                <p className="text-[15px] leading-8 text-dark/72">
                  Nuestro servicio t&eacute;cnico y de soporte est&aacute; disponible para:
                </p>
                <BulletList items={audienceItems} />
              </div>
            </article>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container className="max-w-5xl">
          <div className="text-center">
            <h2 className="text-3xl font-black tracking-tight text-primary sm:text-4xl">
              Preguntas Frecuentes
            </h2>
          </div>

          <div className="mt-10 border-t border-gray-200">
            {faqs.map((faq) => (
              <details key={faq.question} className="group border-b border-gray-200">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left text-[15px] font-semibold text-primary-dark">
                  <span>{faq.question}</span>
                  <ChevronDown size={18} className="flex-shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <div className="pb-5 pr-8 text-[15px] leading-8 text-dark/70">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>

          <div className="mt-12 flex flex-col gap-4 border border-primary-dark/12 bg-primary-dark px-6 py-7 text-white sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                Contacto directo
              </p>
              <p className="mt-3 max-w-2xl text-[15px] leading-7 text-white/76">
                Si ya tienes una referencia, una fotograf&iacute;a o un requerimiento definido,
                podemos ayudarte a encaminar la soluci&oacute;n.
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
