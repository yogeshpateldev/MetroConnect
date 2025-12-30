import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLocation } from '@/hooks/useLocation';
import { getAllStations } from '@/data/metroData';

interface LocationVerificationProps {
  onVerified: (stationId: string | null) => void;
}

export const LocationVerification = ({ onVerified }: LocationVerificationProps) => {
  const {
    location,
    nearestStation,
    loading,
    error,
    permissionDenied,
    requestLocation,
    canPurchaseTicket,
    simulateLocation,
    TICKET_PURCHASE_RADIUS_KM
  } = useLocation();

  const [selectedSimStation, setSelectedSimStation] = useState('');
  const allStations = getAllStations();
  const purchaseStatus = canPurchaseTicket();

  const handleSimulate = () => {
    if (selectedSimStation) {
      simulateLocation(selectedSimStation);
      if (nearestStation?.isWithinRange) {
        onVerified(nearestStation.id);
      }
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <MapPin className="w-6 h-6 text-primary" />
          </div>
          <div>
            <CardTitle>Location Verification</CardTitle>
            <CardDescription>
              Ticket purchase is available within {TICKET_PURCHASE_RADIUS_KM} km of stations
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status Display */}
        {nearestStation && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl ${
              purchaseStatus.allowed 
                ? 'bg-green-500/10 border border-green-500/30' 
                : 'bg-yellow-500/10 border border-yellow-500/30'
            }`}
          >
            <div className="flex items-start gap-3">
              {purchaseStatus.allowed ? (
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
              )}
              <div>
                <p className="font-medium">
                  {purchaseStatus.allowed ? 'You can purchase tickets!' : 'Outside purchase zone'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Nearest station: <span className="font-medium">{nearestStation.name}</span>
                  <br />
                  Distance: <span className="font-medium">{nearestStation.distance} km</span>
                </p>
                {!purchaseStatus.allowed && (
                  <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-2">
                    {purchaseStatus.reason}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Error Display */}
        {error && (
          <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Request Location Button */}
        {!location && (
          <Button
            onClick={requestLocation}
            disabled={loading}
            variant="hero"
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Getting Location...
              </>
            ) : (
              <>
                <Navigation className="w-4 h-4 mr-2" />
                Enable Location
              </>
            )}
          </Button>
        )}

        {/* Demo Mode - Simulate Location */}
        <div className="pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground mb-3">
            Demo Mode: Simulate being near a station
          </p>
          <div className="flex gap-2">
            <Select value={selectedSimStation} onValueChange={setSelectedSimStation}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select station" />
              </SelectTrigger>
              <SelectContent>
                {allStations.slice(0, 10).map((station) => (
                  <SelectItem key={station.id} value={station.id}>
                    {station.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleSimulate} disabled={!selectedSimStation}>
              Simulate
            </Button>
          </div>
        </div>

        {/* Visual Station Radius Indicator */}
        {nearestStation && (
          <div className="relative h-32 rounded-xl bg-secondary/30 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Station Circle */}
              <div className="relative">
                {/* 2km radius circle */}
                <div className={`absolute -inset-12 rounded-full border-2 border-dashed ${
                  purchaseStatus.allowed ? 'border-green-500/50' : 'border-yellow-500/50'
                }`}>
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">
                    {TICKET_PURCHASE_RADIUS_KM} km
                  </span>
                </div>
                {/* Station dot */}
                <div className="w-4 h-4 rounded-full bg-primary animate-pulse-glow" />
              </div>
              {/* User position */}
              {location && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`absolute w-3 h-3 rounded-full ${
                    purchaseStatus.allowed ? 'bg-green-500' : 'bg-yellow-500'
                  }`}
                  style={{
                    left: `${50 + (nearestStation.distance / TICKET_PURCHASE_RADIUS_KM) * 30}%`,
                    top: '50%',
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <div className={`absolute inset-0 rounded-full animate-ping ${
                    purchaseStatus.allowed ? 'bg-green-500' : 'bg-yellow-500'
                  }`} />
                </motion.div>
              )}
            </div>
            <div className="absolute bottom-2 left-2 text-xs text-muted-foreground">
              You • {nearestStation.name}
            </div>
          </div>
        )}

        {/* Continue Button */}
        {purchaseStatus.allowed && (
          <Button
            onClick={() => onVerified(nearestStation?.id || null)}
            variant="hero"
            className="w-full"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Continue to Book
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
