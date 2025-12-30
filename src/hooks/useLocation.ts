import { useState, useCallback } from 'react';
import { getAllStations } from '@/data/metroData';

interface Location {
  latitude: number;
  longitude: number;
}

interface NearestStation {
  id: string;
  name: string;
  distance: number;
  isWithinRange: boolean;
}

// Station coordinates (approximate for Ahmedabad-Gandhinagar metro)
const STATION_COORDS: Record<string, { lat: number; lng: number }> = {
  'apmc': { lat: 22.9949, lng: 72.6051 },
  'vastral': { lat: 23.0126, lng: 72.6597 },
  'nirant-cross-road': { lat: 23.0198, lng: 72.6432 },
  'rabari-colony': { lat: 23.0279, lng: 72.6289 },
  'amraiwadi': { lat: 23.0340, lng: 72.6150 },
  'apparel-park': { lat: 23.0412, lng: 72.5998 },
  'stadium': { lat: 23.0489, lng: 72.5841 },
  'old-high-court': { lat: 23.0289, lng: 72.5681 },
  'shahpur': { lat: 23.0312, lng: 72.5801 },
  'gheekanta': { lat: 23.0265, lng: 72.5752 },
  'kalupur': { lat: 23.0278, lng: 72.6012 },
  'kankaria-east': { lat: 23.0089, lng: 72.6001 },
  'thaltej-gam': { lat: 23.0512, lng: 72.5121 },
  'doordarshan-kendra': { lat: 23.0589, lng: 72.5298 },
  'gurukul': { lat: 23.0398, lng: 72.5412 },
  'gujarat-university': { lat: 23.0356, lng: 72.5521 },
  'commerce-six-roads': { lat: 23.0312, lng: 72.5601 },
  'sola': { lat: 23.0712, lng: 72.5198 },
  'gandhinagar': { lat: 23.2156, lng: 72.6369 },
  'gift-city': { lat: 23.1698, lng: 72.6812 },
  'motera-stadium': { lat: 23.0989, lng: 72.5521 },
  'sabarmati': { lat: 23.0712, lng: 72.5512 },
};

const TICKET_PURCHASE_RADIUS_KM = 2;

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const useLocation = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [nearestStation, setNearestStation] = useState<NearestStation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const findNearestStation = useCallback((userLat: number, userLng: number) => {
    let nearest: NearestStation | null = null;
    let minDistance = Infinity;
    const allStations = getAllStations();

    allStations.forEach(station => {
      const coords = STATION_COORDS[station.id];
      if (coords) {
        const distance = calculateDistance(userLat, userLng, coords.lat, coords.lng);
        if (distance < minDistance) {
          minDistance = distance;
          nearest = {
            id: station.id,
            name: station.name,
            distance: Math.round(distance * 100) / 100,
            isWithinRange: distance <= TICKET_PURCHASE_RADIUS_KM,
          };
        }
      }
    });

    return nearest;
  }, []);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        const nearest = findNearestStation(latitude, longitude);
        setNearestStation(nearest);
        setLoading(false);
        setPermissionDenied(false);
      },
      (err) => {
        setLoading(false);
        if (err.code === err.PERMISSION_DENIED) {
          setPermissionDenied(true);
          setError('Location access denied. Please enable location services.');
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setError('Location information unavailable.');
        } else {
          setError('Unable to get your location.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, [findNearestStation]);

  const canPurchaseTicket = useCallback(() => {
    if (!nearestStation) return { allowed: false, reason: 'Location not available' };
    if (!nearestStation.isWithinRange) {
      return { 
        allowed: false, 
        reason: `You are ${nearestStation.distance.toFixed(1)} km from the nearest station (${nearestStation.name}). Ticket purchase is only available within ${TICKET_PURCHASE_RADIUS_KM} km of a station.` 
      };
    }
    return { allowed: true, reason: '' };
  }, [nearestStation]);

  // Simulate location for demo (in a real app, this would be removed)
  const simulateLocation = useCallback((stationId: string) => {
    const coords = STATION_COORDS[stationId];
    if (coords) {
      // Add small offset to simulate being near the station
      const latitude = coords.lat + (Math.random() - 0.5) * 0.01;
      const longitude = coords.lng + (Math.random() - 0.5) * 0.01;
      setLocation({ latitude, longitude });
      const nearest = findNearestStation(latitude, longitude);
      setNearestStation(nearest);
    }
  }, [findNearestStation]);

  return {
    location,
    nearestStation,
    loading,
    error,
    permissionDenied,
    requestLocation,
    canPurchaseTicket,
    simulateLocation,
    TICKET_PURCHASE_RADIUS_KM,
  };
};
