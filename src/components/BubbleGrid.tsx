
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Zap, Heart, Users } from "lucide-react";

const BubbleGrid = ({ zone, onBack, onProfileSelect }) => {
  const [bubbles, setBubbles] = useState([]);
  const [animatingBubbles, setAnimatingBubbles] = useState(new Set());

  // Generate mock user bubbles for the zone
  useEffect(() => {
    const generateBubbles = () => {
      const mockUsers = Array.from({ length: zone.users }, (_, i) => ({
        id: `user_${zone.id}_${i}`,
        name: `User ${i + 1}`,
        age: 22 + Math.floor(Math.random() * 15),
        bio: "Exploring the depths of human connection through shared experiences...",
        activity: Math.random(),
        vibe: Math.random(),
        intents: ['romantic', 'platonic', 'creative'][Math.floor(Math.random() * 3)],
        x: 10 + Math.random() * 80,
        y: 10 + Math.random() * 80,
        size: 0.6 + Math.random() * 0.8,
        photo: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}?w=150&h=150&fit=crop&crop=face`,
      }));
      setBubbles(mockUsers);
    };

    generateBubbles();
  }, [zone]);

  const handleBubbleClick = (bubble) => {
    setAnimatingBubbles(prev => new Set([...prev, bubble.id]));
    setTimeout(() => {
      onProfileSelect(bubble);
    }, 500);
  };

  const getBubbleColor = (intent, vibe) => {
    const colors = {
      romantic: 'from-pink-400 to-rose-500',
      platonic: 'from-blue-400 to-indigo-500',
      creative: 'from-yellow-400 to-orange-500',
    };
    return colors[intent] || 'from-purple-400 to-blue-500';
  };

  const getVibeIntensity = (vibe) => {
    if (vibe > 0.7) return 'high';
    if (vibe > 0.4) return 'medium';
    return 'low';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-800 relative overflow-hidden">
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={onBack}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Map
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">{zone.name}</h1>
            <p className="text-white/60">{zone.users} active resonance signals</p>
          </div>
        </div>
      </div>

      {/* Bubble Grid Container */}
      <div className="relative flex-1 p-6">
        <Card className="h-[calc(100vh-8rem)] bg-white/5 backdrop-blur-lg border-white/10 overflow-hidden">
          <CardContent className="p-0 h-full relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full">
                <defs>
                  <radialGradient id="bubbleGradient" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="white" stopOpacity="0.3"/>
                    <stop offset="100%" stopColor="white" stopOpacity="0"/>
                  </radialGradient>
                </defs>
                {Array.from({ length: 20 }).map((_, i) => (
                  <circle
                    key={i}
                    cx={Math.random() * 100 + "%"}
                    cy={Math.random() * 100 + "%"}
                    r={Math.random() * 50 + 10}
                    fill="url(#bubbleGradient)"
                    className="animate-pulse"
                    style={{ animationDelay: `${Math.random() * 2}s` }}
                  />
                ))}
              </svg>
            </div>

            {/* User Bubbles */}
            {bubbles.map((bubble) => (
              <div
                key={bubble.id}
                className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 group"
                style={{ 
                  left: `${bubble.x}%`, 
                  top: `${bubble.y}%`,
                  transition: 'all 0.5s ease-out'
                }}
                onClick={() => handleBubbleClick(bubble)}
              >
                {/* Bubble Container */}
                <div 
                  className={`relative transition-all duration-500 ${
                    animatingBubbles.has(bubble.id) ? 'scale-150 opacity-0' : 'group-hover:scale-110'
                  }`}
                  style={{ 
                    width: `${bubble.size * 80 + 40}px`, 
                    height: `${bubble.size * 80 + 40}px` 
                  }}
                >
                  {/* Activity Ring */}
                  <div 
                    className={`absolute inset-0 rounded-full border-2 ${
                      bubble.activity > 0.7 ? 'border-green-400 animate-pulse' :
                      bubble.activity > 0.4 ? 'border-yellow-400' : 'border-gray-400'
                    } opacity-60`}
                  />
                  
                  {/* Vibe Intensity Indicator */}
                  <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
                    getVibeIntensity(bubble.vibe) === 'high' ? 'bg-red-400 animate-pulse' :
                    getVibeIntensity(bubble.vibe) === 'medium' ? 'bg-yellow-400' : 'bg-blue-400'
                  }`} />

                  {/* Main Bubble */}
                  <div 
                    className={`w-full h-full rounded-full bg-gradient-to-br ${getBubbleColor(bubble.intents, bubble.vibe)} 
                    backdrop-blur-lg border border-white/30 shadow-lg group-hover:shadow-xl transition-all duration-300
                    flex items-center justify-center relative overflow-hidden`}
                  >
                    {/* Profile Photo Placeholder */}
                    <div className="w-3/4 h-3/4 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <div className="text-white font-medium text-xs">
                        {bubble.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    </div>

                    {/* Intent Indicator */}
                    <div className="absolute bottom-1 right-1">
                      {bubble.intents === 'romantic' && <Heart className="w-3 h-3 text-white/80" />}
                      {bubble.intents === 'platonic' && <Users className="w-3 h-3 text-white/80" />}
                      {bubble.intents === 'creative' && <Zap className="w-3 h-3 text-white/80" />}
                    </div>
                  </div>

                  {/* Hover Info Card */}
                  <Card className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white/10 backdrop-blur-lg border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 min-w-max z-10">
                    <CardContent className="p-3">
                      <div className="text-white font-medium text-sm">{bubble.name}, {bubble.age}</div>
                      <div className="text-white/70 text-xs mt-1 max-w-32 truncate">{bubble.bio}</div>
                      <div className={`text-xs mt-1 ${
                        bubble.activity > 0.7 ? 'text-green-400' :
                        bubble.activity > 0.4 ? 'text-yellow-400' : 'text-gray-400'
                      }`}>
                        Activity: {Math.round(bubble.activity * 100)}%
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}

            {/* Zone Statistics */}
            <Card className="absolute top-6 right-6 bg-white/10 backdrop-blur-lg border-white/20">
              <CardContent className="p-4">
                <div className="text-white font-medium text-sm mb-2">Zone Statistics</div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-white/70">
                    <span>Active Users:</span>
                    <span className="text-green-400">{zone.users}</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>Resonance Level:</span>
                    <span className="text-purple-400">High</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>New Connections:</span>
                    <span className="text-blue-400">{Math.floor(zone.users * 0.3)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BubbleGrid;
