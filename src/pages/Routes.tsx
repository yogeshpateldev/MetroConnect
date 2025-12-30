import { Navbar } from '@/components/Navbar';
import { RoutePlanner } from '@/components/RoutePlanner';
import { Footer } from '@/components/Footer';

const Routes = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <RoutePlanner />
      </main>
      <Footer />
    </div>
  );
};

export default Routes;
