import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Ticket, MapPin, Clock, Calendar, QrCode, Train, XCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSearchParams, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '@/contexts/AuthContext';
import { useBookings } from '@/hooks/useBookings';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface BookingType {
  id: string;
  from_station: string;
  to_station: string;
  line: string;
  departure_time: string;
  fare: number;
  distance: number | null;
  duration: number | null;
  booking_date: string;
  status: string;
  qr_code: string | null;
  payment_method: string | null;
}

export const MyTickets = () => {
  const [searchParams] = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const { bookings, loading, cancelBooking } = useBookings();
  const { toast } = useToast();
  const [selectedBooking, setSelectedBooking] = useState<BookingType | null>(null);
  const highlightId = searchParams.get('highlight');

  useEffect(() => {
    if (highlightId && bookings.length > 0) {
      const highlighted = bookings.find(b => b.id === highlightId);
      if (highlighted) {
        setSelectedBooking(highlighted);
      }
    }
  }, [highlightId, bookings]);

  const handleCancelBooking = async (bookingId: string) => {
    const { success } = await cancelBooking(bookingId);
    if (success) {
      toast({
        title: 'Ticket Cancelled',
        description: 'Your ticket has been cancelled. Refund will be processed shortly.',
      });
      setSelectedBooking(null);
    }
  };

  if (authLoading || loading) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-1/3 mx-auto" />
              <div className="h-64 bg-muted rounded-xl" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center">
            <Card className="glass-card py-12">
              <Ticket className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Login Required</h3>
              <p className="text-muted-foreground mb-6">Please login to view your tickets</p>
              <Button variant="hero" asChild>
                <Link to="/auth">Login to Continue</Link>
              </Button>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block text-primary text-sm font-medium mb-4"
          >
            MY TICKETS
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-foreground mb-4"
          >
            Your Bookings
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            View and manage your metro tickets. Show QR code at the gates for entry.
          </motion.p>
        </div>

        <div className="max-w-5xl mx-auto">
          {bookings.length === 0 ? (
            <Card className="glass-card text-center py-16">
              <Ticket className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No Tickets Yet</h3>
              <p className="text-muted-foreground mb-6">Book your first metro ticket to see it here</p>
              <Button variant="hero" asChild>
                <Link to="/book">Book a Ticket</Link>
              </Button>
            </Card>
          ) : (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Tickets List */}
              <div className="space-y-4">
                {bookings.map((booking, index) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card 
                      className={`glass-card cursor-pointer transition-all hover:scale-[1.02] ${
                        selectedBooking?.id === booking.id ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => setSelectedBooking(booking)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-2 h-2 rounded-full bg-primary" />
                              <span className="font-medium text-foreground">{booking.from_station}</span>
                              <span className="text-muted-foreground">→</span>
                              <span className="font-medium text-foreground">{booking.to_station}</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {booking.departure_time}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {format(new Date(booking.booking_date), 'MMM d, yyyy')}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-primary">₹{booking.fare}</div>
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs ${
                              booking.status === 'confirmed' 
                                ? 'bg-green-500/20 text-green-500' 
                                : booking.status === 'used'
                                  ? 'bg-muted text-muted-foreground'
                                  : booking.status === 'cancelled'
                                    ? 'bg-red-500/20 text-red-500'
                                    : 'bg-yellow-500/20 text-yellow-500'
                            }`}>
                              {booking.status}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Ticket Details / QR */}
              <div>
                {selectedBooking ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="sticky top-24"
                  >
                    <Card className="glass-card overflow-hidden">
                      {/* Ticket Header */}
                      <div className="bg-gradient-to-r from-primary to-accent p-6 text-center">
                        <Train className="w-10 h-10 text-primary-foreground mx-auto mb-2" />
                        <h3 className="text-xl font-bold text-primary-foreground">Metro Ticket</h3>
                        <p className="text-primary-foreground/80 text-sm">{selectedBooking.line}</p>
                      </div>

                      <CardContent className="p-6">
                        {/* Journey Details */}
                        <div className="flex items-center justify-between mb-6">
                          <div className="text-center">
                            <MapPin className="w-5 h-5 text-primary mx-auto mb-1" />
                            <div className="font-bold text-foreground text-sm">{selectedBooking.from_station}</div>
                          </div>
                          <div className="flex-1 px-4">
                            <div className="flex items-center justify-center gap-2 mb-1">
                              <div className="h-px flex-1 bg-border" />
                              <Train className="w-4 h-4 text-primary" />
                              <div className="h-px flex-1 bg-border" />
                            </div>
                            <div className="text-center text-xs text-muted-foreground">
                              {selectedBooking.duration ? `${selectedBooking.duration} min` : '~'}
                            </div>
                          </div>
                          <div className="text-center">
                            <MapPin className="w-5 h-5 text-accent mx-auto mb-1" />
                            <div className="font-bold text-foreground text-sm">{selectedBooking.to_station}</div>
                          </div>
                        </div>

                        {/* QR Code */}
                        {selectedBooking.status === 'confirmed' && (
                          <div className="bg-white p-4 rounded-xl mb-6">
                            <div className="flex items-center justify-center">
                              <QRCodeSVG
                                value={JSON.stringify({
                                  id: selectedBooking.id,
                                  qr: selectedBooking.qr_code,
                                  from: selectedBooking.from_station,
                                  to: selectedBooking.to_station,
                                  time: selectedBooking.departure_time,
                                })}
                                size={180}
                                bgColor="#ffffff"
                                fgColor="#0a0f1c"
                                level="H"
                              />
                            </div>
                          </div>
                        )}

                        {selectedBooking.status === 'cancelled' && (
                          <div className="bg-red-500/10 p-6 rounded-xl mb-6 text-center">
                            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-2" />
                            <p className="text-red-500 font-medium">This ticket has been cancelled</p>
                          </div>
                        )}

                        {/* Ticket Info */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="text-center p-3 rounded-lg bg-secondary">
                            <div className="text-sm text-muted-foreground">Departure</div>
                            <div className="text-lg font-bold text-foreground">{selectedBooking.departure_time}</div>
                          </div>
                          <div className="text-center p-3 rounded-lg bg-secondary">
                            <div className="text-sm text-muted-foreground">Fare</div>
                            <div className="text-lg font-bold text-primary">₹{selectedBooking.fare}</div>
                          </div>
                        </div>

                        <div className="text-center text-xs text-muted-foreground mb-4">
                          <p>Ticket ID: {selectedBooking.qr_code}</p>
                          <p>Booked: {format(new Date(selectedBooking.booking_date), 'PPpp')}</p>
                        </div>

                        {selectedBooking.status === 'confirmed' && (
                          <Button
                            variant="destructive"
                            size="sm"
                            className="w-full"
                            onClick={() => handleCancelBooking(selectedBooking.id)}
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Cancel Ticket
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ) : (
                  <Card className="glass-card text-center py-16 sticky top-24">
                    <QrCode className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Select a ticket to view QR code</p>
                  </Card>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
