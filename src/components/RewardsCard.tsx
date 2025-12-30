import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Gift, TrendingUp, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useRewards, MILESTONES, REWARD_OPTIONS } from '@/hooks/useRewards';

export const RewardsCard = () => {
  const { rewards, loading, redeemReward, getNextMilestone, getMilestoneProgress } = useRewards();
  const [isRedeemOpen, setIsRedeemOpen] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);

  const nextMilestone = getNextMilestone();
  const progress = getMilestoneProgress();

  const handleRedeem = async (option: typeof REWARD_OPTIONS[0]) => {
    setIsRedeeming(true);
    const { success } = await redeemReward(option.type, option.points, option.value, option.description);
    setIsRedeeming(false);
    if (success) {
      setIsRedeemOpen(false);
    }
  };

  if (loading) {
    return (
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3" />
            <div className="h-4 bg-muted rounded w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-orange-500/10 pointer-events-none" />
      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <CardTitle>Metro Rewards</CardTitle>
              <CardDescription>Earn points with every ride</CardDescription>
            </div>
          </div>
          <Dialog open={isRedeemOpen} onOpenChange={setIsRedeemOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Gift className="w-4 h-4 mr-2" />
                Redeem
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card max-w-md">
              <DialogHeader>
                <DialogTitle>Redeem Rewards</DialogTitle>
                <DialogDescription>
                  You have {rewards?.points || 0} points available
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 py-4">
                {REWARD_OPTIONS.map((option) => (
                  <motion.div
                    key={option.description}
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-xl border transition-all ${
                      (rewards?.points || 0) >= option.points
                        ? 'border-primary/50 bg-primary/5 cursor-pointer'
                        : 'border-border/50 opacity-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Sparkles className="w-5 h-5 text-yellow-500" />
                        <div>
                          <p className="font-medium">{option.description}</p>
                          <p className="text-sm text-muted-foreground">{option.points} points</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        disabled={(rewards?.points || 0) < option.points || isRedeeming}
                        onClick={() => handleRedeem(option)}
                      >
                        Redeem
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="relative space-y-6">
        {/* Points Display */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10">
          <div className="flex items-center gap-3">
            <Star className="w-8 h-8 text-yellow-500" />
            <div>
              <p className="text-3xl font-bold">{rewards?.points || 0}</p>
              <p className="text-sm text-muted-foreground">Total Points</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{rewards?.total_rides || 0}</p>
            <p className="text-sm text-muted-foreground">Total Rides</p>
          </div>
        </div>

        {/* Milestone Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Next Milestone</span>
            <span className="font-medium flex items-center gap-1">
              <Trophy className="w-4 h-4 text-yellow-500" />
              {nextMilestone.rides} rides - {nextMilestone.reward}
            </span>
          </div>
          <Progress value={progress} className="h-3" />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{rewards?.total_rides || 0} rides</span>
            <span>{nextMilestone.rides} rides</span>
          </div>
        </div>

        {/* Milestones Grid */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Milestones
          </h4>
          <div className="grid gap-2">
            {MILESTONES.slice(0, 3).map((milestone) => {
              const isCompleted = (rewards?.total_rides || 0) >= milestone.rides;
              return (
                <div
                  key={milestone.rides}
                  className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                    isCompleted ? 'bg-green-500/10' : 'bg-secondary/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      isCompleted ? 'bg-green-500' : 'bg-muted'
                    }`}>
                      {isCompleted ? (
                        <Star className="w-4 h-4 text-white" />
                      ) : (
                        <span className="text-xs">{milestone.rides}</span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{milestone.rides} Rides</p>
                      <p className="text-xs text-muted-foreground">{milestone.reward}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">+{milestone.points} pts</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
