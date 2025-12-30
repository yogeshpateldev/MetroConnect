-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create wallet table for digital wallet
CREATE TABLE public.wallets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  balance DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create wallet transactions table
CREATE TABLE public.wallet_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_id UUID NOT NULL REFERENCES public.wallets(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('credit', 'debit')),
  description TEXT,
  payment_method TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create metro e-cards table
CREATE TABLE public.metro_cards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  card_number TEXT NOT NULL UNIQUE,
  balance DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  is_active BOOLEAN NOT NULL DEFAULT true,
  auto_reload BOOLEAN NOT NULL DEFAULT false,
  auto_reload_amount DECIMAL(10, 2) DEFAULT 100.00,
  auto_reload_threshold DECIMAL(10, 2) DEFAULT 20.00,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  from_station TEXT NOT NULL,
  to_station TEXT NOT NULL,
  line TEXT NOT NULL,
  departure_time TEXT NOT NULL,
  fare DECIMAL(10, 2) NOT NULL,
  distance DECIMAL(10, 2),
  duration INTEGER,
  booking_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'used', 'expired', 'cancelled')),
  qr_code TEXT,
  payment_method TEXT DEFAULT 'wallet',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create rewards table for milestone tracking
CREATE TABLE public.user_rewards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  total_rides INTEGER NOT NULL DEFAULT 0,
  total_distance DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  current_milestone INTEGER NOT NULL DEFAULT 0,
  points INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reward redemptions table
CREATE TABLE public.reward_redemptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reward_type TEXT NOT NULL CHECK (reward_type IN ('wallet_credit', 'card_discount', 'voucher')),
  points_used INTEGER NOT NULL,
  value DECIMAL(10, 2) NOT NULL,
  description TEXT,
  redeemed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create support tickets table
CREATE TABLE public.support_tickets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metro_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reward_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Wallets policies
CREATE POLICY "Users can view their own wallet" ON public.wallets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own wallet" ON public.wallets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own wallet" ON public.wallets FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Wallet transactions policies
CREATE POLICY "Users can view their own transactions" ON public.wallet_transactions FOR SELECT USING (
  wallet_id IN (SELECT id FROM public.wallets WHERE user_id = auth.uid())
);
CREATE POLICY "Users can insert their own transactions" ON public.wallet_transactions FOR INSERT WITH CHECK (
  wallet_id IN (SELECT id FROM public.wallets WHERE user_id = auth.uid())
);

-- Metro cards policies
CREATE POLICY "Users can view their own cards" ON public.metro_cards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own cards" ON public.metro_cards FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own cards" ON public.metro_cards FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Bookings policies
CREATE POLICY "Users can view their own bookings" ON public.bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own bookings" ON public.bookings FOR UPDATE USING (auth.uid() = user_id);

-- User rewards policies
CREATE POLICY "Users can view their own rewards" ON public.user_rewards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own rewards" ON public.user_rewards FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own rewards" ON public.user_rewards FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Reward redemptions policies
CREATE POLICY "Users can view their own redemptions" ON public.reward_redemptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own redemptions" ON public.reward_redemptions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Support tickets policies
CREATE POLICY "Users can view their own tickets" ON public.support_tickets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own tickets" ON public.support_tickets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own tickets" ON public.support_tickets FOR UPDATE USING (auth.uid() = user_id);

-- Function to create profile, wallet, rewards on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  new_card_number TEXT;
BEGIN
  -- Create profile
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data ->> 'full_name');
  
  -- Create wallet
  INSERT INTO public.wallets (user_id) VALUES (NEW.id);
  
  -- Create rewards tracking
  INSERT INTO public.user_rewards (user_id) VALUES (NEW.id);
  
  -- Generate unique card number and create metro card
  new_card_number := 'MC' || TO_CHAR(NOW(), 'YYYYMMDD') || LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
  INSERT INTO public.metro_cards (user_id, card_number) VALUES (NEW.id, new_card_number);
  
  RETURN NEW;
END;
$$;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_wallets_updated_at BEFORE UPDATE ON public.wallets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_metro_cards_updated_at BEFORE UPDATE ON public.metro_cards FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_rewards_updated_at BEFORE UPDATE ON public.user_rewards FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();