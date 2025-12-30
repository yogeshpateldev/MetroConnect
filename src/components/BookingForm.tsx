import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, Ticket, CheckCircle, Train, Wallet, AlertTriangle, Navigation, CreditCard, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { getAllStations, lines, generateTimetable } from '@/data/metroData';
import { formatDuration } from '@/services/bookingService';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useWallet } from '@/hooks/useWallet';
import { useBookings } from '@/hooks/useBookings';
import { useRewards } from '@/hooks/useRewards';
import { useLocation as useGeoLocation } from '@/hooks/useLocation';
import { LocationVerification } from '@/components/LocationVerification';

interface Route {
  from: { id: string; name: string; code: string; index: number };
  to: { id: string; name: string; code: string; index: number };
  line: { id: string; name: string; color: string };
  duration: number;
  fare: number;
  distance: number;
}

const findRoute = (fromId: string, toId: string): Route | null => {
  const allStations = getAllStations();
  const fromStation = allStations.find(s => s.id === fromId);
  const toStation = allStations.find(s => s.id === toId);
  
  if (!fromStation || !toStation) return null;
  
  // Find the line
  const line = lines.find(l => l.id === fromStation.lineId && l.id === toStation.lineId);
  if (!line) return null;
  
  const stationCount = Math.abs(toStation.index - fromStation.index);
  const duration = stationCount * 3;
  const distance = stationCount * 1.5;
  
  let fare = 10;
  if (stationCount > 2) fare = 20;
  if (stationCount > 5) fare = 30;
  if (stationCount > 8) fare = 40;
  if (stationCount > 12) fare = 50;
  
  return {
    from: { id: fromStation.id, name: fromStation.name, code: fromStation.code, index: fromStation.index },
    to: { id: toStation.id, name: toStation.name, code: toStation.code, index: toStation.index },
    line: { id: line.id, name: line.name, color: line.color },
    duration,
    fare,
    distance,
  };
};

type BookingStep = 'location' | 'details' | 'payment' | 'processing' | 'success';

