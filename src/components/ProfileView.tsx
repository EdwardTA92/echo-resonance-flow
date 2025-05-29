
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Heart, Users, Zap, Eye, Clock } from "lucide-react";

const ProfileView = ({ profile, onBack, currentUser }) => {
  const [viewStartTime] = useState(Date.now());
  const [dwellTime, setDwellTime] = useState(0);
  const [scrollBehavior, setScrollBehavior] = useState([]);
  const [scrollReversals, setScrollReversals] = useState(0);
  const [lastScrollDirection, setLastScrollDirection] = useState(null);
  const [isTracking, setIsTracking] = useState(true);

  useEffect(() => {
    // Track dwell time
    const interval = setInterval(() => {
      if (isTracking) {
        setDwellTime(Date.now() - viewStartTime);
      }
    }, 100);

    // Track scroll behavior
    const handleScroll = (e) => {
      if (!isTracking) return;

      const currentDirection = e.deltaY > 0 ? 'down' : 'up';
      const scrollEvent = {
        timestamp: Date.now() - viewStartTime,
        direction: currentDirection,
        intensity: Math.abs(e.deltaY),
        position: window.scrollY
      };

      setScrollBehavior(prev => [...prev.slice(-20), scrollEvent]);

      if (lastScrollDirection && lastScrollDirection !== currentDirection) {
        setScrollReversals(prev => prev + 1);
      }
      setLastScrollDirection(currentDirection);
    };

    window.addEventListener('wheel', handleScroll);

    return () => {
      clearInterval(interval);
      window.removeEventListener('wheel', handleScroll);
      
      // Save behavioral data when component unmounts
      saveBehavioralData();
    };
  }, [viewStartTime, isTracking, lastScrollDirection]);

  const saveBehavioralData = () => {
    const behavioralVector = {
      target_id: profile.id,
      dwell_ms: dwellTime,
      scroll_reversals: scrollReversals,
      scroll_events: scrollBehavior.length,
      avg_scroll_intensity: scrollBehavior.reduce((sum, event) => sum + event.intensity, 0) / scrollBehavior.length || 0,
      last_action: 'viewed',
      viewer_id: currentUser.email,
      timestamp: new Date().toISOString()
    };

    // Store in localStorage for now (would be sent to backend in real app)
    const existingVectors = JSON.parse(localStorage.getItem('impression_behavioral_vectors') || '[]');
    existingVectors.push(behavioralVector);
    localStorage.setItem('impression_behavioral_vectors', JSON.stringify(existingVectors));

    console.log('Behavioral vector saved:', behavioralVector);
  };

  const handleBack = () => {
    setIsTracking(false);
    saveBehavioralData();
    onBack();
  };

  const getIntentIcon = (intent) => {
    switch (intent) {
      case 'romantic': return <Heart className="w-5 h-5 text-pink-400" />;
      case 'platonic': return <Users className="w-5 h-5 text-blue-400" />;
      case 'creative': return <Zap className="w-5 h-5 text-yellow-400" />;
      default: return <Zap className="w-5 h-5 text-purple-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-800">
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-6">
        <Button
          variant="outline"
          onClick={handleBack}
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Tracking Indicator (for demo purposes) */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardContent className="p-3">
            <div className="flex items-center space-x-4 text-xs text-white/70">
              <div className="flex items-center space-x-1">
                <Eye className="w-3 h-3" />
                <span>{Math.round(dwellTime / 1000)}s</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{scrollReversals} reversals</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profile Content */}
      <div className="px-6 pb-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Main Profile Card */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 overflow-hidden">
            <CardContent className="p-0">
              {/* Profile Photo */}
              <div className="aspect-square bg-gradient-to-br from-purple-400/30 to-blue-500/30 flex items-center justify-center relative">
                <div className="w-48 h-48 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-4xl font-bold text-white">
                    {profile.name.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>
                
                {/* Intent Badge */}
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-lg rounded-full p-3">
                  {getIntentIcon(profile.intents)}
                </div>
              </div>

              {/* Profile Info */}
              <div className="p-6 space-y-4">
                <div>
                  <h1 className="text-2xl font-bold text-white">{profile.name}, {profile.age}</h1>
                  <p className="text-white/60 capitalize">{profile.intents} connections</p>
                </div>

                <div className="text-white/80 leading-relaxed">
                  {profile.bio}
                </div>

                {/* Activity Indicators */}
                <div className="flex space-x-4">
                  <div className="flex-1 bg-white/10 rounded-lg p-3">
                    <div className="text-white/60 text-xs">Activity Level</div>
                    <div className="text-white font-medium">
                      {profile.activity > 0.7 ? 'High' : profile.activity > 0.4 ? 'Medium' : 'Low'}
                    </div>
                  </div>
                  
                  <div className="flex-1 bg-white/10 rounded-lg p-3">
                    <div className="text-white/60 text-xs">Resonance Vibe</div>
                    <div className="text-white font-medium">
                      {Math.round(profile.vibe * 100)}%
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bio Analysis Card (AI-Enhanced) */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-6">
              <h3 className="text-white font-medium mb-4">AI Bio Analysis</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-white/70">Humor</span>
                    <span className="text-white">{Math.round(Math.random() * 100)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Confidence</span>
                    <span className="text-white">{Math.round(Math.random() * 100)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Vulnerability</span>
                    <span className="text-white">{Math.round(Math.random() * 100)}%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-white/70">Creativity</span>
                    <span className="text-white">{Math.round(Math.random() * 100)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Emotional Tone</span>
                    <span className="text-white">Positive</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Openness</span>
                    <span className="text-white">{Math.round(Math.random() * 100)}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Scroll to see more content */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-6">
              <h3 className="text-white font-medium mb-4">More About {profile.name}</h3>
              <div className="space-y-4 text-white/80">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
                  incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis 
                  nostrud exercitation ullamco laboris.
                </p>
                <p>
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore 
                  eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, 
                  sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
                <p>
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium 
                  doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore 
                  veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
