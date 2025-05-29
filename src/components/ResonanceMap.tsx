
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Users, Zap, LogOut } from "lucide-react";
import BubbleGrid from './BubbleGrid';
import ProfileView from './ProfileView';

const ResonanceMap = ({ user }) => {
  const [selectedZone, setSelectedZone] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [mapZoom, setMapZoom] = useState(1);

  // Mock zones data
  const zones = [
    { id: 'downtown', name: 'Downtown Core', x: 40, y: 35, users: 12, color: 'purple' },
    { id: 'westside', name: 'Westside', x: 25, y: 50, users: 8, color: 'blue' },
    { id: 'eastend', name: 'East End', x: 70, y: 45, users: 15, color: 'green' },
    { id: 'northward', name: 'Northward', x: 45, y: 20, users: 6, color: 'gold' },
    { id: 'southbay', name: 'South Bay', x: 35, y: 75, users: 10, color: 'pink' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('impression_user');
    window.location.reload();
  };

  const handleZoneClick = (zone) => {
    setSelectedZone(zone);
    setSelectedProfile(null);
  };

  const handleProfileSelect = (profile) => {
    setSelectedProfile(profile);
  };

  const handleBackToMap = () => {
    setSelectedZone(null);
    setSelectedProfile(null);
  };

  if (selectedProfile) {
    return (
      <ProfileView 
        profile={selectedProfile} 
        onBack={() => setSelectedProfile(null)}
        currentUser={user}
      />
    );
  }

  if (selectedZone) {
    return (
      <BubbleGrid 
        zone={selectedZone} 
        onBack={handleBackToMap}
        onProfileSelect={handleProfileSelect}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-800 relative overflow-hidden">
      {/* Header */}
      <div className="relative z-10 flex justify-between items-center p-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-white">Impression</h1>
          <div className="text-white/60">Welcome, {user.name}</div>
        </div>
        
        <Button
          variant="outline"
          onClick={handleLogout}
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>

      {/* Map Container */}
      <div className="relative flex-1 p-6">
        <Card className="h-[calc(100vh-8rem)] bg-white/5 backdrop-blur-lg border-white/10 overflow-hidden">
          <CardContent className="p-0 h-full relative">
            {/* Abstract Map Background */}
            <div 
              className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-indigo-500/20"
              style={{ 
                transform: `scale(${mapZoom})`,
                transition: 'transform 0.3s ease-out'
              }}
            >
              {/* Map Grid Lines */}
              <svg className="absolute inset-0 w-full h-full opacity-20">
                <defs>
                  <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                    <path d="M 50 0 L 0 0 0 50" fill="none" stroke="white" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>

              {/* Zone Markers */}
              {zones.map((zone) => (
                <div
                  key={zone.id}
                  className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 group"
                  style={{ left: `${zone.x}%`, top: `${zone.y}%` }}
                  onClick={() => handleZoneClick(zone)}
                >
                  {/* Zone Pulse Effect */}
                  <div className={`absolute inset-0 w-16 h-16 bg-${zone.color}-400/30 rounded-full animate-pulse`}></div>
                  <div className={`absolute inset-0 w-12 h-12 bg-${zone.color}-400/50 rounded-full animate-pulse delay-300`}></div>
                  
                  {/* Zone Icon */}
                  <div className="relative w-8 h-8 bg-white/20 backdrop-blur-lg rounded-full border border-white/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>

                  {/* Zone Info Card */}
                  <Card className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-lg border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 min-w-max">
                    <CardContent className="p-3">
                      <div className="text-white font-medium text-sm">{zone.name}</div>
                      <div className="text-white/70 text-xs flex items-center mt-1">
                        <Users className="w-3 h-3 mr-1" />
                        {zone.users} active
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}

              {/* Floating Resonance Indicators */}
              <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-purple-400/60 rounded-full animate-pulse"></div>
              <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-blue-400/60 rounded-full animate-pulse delay-700"></div>
              <div className="absolute bottom-1/3 left-1/5 w-1 h-1 bg-gold-400/60 rounded-full animate-pulse delay-1000"></div>
            </div>

            {/* Map Controls */}
            <div className="absolute bottom-6 right-6 space-y-2">
              <Button
                size="sm"
                onClick={() => setMapZoom(Math.min(mapZoom + 0.2, 2))}
                className="bg-white/10 backdrop-blur-lg border-white/20 text-white hover:bg-white/20 w-10 h-10"
              >
                +
              </Button>
              <Button
                size="sm"
                onClick={() => setMapZoom(Math.max(mapZoom - 0.2, 0.5))}
                className="bg-white/10 backdrop-blur-lg border-white/20 text-white hover:bg-white/20 w-10 h-10"
              >
                -
              </Button>
            </div>

            {/* Legend */}
            <Card className="absolute top-6 right-6 bg-white/10 backdrop-blur-lg border-white/20">
              <CardContent className="p-4">
                <div className="text-white font-medium text-sm mb-2">Active Resonance Zones</div>
                <div className="space-y-1">
                  {zones.map((zone) => (
                    <div key={zone.id} className="flex items-center space-x-2 text-xs">
                      <div className={`w-2 h-2 bg-${zone.color}-400 rounded-full`}></div>
                      <span className="text-white/70">{zone.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResonanceMap;
