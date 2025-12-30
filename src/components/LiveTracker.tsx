import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Train, ChevronDown, Circle, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { lines, Line, Station } from '@/data/metroData';
import { liveTrainService } from '@/services/liveTrainService';
import { formatETA } from '@/services/bookingService';

interface TrainPosition {
  id: string;
  currentStationIndex: number;
  nextStationIndex: number;
  eta: number;
  status: 'running' | 'arrived' | 'departed';
  direction: 'UP' | 'DOWN';
}

export const LiveTracker = () => {
  const [selectedLine, setSelectedLine] = useState<Line>(lines[0]);
  const [direction, setDirection] = useState<'UP' | 'DOWN'>('UP');
  const [trains, setTrains] = useState<TrainPosition[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    const updateTrains = () => {
      const lineTrains = liveTrainService.getTrainsByLineAndDirection(selectedLine.id, direction);
      setTrains(lineTrains);
      setLastUpdate(new Date());
    };

    updateTrains();
    const interval = setInterval(updateTrains, 5000);

    return () => clearInterval(interval);
  }, [selectedLine, direction]);

  const stations = direction === 'UP' ? selectedLine.stations : [...selectedLine.stations].reverse();

  const getTrainAtStation = (stationIndex: number): TrainPosition | null => {
    return trains.find(t => t.currentStationIndex === stationIndex) || null;
  };

  const isTrainApproaching = (stationIndex: number): TrainPosition | null => {
    return trains.find(t => t.nextStationIndex === stationIndex && t.status === 'running') || null;
  };

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 text-primary text-sm font-medium mb-4"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            LIVE TRACKING
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-foreground mb-4"
          >
            Track Metros in Real-Time
          </motion.h2>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Controls */}
          <Card glass className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                {/* Line Selector */}
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <label className="text-sm text-muted-foreground">Line:</label>
                  <div className="relative flex-1 md:w-48">
                    <select
                      value={selectedLine.id}
                      onChange={(e) => setSelectedLine(lines.find(l => l.id === e.target.value) || lines[0])}
                      className="w-full h-10 px-4 bg-secondary border border-border rounded-lg text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {lines.map((line) => (
                        <option key={line.id} value={line.id}>
                          {line.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                {/* Direction Toggle */}
                <div className="flex items-center gap-2 bg-secondary rounded-lg p-1">
                  <button
                    onClick={() => setDirection('UP')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      direction === 'UP'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {selectedLine.stations[0].name} →
                  </button>
                  <button
                    onClick={() => setDirection('DOWN')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      direction === 'DOWN'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    ← {selectedLine.stations[selectedLine.stations.length - 1].name}
                  </button>
                </div>

                {/* Refresh */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <RefreshCw className="w-4 h-4 animate-spin-slow" />
                  <span>Updated: {lastUpdate.toLocaleTimeString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Station List with Train Positions */}
          <Card glass>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: selectedLine.color }} />
                {selectedLine.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {/* Metro Line */}
                <div className="absolute left-6 top-0 bottom-0 w-1 rounded-full" style={{ backgroundColor: selectedLine.color + '40' }} />

                {/* Stations */}
                <div className="space-y-0">
                  {stations.map((station, index) => {
                    const originalIndex = direction === 'UP' ? index : selectedLine.stations.length - 1 - index;
                    const trainHere = getTrainAtStation(originalIndex);
                    const trainApproaching = isTrainApproaching(originalIndex);
                    const isFirst = index === 0;
                    const isLast = index === stations.length - 1;

                    return (
                      <motion.div
                        key={station.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="relative pl-12 py-4"
                      >
                        {/* Station Dot */}
                        <div 
                          className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 z-10 transition-all duration-300 ${
                            trainHere 
                              ? 'bg-primary border-primary animate-pulse-glow' 
                              : isFirst || isLast
                                ? 'bg-primary/50 border-primary'
                                : 'bg-background border-border'
                          }`}
                          style={{ borderColor: selectedLine.color }}
                        />

                        {/* Train Indicator */}
                        {trainHere && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute left-1 top-1/2 -translate-y-1/2 z-20"
                          >
                            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center animate-pulse">
                              <Train className="w-5 h-5 text-primary-foreground" />
                            </div>
                          </motion.div>
                        )}

                        {/* Station Info */}
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-foreground">{station.name}</div>
                            <div className="text-sm text-muted-foreground">{station.code}</div>
                          </div>

                          {/* Status */}
                          <div className="text-right">
                            {trainHere && (
                              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                                trainHere.status === 'arrived' 
                                  ? 'bg-metro-success/20 text-metro-success' 
                                  : trainHere.status === 'departed'
                                    ? 'bg-metro-warning/20 text-metro-warning'
                                    : 'bg-primary/20 text-primary'
                              }`}>
                                <Circle className="w-2 h-2 fill-current" />
                                {trainHere.status === 'arrived' ? 'Train Here' : trainHere.status === 'departed' ? 'Departing' : 'At Platform'}
                              </span>
                            )}
                            {trainApproaching && !trainHere && (
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-accent/20 text-accent">
                                <Train className="w-3 h-3" />
                                ETA: {formatETA(trainApproaching.eta)}
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
