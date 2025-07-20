
import React, { useState } from 'react';
import { Glass, GlassCard, GlassButton } from '@/components/ui/glass';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  X, 
  Star, 
  MessageSquare, 
  MapPin, 
  Briefcase,
  GraduationCap,
  ArrowLeft,
  Zap,
  Clock
} from 'lucide-react';

interface Match {
  id: string;
  name: string;
  age: number;
  location: string;
  occupation: string;
  education: string;
  photos: string[];
  bio: string;
  interests: string[];
  resonanceScore: number;
  compatibility: {
    values: number;
    lifestyle: number;
    communication: number;
    interests: number;
  };
  mutualInterests: string[];
  isNewMatch: boolean;
  matchedAt: Date;
}

const MatchResults = ({ user, onBack, onMessage }: { 
  user: any; 
  onBack: () => void;
  onMessage: (matchId: string) => void;
}) => {
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);

  const mockMatches: Match[] = [
    {
      id: 'match-1',
      name: 'Sarah Chen',
      age: 28,
      location: 'San Francisco, CA',
      occupation: 'Product Designer',
      education: 'Stanford University',
      photos: ['/api/placeholder/400/600', '/api/placeholder/400/600', '/api/placeholder/400/600'],
      bio: 'Love exploring new coffee shops, hiking on weekends, and photography. Always up for an adventure or a deep conversation about design and life.',
      interests: ['Photography', 'Hiking', 'Coffee', 'Design', 'Travel'],
      resonanceScore: 94,
      compatibility: {
        values: 95,
        lifestyle: 88,
        communication: 96,
        interests: 92
      },
      mutualInterests: ['Photography', 'Hiking', 'Coffee'],
      isNewMatch: true,
      matchedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: 'match-2',
      name: 'Alex Rodriguez',
      age: 32,
      location: 'Oakland, CA',
      occupation: 'Software Engineer',
      education: 'UC Berkeley',
      photos: ['/api/placeholder/400/600', '/api/placeholder/400/600'],
      bio: 'Tech enthusiast by day, chef by night. Love trying new restaurants and cooking at home. Always looking for the next great book to read.',
      interests: ['Cooking', 'Reading', 'Technology', 'Food', 'Music'],
      resonanceScore: 87,
      compatibility: {
        values: 85,
        lifestyle: 82,
        communication: 89,
        interests: 92
      },
      mutualInterests: ['Reading', 'Technology'],
      isNewMatch: false,
      matchedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'match-3',
      name: 'Emma Thompson',
      age: 26,
      location: 'Palo Alto, CA',
      occupation: 'Marketing Manager',
      education: 'UCLA',
      photos: ['/api/placeholder/400/600', '/api/placeholder/400/600', '/api/placeholder/400/600'],
      bio: 'Yoga instructor and marketing professional. Passionate about wellness, sustainability, and making meaningful connections.',
      interests: ['Yoga', 'Wellness', 'Sustainability', 'Marketing', 'Meditation'],
      resonanceScore: 91,
      compatibility: {
        values: 93,
        lifestyle: 87,
        communication: 88,
        interests: 86
      },
      mutualInterests: ['Wellness', 'Sustainability'],
      isNewMatch: true,
      matchedAt: new Date(Date.now() - 4 * 60 * 60 * 1000)
    }
  ];

  const selectedMatchData = mockMatches.find(match => match.id === selectedMatch);

  if (selectedMatch && selectedMatchData) {
    return (
      <div className="min-h-screen bg-black-primary p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <Glass variant="dark" surface="raised" className="p-6 rounded-xl mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <GlassButton 
                  variant="subtle" 
                  onClick={() => setSelectedMatch(null)}
                  className="mr-4"
                >
                  <ArrowLeft className="h-5 w-5" />
                </GlassButton>
                <h1 className="text-2xl font-bold text-white">Match Details</h1>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-primary/20 text-primary-foreground">
                  <Zap className="mr-1 h-4 w-4" />
                  {selectedMatchData.resonanceScore}% Match
                </Badge>
                {selectedMatchData.isNewMatch && (
                  <Badge className="bg-green-500/20 text-green-400">New</Badge>
                )}
              </div>
            </div>
          </Glass>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Photos */}
            <div className="space-y-4">
              <GlassCard variant="dark" surface="raised" className="p-0 overflow-hidden">
                <div className="aspect-[3/4] relative">
                  <img 
                    src={selectedMatchData.photos[0]} 
                    alt={selectedMatchData.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h2 className="text-2xl font-bold text-white mb-1">
                      {selectedMatchData.name}, {selectedMatchData.age}
                    </h2>
                    <div className="flex items-center text-white/80 text-sm space-x-4">
                      <div className="flex items-center">
                        <MapPin className="mr-1 h-4 w-4" />
                        {selectedMatchData.location}
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>

              <div className="grid grid-cols-2 gap-3">
                {selectedMatchData.photos.slice(1).map((photo, index) => (
                  <GlassCard key={index} variant="dark" className="p-0 overflow-hidden">
                    <div className="aspect-square">
                      <img 
                        src={photo} 
                        alt={`${selectedMatchData.name} ${index + 2}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>

            {/* Details */}
            <div className="space-y-6">
              {/* Compatibility Score */}
              <GlassCard variant="primary" surface="raised" glow="always">
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold text-primary-foreground mb-2">
                    {selectedMatchData.resonanceScore}%
                  </div>
                  <p className="text-primary-foreground/80">Resonance Match</p>
                </div>
                
                <div className="space-y-3">
                  {Object.entries(selectedMatchData.compatibility).map(([key, value]) => (
                    <div key={key}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-primary-foreground/80 capitalize">{key}</span>
                        <span className="text-primary-foreground font-medium">{value}%</span>
                      </div>
                      <Progress value={value} className="h-2" />
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Basic Info */}
              <GlassCard variant="dark" surface="raised">
                <div className="space-y-4">
                  <div className="flex items-center text-white/80">
                    <Briefcase className="mr-2 h-5 w-5" />
                    <span>{selectedMatchData.occupation}</span>
                  </div>
                  <div className="flex items-center text-white/80">
                    <GraduationCap className="mr-2 h-5 w-5" />
                    <span>{selectedMatchData.education}</span>
                  </div>
                  <div className="flex items-center text-white/80">
                    <Clock className="mr-2 h-5 w-5" />
                    <span>Matched {selectedMatchData.matchedAt.toLocaleDateString()}</span>
                  </div>
                </div>
              </GlassCard>

              {/* Bio */}
              <GlassCard variant="dark" surface="raised">
                <h3 className="text-lg font-semibold text-white mb-3">About</h3>
                <p className="text-white/80 leading-relaxed">{selectedMatchData.bio}</p>
              </GlassCard>

              {/* Mutual Interests */}
              <GlassCard variant="dark" surface="raised">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <Star className="mr-2 h-5 w-5 text-primary" />
                  Mutual Interests
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedMatchData.mutualInterests.map((interest, index) => (
                    <Badge key={index} className="bg-primary/20 text-primary-foreground">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </GlassCard>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <GlassButton 
                  variant="subtle" 
                  surface="interactive"
                  className="flex-1 p-4"
                >
                  <X className="mr-2 h-5 w-5" />
                  Pass
                </GlassButton>
                <GlassButton 
                  variant="primary" 
                  surface="floating"
                  onClick={() => onMessage(selectedMatchData.id)}
                  className="flex-1 p-4"
                >
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Message
                </GlassButton>
                <GlassButton 
                  variant="secondary" 
                  surface="interactive"
                  className="flex-1 p-4"
                >
                  <Heart className="mr-2 h-5 w-5" />
                  Super Like
                </GlassButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black-primary p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <Glass variant="dark" surface="raised" className="p-6 rounded-xl mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <GlassButton variant="subtle" onClick={onBack} className="mr-4">
                <ArrowLeft className="h-5 w-5" />
              </GlassButton>
              <h1 className="text-2xl font-bold text-white">Your Matches</h1>
            </div>
            <Badge variant="secondary" className="bg-primary/20 text-primary-foreground">
              {mockMatches.filter(m => m.isNewMatch).length} New
            </Badge>
          </div>
        </Glass>

        {/* Matches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {mockMatches.map((match) => (
            <GlassCard
              key={match.id}
              variant="dark"
              surface="interactive"
              glow="subtle"
              className="cursor-pointer hover:scale-[1.02] transition-transform overflow-hidden p-0"
              onClick={() => setSelectedMatch(match.id)}
            >
              <div className="relative">
                <div className="aspect-[3/4] relative overflow-hidden">
                  <img 
                    src={match.photos[0]} 
                    alt={match.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  {match.isNewMatch && (
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-green-500/90 text-white">New</Badge>
                    </div>
                  )}
                  
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-primary/90 text-primary-foreground">
                      <Zap className="mr-1 h-3 w-3" />
                      {match.resonanceScore}%
                    </Badge>
                  </div>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-xl font-bold text-white mb-1">
                    {match.name}, {match.age}
                  </h3>
                  <div className="flex items-center text-white/80 text-sm mb-2">
                    <MapPin className="mr-1 h-4 w-4" />
                    {match.location}
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {match.mutualInterests.slice(0, 2).map((interest, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="bg-white/20 text-white text-xs"
                      >
                        {interest}
                      </Badge>
                    ))}
                    {match.mutualInterests.length > 2 && (
                      <Badge className="bg-white/20 text-white text-xs">
                        +{match.mutualInterests.length - 2}
                      </Badge>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <GlassButton 
                      variant="subtle" 
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <X className="h-4 w-4" />
                    </GlassButton>
                    <GlassButton 
                      variant="primary" 
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        onMessage(match.id);
                      }}
                    >
                      <MessageSquare className="h-4 w-4" />
                    </GlassButton>
                    <GlassButton 
                      variant="secondary" 
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <Heart className="h-4 w-4" />
                    </GlassButton>
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MatchResults;
