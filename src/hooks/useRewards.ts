import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface UserRewards {
  id: string;
  total_rides: number;
  total_distance: number;
  current_milestone: number;
  points: number;
}

interface Redemption {
  id: string;
  reward_type: 'wallet_credit' | 'card_discount' | 'voucher';
  points_used: number;
  value: number;
  description: string | null;
  redeemed_at: string;
}

export const MILESTONES = [
  { rides: 10, points: 50, reward: '₹25 wallet credit' },
  { rides: 25, points: 150, reward: '₹75 wallet credit' },
  { rides: 50, points: 350, reward: '₹150 wallet credit' },
  { rides: 100, points: 800, reward: '₹400 wallet credit' },
  { rides: 200, points: 1800, reward: '₹900 wallet credit' },
];

export const REWARD_OPTIONS = [
  { type: 'wallet_credit' as const, points: 100, value: 50, description: '₹50 Wallet Credit' },
  { type: 'wallet_credit' as const, points: 200, value: 100, description: '₹100 Wallet Credit' },
  { type: 'card_discount' as const, points: 150, value: 10, description: '10% Metro Card Discount' },
  { type: 'voucher' as const, points: 250, value: 100, description: '₹100 Shopping Voucher' },
];

export const useRewards = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [rewards, setRewards] = useState<UserRewards | null>(null);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRewards = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_rewards')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setRewards({
          id: data.id,
          total_rides: data.total_rides,
          total_distance: Number(data.total_distance),
          current_milestone: data.current_milestone,
          points: data.points,
        });
      }
    } catch (error) {
      console.error('Error fetching rewards:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchRedemptions = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('reward_redemptions')
        .select('*')
        .eq('user_id', user.id)
        .order('redeemed_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setRedemptions(data?.map(r => ({
        ...r,
        value: Number(r.value),
        reward_type: r.reward_type as 'wallet_credit' | 'card_discount' | 'voucher'
      })) || []);
    } catch (error) {
      console.error('Error fetching redemptions:', error);
    }
  }, [user]);

  useEffect(() => {
    fetchRewards();
    fetchRedemptions();
  }, [fetchRewards, fetchRedemptions]);

  const addRide = async (distance: number) => {
    if (!rewards || !user) return { success: false };

    try {
      const newRides = rewards.total_rides + 1;
      const newDistance = rewards.total_distance + distance;
      const pointsEarned = Math.floor(distance * 2); // 2 points per km
      const newPoints = rewards.points + pointsEarned;

      // Check for milestone completion
      let newMilestone = rewards.current_milestone;
      const nextMilestone = MILESTONES.find(m => m.rides > rewards.current_milestone && newRides >= m.rides);
      
      if (nextMilestone) {
        newMilestone = nextMilestone.rides;
        toast({
          title: '🎉 Milestone Reached!',
          description: `You completed ${nextMilestone.rides} rides! Earned ${nextMilestone.points} bonus points.`,
        });
      }

      const { error } = await supabase
        .from('user_rewards')
        .update({
          total_rides: newRides,
          total_distance: newDistance,
          points: newPoints + (nextMilestone ? nextMilestone.points : 0),
          current_milestone: newMilestone,
        })
        .eq('id', rewards.id);

      if (error) throw error;

      await fetchRewards();
      return { success: true, pointsEarned };
    } catch (error) {
      console.error('Error adding ride:', error);
      return { success: false };
    }
  };

  const redeemReward = async (rewardType: 'wallet_credit' | 'card_discount' | 'voucher', points: number, value: number, description: string) => {
    if (!rewards || !user) return { success: false };
    if (rewards.points < points) {
      toast({
        title: 'Insufficient Points',
        description: 'You need more points to redeem this reward.',
        variant: 'destructive',
      });
      return { success: false };
    }

    try {
      // Create redemption record
      const { error: redemptionError } = await supabase
        .from('reward_redemptions')
        .insert({
          user_id: user.id,
          reward_type: rewardType,
          points_used: points,
          value,
          description,
        });

      if (redemptionError) throw redemptionError;

      // Deduct points
      const { error: updateError } = await supabase
        .from('user_rewards')
        .update({ points: rewards.points - points })
        .eq('id', rewards.id);

      if (updateError) throw updateError;

      toast({
        title: 'Reward Redeemed!',
        description: `You redeemed ${description}`,
      });

      await fetchRewards();
      await fetchRedemptions();
      return { success: true };
    } catch (error) {
      console.error('Error redeeming reward:', error);
      toast({
        title: 'Redemption Failed',
        description: 'Could not redeem reward. Please try again.',
        variant: 'destructive',
      });
      return { success: false };
    }
  };

  const getNextMilestone = () => {
    if (!rewards) return MILESTONES[0];
    return MILESTONES.find(m => m.rides > rewards.total_rides) || MILESTONES[MILESTONES.length - 1];
  };

  const getMilestoneProgress = () => {
    if (!rewards) return 0;
    const next = getNextMilestone();
    const prevMilestones = MILESTONES.filter(m => m.rides <= rewards.total_rides);
    const prev = prevMilestones.length > 0 ? prevMilestones[prevMilestones.length - 1] : null;
    const start = prev?.rides || 0;
    return ((rewards.total_rides - start) / (next.rides - start)) * 100;
  };

  return {
    rewards,
    redemptions,
    loading,
    addRide,
    redeemReward,
    getNextMilestone,
    getMilestoneProgress,
    refetch: fetchRewards,
  };
};
