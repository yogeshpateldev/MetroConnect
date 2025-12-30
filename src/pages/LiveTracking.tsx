import { Navbar } from '@/components/Navbar';
import { LiveTracker } from '@/components/LiveTracker';
import { Footer } from '@/components/Footer';

const LiveTracking = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <LiveTracker />
      </main>
      <Footer />
    </div>
  );
};

export default LiveTracking;
