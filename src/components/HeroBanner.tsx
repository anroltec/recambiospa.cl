"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Link from "next/link";
import Image from "next/image";

const slides = [
  { image: "/banners/banner1.jpg", href: "/collections/iluminacion", alt: "Iluminación LED Braslux" },
  { image: "/banners/banner2.jpg", href: "/collections/loctite", alt: "Productos Loctite" },
  { image: "/banners/banner5.jpg", href: "/collections/teroson", alt: "Selladores Teroson" },
];

export default function HeroBanner() {
  return (
    <section>
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        navigation
        pagination={{ clickable: true }}
        loop
        className="w-full"
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i}>
            <Link href={slide.href} className="block relative w-full aspect-[21/7]">
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                className="object-cover"
                priority={i === 0}
              />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
