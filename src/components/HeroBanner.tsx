"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    image: "/banners/banner-precios-imperdibles.png",
    imageMobile: "/banners/banner-mobile-precios-imperdibles.png",
    href: "/collections",
    alt: "Sección Precios Imperdibles - Comercializadora Recambio SpA",
  },
  {
    image: "/banners/banner-1.png",
    imageMobile: "/banners/banner-mobile-loctite.png",
    href: "/collections/loctite",
    alt: "Trabador Perno Loctite 243 50ml - $24.900 + IVA",
  },
  {
    image: "/banners/banner-2.png",
    imageMobile: "/banners/banner-mobile-foco-led.png",
    href: "/collections/iluminacion",
    alt: "Foco LED Trasero 125mm Braslux - Precio de venta $18.603 + IVA",
  },
  {
    image: "/banners/banner-3.png",
    imageMobile: "/banners/banner-mobile-correa.png",
    href: "/collections/otros",
    alt: "Correa Aire Acondicionado Lisa 2B-76 1930mm Optibelt - $54.330 + IVA",
  },
];

export default function HeroBanner() {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <section className="relative group/hero isolate select-none overflow-hidden">
      <Swiper
        onSwiper={(swiper) => { swiperRef.current = swiper; }}
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true, el: ".hero-pagination" }}
        loop
        className="w-full"
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i}>
            <Link
              href={slide.href}
              className="relative block h-[320px] sm:h-[460px] w-full"
              aria-label={slide.alt}
              tabIndex={-1}
            >
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                className="hidden sm:block object-cover object-[10%_center]"
                priority={i === 0}
                sizes="100vw"
              />
              <Image
                src={slide.imageMobile}
                alt={slide.alt}
                fill
                className="block sm:hidden object-cover object-[10%_center]"
                priority={i === 0}
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/32 via-transparent to-black/28 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/55 pointer-events-none" />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      <button
        onClick={() => swiperRef.current?.slidePrev()}
        aria-label="Anterior"
        className="
          absolute left-0 top-1/2 -translate-y-1/2 z-30
          flex items-center justify-center
          w-10 sm:w-12 h-16 sm:h-20
          bg-black/50 hover:bg-primary
          text-white
          border-r border-white/10
          transition-all duration-200
          backdrop-blur-[2px]
          opacity-100 sm:opacity-0 sm:group-hover/hero:opacity-100
        "
      >
        <ChevronLeft size={26} strokeWidth={2} />
      </button>

      <button
        onClick={() => swiperRef.current?.slideNext()}
        aria-label="Siguiente"
        className="
          absolute right-0 top-1/2 -translate-y-1/2 z-30
          flex items-center justify-center
          w-10 sm:w-12 h-16 sm:h-20
          bg-black/50 hover:bg-primary
          text-white
          border-l border-white/10
          transition-all duration-200
          backdrop-blur-[2px]
          opacity-100 sm:opacity-0 sm:group-hover/hero:opacity-100
        "
      >
        <ChevronRight size={26} strokeWidth={2} />
      </button>

      <div className="hero-pagination absolute bottom-3 left-1/2 z-30 flex -translate-x-1/2 gap-1.5" />
    </section>
  );
}
