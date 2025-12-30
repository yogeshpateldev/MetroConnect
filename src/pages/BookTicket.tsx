import { Navbar } from '@/components/Navbar';
import { BookingForm } from '@/components/BookingForm';
import { Footer } from '@/components/Footer';

const BookTicket = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <BookingForm />
      </main>
      <Footer />
    </div>
  );
};

export default BookTicket;
