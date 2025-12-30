import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Booking {
  id: string;
  from_station: string;
  to_station: string;
  line: string;
  departure_time: string;
  fare: number;
  distance: number | null;
  duration: number | null;
  booking_date: string;
  status: 'confirmed' | 'used' | 'expired' | 'cancelled';
  qr_code: string | null;
  payment_method: string | null;
}

export const useBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data?.map(b => ({
        ...b,
        fare: Number(b.fare),
        distance: b.distance ? Number(b.distance) : null,
        status: b.status as Booking['status'],
      })) || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const createBooking = async (bookingData: Omit<Booking, 'id' | 'booking_date' | 'status' | 'qr_code'>) => {
    if (!user) return { success: false, booking: null };

    try {
      const qrCode = `MC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          from_station: bookingData.from_station,
          to_station: bookingData.to_station,
          line: bookingData.line,
          departure_time: bookingData.departure_time,
          fare: bookingData.fare,
          distance: bookingData.distance,
          duration: bookingData.duration,
          payment_method: bookingData.payment_method,
          qr_code: qrCode,
        })
        .select()
        .single();

      if (error) throw error;

      await fetchBookings();
      return { success: true, booking: data };
    } catch (error) {
      console.error('Error creating booking:', error);
      return { success: false, booking: null };
    }
  };

  const cancelBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);

      if (error) throw error;

      await fetchBookings();
      return { success: true };
    } catch (error) {
      console.error('Error cancelling booking:', error);
      return { success: false };
    }
  };

  return {
    bookings,
    loading,
    createBooking,
    cancelBooking,
    refetch: fetchBookings,
  };
};
