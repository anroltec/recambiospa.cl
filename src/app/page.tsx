import HeroBanner from "@/components/HeroBanner";
import PromoBanner from "@/components/PromoBanner";
import CategoryCards from "@/components/CategoryCards";
import FeaturedProducts from "@/components/FeaturedProducts";
import BrandsSection from "@/components/BrandsSection";
import BlogSection from "@/components/BlogSection";

export default function Home() {
  return (
    <>
      <HeroBanner />
      <PromoBanner />
      <CategoryCards />
      <FeaturedProducts />
      <BrandsSection />
      <BlogSection />
    </>
  );
}
