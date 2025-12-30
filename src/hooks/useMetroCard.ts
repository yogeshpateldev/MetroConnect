import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface MetroCard {
  id: string;
  card_number: string;
  balance: number;
  is_active: boolean;
  auto_reload: boolean;
  auto_reload_amount: number;
  auto_reload_threshold: number;
}

export const useMetroCard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [card, setCard] = useState<MetroCard | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCard = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('metro_cards')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setCard({
          id: data.id,
          card_number: data.card_number,
          balance: Number(data.balance),
          is_active: data.is_active,
          auto_reload: data.auto_reload,
          auto_reload_amount: Number(data.auto_reload_amount),
          auto_reload_threshold: Number(data.auto_reload_threshold),
        });
      }
    } catch (error) {
      console.error('Error fetching metro card:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCard();
  }, [fetchCard]);

  const addBalance = async (amount: number) => {
    if (!card) return { success: false };

    try {
      const newBalance = card.balance + amount;
      const { error } = await supabase
        .from('metro_cards')
        .update({ balance: newBalance })
        .eq('id', card.id);

      if (error) throw error;

      setCard({ ...card, balance: newBalance });
      toast({
        title: 'Card Recharged!',
        description: `₹${amount} added to your Metro Card.`,
      });

      return { success: true };
    } catch (error) {
      console.error('Error adding balance:', error);
      toast({
        title: 'Recharge Failed',
        description: 'Could not recharge card. Please try again.',
        variant: 'destructive',
      });
      return { success: false };
    }
  };

  const deductBalance = async (amount: number) => {
    if (!card) return { success: false };
    if (card.balance < amount) {
      // Check auto reload
      if (card.auto_reload && card.balance < card.auto_reload_threshold) {
        await addBalance(card.auto_reload_amount);
      } else {
        toast({
          title: 'Insufficient Card Balance',
          description: 'Please recharge your Metro Card.',
          variant: 'destructive',
        });
        return { success: false };
      }
    }

    try {
      const newBalance = card.balance - amount;
      const { error } = await supabase
        .from('metro_cards')
        .update({ balance: newBalance })
        .eq('id', card.id);

      if (error) throw error;

      setCard({ ...card, balance: newBalance });
      return { success: true };
    } catch (error) {
      console.error('Error deducting balance:', error);
      return { success: false };
    }
  };

  const updateAutoReload = async (enabled: boolean, amount?: number, threshold?: number) => {
    if (!card) return { success: false };

    try {
      const updates: Partial<MetroCard> = { auto_reload: enabled };
      if (amount !== undefined) updates.auto_reload_amount = amount;
      if (threshold !== undefined) updates.auto_reload_threshold = threshold;

      const { error } = await supabase
        .from('metro_cards')
        .update(updates)
        .eq('id', card.id);

      if (error) throw error;

      setCard({ ...card, ...updates });
      toast({
        title: enabled ? 'Auto-Reload Enabled' : 'Auto-Reload Disabled',
        description: enabled 
          ? `Card will auto-reload ₹${amount || card.auto_reload_amount} when balance falls below ₹${threshold || card.auto_reload_threshold}`
          : 'Auto-reload has been turned off.',
      });

      return { success: true };
    } catch (error) {
      console.error('Error updating auto reload:', error);
      return { success: false };
    }
  };

  const toggleActive = async () => {
    if (!card) return { success: false };

    try {
      const { error } = await supabase
        .from('metro_cards')
        .update({ is_active: !card.is_active })
        .eq('id', card.id);

      if (error) throw error;

      setCard({ ...card, is_active: !card.is_active });
      toast({
        title: card.is_active ? 'Card Deactivated' : 'Card Activated',
        description: card.is_active 
          ? 'Your Metro Card has been temporarily deactivated.'
          : 'Your Metro Card is now active.',
      });

      return { success: true };
    } catch (error) {
      console.error('Error toggling card:', error);
      return { success: false };
    }
  };

  return {
    card,
    loading,
    addBalance,
    deductBalance,
    updateAutoReload,
    toggleActive,
    refetch: fetchCard,
  };
};
