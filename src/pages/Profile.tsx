import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Settings, LogOut, Edit2, Camera, MapPin, Mail, Phone, Calendar } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { WalletCard } from '@/components/WalletCard';
import { RewardsCard } from '@/components/RewardsCard';
import { MetroCardDisplay } from '@/components/MetroCardDisplay';
import { FAQSection, ContactForm } from '@/components/Support';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import metroBg from '@/assets/metro-bg.jpg';

interface Profile {
  full_name: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ full_name: '', phone: '' });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) throw error;
        if (data) {
          setProfile(data);
          setEditData({
            full_name: data.full_name || '',
            phone: data.phone || ''
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleUpdateProfile = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: editData.full_name,
          phone: editData.phone
        })
        .eq('user_id', user.id);

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, ...editData } : null);
      setIsEditing(false);
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully.'
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Update Failed',
        description: 'Could not update profile. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    toast({
      title: 'Signed Out',
      description: 'You have been logged out successfully.'
    });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background relative">
        <div className="fixed inset-0 z-0">
          <img src={metroBg} alt="" className="w-full h-full object-cover opacity-5" />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
        </div>
        <div className="relative z-10">
          <Navbar />
          <main className="container mx-auto px-4 pt-24 pb-12">
            <div className="animate-pulse space-y-4">
              <div className="h-32 bg-muted rounded-xl" />
              <div className="h-64 bg-muted rounded-xl" />
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Fixed Background */}
      <div className="fixed inset-0 z-0">
        <img 
          src={metroBg} 
          alt="" 
          className="w-full h-full object-cover opacity-5"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      </div>
      
      <div className="relative z-10">
        <Navbar />
        <main className="container mx-auto px-4 pt-24 pb-12">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Profile Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="glass-card overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-primary via-primary/80 to-accent" />
                <CardContent className="relative px-6 pb-6">
                  <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-16">
                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-32 h-32 rounded-2xl bg-secondary border-4 border-background flex items-center justify-center overflow-hidden">
                        {profile?.avatar_url ? (
                          <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-16 h-16 text-muted-foreground" />
                        )}
                      </div>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full"
                      >
                        <Camera className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Info */}
                    <div className="flex-1 space-y-1">
                      <h1 className="text-2xl font-bold">
                        {profile?.full_name || 'Metro User'}
                      </h1>
                      <p className="text-muted-foreground flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {profile?.email || user?.email}
                      </p>
                      {profile?.phone && (
                        <p className="text-muted-foreground flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {profile.phone}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Member since {profile?.created_at ? format(new Date(profile.created_at), 'MMMM yyyy') : 'Recently'}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Dialog open={isEditing} onOpenChange={setIsEditing}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Edit2 className="w-4 h-4 mr-2" />
                            Edit Profile
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="glass-card">
                          <DialogHeader>
                            <DialogTitle>Edit Profile</DialogTitle>
                            <DialogDescription>Update your personal information</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="fullName">Full Name</Label>
                              <Input
                                id="fullName"
                                value={editData.full_name}
                                onChange={(e) => setEditData({ ...editData, full_name: e.target.value })}
                                placeholder="Enter your name"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="phone">Phone Number</Label>
                              <Input
                                id="phone"
                                value={editData.phone}
                                onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                                placeholder="Enter phone number"
                              />
                            </div>
                            <Button onClick={handleUpdateProfile} className="w-full" variant="hero">
                              Save Changes
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button variant="destructive" size="sm" onClick={handleSignOut}>
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Tabs */}
            <Tabs defaultValue="wallet" className="space-y-6">
              <TabsList className="w-full justify-start bg-secondary/50 p-1 rounded-xl">
                <TabsTrigger value="wallet" className="rounded-lg">Wallet</TabsTrigger>
                <TabsTrigger value="rewards" className="rounded-lg">Rewards</TabsTrigger>
                <TabsTrigger value="card" className="rounded-lg">Metro Card</TabsTrigger>
                <TabsTrigger value="support" className="rounded-lg">Support</TabsTrigger>
              </TabsList>

              <TabsContent value="wallet" className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  <WalletCard />
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                      <CardDescription>Common wallet operations</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button variant="outline" className="w-full justify-start" asChild>
                        <Link to="/book">
                          <MapPin className="w-4 h-4 mr-2" />
                          Book a Ticket
                        </Link>
                      </Button>
                      <Button variant="outline" className="w-full justify-start" asChild>
                        <Link to="/my-tickets">
                          <Settings className="w-4 h-4 mr-2" />
                          View My Tickets
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="rewards">
                <div className="grid gap-6 lg:grid-cols-2">
                  <RewardsCard />
                </div>
              </TabsContent>

              <TabsContent value="card">
                <div className="grid gap-6 lg:grid-cols-2">
                  <MetroCardDisplay />
                </div>
              </TabsContent>

              <TabsContent value="support" className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  <FAQSection />
                  <ContactForm />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Profile;
