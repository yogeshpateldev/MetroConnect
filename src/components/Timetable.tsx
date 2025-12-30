import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, ChevronDown, Train, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { lines, Line, generateTimetable } from '@/data/metroData';

export const Timetable = () => {
  const [selectedLine, setSelectedLine] = useState<Line>(lines[0]);
  const [selectedStation, setSelectedStation] = useState(lines[0].stations[0].id);

  const timetable = generateTimetable(selectedLine.id);
  const station = selectedLine.stations.find(s => s.id === selectedStation);

  // Group times by hour
  const groupedTimes: Record<string, string[]> = {};
  timetable.forEach(time => {
    const hour = time.split(':')[0];
    if (!groupedTimes[hour]) {
      groupedTimes[hour] = [];
    }
    groupedTimes[hour].push(time);
  });

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
            TIMETABLE
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-foreground mb-4"
          >
            Metro Schedule
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            View complete metro timings for all stations. First train at 06:00, last train at 22:00.
          </motion.p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Controls */}
          <Card glass className="mb-8">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-4">
                {/* Line Selector */}
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Select Line
                  </label>
                  <div className="relative">
                    <select
                      value={selectedLine.id}
                      onChange={(e) => {
                        const line = lines.find(l => l.id === e.target.value) || lines[0];
                        setSelectedLine(line);
                        setSelectedStation(line.stations[0].id);
                      }}
                      className="w-full h-12 px-4 bg-secondary border border-border rounded-lg text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary"
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

                {/* Station Selector */}
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Select Station
                  </label>
                  <div className="relative">
                    <select
                      value={selectedStation}
                      onChange={(e) => setSelectedStation(e.target.value)}
                      className="w-full h-12 px-4 bg-secondary border border-border rounded-lg text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {selectedLine.stations.map((station) => (
                        <option key={station.id} value={station.id}>
                          {station.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Station Info */}
          {station && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card glass className="mb-8">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Train className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground">{station.name}</h3>
                        <p className="text-muted-foreground">{station.code} • {selectedLine.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">First Train</div>
                        <div className="text-lg font-bold text-metro-success">06:00</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">Last Train</div>
                        <div className="text-lg font-bold text-destructive">22:00</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Timetable Grid */}
              <Card glass>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Departure Times
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(groupedTimes).map(([hour, times]) => (
                      <div key={hour} className="flex gap-4">
                        <div className="w-16 py-2 text-center bg-primary/10 rounded-lg font-bold text-primary">
                          {hour}:00
                        </div>
                        <div className="flex-1 flex flex-wrap gap-2">
                          {times.map((time) => (
                            <span
                              key={time}
                              className="px-3 py-2 bg-secondary rounded-lg text-sm text-foreground hover:bg-primary/20 transition-colors cursor-default"
                            >
                              {time}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 p-4 rounded-xl bg-secondary/50">
                    <p className="text-sm text-muted-foreground">
                      <span className="text-primary font-medium">Note:</span> Trains run every 10 minutes during peak hours. 
                      Times may vary slightly due to operational requirements.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};
