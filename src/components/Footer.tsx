import { Link } from 'react-router-dom';
import { Train, Github, Twitter, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-secondary/50 border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Train className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">
                Metro<span className="text-primary">Connect</span>
              </span>
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

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 MetroConnect. A prototype for educational purposes.
          </p>
        </div>
      </div>
    </footer>
  );
};
