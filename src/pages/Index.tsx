import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { FeaturesSection } from '@/components/FeaturesSection';
import { StatsSection } from '@/components/StatsSection';
import { Footer } from '@/components/Footer';
import metroBg from '@/assets/metro-bg.jpg';

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      {/* Fixed Background */}
      <div className="fixed inset-0 z-0">
        <img 
          src={metroBg} 
          alt="" 
          className="w-full h-full object-cover opacity-5"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      </div>
      
      <div className="relative z-10">
        <Navbar />
        <main>
          <HeroSection />
          <FeaturesSection />
          <StatsSection />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Index;
