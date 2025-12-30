import { Train, lines } from '@/data/metroData';

// Simulated live train tracking service
class LiveTrainService {
  private trains: Train[] = [];
  private updateInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.initializeTrains();
    this.startSimulation();
  }

  private initializeTrains() {
    // Initialize one train per line per direction
    this.trains = [
      {
        id: 'train-ew-up-1',
        lineId: 'east-west',
        direction: 'UP',
        currentStationIndex: 2,
        nextStationIndex: 3,
        eta: 120,
        status: 'running',
      },
      {
        id: 'train-ew-down-1',
        lineId: 'east-west',
        direction: 'DOWN',
        currentStationIndex: 10,
        nextStationIndex: 9,
        eta: 90,
        status: 'running',
      },
      {
        id: 'train-ns-up-1',
        lineId: 'north-south',
        direction: 'UP',
        currentStationIndex: 3,
        nextStationIndex: 4,
        eta: 150,
        status: 'running',
      },
      {
        id: 'train-ns-down-1',
        lineId: 'north-south',
        direction: 'DOWN',
        currentStationIndex: 8,
        nextStationIndex: 7,
        eta: 60,
        status: 'running',
      },
    ];
  }

  private startSimulation() {
    // Update train positions every 10 seconds
    this.updateInterval = setInterval(() => {
      this.updateTrainPositions();
    }, 10000);
  }

  private updateTrainPositions() {
    this.trains = this.trains.map(train => {
      const line = lines.find(l => l.id === train.lineId);
      if (!line) return train;

      const maxIndex = line.stations.length - 1;
      let newEta = train.eta - 10;
      let newStatus = train.status;
      let newCurrentIndex = train.currentStationIndex;
      let newNextIndex = train.nextStationIndex;

      if (newEta <= 0) {
        // Train arrived at next station
        newCurrentIndex = train.nextStationIndex;
        newStatus = 'arrived';

        // After a brief stop, move to next station
        setTimeout(() => {
          this.departTrain(train.id);
        }, 3000);

        // Calculate next station based on direction
        if (train.direction === 'UP') {
          newNextIndex = Math.min(newCurrentIndex + 1, maxIndex);
          if (newCurrentIndex >= maxIndex) {
            // Reverse direction at terminal
            newNextIndex = newCurrentIndex - 1;
          }
        } else {
          newNextIndex = Math.max(newCurrentIndex - 1, 0);
          if (newCurrentIndex <= 0) {
            // Reverse direction at terminal
            newNextIndex = newCurrentIndex + 1;
          }
        }

        // Add some randomness to ETA (120-180 seconds)
        newEta = 120 + Math.floor(Math.random() * 60);
      }

      return {
        ...train,
        currentStationIndex: newCurrentIndex,
        nextStationIndex: newNextIndex,
        eta: newEta,
        status: newStatus,
      };
    });
  }

  private departTrain(trainId: string) {
    this.trains = this.trains.map(train => {
      if (train.id === trainId) {
        return { ...train, status: 'departed' as const };
      }
      return train;
    });

    // Reset to running after departure
    setTimeout(() => {
      this.trains = this.trains.map(train => {
        if (train.id === trainId) {
          return { ...train, status: 'running' as const };
        }
        return train;
      });
    }, 5000);
  }

  getTrainsByLine(lineId: string): Train[] {
    return this.trains.filter(train => train.lineId === lineId);
  }

  getTrainsByLineAndDirection(lineId: string, direction: 'UP' | 'DOWN'): Train[] {
    return this.trains.filter(train => train.lineId === lineId && train.direction === direction);
  }

  getAllTrains(): Train[] {
    return [...this.trains];
  }

  getNextTrainETA(lineId: string, stationIndex: number, direction: 'UP' | 'DOWN'): number | null {
    const trains = this.getTrainsByLineAndDirection(lineId, direction);
    
    for (const train of trains) {
      if (direction === 'UP' && train.currentStationIndex < stationIndex) {
        const stationsAway = stationIndex - train.currentStationIndex;
        return train.eta + (stationsAway - 1) * 180; // ~3 min per station
      }
      if (direction === 'DOWN' && train.currentStationIndex > stationIndex) {
        const stationsAway = train.currentStationIndex - stationIndex;
        return train.eta + (stationsAway - 1) * 180;
      }
    }
    
    return null;
  }

  destroy() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }
}

// Singleton instance
export const liveTrainService = new LiveTrainService();
