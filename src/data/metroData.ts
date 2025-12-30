// Ahmedabad-Gandhinagar Metro Data
export interface Station {
  id: string;
  name: string;
  code: string;
  lineId: string;
  index: number;
  lat: number;
  lng: number;
}

export interface Line {
  id: string;
  name: string;
  color: string;
  stations: Station[];
}

export interface Route {
  id: string;
  from: Station;
  to: Station;
  line: Line;
  duration: number; // in minutes
  fare: number;
  distance: number; // in km
}

export interface Train {
  id: string;
  lineId: string;
  direction: 'UP' | 'DOWN';
  currentStationIndex: number;
  nextStationIndex: number;
  eta: number; // seconds to next station
  status: 'running' | 'arrived' | 'departed';
}

export interface Booking {
  id: string;
  userId: string;
  route: Route;
  departureTime: string;
  bookingTime: string;
  status: 'confirmed' | 'used' | 'expired';
  qrCode: string;
}

// East-West Line Stations
export const eastWestStations: Station[] = [
  { id: 'ew1', name: 'APMC', code: 'APMC', lineId: 'east-west', index: 0, lat: 23.0045, lng: 72.5945 },
  { id: 'ew2', name: 'Vastral Gam', code: 'VST', lineId: 'east-west', index: 1, lat: 23.0125, lng: 72.6012 },
  { id: 'ew3', name: 'Nirant Cross Road', code: 'NCR', lineId: 'east-west', index: 2, lat: 23.0198, lng: 72.5912 },
  { id: 'ew4', name: 'Rabari Colony', code: 'RBC', lineId: 'east-west', index: 3, lat: 23.0245, lng: 72.5845 },
  { id: 'ew5', name: 'Amraiwadi', code: 'AMR', lineId: 'east-west', index: 4, lat: 23.0312, lng: 72.5778 },
  { id: 'ew6', name: 'Apparel Park', code: 'APP', lineId: 'east-west', index: 5, lat: 23.0378, lng: 72.5712 },
  { id: 'ew7', name: 'Kalupur Railway Station', code: 'KRS', lineId: 'east-west', index: 6, lat: 23.0423, lng: 72.5645 },
  { id: 'ew8', name: 'Gheekanta', code: 'GHK', lineId: 'east-west', index: 7, lat: 23.0312, lng: 72.5578 },
  { id: 'ew9', name: 'Old High Court', code: 'OHC', lineId: 'east-west', index: 8, lat: 23.0245, lng: 72.5512 },
  { id: 'ew10', name: 'Shahpur', code: 'SHP', lineId: 'east-west', index: 9, lat: 23.0178, lng: 72.5445 },
  { id: 'ew11', name: 'Vijay Nagar', code: 'VJN', lineId: 'east-west', index: 10, lat: 23.0112, lng: 72.5378 },
  { id: 'ew12', name: 'Usmanpura', code: 'USM', lineId: 'east-west', index: 11, lat: 23.0045, lng: 72.5312 },
  { id: 'ew13', name: 'Vadaj', code: 'VDJ', lineId: 'east-west', index: 12, lat: 22.9978, lng: 72.5245 },
  { id: 'ew14', name: 'Ranip', code: 'RNP', lineId: 'east-west', index: 13, lat: 22.9912, lng: 72.5178 },
  { id: 'ew15', name: 'Thaltej Gam', code: 'TLG', lineId: 'east-west', index: 14, lat: 22.9845, lng: 72.5112 },
];

// North-South Line Stations (Ahmedabad to Gandhinagar)
export const northSouthStations: Station[] = [
  { id: 'ns1', name: 'Motera Stadium', code: 'MTR', lineId: 'north-south', index: 0, lat: 23.0912, lng: 72.5245 },
  { id: 'ns2', name: 'Sabarmati', code: 'SBR', lineId: 'north-south', index: 1, lat: 23.0845, lng: 72.5312 },
  { id: 'ns3', name: 'Ranip', code: 'RNP', lineId: 'north-south', index: 2, lat: 22.9912, lng: 72.5178 },
  { id: 'ns4', name: 'Gujarat University', code: 'GJU', lineId: 'north-south', index: 3, lat: 23.0378, lng: 72.5445 },
  { id: 'ns5', name: 'Commerce Six Roads', code: 'CSR', lineId: 'north-south', index: 4, lat: 23.0312, lng: 72.5512 },
  { id: 'ns6', name: 'Stadium', code: 'STD', lineId: 'north-south', index: 5, lat: 23.0245, lng: 72.5578 },
  { id: 'ns7', name: 'Old High Court', code: 'OHC', lineId: 'north-south', index: 6, lat: 23.0245, lng: 72.5512 },
  { id: 'ns8', name: 'Kankaria East', code: 'KRE', lineId: 'north-south', index: 7, lat: 23.0045, lng: 72.6012 },
  { id: 'ns9', name: 'Maninagar', code: 'MNG', lineId: 'north-south', index: 8, lat: 22.9978, lng: 72.6078 },
  { id: 'ns10', name: 'Doordarshan Kendra', code: 'DDK', lineId: 'north-south', index: 9, lat: 23.1045, lng: 72.5378 },
  { id: 'ns11', name: 'GNLU', code: 'GNL', lineId: 'north-south', index: 10, lat: 23.1178, lng: 72.5445 },
  { id: 'ns12', name: 'Infocity', code: 'IFC', lineId: 'north-south', index: 11, lat: 23.1312, lng: 72.5512 },
  { id: 'ns13', name: 'GIFT City', code: 'GFT', lineId: 'north-south', index: 12, lat: 23.1445, lng: 72.5578 },
];

export const lines: Line[] = [
  {
    id: 'east-west',
    name: 'East-West Line',
    color: '#0ea5e9',
    stations: eastWestStations,
  },
  {
    id: 'north-south',
    name: 'North-South Line',
    color: '#22c55e',
    stations: northSouthStations,
  },
];

export const getAllStations = (): Station[] => {
  return [...eastWestStations, ...northSouthStations];
};

export const getLineById = (lineId: string): Line | undefined => {
  return lines.find(line => line.id === lineId);
};

export const getStationById = (stationId: string): Station | undefined => {
  return getAllStations().find(station => station.id === stationId);
};

export const calculateFare = (stationCount: number): number => {
  if (stationCount <= 2) return 10;
  if (stationCount <= 5) return 20;
  if (stationCount <= 8) return 30;
  if (stationCount <= 12) return 40;
  return 50;
};

export const calculateDuration = (stationCount: number): number => {
  return stationCount * 3; // ~3 minutes per station
};

// Generate timetable
export const generateTimetable = (lineId: string): string[] => {
  const times: string[] = [];
  const startHour = 6;
  const endHour = 22;
  const frequency = 10; // minutes

  for (let hour = startHour; hour <= endHour; hour++) {
    for (let min = 0; min < 60; min += frequency) {
      const time = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
      times.push(time);
    }
  }
  return times;
};
