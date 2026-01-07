import { Navbar } from '@/components/Navbar';
import { RoutePlanner } from '@/components/RoutePlanner';
import { Footer } from '@/components/Footer';
import metroBg from '@/assets/metro-bg.jpg';

const Routes = () => {
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
        <main className="pt-16">
          <RoutePlanner />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Routes;
