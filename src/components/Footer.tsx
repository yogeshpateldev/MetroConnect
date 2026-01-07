import { Link } from 'react-router-dom';
import { Github, Twitter, Mail } from 'lucide-react';
import logo from '@/assets/logo.png';
import metroBg from '@/assets/metro-bg.jpg';

export const Footer = () => {
  return (
    <footer className="relative border-t border-border py-12 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={metroBg} 
          alt="" 
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-background/90" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img src={logo} alt="MetroConnect Logo" className="h-10 w-auto" />
              <div>
                <span className="text-xl font-bold text-foreground">Metro</span>
                <span className="text-xl font-bold text-cyan-400">Connect</span>
              </div>
            </Link>
            <p className="text-muted-foreground text-sm max-w-md mb-4">
              Your complete metro companion. Real-time tracking, instant booking, and seamless journey planning for Ahmedabad-Gandhinagar Metro.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/routes" className="text-muted-foreground hover:text-primary transition-colors">Plan Journey</Link></li>
              <li><Link to="/live-tracking" className="text-muted-foreground hover:text-primary transition-colors">Live Tracking</Link></li>
              <li><Link to="/timetable" className="text-muted-foreground hover:text-primary transition-colors">Timetable</Link></li>
              <li><Link to="/book" className="text-muted-foreground hover:text-primary transition-colors">Book Ticket</Link></li>
              <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Information</h4>
            <ul className="space-y-2">
              <li><span className="text-muted-foreground">First Train: 06:00</span></li>
              <li><span className="text-muted-foreground">Last Train: 22:00</span></li>
              <li><span className="text-muted-foreground">Frequency: 10 min</span></li>
              <li><span className="text-muted-foreground">Helpline: 1800-XXX-XXXX</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2026 <span className="text-foreground">Metro</span><span className="text-cyan-400">Connect</span>. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground">
              A <span className="text-primary font-semibold">Passing Metro</span> Initiative
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
