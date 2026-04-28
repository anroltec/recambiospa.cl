"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Zap } from "lucide-react";
import { products } from "@/data/products";

const slides = [
  {
    image: "/banners/banner1.jpg",
    href: "/collections/iluminacion",
    eyebrow: "Iluminación LED profesional",
    title: "Braslux",
    subtitle: "ILUMINACIÓN PARA FLOTAS",
    desc: "Focos LED, faros y lanternas de alta durabilidad para buses, camiones y vehículos de carga.",
    cta: "Ver colección",
    ctaHref: "/collections/iluminacion",
    accent: "#F5A623",
  },
  {
    image: "/banners/banner2.jpg",
    href: "/collections/loctite",
    eyebrow: "Adhesivos técnicos Henkel",
    title: "Loctite",
    subtitle: "ADHESIVOS & SELLADORES",
    desc: "Trabadores de rosca, selladores de juntas y adhesivos estructurales para taller y maestranza.",
    cta: "Ver productos",
    ctaHref: "/collections/loctite",
    accent: "#334FB4",
  },
  {
    image: "/banners/banner3.jpg",
    href: "/collections/baterias",
    eyebrow: "Alto rendimiento · Moura",
    title: "Baterías",
    subtitle: "LIVIANOS Y PESADOS",
    desc: "Baterías de alto rendimiento para vehículos particulares, flotas de transporte y maquinaria.",
    cta: "Ver baterías",
    ctaHref: "/collections/baterias",
    accent: "#7ED321",
  },
  {
    image: "/banners/banner4.jpg",
    href: "/collections/extintores",
    eyebrow: "Seguridad certificada",
    title: "Extintores",
    subtitle: "CUMPLIMIENTO NORMATIVO",
    desc: "Extintores certificados para flotas de buses y camiones. Cumple con la normativa vigente en Chile.",
    cta: "Ver extintores",
    ctaHref: "/collections/extintores",
    accent: "#E74C3C",
  },
  {
    image: "/banners/banner5.jpg",
    href: "/collections/teroson",
    eyebrow: "Carrocería · Henkel",
    title: "Teroson",
    subtitle: "SELLADORES DE CARROCERÍA",
    desc: "Selladores, anti-vibraciones y tratamientos anti-corrosión para talleres especializados.",
    cta: "Ver Teroson",
    ctaHref: "/collections/teroson",
    accent: "#8E44AD",
  },
  {
    image: "/banners/banner6.jpg",
    href: "/collections/amarras",
    eyebrow: "Seguridad de carga",
    title: "Amarras",
    subtitle: "TRANSPORTE DE CARGA",
    desc: "Amarras de carga resistentes para el aseguramiento de mercancías en camiones y plataformas.",
    cta: "Ver amarras",
    ctaHref: "/collections/amarras",
    accent: "#9B59B6",
  },
];

