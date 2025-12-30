import { motion } from 'framer-motion';
import { MapPin, Clock, Train, Ticket } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: MapPin,
    title: 'Plan Journey',
    description: 'Find the best route between any two stations with real-time fare calculation',
    href: '/routes',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    icon: Train,
    title: 'Live Tracking',
    description: 'Track metro trains in real-time with accurate ETAs and station updates',
    href: '/live-tracking',
    color: 'text-metro-success',
    bgColor: 'bg-metro-success/10',
  },
  {
    icon: Clock,
    title: 'View Timetable',
    description: 'Access complete metro schedules with first and last train timings',
    href: '/timetable',
    color: 'text-metro-warning',
    bgColor: 'bg-metro-warning/10',
  },
  {
    icon: Ticket,
    title: 'Book Ticket',
    description: 'Book tickets instantly and get QR codes for contactless entry',
    href: '/book',
    color: 'text-accent',
    bgColor: 'bg-accent/10',
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
                  <Card glass className="h-full hover:scale-105 transition-transform duration-300 cursor-pointer group">
                    <CardContent className="p-6">
                      <div className={`w-14 h-14 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className={`w-7 h-7 ${feature.color}`} />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm">{feature.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
