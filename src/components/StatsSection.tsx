import { motion } from 'framer-motion';
import { Train, MapPin, Clock, Users, Gauge, Shield } from 'lucide-react';

const stats = [
  { icon: Train, value: '2', label: 'Metro Lines' },
  { icon: MapPin, value: '28+', label: 'Stations' },
  { icon: Users, value: '50K+', label: 'Daily Riders' },
  { icon: Clock, value: '10', label: 'Min Frequency' },
  { icon: Gauge, value: '80', label: 'km/h Speed' },
  { icon: Shield, value: '99.9%', label: 'Uptime' },
];

export const StatsSection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-secondary/50" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Metro at a Glance
          </h2>
          <p className="text-muted-foreground">
            Ahmedabad-Gandhinagar Metro connects the twin cities with modern transit
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