export default function HeroBanner() {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <section className="relative bg-primary-dark overflow-hidden">
      {/* Left accent stripe */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary z-20" />

      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        autoplay={{ delay: 5500, disableOnInteraction: false }}
        loop
        speed={700}
        onSwiper={(swiper) => { swiperRef.current = swiper; }}
        pagination={false}
        navigation={false}
        className="w-full"
        style={{ minHeight: "88vh" } as React.CSSProperties}
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i}>
            <div className="relative min-h-[88vh] flex items-center">

              {/* Background image */}
              <div className="absolute inset-0">
                <Image
                  src={slide.image}
                  alt={slide.subtitle}
                  fill
                  className="object-cover"
                  priority={i === 0}
                  sizes="100vw"
                />
                {/* Multi-layer overlay for legibility */}
                <div className="absolute inset-0 bg-primary-dark/70" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/95 via-primary-dark/60 to-transparent" />
              </div>

              {/* Grid pattern overlay */}
              <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage:
                    "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />

              {/* SVG decorative lines */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 1440 800"
                preserveAspectRatio="xMidYMid slice"
                fill="none"
                aria-hidden="true"
              >
                <line x1="-50" y1="850" x2="850" y2="-50" stroke={slide.accent} strokeWidth="1" strokeOpacity="0.18" />
                <line x1="250" y1="850" x2="1150" y2="-50" stroke={slide.accent} strokeWidth="1" strokeOpacity="0.08" />
                <circle cx="1200" cy="600" r="300" stroke={slide.accent} strokeWidth="1" strokeOpacity="0.06" fill="none" />
              </svg>

              {/* Content */}
              <div className="relative max-w-7xl mx-auto px-6 lg:px-8 w-full py-20 lg:py-28">
                <div className="max-w-xl">

                  {/* Eyebrow badge */}
                  <div className="inline-flex items-center gap-2 border px-3 py-1.5 mb-7" style={{ borderColor: `${slide.accent}40`, backgroundColor: `${slide.accent}12` }}>
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: slide.accent }} />
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color: slide.accent }}>
                      {slide.eyebrow}
                    </span>
                  </div>

                  {/* Headline */}
                  <h1 className="font-black uppercase leading-[0.88] tracking-tight mb-7">
                    <span className="block text-[clamp(2.8rem,6vw,4.5rem)] text-white">
                      {slide.title}
                    </span>
                    <span
                      className="block text-[clamp(1.4rem,3vw,2.2rem)] text-transparent mt-1"
                      style={{ WebkitTextStroke: `2px ${slide.accent}` }}
                    >
                      {slide.subtitle}
                    </span>
                  </h1>

                  {/* Divider + desc */}
                  <div className="flex items-start gap-3 mb-8">
                    <div className="w-8 h-0.5 mt-2 flex-shrink-0" style={{ backgroundColor: slide.accent }} />
                    <p className="text-white/85 text-sm leading-relaxed">
                      {slide.desc}
                    </p>
                  </div>

                  {/* CTAs */}
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={slide.ctaHref}
                      className="inline-flex items-center gap-2 font-bold px-7 py-4 text-sm uppercase tracking-wider transition-colors text-white"
                      style={{ backgroundColor: slide.accent }}
                    >
                      {slide.cta} <ArrowRight size={15} />
                    </Link>
                    <a
                      href="https://wa.me/569xxxxxxxx"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 border border-white/40 hover:border-white/70 text-white/85 hover:text-white font-bold px-7 py-4 text-sm uppercase tracking-wider transition-colors"
                    >
                      Cotizar por WhatsApp
                    </a>
                  </div>
                </div>
              </div>

              {/* Slide counter */}
              <div className="absolute bottom-8 right-8 text-white/40 text-xs font-bold tracking-widest">
                {String(i + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Arrow — izquierda, centrada verticalmente */}
      <button
        onClick={() => swiperRef.current?.slidePrev()}
        className="absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 border border-white/25 hover:border-white/60 bg-black/20 hover:bg-black/40 flex items-center justify-center text-white/70 hover:text-white transition-all backdrop-blur-sm"
        aria-label="Anterior"
      >
        <ArrowLeft size={17} />
      </button>

      {/* Arrow — derecha, centrada verticalmente */}
      <button
        onClick={() => swiperRef.current?.slideNext()}
        className="absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 border border-white/25 hover:border-white/60 bg-black/20 hover:bg-black/40 flex items-center justify-center text-white/70 hover:text-white transition-all backdrop-blur-sm"
        aria-label="Siguiente"
      >
        <ArrowRight size={17} />
      </button>

      {/* Dots — centrados en la parte inferior */}
      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => swiperRef.current?.slideTo(i)}
            className="w-7 h-0.5 bg-white/25 hover:bg-white/70 transition-colors"
            aria-label={`Ir al slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Stats bar at bottom */}
      <div className="absolute bottom-0 left-1.5 right-0 z-20 hidden lg:block">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center gap-8 pb-8">
            <div className="flex items-center gap-2 mr-4">
              <Zap size={11} className="text-primary" />
              <span className="text-[9px] text-white/50 uppercase tracking-widest font-bold">Stock disponible</span>
            </div>
            {[
              { value: `${products.length}+`, label: "Productos" },
              { value: "7+", label: "Marcas int." },
              { value: "100%", label: "Originales" },
              { value: "B2B", label: "Especializado" },
            ].map(({ value, label }) => (
              <div key={label} className="flex items-center gap-2">
                <span className="text-sm font-black text-white/80">{value}</span>
                <span className="text-[9px] text-white/45 uppercase tracking-widest">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
