import type { LucideIcon } from "lucide-react";

export interface BannerSlide {
  image: string;
  href: string;
  alt: string;
}

export interface Feature {
  icon: LucideIcon;
  title: string;
  desc: string;
}

export interface BlogPost {
  title: string;
  date: string;
  excerpt: string;
  category: string;
  href: string;
}
