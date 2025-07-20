
import React, { useState } from 'react';
import { Glass, GlassCard, GlassButton } from '@/components/ui/glass';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  MapPin, 
  Heart, 
  Camera, 
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Check
} from 'lucide-react';

interface OnboardingData {
  name: string;
  age: number;
  location: string;
  occupation: string;
  bio: string;
  interests: string[];
  photos: string[];
  preferences: {
    ageRange: [number, number];
    maxDistance: number;
    lookingFor: string[];
  };
}

const OnboardingFlow = ({ onComplete }: { onComplete: (userData: OnboardingData) => void }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<OnboardingData>({
    name: '',
    age: 25,
    location: '',
    occupation: '',
    bio: '',
    interests: [],
    photos: [],
    preferences: {
      ageRange: [22, 35],
      maxDistance: 50,
      lookingFor: []
    }
  });

  const totalSteps = 6;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const interestOptions = [
    'Photography', 'Hiking', 'Cooking', 'Travel', 'Music', 'Reading',
    'Fitness', 'Art', 'Technology', 'Dancing', 'Coffee', 'Movies',
    'Yoga', 'Gaming', 'Fashion', 'Food', 'Sports', 'Meditation'
  ];

  const lookingForOptions = [
    'Long-term relationship', 'Casual dating', 'New friends', 
    'Professional networking', 'Activity partners', 'Travel companions'
  ];

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const toggleLookingFor = (option: string) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        lookingFor: prev.preferences.lookingFor.includes(option)
          ? prev.preferences.lookingFor.filter(o => o !== option)
          : [...prev.preferences.lookingFor, option]
      }
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    const userData = {
      ...formData,
      id: Date.now().toString(),
      photos: formData.photos.length === 0 ? ['/api/placeholder/400/600'] : formData.photos
    };
    onComplete(userData);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return formData.name.trim() && formData.age >= 18;
      case 1: return formData.location.trim() && formData.occupation.trim();
      case 2: return formData.bio.trim();
      case 3: return formData.interests.length >= 3;
      case 4: return true; // Photos are optional
      case 5: return formData.preferences.lookingFor.length > 0;
      default: return true;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Tell us about yourself</h2>
              <p className="text-white/70">Let's start with the basics</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-white/80">What's your name?</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your first name"
                  className="bg-white/5 border-white/20 text-white mt-1"
                />
              </div>
              <div>
                <Label htmlFor="age" className="text-white/80">How old are you?</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData(prev => ({ ...prev, age: parseInt(e.target.value) || 18 }))}
                  min="18"
                  max="100"
                  className="bg-white/5 border-white/20 text-white mt-1"
                />
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Where are you located?</h2>
              <p className="text-white/70">This helps us find people nearby</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="location" className="text-white/80">Your location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="City, State"
                  className="bg-white/5 border-white/20 text-white mt-1"
                />
              </div>
              <div>
                <Label htmlFor="occupation" className="text-white/80">What do you do?</Label>
                <Input
                  id="occupation"
                  value={formData.occupation}
                  onChange={(e) => setFormData(prev => ({ ...prev, occupation: e.target.value }))}
                  placeholder="Your occupation"
                  className="bg-white/5 border-white/20 text-white mt-1"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Tell your story</h2>
              <p className="text-white/70">Share what makes you unique</p>
            </div>

            <div>
              <Label htmlFor="bio" className="text-white/80">About you</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Tell others about yourself, your interests, what you're looking for..."
                className="bg-white/5 border-white/20 text-white mt-1 min-h-[120px]"
              />
              <p className="text-white/50 text-sm mt-2">
                {formData.bio.length}/500 characters
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">What are you into?</h2>
              <p className="text-white/70">Select at least 3 interests</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {interestOptions.map((interest) => (
                <Badge
                  key={interest}
                  variant={formData.interests.includes(interest) ? "default" : "outline"}
                  className={`cursor-pointer text-center p-3 transition-all ${
                    formData.interests.includes(interest)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-white/5 text-white/80 hover:bg-white/10 border-white/20'
                  }`}
                  onClick={() => toggleInterest(interest)}
                >
                  {interest}
                </Badge>
              ))}
            </div>

            <div className="text-center">
              <p className="text-white/60 text-sm">
                Selected: {formData.interests.length} interests
              </p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Add your photos</h2>
              <p className="text-white/70">Show your best self (optional)</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, index) => (
                <GlassCard
                  key={index}
                  variant="subtle"
                  surface="interactive"
                  className="aspect-[3/4] flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
                >
                  <div className="text-center">
                    <Camera className="h-8 w-8 text-white/60 mx-auto mb-2" />
                    <p className="text-white/60 text-sm">Add Photo</p>
                  </div>
                </GlassCard>
              ))}
            </div>

            <div className="text-center">
              <p className="text-white/60 text-sm">
                You can add photos later from your profile
              </p>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">What are you looking for?</h2>
              <p className="text-white/70">Help us understand your intentions</p>
            </div>

            <div className="space-y-3">
              {lookingForOptions.map((option) => (
                <GlassCard
                  key={option}
                  variant={formData.preferences.lookingFor.includes(option) ? "primary" : "subtle"}
                  surface="interactive"
                  className={`cursor-pointer p-4 transition-all ${
                    formData.preferences.lookingFor.includes(option)
                      ? 'bg-primary/20 border-primary/40'
                      : 'hover:bg-white/5'
                  }`}
                  onClick={() => toggleLookingFor(option)}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">{option}</span>
                    {formData.preferences.lookingFor.includes(option) && (
                      <Check className="h-5 w-5 text-primary" />
                    )}
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black-primary flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <Glass variant="dark" surface="raised" className="p-4 rounded-xl mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/80 text-sm">Step {currentStep + 1} of {totalSteps}</span>
            <span className="text-primary font-medium text-sm">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </Glass>

        {/* Step Content */}
        <GlassCard variant="dark" surface="raised" className="p-8">
          {renderStep()}
        </GlassCard>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <GlassButton
            variant="subtle"
            onClick={prevStep}
            disabled={currentStep === 0}
            className={currentStep === 0 ? 'opacity-50 cursor-not-allowed' : ''}
          >
            <ChevronLeft className="mr-2 h-5 w-5" />
            Previous
          </GlassButton>

          <GlassButton
            variant="primary"
            onClick={nextStep}
            disabled={!canProceed()}
            className={!canProceed() ? 'opacity-50 cursor-not-allowed' : ''}
          >
            {currentStep === totalSteps - 1 ? 'Complete Setup' : 'Continue'}
            <ChevronRight className="ml-2 h-5 w-5" />
          </GlassButton>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;
