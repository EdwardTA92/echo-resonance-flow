
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Camera, Mic, MapPin, Heart, Users, Zap, Lightbulb } from "lucide-react";

const OnboardingFlow = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({
    name: '',
    pronouns: '',
    email: '',
    bio: '',
    photo: null,
    intents: [],
    permissions: {
      camera: false,
      microphone: false,
      location: false
    },
    acceptTerms: false
  });

  const intentOptions = [
    { id: 'romantic', label: 'Romantic', icon: Heart, color: 'text-pink-400' },
    { id: 'platonic', label: 'Platonic', icon: Users, color: 'text-blue-400' },
    { id: 'creative', label: 'Creative', icon: Lightbulb, color: 'text-yellow-400' },
    { id: 'undefined', label: 'Undefined', icon: Zap, color: 'text-purple-400' },
    { id: 'group', label: 'Group', icon: Users, color: 'text-green-400' }
  ];

  const handleInputChange = (field, value) => {
    setUserData(prev => ({ ...prev, [field]: value }));
  };

  const handleIntentToggle = (intentId) => {
    setUserData(prev => ({
      ...prev,
      intents: prev.intents.includes(intentId)
        ? prev.intents.filter(id => id !== intentId)
        : [...prev.intents, intentId]
    }));
  };

  const handlePermissionChange = (permission, value) => {
    setUserData(prev => ({
      ...prev,
      permissions: { ...prev.permissions, [permission]: value }
    }));
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Complete onboarding
      onComplete(userData);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return userData.name && userData.email;
      case 2:
        return userData.intents.length > 0;
      case 3:
        return true; // Permissions are optional
      case 4:
        return userData.acceptTerms;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-800 flex items-center justify-center px-4">
      <Card className="w-full max-w-2xl bg-white/10 backdrop-blur-lg border-white/20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-white">
            Step {step} of 4
          </CardTitle>
          <div className="w-full bg-white/20 rounded-full h-2 mt-4">
            <div 
              className="bg-gradient-to-r from-purple-400 to-blue-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-xl text-white text-center">Tell us about yourself</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-white">Name</Label>
                  <Input
                    id="name"
                    value={userData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <Label htmlFor="pronouns" className="text-white">Pronouns (optional)</Label>
                  <Input
                    id="pronouns"
                    value={userData.pronouns}
                    onChange={(e) => handleInputChange('pronouns', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    placeholder="they/them, she/her, he/him, etc."
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={userData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <Label htmlFor="bio" className="text-white">Bio (optional)</Label>
                  <Textarea
                    id="bio"
                    value={userData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    placeholder="Tell us a bit about yourself..."
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-xl text-white text-center">What kind of connections are you seeking?</h3>
              <p className="text-white/70 text-center text-sm">Select all that apply</p>
              
              <div className="grid grid-cols-2 gap-4">
                {intentOptions.map((intent) => {
                  const Icon = intent.icon;
                  return (
                    <Card
                      key={intent.id}
                      className={`cursor-pointer transition-all duration-300 ${
                        userData.intents.includes(intent.id)
                          ? 'bg-white/20 border-white/40 scale-105'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                      onClick={() => handleIntentToggle(intent.id)}
                    >
                      <CardContent className="p-4 text-center">
                        <Icon className={`w-8 h-8 mx-auto mb-2 ${intent.color}`} />
                        <p className="text-white font-medium">{intent.label}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-xl text-white text-center">Enable enhanced features</h3>
              <p className="text-white/70 text-center text-sm">
                These permissions help us understand your subconscious preferences for better matches
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-lg">
                  <Checkbox
                    id="camera"
                    checked={userData.permissions.camera}
                    onCheckedChange={(checked) => handlePermissionChange('camera', checked)}
                  />
                  <Camera className="w-5 h-5 text-blue-400" />
                  <div className="flex-1">
                    <Label htmlFor="camera" className="text-white font-medium">Camera Access</Label>
                    <p className="text-white/60 text-sm">For gaze tracking and interaction analysis</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-lg">
                  <Checkbox
                    id="microphone"
                    checked={userData.permissions.microphone}
                    onCheckedChange={(checked) => handlePermissionChange('microphone', checked)}
                  />
                  <Mic className="w-5 h-5 text-green-400" />
                  <div className="flex-1">
                    <Label htmlFor="microphone" className="text-white font-medium">Microphone Access</Label>
                    <p className="text-white/60 text-sm">For voice tone analysis (optional)</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-lg">
                  <Checkbox
                    id="location"
                    checked={userData.permissions.location}
                    onCheckedChange={(checked) => handlePermissionChange('location', checked)}
                  />
                  <MapPin className="w-5 h-5 text-purple-400" />
                  <div className="flex-1">
                    <Label htmlFor="location" className="text-white font-medium">Location Access</Label>
                    <p className="text-white/60 text-sm">For zone-based discovery (anonymized)</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-xl text-white text-center">Terms & Privacy</h3>
              
              <div className="bg-white/5 p-6 rounded-lg space-y-4">
                <h4 className="text-white font-medium">How Impression Works:</h4>
                <ul className="text-white/80 text-sm space-y-2">
                  <li>• We track how you interact with profiles (viewing time, scroll patterns)</li>
                  <li>• This data helps us identify mutual subconscious interest</li>
                  <li>• All tracking is anonymized until mutual interest is confirmed</li>
                  <li>• You can revoke permissions at any time</li>
                  <li>• Your precise location is never shared or stored</li>
                </ul>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="terms"
                  checked={userData.acceptTerms}
                  onCheckedChange={(checked) => handleInputChange('acceptTerms', checked)}
                />
                <div className="flex-1">
                  <Label htmlFor="terms" className="text-white">
                    I accept the Terms of Service and Privacy Policy
                  </Label>
                  <p className="text-white/60 text-sm mt-1">
                    By accepting, you consent to behavioral analysis for matching purposes
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Back
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            >
              {step === 4 ? 'Complete' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingFlow;
