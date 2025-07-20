import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Glass, GlassCard, GlassButton } from '@/components/ui/glass';
import { Badge } from '@/components/ui/badge';
import { 
  Globe, 
  Zap, 
  Users, 
  Heart, 
  Sparkles, 
  Target,
  MapPin,
  Settings
} from 'lucide-react';

interface UserDensity {
  lat: number;
  lng: number;
  count: number;
  vibeType: 'solo' | 'couple' | 'group' | 'sexual' | 'casual' | 'serious' | 'experimental' | 'romantic';
  intensity: number;
}

interface VibeZone {
  center: { lat: number; lng: number };
  radius: number;
  type: 'high-energy' | 'romantic' | 'casual' | 'experimental';
  density: number;
}

declare global {
  interface Window {
    google: typeof google;
  }
}

const WorldMap = ({ user }: { user: any }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(2);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [showApiInput, setShowApiInput] = useState(true);

  // Mock density data for different world regions
  const mockDensityData: UserDensity[] = [
    { lat: 40.7128, lng: -74.0060, count: 1250, vibeType: 'casual', intensity: 0.8 }, // NYC
    { lat: 51.5074, lng: -0.1278, count: 890, vibeType: 'serious', intensity: 0.7 }, // London
    { lat: 35.6762, lng: 139.6503, count: 675, vibeType: 'experimental', intensity: 0.6 }, // Tokyo
    { lat: 48.8566, lng: 2.3522, count: 720, vibeType: 'romantic', intensity: 0.75 }, // Paris
    { lat: 37.7749, lng: -122.4194, count: 980, vibeType: 'casual', intensity: 0.85 }, // SF
    { lat: -33.8688, lng: 151.2093, count: 550, vibeType: 'group', intensity: 0.65 }, // Sydney
    { lat: 52.5200, lng: 13.4050, count: 640, vibeType: 'sexual', intensity: 0.7 }, // Berlin
    { lat: 41.9028, lng: 12.4964, count: 480, vibeType: 'romantic', intensity: 0.6 }, // Rome
  ];

  const vibeZones: VibeZone[] = [
    { center: { lat: 40.7589, lng: -73.9851 }, radius: 50000, type: 'high-energy', density: 0.9 }, // Manhattan
    { center: { lat: 48.8566, lng: 2.3522 }, radius: 30000, type: 'romantic', density: 0.8 }, // Paris
    { center: { lat: 52.5200, lng: 13.4050 }, radius: 40000, type: 'experimental', density: 0.75 }, // Berlin
  ];

  const initializeMap = async () => {
    if (!apiKey || !mapRef.current) return;

    try {
      const loader = new Loader({
        apiKey: apiKey,
        version: 'weekly',
        libraries: ['places', 'visualization']
      });

      const google = await loader.load();
      
      const map = new google.maps.Map(mapRef.current, {
        zoom: zoomLevel,
        center: { lat: 20, lng: 0 },
        styles: [
          {
            featureType: 'all',
            elementType: 'labels',
            stylers: [{ visibility: 'simplified' }]
          },
          {
            featureType: 'landscape',
            elementType: 'geometry',
            stylers: [
              { hue: '#7E22CE' },
              { saturation: 30 },
              { lightness: -20 }
            ]
          },
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [
              { hue: '#DB2777' },
              { saturation: 80 },
              { lightness: -40 }
            ]
          },
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [
              { visibility: 'simplified' },
              { color: '#8B5CF6' }
            ]
          }
        ],
        disableDefaultUI: true,
        gestureHandling: 'greedy'
      });

      mapInstanceRef.current = map;

      // Add surreal overlay
      const overlay = new google.maps.OverlayView();
      overlay.onAdd = function() {
        const div = document.createElement('div');
        div.className = 'surreal-overlay';
        div.style.position = 'absolute';
        div.style.width = '100%';
        div.style.height = '100%';
        div.style.pointerEvents = 'none';
        this.getPanes()?.overlayLayer.appendChild(div);
      };
      overlay.draw = function() {};
      overlay.setMap(map);

      // Add density visualizations
      mockDensityData.forEach((density, index) => {
        createDensityVisualization(map, density, index);
      });

      // Add vibe zones
      vibeZones.forEach((zone, index) => {
        createVibeZone(map, zone, index);
      });

      // Add zoom listener
      map.addListener('zoom_changed', () => {
        const newZoom = map.getZoom() || 2;
        setZoomLevel(newZoom);
      });

      setIsLoaded(true);
      setShowApiInput(false);
    } catch (error) {
      console.error('Error loading Google Maps:', error);
    }
  };

  const createDensityVisualization = (map: any, density: UserDensity, index: number) => {
    const getVibeColor = (type: string) => {
      const colors = {
        solo: '#8B5CF6',
        couple: '#DB2777',
        group: '#059669',
        sexual: '#DC2626',
        casual: '#F59E0B',
        serious: '#3B82F6'
      };
      return colors[type as keyof typeof colors] || '#8B5CF6';
    };

    // Create pulsing circle for density
    const circle = new window.google.maps.Circle({
      strokeColor: getVibeColor(density.vibeType),
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: getVibeColor(density.vibeType),
      fillOpacity: 0.3,
      map: map,
      center: { lat: density.lat, lng: density.lng },
      radius: Math.max(10000, density.count * 50),
      clickable: true
    });

    // Add click listener
    circle.addListener('click', () => {
      setSelectedRegion(`Region ${index + 1}: ${density.count} users, ${density.vibeType} vibe`);
    });

    // Animate the circle
    let growing = true;
    const originalRadius = circle.getRadius();
    setInterval(() => {
      const currentRadius = circle.getRadius();
      if (growing) {
        circle.setRadius(Math.min(currentRadius * 1.02, originalRadius * 1.2));
        if (currentRadius >= originalRadius * 1.2) growing = false;
      } else {
        circle.setRadius(Math.max(currentRadius * 0.98, originalRadius * 0.8));
        if (currentRadius <= originalRadius * 0.8) growing = true;
      }
    }, 100);
  };

  const createVibeZone = (map: any, zone: VibeZone, index: number) => {
    const getZoneColor = (type: string) => {
      const colors = {
        'high-energy': '#F59E0B',
        'romantic': '#DB2777',
        'casual': '#8B5CF6',
        'experimental': '#DC2626'
      };
      return colors[type as keyof typeof colors] || '#8B5CF6';
    };

    const vibeCircle = new window.google.maps.Circle({
      strokeColor: getZoneColor(zone.type),
      strokeOpacity: 0.6,
      strokeWeight: 3,
      fillColor: getZoneColor(zone.type),
      fillOpacity: 0.15,
      map: map,
      center: zone.center,
      radius: zone.radius,
      clickable: false
    });

    // Add floating particles
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        createFloatingParticle(map, zone.center, getZoneColor(zone.type));
      }, i * 1000);
    }
  };

  const createFloatingParticle = (map: any, center: { lat: number; lng: number }, color: string) => {
    const randomOffset = () => (Math.random() - 0.5) * 0.01;
    
    const marker = new window.google.maps.Marker({
      position: {
        lat: center.lat + randomOffset(),
        lng: center.lng + randomOffset()
      },
      map: map,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 4,
        fillColor: color,
        fillOpacity: 0.8,
        strokeWeight: 0
      }
    });

    // Animate particle movement
    let step = 0;
    const animate = () => {
      step += 0.01;
      const newLat = center.lat + Math.sin(step) * 0.005;
      const newLng = center.lng + Math.cos(step) * 0.005;
      marker.setPosition({ lat: newLat, lng: newLng });
      
      if (step < Math.PI * 4) {
        requestAnimationFrame(animate);
      } else {
        marker.setMap(null);
      }
    };
    animate();
  };

  const handleApiKeySubmit = () => {
    if (apiKey.trim()) {
      initializeMap();
    }
  };

  if (showApiInput) {
    return (
      <div className="min-h-screen bg-black-primary flex items-center justify-center p-4">
        <GlassCard variant="dimensional" surface="floating" glow="dimensional" className="w-full max-w-md text-center">
          <div className="space-y-6">
            <div>
              <Globe className="h-16 w-16 mx-auto text-primary mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Initialize World Map</h2>
              <p className="text-white/70">Enter your Google Maps API key to access the surreal world visualization</p>
            </div>
            
            <div className="space-y-4">
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Google Maps API Key"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 backdrop-blur-md"
              />
              
              <GlassButton
                variant="dimensional"
                surface="pressable"
                glow="dimensional"
                onClick={handleApiKeySubmit}
                className="w-full"
                disabled={!apiKey.trim()}
              >
                <Target className="mr-2 h-5 w-5" />
                Launch World Map
              </GlassButton>
              
              <div className="text-xs text-white/50">
                <p>Get your API key at: <span className="text-primary">console.cloud.google.com</span></p>
                <p>Enable Maps JavaScript API & Places API</p>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black-primary relative overflow-hidden">
      {/* Ambient Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="resonance-particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${8 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Header */}
      <Glass variant="dimensional" surface="raised" glow="dimensional" className="p-4 m-4 rounded-xl relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Globe className="h-12 w-12 text-primary animate-spin" style={{ animationDuration: '20s' }} />
              <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Surreal Resonance World</h1>
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-primary" />
                <span className="text-primary font-medium">Global Network Active</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge className="bg-primary/20 text-primary-foreground density-pulse">
              <Users className="mr-1 h-4 w-4" />
              {mockDensityData.reduce((sum, d) => sum + d.count, 0).toLocaleString()} Online
            </Badge>
            
            <GlassButton variant="bubble" surface="pressable" glow="bubble" size="sm">
              <Settings className="h-4 w-4" />
            </GlassButton>
          </div>
        </div>
      </Glass>

      {/* Map Container */}
      <div className="relative h-[calc(100vh-200px)] mx-4 mb-4">
        <GlassCard variant="dimensional" surface="raised" glow="dimensional" className="h-full p-2 relative overflow-hidden">
          <div 
            ref={mapRef} 
            className="w-full h-full rounded-lg overflow-hidden relative"
            style={{ minHeight: '400px' }}
          />
          
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md">
              <div className="text-center">
                <Globe className="h-16 w-16 mx-auto text-primary animate-spin mb-4" />
                <p className="text-white text-lg">Loading Surreal World...</p>
              </div>
            </div>
          )}

          {/* Zoom Level Indicator */}
          {isLoaded && (
            <div className="absolute top-4 left-4">
              <Glass variant="bubble" surface="floating" glow="subtle" className="px-3 py-2">
                <span className="text-white text-sm">Zoom: {zoomLevel}x</span>
              </Glass>
            </div>
          )}

          {/* Region Info Panel */}
          {selectedRegion && (
            <div className="absolute bottom-4 left-4 right-4">
              <Glass variant="dimensional" surface="floating" glow="dimensional" className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span className="text-white">{selectedRegion}</span>
                  </div>
                  <GlassButton
                    variant="subtle"
                    size="sm"
                    onClick={() => setSelectedRegion(null)}
                  >
                    ×
                  </GlassButton>
                </div>
              </Glass>
            </div>
          )}

          {/* Legend */}
          <div className="absolute top-4 right-4">
            <Glass variant="bubble" surface="floating" glow="subtle" className="p-3">
              <div className="space-y-2">
                <h4 className="text-white text-sm font-medium mb-2">Vibe Types</h4>
                {[
                  { type: 'solo', color: '#8B5CF6', label: 'Solo' },
                  { type: 'couple', color: '#DB2777', label: 'Couples' },
                  { type: 'group', color: '#059669', label: 'Groups' },
                  { type: 'sexual', color: '#DC2626', label: 'Sexual' },
                  { type: 'casual', color: '#F59E0B', label: 'Casual' },
                  { type: 'serious', color: '#3B82F6', label: 'Serious' }
                ].map(({ type, color, label }) => (
                  <div key={type} className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-white/80 text-xs">{label}</span>
                  </div>
                ))}
              </div>
            </Glass>
          </div>
        </GlassCard>
      </div>

      {/* Controls */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-20">
        <Glass variant="dimensional" surface="floating" glow="dimensional" className="flex items-center space-x-2 px-4 py-2">
          <GlassButton variant="bubble" surface="pressable" glow="bubble" size="sm">
            <Heart className="h-4 w-4" />
          </GlassButton>
          <GlassButton variant="bubble" surface="pressable" glow="bubble" size="sm">
            <Sparkles className="h-4 w-4" />
          </GlassButton>
          <GlassButton variant="bubble" surface="pressable" glow="bubble" size="sm">
            <Target className="h-4 w-4" />
          </GlassButton>
        </Glass>
      </div>
    </div>
  );
};

export default WorldMap;