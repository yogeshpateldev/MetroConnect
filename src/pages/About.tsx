import { motion } from 'framer-motion';
import { Users, Target, Award, Train } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import metroMotion from '@/assets/metro-motion.jpg';
import metroPlatform from '@/assets/metro-platform.jpg';
import metroEntrance from '@/assets/metro-entrance.jpg';
import metroBg from '@/assets/metro-bg.jpg';

const creators = [
  {
    name: 'Solanki Viraj',
    role: 'Lead Developer',
    description: 'Full-stack development and system architecture'
  },
  {
    name: 'Patel Yogesh',
    role: 'Backend Developer',
    description: 'Database design and API development'
  },
  {
    name: 'Sinchaniya Tanishq',
    role: 'Frontend Developer',
    description: 'UI/UX design and user experience'
  }
];

const features = [
  {
    icon: Train,
    title: 'Real-Time Tracking',
    description: 'Track metro trains in real-time with accurate arrival predictions'
  },
  {
    icon: Target,
    title: 'Smart Booking',
    description: 'Book tickets seamlessly with location-based verification'
  },
  {
    icon: Award,
    title: 'Rewards Program',
    description: 'Earn points with every ride and unlock exclusive benefits'
  }
];

const About = () => {
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
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={metroMotion}
            alt="Metro in motion"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About <span className="text-foreground">Metro</span>
              <span className="text-cyan-400">Connect</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Your complete metro companion for the Ahmedabad-Gandhinagar region. 
              We're revolutionizing urban transit with technology.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-muted-foreground mb-4">
                MetroConnect aims to transform the commuting experience for millions of metro riders 
                in the Ahmedabad-Gandhinagar region. We believe that public transportation should be 
                convenient, efficient, and accessible to everyone.
              </p>
              <p className="text-muted-foreground mb-4">
                Our platform integrates real-time tracking, digital ticketing, and smart rewards 
                to make your daily commute smoother and more rewarding.
              </p>
              <p className="text-muted-foreground">
                Built with love by students passionate about improving urban mobility and 
                leveraging technology for public good.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img 
                src={metroPlatform}
                alt="Metro platform"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-background/50 to-transparent" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Platform Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need for a seamless metro experience
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass-card h-full hover:border-primary/50 transition-all">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">
              <Users className="inline-block w-8 h-8 mr-2 text-primary" />
              Meet Our Team
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The passionate developers behind MetroConnect
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {creators.map((creator, index) => (
              <motion.div
                key={creator.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass-card text-center hover:border-primary/50 transition-all">
                  <CardContent className="p-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-primary-foreground">
                        {creator.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold mb-1">{creator.name}</h3>
                    <p className="text-primary text-sm font-medium mb-2">{creator.role}</p>
                    <p className="text-muted-foreground text-sm">{creator.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Metro Gallery</h2>
            <p className="text-muted-foreground">Experience the beauty of modern metro transit</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-xl aspect-video"
            >
              <img src={metroMotion} alt="Metro in motion" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="relative overflow-hidden rounded-xl aspect-video"
            >
              <img src={metroPlatform} alt="Metro platform" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative overflow-hidden rounded-xl aspect-video"
            >
              <img src={metroEntrance} alt="Metro entrance" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
      </div>
    </div>
  );
};

export default About;
