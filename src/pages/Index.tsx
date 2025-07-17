
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Zap, Heart, Users } from "lucide-react";
import OnboardingFlow from '@/components/OnboardingFlow';
import ResonanceMap from '@/components/ResonanceMap';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Check if user is already authenticated
    const user = localStorage.getItem('impression_user');
    if (user) {
      setCurrentUser(JSON.parse(user));
      setIsAuthenticated(true);
    }
  }, []);

  const handleAuthComplete = (userData) => {
    setCurrentUser(userData);
    setIsAuthenticated(true);
    setShowOnboarding(false);
    localStorage.setItem('impression_user', JSON.stringify(userData));
  };

  if (isAuthenticated && currentUser) {
    return <ResonanceMap user={currentUser} />;
  }

  if (showOnboarding) {
    return <OnboardingFlow onComplete={handleAuthComplete} />;
  }

  return (
    <div className="min-h-screen bg-black-primary flex items-center justify-center relative overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-secondary/8 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Clickable Logo */}
      <div className="relative z-10 group cursor-pointer" onClick={() => setShowOnboarding(true)}>
        <div className="relative transform transition-all duration-500 hover:scale-110 group-hover:drop-shadow-2xl">
          {/* Glow effect behind logo */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-150"></div>
          
          {/* Logo with depth */}
          <div className="relative">
            <img 
              src="/lovable-uploads/1cafcb12-3a6f-4fcf-818d-5250ac45ab53.png" 
              alt="Impression Logo" 
              className="w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 relative z-10 transition-all duration-500 group-hover:brightness-110"
              style={{
                filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.8)) drop-shadow(0 0 20px hsl(var(--primary)/0.3))',
                transformStyle: 'preserve-3d'
              }}
            />
            
            {/* Subtle reflection */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
          </div>

          {/* Ripple effect on hover */}
          <div className="absolute inset-0 rounded-full border border-primary/20 opacity-0 group-hover:opacity-100 group-hover:animate-ping"></div>
        </div>

        {/* Minimal call to action */}
        <div className="text-center mt-8 opacity-60 group-hover:opacity-100 transition-opacity duration-500">
          <p className="text-white/80 text-lg font-light tracking-wide">
            Touch to begin
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
