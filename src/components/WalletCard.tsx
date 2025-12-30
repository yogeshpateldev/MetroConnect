import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Plus, CreditCard, Smartphone, ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useWallet } from '@/hooks/useWallet';
import { format } from 'date-fns';

const paymentMethods = [
  { id: 'card', label: 'Credit/Debit Card', icon: CreditCard },
  { id: 'upi', label: 'UPI', icon: Smartphone },
];

const quickAmounts = [100, 200, 500, 1000];

export const WalletCard = () => {
  const { wallet, transactions, loading, addFunds } = useWallet();
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAddFunds = async () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    setIsProcessing(true);
    const { success } = await addFunds(numAmount, paymentMethod);
    setIsProcessing(false);

    if (success) {
      setIsOpen(false);
      setAmount('');
    }
  };

  if (loading) {
    return (
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3" />
            <div className="h-12 bg-muted rounded w-1/2" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/10 pointer-events-none" />
      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <Wallet className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle>Metro Wallet</CardTitle>
              <CardDescription>Your digital payment wallet</CardDescription>
            </div>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="hero" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Funds
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card">
              <DialogHeader>
                <DialogTitle>Add Funds to Wallet</DialogTitle>
                <DialogDescription>Choose amount and payment method</DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="space-y-3">
                  <Label>Quick Select</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {quickAmounts.map((amt) => (
                      <Button
                        key={amt}
                        variant={amount === String(amt) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setAmount(String(amt))}
                      >
                        ₹{amt}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Custom Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min={1}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Payment Method</Label>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    {paymentMethods.map((method) => (
                      <div key={method.id} className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-secondary/50 transition-colors">
                        <RadioGroupItem value={method.id} id={method.id} />
                        <method.icon className="w-5 h-5 text-muted-foreground" />
                        <Label htmlFor={method.id} className="flex-1 cursor-pointer">{method.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <Button 
                  className="w-full" 
                  variant="hero"
                  disabled={!amount || parseFloat(amount) <= 0 || isProcessing}
                  onClick={handleAddFunds}
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    `Add ₹${amount || '0'} to Wallet`
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="relative">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-6"
        >
          <p className="text-muted-foreground text-sm mb-1">Available Balance</p>
          <p className="text-5xl font-bold text-foreground">
            ₹{wallet?.balance.toFixed(2) || '0.00'}
          </p>
        </motion.div>

        {/* Recent Transactions */}
        <div className="mt-6 space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Recent Transactions
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {transactions.length === 0 ? (
              <p className="text-center text-muted-foreground py-4 text-sm">
                No transactions yet
              </p>
            ) : (
              transactions.slice(0, 5).map((tx) => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/30"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      tx.type === 'credit' ? 'bg-green-500/20' : 'bg-red-500/20'
                    }`}>
                      {tx.type === 'credit' ? (
                        <ArrowDownRight className="w-4 h-4 text-green-500" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{tx.description || 'Transaction'}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(tx.created_at), 'MMM d, h:mm a')}
                      </p>
                    </div>
                  </div>
                  <p className={`font-semibold ${
                    tx.type === 'credit' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {tx.type === 'credit' ? '+' : '-'}₹{tx.amount}
                  </p>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
