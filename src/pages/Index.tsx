
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-black-primary">
        <div className="absolute inset-0 bg-gradient-to-br from-black-primary via-primary/20 to-secondary/10"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary/5 to-secondary/10 animate-pulse"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-center mb-12 animate-fade-in">
          {/* Logo */}
          <div className="flex items-center justify-center mb-6">
            <img 
              src="/lovable-uploads/1cafcb12-3a6f-4fcf-818d-5250ac45ab53.png" 
              alt="Impression Logo" 
              className="w-24 h-24 md:w-32 md:h-32"
            />
          </div>
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-white via-primary to-secondary bg-clip-text text-transparent mb-6">
            Impression
          </h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            Where connections emerge through resonance, not declarations
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-4xl">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
            <CardContent className="p-6 text-center">
              <Zap className="w-12 h-12 text-gold-400 mx-auto mb-4" />
              <h3 className="text-white text-lg font-semibold mb-2">Behavioral Resonance</h3>
              <p className="text-white/70 text-sm">AI analyzes your subconscious signals to find genuine connections</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
            <CardContent className="p-6 text-center">
              <MapPin className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-white text-lg font-semibold mb-2">Spatial Discovery</h3>
              <p className="text-white/70 text-sm">Explore connections through intuitive, zone-based mapping</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
            <CardContent className="p-6 text-center">
              <Users className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-white text-lg font-semibold mb-2">Dynamic Relationships</h3>
              <p className="text-white/70 text-sm">Form evolving connections that adapt to your shared journey</p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Button */}
        <Button 
          onClick={() => setShowOnboarding(true)}
          className="bg-gradient-to-r from-primary to-secondary hover:from-primary-glow hover:to-secondary text-white px-12 py-4 text-lg rounded-full transition-all duration-300 transform hover:scale-105"
          style={{ boxShadow: 'var(--shadow-brand)' }}
        >
          Begin Your Journey
        </Button>

        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-white/30 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-2 h-2 bg-purple-400/40 rounded-full animate-pulse delay-500"></div>
        <div className="absolute bottom-32 left-40 w-3 h-3 bg-blue-400/30 rounded-full animate-pulse delay-1000"></div>
      </div>
    </div>
  );
};

export default Index;
