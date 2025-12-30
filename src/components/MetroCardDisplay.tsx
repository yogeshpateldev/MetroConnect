import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, RefreshCw, Power, Wifi, Shield, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useMetroCard } from '@/hooks/useMetroCard';
import { useWallet } from '@/hooks/useWallet';

export const MetroCardDisplay = () => {
  const { card, loading, addBalance, updateAutoReload, toggleActive } = useMetroCard();
  const { wallet, deductFunds } = useWallet();
  const [isRechargeOpen, setIsRechargeOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState('100');
  const [isRecharging, setIsRecharging] = useState(false);
  const [autoReloadAmount, setAutoReloadAmount] = useState(card?.auto_reload_amount?.toString() || '100');
  const [autoReloadThreshold, setAutoReloadThreshold] = useState(card?.auto_reload_threshold?.toString() || '20');

  const handleRecharge = async () => {
    const amount = parseFloat(rechargeAmount);
    if (isNaN(amount) || amount <= 0) return;

    setIsRecharging(true);
    
    // Deduct from wallet first
    const { success: walletSuccess } = await deductFunds(amount, 'Metro Card Recharge');
    if (walletSuccess) {
      await addBalance(amount);
    }
    
    setIsRecharging(false);
    setIsRechargeOpen(false);
  };

  const handleSaveSettings = async () => {
    const amount = parseFloat(autoReloadAmount);
    const threshold = parseFloat(autoReloadThreshold);
    await updateAutoReload(card?.auto_reload || false, amount, threshold);
    setIsSettingsOpen(false);
  };

  if (loading) {
    return (
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-40 bg-muted rounded-xl" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <CardTitle>Metro e-Card</CardTitle>
              <CardDescription>Your digital transit pass</CardDescription>
            </div>
          </div>
          <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card">
              <DialogHeader>
                <DialogTitle>Card Settings</DialogTitle>
                <DialogDescription>Manage your Metro e-Card settings</DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Auto-Reload</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically recharge when balance is low
                    </p>
                  </div>
                  <Switch
                    checked={card?.auto_reload}
                    onCheckedChange={(checked) => updateAutoReload(checked)}
                  />
                </div>

                {card?.auto_reload && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-4 pl-4 border-l-2 border-primary/30"
                  >
                    <div className="space-y-2">
                      <Label>Reload Amount</Label>
                      <Input
                        type="number"
                        value={autoReloadAmount}
                        onChange={(e) => setAutoReloadAmount(e.target.value)}
                        placeholder="100"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Reload when balance below</Label>
                      <Input
                        type="number"
                        value={autoReloadThreshold}
                        onChange={(e) => setAutoReloadThreshold(e.target.value)}
                        placeholder="20"
                      />
                    </div>
                    <Button onClick={handleSaveSettings} className="w-full">
                      Save Settings
                    </Button>
                  </motion.div>
                )}

                <div className="pt-4 border-t border-border">
                  <Button
                    variant={card?.is_active ? 'destructive' : 'default'}
                    className="w-full"
                    onClick={toggleActive}
                  >
                    <Power className="w-4 h-4 mr-2" />
                    {card?.is_active ? 'Deactivate Card' : 'Activate Card'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Virtual Card */}
        <motion.div
          initial={{ rotateY: -10 }}
          animate={{ rotateY: 0 }}
          className="relative aspect-[1.6/1] rounded-2xl overflow-hidden"
          style={{ perspective: '1000px' }}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${
            card?.is_active 
              ? 'from-primary via-primary/80 to-accent' 
              : 'from-gray-600 to-gray-800'
          }`} />
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-4 w-20 h-20 border border-white/50 rounded-full" />
            <div className="absolute bottom-4 right-4 w-32 h-32 border border-white/50 rounded-full" />
          </div>
          <div className="relative h-full p-6 flex flex-col justify-between text-primary-foreground">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wifi className="w-5 h-5" />
                <span className="text-sm font-medium">
                  {card?.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <p className="text-lg font-mono tracking-wider mb-2">
                {card?.card_number || 'MC00000000000000'}
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs opacity-70">Balance</p>
                  <p className="text-2xl font-bold">₹{card?.balance.toFixed(2) || '0.00'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">MetroConnect</p>
                  <p className="text-xs opacity-70">e-Card</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div className="flex gap-3">
          <Dialog open={isRechargeOpen} onOpenChange={setIsRechargeOpen}>
            <DialogTrigger asChild>
              <Button variant="hero" className="flex-1">
                <RefreshCw className="w-4 h-4 mr-2" />
                Recharge
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card">
              <DialogHeader>
                <DialogTitle>Recharge Metro Card</DialogTitle>
                <DialogDescription>
                  Wallet Balance: ₹{wallet?.balance.toFixed(2) || '0.00'}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-4 gap-2">
                  {[50, 100, 200, 500].map((amt) => (
                    <Button
                      key={amt}
                      variant={rechargeAmount === String(amt) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setRechargeAmount(String(amt))}
                    >
                      ₹{amt}
                    </Button>
                  ))}
                </div>
                <div className="space-y-2">
                  <Label>Custom Amount</Label>
                  <Input
                    type="number"
                    value={rechargeAmount}
                    onChange={(e) => setRechargeAmount(e.target.value)}
                    placeholder="Enter amount"
                  />
                </div>
                <Button
                  className="w-full"
                  variant="hero"
                  disabled={!rechargeAmount || parseFloat(rechargeAmount) <= 0 || isRecharging || (wallet?.balance || 0) < parseFloat(rechargeAmount)}
                  onClick={handleRecharge}
                >
                  {isRecharging ? 'Processing...' : `Recharge ₹${rechargeAmount}`}
                </Button>
                {(wallet?.balance || 0) < parseFloat(rechargeAmount) && (
                  <p className="text-sm text-destructive text-center">
                    Insufficient wallet balance
                  </p>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Auto-reload Status */}
        {card?.auto_reload && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground p-3 rounded-lg bg-secondary/30">
            <RefreshCw className="w-4 h-4 text-primary" />
            <span>
              Auto-reload: ₹{card.auto_reload_amount} when below ₹{card.auto_reload_threshold}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
