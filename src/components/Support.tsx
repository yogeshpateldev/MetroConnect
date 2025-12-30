import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Send, X, HelpCircle, Mail, Phone, Clock, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const FAQ_DATA = [
  {
    question: 'How do I book a metro ticket?',
    answer: 'Navigate to "Book Ticket" from the menu, select your departure and arrival stations, choose a departure time, and confirm your booking. The fare will be deducted from your wallet.'
  },
  {
    question: 'How do I add money to my wallet?',
    answer: 'Go to your Profile page, click on "Add Funds" in the Wallet section. You can add money using Credit/Debit cards or UPI. Choose a quick amount or enter a custom amount.'
  },
  {
    question: 'What is the Metro e-Card?',
    answer: 'The Metro e-Card is a digital transit pass that stores your balance. You can use it for faster checkouts and enable auto-reload to never run out of balance.'
  },
  {
    question: 'How do rewards work?',
    answer: 'You earn 2 points per kilometer traveled. Complete milestone rides (10, 25, 50, 100, 200 rides) to earn bonus points. Redeem points for wallet credits, card discounts, or vouchers.'
  },
  {
    question: 'Can I cancel my ticket?',
    answer: 'Yes, you can cancel unused tickets from the "My Tickets" page. Refunds are processed to your wallet within 24 hours.'
  },
  {
    question: 'What are the metro operating hours?',
    answer: 'Metro services operate from 6:00 AM to 10:00 PM daily, with trains arriving every 10 minutes during peak hours.'
  },
  {
    question: 'How do I track my train in real-time?',
    answer: 'Use the "Live Tracking" feature to see real-time positions of trains on each line. You can track ETA to your station.'
  },
  {
    question: 'Is my payment information secure?',
    answer: 'Yes, all payment transactions are encrypted and processed through secure payment gateways. We never store your card details.'
  }
];

const BOT_RESPONSES: Record<string, string> = {
  'hello': 'Hello! Welcome to MetroConnect support. How can I help you today?',
  'hi': 'Hi there! How can I assist you with your metro journey?',
  'book': 'To book a ticket, go to "Book Ticket" in the menu. Select your stations and time, then confirm. Need more help?',
  'ticket': 'You can book tickets from the "Book Ticket" page. View your booked tickets in "My Tickets" section.',
  'wallet': 'Your wallet balance can be found in your Profile. Click "Add Funds" to add money via UPI or Card.',
  'refund': 'Refunds for cancelled tickets are processed within 24 hours to your wallet balance.',
  'time': 'Metro operates from 6 AM to 10 PM daily with trains every 10 minutes.',
  'timing': 'Metro operates from 6 AM to 10 PM daily with trains every 10 minutes.',
  'fare': 'Fares range from ₹10-50 based on distance. Check exact fare on the booking page.',
  'price': 'Ticket prices range from ₹10 (1-2 stations) to ₹50 (12+ stations).',
  'card': 'Your Metro e-Card is a digital pass. Recharge it from your Profile page.',
  'reward': 'Earn 2 points per km traveled. Redeem points for wallet credits and discounts in the Rewards section.',
  'points': 'Check your points in the Profile page. Complete milestones for bonus points!',
  'cancel': 'Cancel tickets from "My Tickets" page. Refund will be credited to your wallet.',
  'track': 'Use "Live Tracking" to see real-time train positions and ETA.',
  'help': 'I can help with booking, wallet, rewards, timing, and more. What do you need?',
  'default': "I'm not sure about that. You can check our FAQ section or contact support at support@metroconnect.com for detailed assistance."
};

const findBotResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  for (const [key, response] of Object.entries(BOT_RESPONSES)) {
    if (lowerMessage.includes(key)) {
      return response;
    }
  }
  return BOT_RESPONSES.default;
};

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'bot',
      content: 'Hello! I\'m MetroBot, your virtual assistant. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Simulate bot thinking
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: findBotResponse(input),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 800);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 flex items-center justify-center z-50"
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>

      {/* Chat Window */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] z-50"
        >
          <Card className="glass-card shadow-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary to-accent text-primary-foreground pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-white">MetroBot</CardTitle>
                    <CardDescription className="text-white/70 text-xs">Always here to help</CardDescription>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {/* Messages */}
              <div className="h-80 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] p-3 rounded-2xl ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-md'
                        : 'bg-secondary text-foreground rounded-bl-md'
                    }`}>
                      <p className="text-sm">{msg.content}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-border">
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    className="flex-1"
                  />
                  <Button onClick={handleSend} size="icon" variant="hero">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </>
  );
};

export const FAQSection = () => {
  return (
    <Card className="glass-card">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <HelpCircle className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <CardTitle>Frequently Asked Questions</CardTitle>
            <CardDescription>Find quick answers to common questions</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="space-y-2">
          {FAQ_DATA.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border border-border/50 rounded-lg px-4">
              <AccordionTrigger className="text-left hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export const ContactForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: 'Message Sent!',
      description: 'We will get back to you within 24-48 hours.'
    });

    setFormData({ subject: '', message: '' });
    setIsSubmitting(false);
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
            <Mail className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <CardTitle>Contact Support</CardTitle>
            <CardDescription>Can't find what you're looking for?</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Subject</label>
            <Input
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="What do you need help with?"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Message</label>
            <Textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Describe your issue in detail..."
              rows={4}
              required
            />
          </div>
          <Button type="submit" className="w-full" variant="hero" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-border space-y-3">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Mail className="w-4 h-4" />
            <span>support@metroconnect.com</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Phone className="w-4 h-4" />
            <span>1800-xxx-xxxx (Toll Free)</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Mon-Sat: 9 AM - 6 PM</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
