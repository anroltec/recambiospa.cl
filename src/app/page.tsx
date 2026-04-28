import HeroBanner from "@/components/HeroBanner";
import PromoBanner from "@/components/PromoBanner";
import VehicleSection from "@/components/VehicleSection";
import CategoryCards from "@/components/CategoryCards";
import FeaturedProducts from "@/components/FeaturedProducts";
import BrandsSection from "@/components/BrandsSection";
import BlogSection from "@/components/BlogSection";
import HomeCTA from "@/components/HomeCTA";

export default function Home() {
  return (
    <>
      <HeroBanner />
      <PromoBanner />
      <VehicleSection />
      <CategoryCards />
      <FeaturedProducts />
      <BrandsSection />
      <BlogSection />
      <HomeCTA />
    </>
  );
}
