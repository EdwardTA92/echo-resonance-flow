
import React, { useState, useEffect } from 'react';
import { Glass, GlassCard, GlassButton } from '@/components/ui/glass';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  X, 
  Star, 
  Zap, 
  MapPin, 
  Users,
  Sparkles,
  Target
} from 'lucide-react';

interface Person {
  id: string;
  name: string;
  age: number;
  distance: number;
  photos: string[];
  occupation: string;
  interests: string[];
  resonanceScore: number;
  mutualInterests: string[];
  location: { x: number; y: number };
  isActive: boolean;
}

const ResonanceMap = ({ user }: { user: any }) => {
  const [people, setPeople] = useState<Person[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [userResonance, setUserResonance] = useState(0);

  // Mock data for demonstration
  const mockPeople: Person[] = [
    {
      id: '1',
      name: 'Sarah',
      age: 28,
      distance: 2.3,
      photos: ['/api/placeholder/400/600'],
      occupation: 'Designer',
      interests: ['Photography', 'Hiking', 'Coffee'],
      resonanceScore: 94,
      mutualInterests: ['Photography', 'Coffee'],
      location: { x: 65, y: 35 },
      isActive: true
    },
    {
      id: '2',
      name: 'Alex',
      age: 32,
      distance: 1.8,
      photos: ['/api/placeholder/400/600'],
      occupation: 'Engineer',
      interests: ['Tech', 'Cooking', 'Music'],
      resonanceScore: 87,
      mutualInterests: ['Tech'],
      location: { x: 40, y: 60 },
      isActive: true
    },
    {
      id: '3',
      name: 'Emma',
      age: 26,
      distance: 3.1,
      photos: ['/api/placeholder/400/600'],
      occupation: 'Writer',
      interests: ['Books', 'Travel', 'Yoga'],
      resonanceScore: 91,
      mutualInterests: ['Books', 'Travel'],
      location: { x: 75, y: 70 },
      isActive: false
    },
    {
      id: '4',
      name: 'David',
      age: 30,
      distance: 0.9,
      photos: ['/api/placeholder/400/600'],
      occupation: 'Artist',
      interests: ['Art', 'Music', 'Coffee'],
      resonanceScore: 89,
      mutualInterests: ['Art', 'Coffee'],
      location: { x: 25, y: 25 },
      isActive: true
    }
  ];

  useEffect(() => {
    setPeople(mockPeople);
    // Simulate user resonance building up
    const interval = setInterval(() => {
      setUserResonance(prev => Math.min(prev + 1, 85));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handlePersonClick = (person: Person) => {
    setSelectedPerson(person);
  };

  const handleAction = (action: 'like' | 'pass' | 'superlike') => {
    if (selectedPerson) {
      console.log(`${action} action for ${selectedPerson.name}`);
      setSelectedPerson(null);
    }
  };

  return (
    <div className="min-h-screen bg-black-primary relative overflow-hidden">
      {/* Ambient Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <Glass variant="dark" surface="raised" className="p-4 m-4 rounded-xl relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user?.photos?.[0]} />
              <AvatarFallback className="bg-primary/20 text-primary-foreground">
                {user?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-bold text-white">Resonance Map</h1>
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-primary" />
                <span className="text-primary font-medium">{userResonance}% Active</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-primary/20 text-primary-foreground">
              <Users className="mr-1 h-4 w-4" />
              {people.filter(p => p.isActive).length} Online
            </Badge>
            <GlassButton variant="primary" size="sm">
              <Target className="h-4 w-4" />
            </GlassButton>
          </div>
        </div>
      </Glass>

      {/* Main Map Area */}
      <div className="relative h-[calc(100vh-200px)] mx-4 mb-4">
        <GlassCard variant="dark" surface="raised" className="h-full p-6 relative overflow-hidden">
          {/* Resonance Grid Background */}
          <div className="absolute inset-0 opacity-20">
            <div className="grid grid-cols-8 grid-rows-8 h-full w-full">
              {[...Array(64)].map((_, i) => (
                <div 
                  key={i} 
                  className="border border-primary/10 hover:bg-primary/5 transition-colors duration-300"
                />
              ))}
            </div>
          </div>

          {/* People on Map */}
          {people.map((person) => (
            <div
              key={person.id}
              className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-110"
              style={{
                left: `${person.location.x}%`,
                top: `${person.location.y}%`,
              }}
              onClick={() => handlePersonClick(person)}
            >
              <div className="relative">
                {/* Resonance Pulse */}
                <div 
                  className="absolute inset-0 rounded-full border-2 animate-ping"
                  style={{
                    borderColor: `hsl(${280 + (person.resonanceScore - 50)}, 100%, 60%)`,
                    animationDuration: `${2 + (100 - person.resonanceScore) / 20}s`
                  }}
                />
                
                {/* Person Avatar */}
                <Glass 
                  variant="primary" 
                  surface="floating" 
                  glow="subtle"
                  className="p-1 rounded-full"
                >
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={person.photos[0]} />
                    <AvatarFallback className="bg-primary/20 text-primary-foreground text-lg">
                      {person.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </Glass>

                {/* Status Indicator */}
                {person.isActive && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-black-primary animate-pulse"></div>
                )}

                {/* Resonance Score */}
                <Badge 
                  className="absolute -top-2 -right-2 bg-primary/90 text-primary-foreground text-xs px-2 py-1"
                >
                  {person.resonanceScore}%
                </Badge>
              </div>
            </div>
          ))}

          {/* User Position (Center) */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              {/* User's Resonance Field */}
              <div className="absolute inset-0 w-32 h-32 border-2 border-primary/30 rounded-full animate-pulse scale-150"></div>
              <div className="absolute inset-0 w-32 h-32 border border-primary/20 rounded-full animate-pulse scale-125 delay-500"></div>
              
              <Glass variant="primary" surface="floating" glow="always" className="p-2 rounded-full">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user?.photos?.[0]} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                    {user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Glass>

              <Badge className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                <Sparkles className="mr-1 h-3 w-3" />
                You
              </Badge>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Person Details Modal */}
      {selectedPerson && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <GlassCard variant="dark" surface="floating" className="w-full max-w-md">
            <div className="relative">
              {/* Photo */}
              <div className="aspect-[3/4] rounded-lg overflow-hidden mb-4">
                <img 
                  src={selectedPerson.photos[0]} 
                  alt={selectedPerson.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>

              {/* Details */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {selectedPerson.name}, {selectedPerson.age}
                  </h3>
                  <div className="flex items-center text-white/80 text-sm space-x-4">
                    <div className="flex items-center">
                      <MapPin className="mr-1 h-4 w-4" />
                      {selectedPerson.distance} km away
                    </div>
                    <span>{selectedPerson.occupation}</span>
                  </div>
                </div>

                {/* Resonance Score */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/80">Resonance Match</span>
                    <span className="text-primary font-bold">{selectedPerson.resonanceScore}%</span>
                  </div>
                  <Progress value={selectedPerson.resonanceScore} className="h-2" />
                </div>

                {/* Mutual Interests */}
                <div>
                  <h4 className="text-white font-medium mb-2 flex items-center">
                    <Star className="mr-2 h-4 w-4 text-primary" />
                    Mutual Interests
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedPerson.mutualInterests.map((interest, index) => (
                      <Badge key={index} className="bg-primary/20 text-primary-foreground">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                  <GlassButton 
                    variant="subtle" 
                    onClick={() => handleAction('pass')}
                    className="flex-1"
                  >
                    <X className="mr-2 h-5 w-5" />
                    Pass
                  </GlassButton>
                  <GlassButton 
                    variant="secondary" 
                    onClick={() => handleAction('superlike')}
                    className="flex-1"
                  >
                    <Star className="mr-2 h-5 w-5" />
                    Super
                  </GlassButton>
                  <GlassButton 
                    variant="primary" 
                    onClick={() => handleAction('like')}
                    className="flex-1"
                  >
                    <Heart className="mr-2 h-5 w-5" />
                    Connect
                  </GlassButton>
                </div>
              </div>

              {/* Close Button */}
              <GlassButton
                variant="subtle"
                onClick={() => setSelectedPerson(null)}
                className="absolute top-2 right-2 p-2"
              >
                <X className="h-5 w-5" />
              </GlassButton>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default ResonanceMap;