export const BookingForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { wallet, deductFunds } = useWallet();
  const { createBooking } = useBookings();
  const { addRide } = useRewards();
  const { nearestStation, canPurchaseTicket, requestLocation } = useGeoLocation();
  
  const [step, setStep] = useState<BookingStep>('location');
  const [fromStation, setFromStation] = useState(searchParams.get('from') || '');
  const [toStation, setToStation] = useState(searchParams.get('to') || '');
  const [selectedTime, setSelectedTime] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'card'>('wallet');
  const [route, setRoute] = useState<Route | null>(null);
  const [trainPosition, setTrainPosition] = useState(0);

  const stations = getAllStations();
  const timetable = generateTimetable(route?.line.id || 'east-west');

  // Get upcoming times
  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  const upcomingTimes = timetable.filter(time => time >= currentTime).slice(0, 10);

  useEffect(() => {
    if (fromStation && toStation && fromStation !== toStation) {
      const foundRoute = findRoute(fromStation, toStation);
      setRoute(foundRoute);
    } else {
      setRoute(null);
    }
  }, [fromStation, toStation]);

  // Animate train during processing
  useEffect(() => {
    if (step === 'processing') {
      const interval = setInterval(() => {
        setTrainPosition(prev => (prev >= 100 ? 0 : prev + 2));
      }, 50);
      return () => clearInterval(interval);
    }
  }, [step]);

  const handleLocationVerified = (_stationId: string | null) => {
    setStep('details');
  };

  const handleProceedToPayment = () => {
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please login to book tickets.',
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }
    if (!route || !selectedTime) return;
    setStep('payment');
  };

  const handleConfirmBooking = async () => {
    if (!route || !selectedTime || !user) return;

    // Check wallet balance
    if (paymentMethod === 'wallet' && (wallet?.balance || 0) < route.fare) {
      toast({
        title: 'Insufficient Balance',
        description: 'Please add funds to your wallet.',
        variant: 'destructive',
      });
      return;
    }

    setStep('processing');

    try {
      // Deduct payment
      if (paymentMethod === 'wallet') {
        const { success } = await deductFunds(route.fare, `Ticket: ${route.from.name} → ${route.to.name}`);
        if (!success) {
          setStep('payment');
          return;
        }
      } else {
        // Simulate card payment
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      // Create booking
      const { success, booking } = await createBooking({
        from_station: route.from.name,
        to_station: route.to.name,
        line: route.line.name,
        departure_time: selectedTime,
        fare: route.fare,
        distance: route.distance,
        duration: route.duration,
        payment_method: paymentMethod,
      });

      if (!success) {
        throw new Error('Booking failed');
      }

      // Add ride to rewards
      await addRide(route.distance);

      // Show success
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStep('success');

      toast({
        title: '🎉 Ticket Booked!',
        description: `Your journey from ${route.from.name} to ${route.to.name} is confirmed.`,
      });

      // Navigate after delay
      setTimeout(() => {
        navigate(`/my-tickets?highlight=${booking?.id}`);
      }, 2000);

    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: 'Booking Failed',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
      setStep('payment');
    }
  };

  // Skip location check for demo
  const skipLocationCheck = () => {
    setStep('details');
  };

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
            BOOK TICKET
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-foreground mb-4"
          >
            Book Your Metro Ticket
          </motion.h2>
          
          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {['location', 'details', 'payment', 'success'].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                  step === s || ['location', 'details', 'payment', 'success'].indexOf(step) > i
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground'
                }`}>
                  {i + 1}
                </div>
                {i < 3 && <div className="w-8 h-px bg-border" />}
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {/* Step 1: Location Verification */}
            {step === 'location' && (
              <motion.div
                key="location"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-md mx-auto"
              >
                <LocationVerification onVerified={handleLocationVerified} />
                <div className="mt-4 text-center">
                  <Button variant="ghost" onClick={skipLocationCheck}>
                    Skip for Demo
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Journey Details */}
            {step === 'details' && (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="grid lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    {/* Station Selection */}
                    <Card className="glass-card">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-primary" />
                          Select Stations
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-muted-foreground mb-2">
                            From Station
                          </label>
                          <select
                            value={fromStation}
                            onChange={(e) => setFromStation(e.target.value)}
                            className="w-full h-12 px-4 bg-secondary border border-border rounded-lg text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary"
                          >
                            <option value="">Select starting station</option>
                            {lines.map((line) => (
                              <optgroup key={line.id} label={line.name}>
                                {line.stations.map((station) => (
                                  <option key={station.id} value={station.id}>
                                    {station.name}
                                  </option>
                                ))}
                              </optgroup>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-muted-foreground mb-2">
                            To Station
                          </label>
                          <select
                            value={toStation}
                            onChange={(e) => setToStation(e.target.value)}
                            className="w-full h-12 px-4 bg-secondary border border-border rounded-lg text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary"
                          >
                            <option value="">Select destination</option>
                            {lines.map((line) => (
                              <optgroup key={line.id} label={line.name}>
                                {line.stations.map((station) => (
                                  <option key={station.id} value={station.id}>
                                    {station.name}
                                  </option>
                                ))}
                              </optgroup>
                            ))}
                          </select>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Time Selection */}
                    {route && (
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <Card className="glass-card">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Clock className="w-5 h-5 text-primary" />
                              Select Departure Time
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-5 gap-2">
                              {upcomingTimes.map((time) => (
                                <button
                                  key={time}
                                  onClick={() => setSelectedTime(time)}
                                  className={`p-3 rounded-lg text-sm font-medium transition-all ${
                                    selectedTime === time
                                      ? 'bg-primary text-primary-foreground'
                                      : 'bg-secondary text-foreground hover:bg-primary/20'
                                  }`}
                                >
                                  {time}
                                </button>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                  </div>

                  {/* Booking Summary */}
                  <div>
                    <Card className="glass-card sticky top-24">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Ticket className="w-5 h-5 text-primary" />
                          Booking Summary
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {route ? (
                          <>
                            <div className="space-y-3">
                              <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-primary" />
                                <div>
                                  <div className="text-sm text-muted-foreground">From</div>
                                  <div className="font-medium text-foreground">{route.from.name}</div>
                                </div>
                              </div>
                              <div className="ml-1.5 h-8 w-px bg-border" />
                              <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-accent" />
                                <div>
                                  <div className="text-sm text-muted-foreground">To</div>
                                  <div className="font-medium text-foreground">{route.to.name}</div>
                                </div>
                              </div>
                            </div>

                            <div className="h-px bg-border" />

                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Line</span>
                                <span className="font-medium text-foreground">{route.line.name}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Duration</span>
                                <span className="font-medium text-foreground">{formatDuration(route.duration)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Distance</span>
                                <span className="font-medium text-foreground">{route.distance.toFixed(1)} km</span>
                              </div>
                              {selectedTime && (
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Departure</span>
                                  <span className="font-medium text-primary">{selectedTime}</span>
                                </div>
                              )}
                            </div>

                            <div className="h-px bg-border" />

                            <div className="flex justify-between items-center">
                              <span className="text-lg text-muted-foreground">Total Fare</span>
                              <span className="text-2xl font-bold text-primary">₹{route.fare}</span>
                            </div>

                            <Button
                              variant="hero"
                              size="lg"
                              className="w-full"
                              onClick={handleProceedToPayment}
                              disabled={!selectedTime}
                            >
                              {user ? 'Proceed to Payment' : 'Login to Book'}
                            </Button>

                            {!user && (
                              <p className="text-center text-sm text-muted-foreground">
                                <Link to="/auth" className="text-primary hover:underline">Login</Link> or{' '}
                                <Link to="/auth" className="text-primary hover:underline">Sign up</Link> to book tickets
                              </p>
                            )}
                          </>
                        ) : (
                          <div className="text-center py-8">
                            <Train className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">
                              Select stations to see booking details
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Payment */}
            {step === 'payment' && route && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-md mx-auto"
              >
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wallet className="w-5 h-5 text-primary" />
                      Select Payment Method
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Journey Summary */}
                    <div className="p-4 rounded-xl bg-secondary/50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">{route.from.name}</span>
                        <Train className="w-4 h-4 text-primary" />
                        <span className="text-sm text-muted-foreground">{route.to.name}</span>
                      </div>
                      <div className="text-center">
                        <span className="text-2xl font-bold text-primary">₹{route.fare}</span>
                      </div>
                    </div>

                    {/* Payment Options */}
                    <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as 'wallet' | 'card')}>
                      <div className={`flex items-center space-x-3 p-4 rounded-xl border transition-all cursor-pointer ${
                        paymentMethod === 'wallet' ? 'border-primary bg-primary/5' : 'border-border'
                      }`}>
                        <RadioGroupItem value="wallet" id="wallet" />
                        <Wallet className="w-5 h-5 text-primary" />
                        <div className="flex-1">
                          <Label htmlFor="wallet" className="cursor-pointer">Metro Wallet</Label>
                          <p className="text-sm text-muted-foreground">
                            Balance: ₹{wallet?.balance?.toFixed(2) || '0.00'}
                          </p>
                        </div>
                        {(wallet?.balance || 0) < route.fare && (
                          <AlertTriangle className="w-5 h-5 text-yellow-500" />
                        )}
                      </div>

                      <div className={`flex items-center space-x-3 p-4 rounded-xl border transition-all cursor-pointer ${
                        paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'border-border'
                      }`}>
                        <RadioGroupItem value="card" id="card" />
                        <CreditCard className="w-5 h-5 text-muted-foreground" />
                        <div className="flex-1">
                          <Label htmlFor="card" className="cursor-pointer">Credit/Debit Card</Label>
                          <p className="text-sm text-muted-foreground">Pay directly (simulated)</p>
                        </div>
                      </div>
                    </RadioGroup>

                    {paymentMethod === 'wallet' && (wallet?.balance || 0) < route.fare && (
                      <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30">
                        <p className="text-sm text-yellow-600 dark:text-yellow-400 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" />
                          Insufficient balance.{' '}
                          <Link to="/profile" className="underline">Add funds</Link>
                        </p>
                      </div>
                    )}

                    {/* Points Earned */}
                    <div className="p-4 rounded-xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-yellow-500" />
                        <span className="text-sm font-medium">
                          You'll earn <span className="text-yellow-500">{Math.floor(route.distance * 2)} points</span> for this ride!
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button variant="outline" onClick={() => setStep('details')} className="flex-1">
                        Back
                      </Button>
                      <Button
                        variant="hero"
                        onClick={handleConfirmBooking}
                        className="flex-1"
                        disabled={paymentMethod === 'wallet' && (wallet?.balance || 0) < route.fare}
                      >
                        Pay ₹{route.fare}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 4: Processing with Train Animation */}
            {step === 'processing' && (
              <motion.div
                key="processing"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="max-w-md mx-auto text-center"
              >
                <Card className="glass-card overflow-hidden">
                  <CardContent className="py-12">
                    {/* Animated Train Track */}
                    <div className="relative h-24 mb-8">
                      {/* Track */}
                      <div className="absolute top-1/2 left-8 right-8 h-1 bg-border rounded-full">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-accent/50 rounded-full" 
                          style={{ width: `${trainPosition}%` }} 
                        />
                      </div>
                      
                      {/* Station dots */}
                      <div className="absolute top-1/2 left-8 w-4 h-4 -translate-y-1/2 rounded-full bg-primary" />
                      <div className="absolute top-1/2 right-8 w-4 h-4 -translate-y-1/2 rounded-full bg-accent" />
                      
                      {/* Train */}
                      <motion.div
                        className="absolute top-1/2 -translate-y-1/2"
                        style={{ left: `calc(8% + ${trainPosition * 0.84}%)` }}
                      >
                        <div className="relative">
                          <div className="w-16 h-10 bg-gradient-to-r from-primary to-accent rounded-lg shadow-lg shadow-primary/30 flex items-center justify-center">
                            <Train className="w-6 h-6 text-primary-foreground" />
                          </div>
                          {/* Smoke effect */}
                          <motion.div
                            animate={{ opacity: [0.5, 0, 0.5], y: [-5, -15, -5] }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="absolute -top-4 left-2 w-3 h-3 bg-muted-foreground/30 rounded-full"
                          />
                        </div>
                      </motion.div>
                    </div>

                    <h3 className="text-xl font-bold text-foreground mb-2">
                      Processing Your Booking
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Please wait while we confirm your ticket...
                    </p>

                    {/* Loading dots */}
                    <div className="flex justify-center gap-2">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                          className="w-3 h-3 rounded-full bg-primary"
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 5: Success */}
            {step === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-md mx-auto text-center"
              >
                <Card className="glass-card overflow-hidden">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', delay: 0.2 }}
                    >
                      <CheckCircle className="w-20 h-20 text-white mx-auto" />
                    </motion.div>
                  </div>
                  <CardContent className="py-8">
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      Booking Confirmed!
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Your ticket has been booked successfully. Redirecting to your tickets...
                    </p>
                    
                    {/* Confetti-like sparkles */}
                    <div className="flex justify-center gap-4">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{ 
                            y: [0, -20, 0],
                            rotate: [0, 360],
                            opacity: [1, 0.5, 1]
                          }}
                          transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                        >
                          <Sparkles className="w-6 h-6 text-yellow-500" />
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
