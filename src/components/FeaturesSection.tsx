import { motion } from 'framer-motion';
import { MapPin, Clock, Train, Ticket } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import metroStation1 from '@/assets/metro-station-1.jpg';
import metroStation2 from '@/assets/metro-station-2.jpg';
import metroTrain1 from '@/assets/metro-train-1.jpg';

const features = [
  {
    icon: MapPin,
    title: 'Plan Journey',
    description: 'Find the best route between any two stations with real-time fare calculation',
    href: '/routes',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    image: metroStation1,
  },
  {
    icon: Train,
    title: 'Live Tracking',
    description: 'Track metro trains in real-time with accurate ETAs and station updates',
    href: '/live-tracking',
    color: 'text-metro-success',
    bgColor: 'bg-metro-success/10',
    image: metroTrain1,
  },
  {
    icon: Clock,
    title: 'View Timetable',
    description: 'Access complete metro schedules with first and last train timings',
    href: '/timetable',
    color: 'text-metro-warning',
    bgColor: 'bg-metro-warning/10',
    image: metroStation2,
  },
  {
    icon: Ticket,
    title: 'Book Ticket',
    description: 'Book tickets instantly and get QR codes for contactless entry',
    href: '/book',
    color: 'text-accent',
    bgColor: 'bg-accent/10',
    image: metroStation1,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const FeaturesSection = () => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-primary text-sm font-medium mb-4"
          >
            FEATURES
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-foreground mb-4"
          >
            Everything You Need
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            A complete metro experience at your fingertips. From route planning to live tracking, 
            we've got you covered.
          </motion.p>
        </div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div key={feature.title} variants={itemVariants}>
                <Link to={feature.href}>
                  <Card glass className="h-full hover:scale-105 transition-transform duration-300 cursor-pointer group overflow-hidden">
                    {/* Feature Image */}
                    <div className="h-32 overflow-hidden relative">
                      <img 
                        src={feature.image} 
                        alt={feature.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                      <div className={`absolute bottom-3 left-3 w-10 h-10 rounded-lg ${feature.bgColor} flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${feature.color}`} />
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm">{feature.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Metro Imagery Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="mt-20 container mx-auto px-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden group">
            <img 
              src={metroStation2} 
              alt="Busy metro station platform" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <h3 className="text-2xl font-bold text-foreground mb-2">Connecting Cities</h3>
              <p className="text-muted-foreground">Experience reliable, efficient metro travel across Ahmedabad and Gandhinagar</p>
            </div>
          </div>
          <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden group">
            <img 
              src={metroTrain1} 
              alt="Modern metro train" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <h3 className="text-2xl font-bold text-foreground mb-2">Building Communities</h3>
              <p className="text-muted-foreground">Modern, comfortable, and sustainable urban transit for everyone</p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};