import { Booking, Route, Station, calculateFare, calculateDuration, lines } from '@/data/metroData';

// Local storage keys
const BOOKINGS_KEY = 'metroconnect_bookings';
const USER_KEY = 'metroconnect_user';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

// User management
export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const setCurrentUser = (user: User) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const logoutUser = () => {
  localStorage.removeItem(USER_KEY);
};

// Generate unique ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
};

// Find route between two stations
export const findRoute = (fromId: string, toId: string): Route | null => {
  for (const line of lines) {
    const fromStation = line.stations.find(s => s.id === fromId);
    const toStation = line.stations.find(s => s.id === toId);

    if (fromStation && toStation) {
      const stationCount = Math.abs(toStation.index - fromStation.index);
      return {
        id: `${fromId}-${toId}`,
        from: fromStation,
        to: toStation,
        line,
        duration: calculateDuration(stationCount),
        fare: calculateFare(stationCount),
        distance: stationCount * 1.2, // ~1.2 km per station
      };
    }
  }
  return null;
};

// Booking management
export const getBookings = (): Booking[] => {
  const bookings = localStorage.getItem(BOOKINGS_KEY);
  return bookings ? JSON.parse(bookings) : [];
};

export const createBooking = (route: Route, departureTime: string): Booking => {
  const user = getCurrentUser();
  const booking: Booking = {
    id: generateId(),
    userId: user?.id || 'guest',
    route,
    departureTime,
    bookingTime: new Date().toISOString(),
    status: 'confirmed',
    qrCode: `MC-${generateId().toUpperCase()}`,
  };

  const bookings = getBookings();
  bookings.push(booking);
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));

  return booking;
};

export const getBookingById = (bookingId: string): Booking | null => {
  const bookings = getBookings();
  return bookings.find(b => b.id === bookingId) || null;
};

export const getUserBookings = (): Booking[] => {
  const user = getCurrentUser();
  if (!user) return [];
  return getBookings().filter(b => b.userId === user.id);
};

// Format time helpers
export const formatETA = (seconds: number): string => {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (remainingSeconds === 0) return `${minutes} min`;
  return `${minutes}m ${remainingSeconds}s`;
};

export const formatDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
};
