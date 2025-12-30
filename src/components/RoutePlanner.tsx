import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, IndianRupee, ArrowRight, Train } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getAllStations, Station, lines } from '@/data/metroData';
import { findRoute, formatDuration } from '@/services/bookingService';
import { useSearchParams, useNavigate } from 'react-router-dom';

export const RoutePlanner = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [fromStation, setFromStation] = useState(searchParams.get('from') || '');
  const [toStation, setToStation] = useState(searchParams.get('to') || '');
  const [route, setRoute] = useState<ReturnType<typeof findRoute>>(null);

  const stations = getAllStations();

  useEffect(() => {
    if (fromStation && toStation && fromStation !== toStation) {
      const foundRoute = findRoute(fromStation, toStation);
      setRoute(foundRoute);
    } else {
      setRoute(null);
    }
  }, [fromStation, toStation]);

  const handleBookTicket = () => {
    if (route) {
      navigate(`/book?from=${fromStation}&to=${toStation}`);
    }
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
            ROUTE PLANNER
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-foreground mb-4"
          >
            Plan Your Journey
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            Select your stations to find the best route with fare and duration details
          </motion.p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Station Selection */}
          <Card glass className="mb-8">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* From Station */}
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    <MapPin className="w-4 h-4 inline mr-2 text-primary" />
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

                {/* To Station */}
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    <MapPin className="w-4 h-4 inline mr-2 text-accent" />
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
              </div>
            </CardContent>
          </Card>

          {/* Route Details */}
          {route && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card glass className="overflow-hidden">
                <CardHeader className="border-b border-border">
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: route.line.color }} />
                    {route.line.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {/* Journey Visual */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
                        <MapPin className="w-6 h-6 text-primary" />
                      </div>
                      <div className="font-semibold text-foreground">{route.from.name}</div>
                      <div className="text-sm text-muted-foreground">{route.from.code}</div>
                    </div>

                    <div className="flex-1 flex items-center justify-center px-4">
                      <div className="flex items-center gap-2">
                        <div className="h-0.5 flex-1 bg-gradient-to-r from-primary to-accent" />
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary">
                          <Train className="w-4 h-4 text-primary animate-train-move" />
                          <span className="text-sm text-muted-foreground">
                            {Math.abs(route.to.index - route.from.index)} stations
                          </span>
                        </div>
                        <div className="h-0.5 flex-1 bg-gradient-to-r from-accent to-primary" />
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-2">
                        <MapPin className="w-6 h-6 text-accent" />
                      </div>
                      <div className="font-semibold text-foreground">{route.to.name}</div>
                      <div className="text-sm text-muted-foreground">{route.to.code}</div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="text-center p-4 rounded-xl bg-secondary">
                      <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold text-foreground">{formatDuration(route.duration)}</div>
                      <div className="text-sm text-muted-foreground">Duration</div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-secondary">
                      <IndianRupee className="w-6 h-6 text-metro-success mx-auto mb-2" />
                      <div className="text-2xl font-bold text-foreground">₹{route.fare}</div>
                      <div className="text-sm text-muted-foreground">Fare</div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-secondary">
                      <MapPin className="w-6 h-6 text-accent mx-auto mb-2" />
                      <div className="text-2xl font-bold text-foreground">{route.distance.toFixed(1)} km</div>
                      <div className="text-sm text-muted-foreground">Distance</div>
                    </div>
                  </div>

                  {/* Book Button */}
                  <Button
                    variant="hero"
                    size="xl"
                    className="w-full"
                    onClick={handleBookTicket}
                  >
                    Book Ticket Now
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* No Route Message */}
          {fromStation && toStation && fromStation === toStation && (
            <Card glass className="text-center p-8">
              <p className="text-muted-foreground">Please select different stations for your journey</p>
            </Card>
          )}

          {fromStation && toStation && fromStation !== toStation && !route && (
            <Card glass className="text-center p-8">
              <p className="text-muted-foreground">No direct route found between these stations</p>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
};
