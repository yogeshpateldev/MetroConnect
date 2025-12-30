import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Wallet {
  id: string;
  balance: number;
}

interface Transaction {
  id: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string | null;
  payment_method: string | null;
  created_at: string;
}

export const useWallet = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWallet = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setWallet({ id: data.id, balance: Number(data.balance) });
      }
    } catch (error) {
      console.error('Error fetching wallet:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchTransactions = useCallback(async () => {
    if (!wallet) return;

    try {
      const { data, error } = await supabase
        .from('wallet_transactions')
        .select('*')
        .eq('wallet_id', wallet.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setTransactions(data?.map(t => ({
        ...t,
        amount: Number(t.amount),
        type: t.type as 'credit' | 'debit'
      })) || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  }, [wallet]);

  useEffect(() => {
    fetchWallet();
  }, [fetchWallet]);

  useEffect(() => {
    if (wallet) {
      fetchTransactions();
    }
  }, [wallet, fetchTransactions]);

  const addFunds = async (amount: number, paymentMethod: string) => {
    if (!wallet) return { success: false };

    try {
      // Simulated payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Add transaction
      const { error: transactionError } = await supabase
        .from('wallet_transactions')
        .insert({
          wallet_id: wallet.id,
          amount,
          type: 'credit',
          description: 'Added funds via ' + paymentMethod,
          payment_method: paymentMethod,
        });

      if (transactionError) throw transactionError;

      // Update wallet balance
      const newBalance = wallet.balance + amount;
      const { error: updateError } = await supabase
        .from('wallets')
        .update({ balance: newBalance })
        .eq('id', wallet.id);

      if (updateError) throw updateError;

      setWallet({ ...wallet, balance: newBalance });
      await fetchTransactions();

      toast({
        title: 'Funds Added!',
        description: `₹${amount} has been added to your wallet.`,
      });

      return { success: true };
    } catch (error) {
      console.error('Error adding funds:', error);
      toast({
        title: 'Transaction Failed',
        description: 'Could not add funds. Please try again.',
        variant: 'destructive',
      });
      return { success: false };
    }
  };

  const deductFunds = async (amount: number, description: string) => {
    if (!wallet) return { success: false };
    if (wallet.balance < amount) {
      toast({
        title: 'Insufficient Balance',
        description: 'Please add funds to your wallet.',
        variant: 'destructive',
      });
      return { success: false };
    }

    try {
      const { error: transactionError } = await supabase
        .from('wallet_transactions')
        .insert({
          wallet_id: wallet.id,
          amount,
          type: 'debit',
          description,
          payment_method: 'wallet',
        });

      if (transactionError) throw transactionError;

      const newBalance = wallet.balance - amount;
      const { error: updateError } = await supabase
        .from('wallets')
        .update({ balance: newBalance })
        .eq('id', wallet.id);

      if (updateError) throw updateError;

      setWallet({ ...wallet, balance: newBalance });
      await fetchTransactions();

      return { success: true };
    } catch (error) {
      console.error('Error deducting funds:', error);
      return { success: false };
    }
  };

  return {
    wallet,
    transactions,
    loading,
    addFunds,
    deductFunds,
    refetch: fetchWallet,
  };
};
