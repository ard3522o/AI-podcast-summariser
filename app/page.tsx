import { Header } from "@/components/header";
import { CtaSection } from "@/components/home/cta-section";
import { FeaturesSection } from "@/components/home/feature-section";
import { Footer } from "@/components/home/footer";
import { HeroSection } from "@/components/home/hero-section";
import { PricingSection } from "@/components/home/pricing-section";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header/>
      <HeroSection/>
      <FeaturesSection/>
      <PricingSection/>
      <CtaSection/>
      <Footer/>  
    </div>
  );
}
