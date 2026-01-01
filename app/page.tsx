import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeatureRow from "@/components/FeatureRow";
import BestSellers from "@/components/BestSellers";
import AboutPreview from "@/components/AboutPreview";
import InstagramGrid from "@/components/InstagramGrid";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Navbar cartCount={0} />

      <main>
        <Hero />
        <FeatureRow />
        <BestSellers />
        <AboutPreview />
        <InstagramGrid />
      </main>

      <Footer />
    </div>
  );
}
