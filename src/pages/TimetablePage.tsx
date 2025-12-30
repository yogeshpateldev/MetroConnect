import { Navbar } from '@/components/Navbar';
import { Timetable as TimetableComponent } from '@/components/Timetable';
import { Footer } from '@/components/Footer';

const TimetablePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <TimetableComponent />
      </main>
      <Footer />
    </div>
  );
};

export default TimetablePage;
