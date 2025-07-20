
import React, { useState } from 'react';
import { Glass, GlassCard, GlassButton } from '@/components/ui/glass';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Camera, Edit, Plus, X, MapPin, Briefcase, GraduationCap } from 'lucide-react';

interface ProfileData {
  name: string;
  age: number;
  location: string;
  occupation: string;
  education: string;
  bio: string;
  interests: string[];
  photos: string[];
}

const ProfileManagement = ({ user, onSave, onBack }: { 
  user: any;
  onSave: (data: ProfileData) => void;
  onBack: () => void;
}) => {
  const [profile, setProfile] = useState<ProfileData>({
    name: user?.name || '',
    age: user?.age || 25,
    location: user?.location || '',
    occupation: user?.occupation || '',
    education: user?.education || '',
    bio: user?.bio || '',
    interests: user?.interests || [],
    photos: user?.photos || []
  });

  const [newInterest, setNewInterest] = useState('');

  const handleAddInterest = () => {
    if (newInterest.trim() && !profile.interests.includes(newInterest.trim())) {
      setProfile(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()]
      }));
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setProfile(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };

  const handleSave = () => {
    onSave(profile);
    onBack();
  };

  return (
    <div className="min-h-screen bg-black-primary p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Glass variant="dark" surface="raised" className="p-6 rounded-xl mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Edit Profile</h1>
            <div className="flex gap-3">
              <GlassButton variant="subtle" onClick={onBack}>
                Cancel
              </GlassButton>
              <GlassButton variant="primary" onClick={handleSave}>
                Save Changes
              </GlassButton>
            </div>
          </div>
        </Glass>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Photo Management */}
          <div className="lg:col-span-1">
            <GlassCard variant="dark" surface="raised" className="mb-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Camera className="mr-2 h-5 w-5" />
                Photos
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {profile.photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <img 
                      src={photo} 
                      alt={`Profile ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => setProfile(prev => ({
                        ...prev,
                        photos: prev.photos.filter((_, i) => i !== index)
                      }))}
                      className="absolute top-1 right-1 bg-red-500/80 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <GlassButton 
                  variant="subtle" 
                  surface="interactive"
                  className="h-24 flex flex-col items-center justify-center"
                >
                  <Plus className="h-6 w-6 mb-1" />
                  <span className="text-xs">Add Photo</span>
                </GlassButton>
              </div>
            </GlassCard>
          </div>

          {/* Main Profile Form */}
          <div className="lg:col-span-2">
            <GlassCard variant="dark" surface="raised">
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-white/80">Name</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                      className="bg-white/5 border-white/20 text-white mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="age" className="text-white/80">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      value={profile.age}
                      onChange={(e) => setProfile(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                      className="bg-white/5 border-white/20 text-white mt-1"
                    />
                  </div>
                </div>

                {/* Location & Work */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="location" className="text-white/80 flex items-center">
                      <MapPin className="mr-2 h-4 w-4" />
                      Location
                    </Label>
                    <Input
                      id="location"
                      value={profile.location}
                      onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                      className="bg-white/5 border-white/20 text-white mt-1"
                      placeholder="City, State"
                    />
                  </div>
                  <div>
                    <Label htmlFor="occupation" className="text-white/80 flex items-center">
                      <Briefcase className="mr-2 h-4 w-4" />
                      Occupation
                    </Label>
                    <Input
                      id="occupation"
                      value={profile.occupation}
                      onChange={(e) => setProfile(prev => ({ ...prev, occupation: e.target.value }))}
                      className="bg-white/5 border-white/20 text-white mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="education" className="text-white/80 flex items-center">
                      <GraduationCap className="mr-2 h-4 w-4" />
                      Education
                    </Label>
                    <Input
                      id="education"
                      value={profile.education}
                      onChange={(e) => setProfile(prev => ({ ...prev, education: e.target.value }))}
                      className="bg-white/5 border-white/20 text-white mt-1"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <Label htmlFor="bio" className="text-white/80">About Me</Label>
                  <Textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                    className="bg-white/5 border-white/20 text-white mt-1 min-h-[100px]"
                    placeholder="Tell others about yourself..."
                  />
                </div>

                {/* Interests */}
                <div>
                  <Label className="text-white/80">Interests</Label>
                  <div className="flex flex-wrap gap-2 mt-2 mb-3">
                    {profile.interests.map((interest, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-primary/20 text-primary-foreground hover:bg-primary/30 cursor-pointer"
                        onClick={() => handleRemoveInterest(interest)}
                      >
                        {interest} <X className="ml-1 h-3 w-3" />
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newInterest}
                      onChange={(e) => setNewInterest(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddInterest()}
                      placeholder="Add an interest..."
                      className="bg-white/5 border-white/20 text-white"
                    />
                    <GlassButton
                      variant="primary"
                      onClick={handleAddInterest}
                      disabled={!newInterest.trim()}
                    >
                      Add
                    </GlassButton>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileManagement;
