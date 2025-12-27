import "@/components/landing/LandingPage.css";

// Landing Components
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import AgentsShowcase from "@/components/landing/AgentsShowcase";
import Pricing from "@/components/landing/Pricing";
import MegaCta from "@/components/landing/MegaCta";
import Footer from "@/components/landing/Footer";
import Particles from "@/components/landing/Particles";

export default function Home() {
  // Landing Page is always visible, clicking "Get Started" goes to dashboard.
  return (
    <div className="landing-page min-h-screen">
      {/* Background Effects */}
      <div className="mesh-gradient">
        <div className="gradient-blob blob-1"></div>
        <div className="gradient-blob blob-2"></div>
        <div className="gradient-blob blob-3"></div>
      </div>
      <Particles />

      {/* Content */}
      <Navbar />
      <Hero />
      <Features />
      <AgentsShowcase />
      <Pricing />
      <MegaCta />
      <Footer />
    </div>
  );
}
