import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Chatbot } from "@/components/Support";
import Index from "./pages/Index";
import RoutesPage from "./pages/Routes";
import TimetablePage from "./pages/TimetablePage";
import LiveTracking from "./pages/LiveTracking";
import BookTicket from "./pages/BookTicket";
import MyTicketsPage from "./pages/MyTicketsPage";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  // Ensure title stays clean
  useEffect(() => {
    // Set clean title immediately
    document.title = "MetroConnect";
    
    // Watch for title changes and override them
    const observer = new MutationObserver(() => {
      if (document.title !== "MetroConnect") {
        document.title = "MetroConnect";
      }
    });
    
    observer.observe(document.querySelector("title") || document.head, {
      childList: true,
      subtree: true,
      characterData: true,
    });
    
    // Periodically check and reset title if modified
    const interval = setInterval(() => {
      if (document.title !== "MetroConnect") {
        document.title = "MetroConnect";
      }
    }, 100);
    
    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/routes" element={<RoutesPage />} />
              <Route path="/timetable" element={<TimetablePage />} />
              <Route path="/live-tracking" element={<LiveTracking />} />
              <Route path="/book" element={<BookTicket />} />
              <Route path="/my-tickets" element={<MyTicketsPage />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Chatbot />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
