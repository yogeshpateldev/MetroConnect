import { Navbar } from '@/components/Navbar';
import { MyTickets as MyTicketsComponent } from '@/components/MyTickets';
import { Footer } from '@/components/Footer';

const MyTicketsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <MyTicketsComponent />
      </main>
      <Footer />
    </div>
  );
};

export default MyTicketsPage;
