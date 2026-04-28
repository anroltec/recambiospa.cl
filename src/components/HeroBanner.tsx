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
    image: "/banners/banner1-new.png",
    href: "/collections/extintores",
    alt: "Extintor PQS 6KG y productos de seguridad para transporte",
  },
  {
    image: "/banners/banner2.jpg",
    href: "/collections/loctite",
    alt: "Productos Loctite",
  },
  {
    image: "/banners/banner5.jpg",
    href: "/collections/teroson",
    alt: "Selladores Teroson",
  },
];

export default function HeroBanner() {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <section className="relative group/hero select-none overflow-hidden">
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
              className="block relative w-full aspect-[16/9] sm:aspect-[2/1] lg:aspect-[5/2]"
              aria-label={slide.alt}
              tabIndex={-1}
            >
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                className="object-cover object-center"
                priority={i === 0}
                sizes="100vw"
              />
              {/* Left/right vignette */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30 pointer-events-none" />
              {/* Bottom gradient for pagination contrast */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50 pointer-events-none" />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* ── Custom arrows ───────────────────────────── */}
      <button
        onClick={() => swiperRef.current?.slidePrev()}
        aria-label="Anterior"
        className="
          absolute left-0 top-1/2 -translate-y-1/2 z-20
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
          absolute right-0 top-1/2 -translate-y-1/2 z-20
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

      {/* ── Pagination bars ─────────────────────────── */}
      <div className="hero-pagination absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5" />
    </section>
  );
}
