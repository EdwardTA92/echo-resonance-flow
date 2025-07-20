
import React, { useState } from 'react';
import { Glass, GlassCard, GlassButton } from '@/components/ui/glass';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Shield, 
  Eye, 
  Bell, 
  MapPin, 
  Users, 
  Heart,
  Smartphone,
  Globe
} from 'lucide-react';

const SettingsPrivacy = ({ user, onBack }: { user: any; onBack: () => void }) => {
  const [settings, setSettings] = useState({
    // Privacy Settings
    profileVisibility: true,
    showDistance: true,
    showAge: true,
    showLastActive: false,
    allowMessages: true,
    
    // Notification Settings
    pushNotifications: true,
    emailNotifications: false,
    matchNotifications: true,
    messageNotifications: true,
    
    // Discovery Settings
    discoverable: true,
    maxDistance: [50],
    ageRange: [22, 35],
    showMeFirst: false,
    
    // Safety Settings
    photoVerification: false,
    reportingEnabled: true,
    blockingEnabled: true
  });

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-black-primary p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Glass variant="dark" surface="raised" className="p-6 rounded-xl mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <GlassButton variant="subtle" onClick={onBack} className="mr-4">
                <ArrowLeft className="h-5 w-5" />
              </GlassButton>
              <h1 className="text-2xl font-bold text-white">Settings & Privacy</h1>
            </div>
            <Badge variant="secondary" className="bg-primary/20 text-primary-foreground">
              <Shield className="mr-1 h-4 w-4" />
              Secure
            </Badge>
          </div>
        </Glass>

        <div className="space-y-6">
          {/* Privacy Settings */}
          <GlassCard variant="dark" surface="raised">
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-4">
                <Eye className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-semibold text-white">Privacy Settings</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white font-medium">Profile Visibility</Label>
                    <p className="text-white/60 text-sm">Make your profile visible to others</p>
                  </div>
                  <Switch
                    checked={settings.profileVisibility}
                    onCheckedChange={(checked) => updateSetting('profileVisibility', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white font-medium">Show Distance</Label>
                    <p className="text-white/60 text-sm">Display distance to other users</p>
                  </div>
                  <Switch
                    checked={settings.showDistance}
                    onCheckedChange={(checked) => updateSetting('showDistance', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white font-medium">Show Age</Label>
                    <p className="text-white/60 text-sm">Display your age on your profile</p>
                  </div>
                  <Switch
                    checked={settings.showAge}
                    onCheckedChange={(checked) => updateSetting('showAge', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white font-medium">Show Last Active</Label>
                    <p className="text-white/60 text-sm">Let others see when you were last online</p>
                  </div>
                  <Switch
                    checked={settings.showLastActive}
                    onCheckedChange={(checked) => updateSetting('showLastActive', checked)}
                  />
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Notification Settings */}
          <GlassCard variant="dark" surface="raised">
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-4">
                <Bell className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-semibold text-white">Notifications</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Smartphone className="h-5 w-5 text-white/60" />
                    <div>
                      <Label className="text-white font-medium">Push Notifications</Label>
                      <p className="text-white/60 text-sm">Receive notifications on your device</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => updateSetting('pushNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Globe className="h-5 w-5 text-white/60" />
                    <div>
                      <Label className="text-white font-medium">Email Notifications</Label>
                      <p className="text-white/60 text-sm">Receive updates via email</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Heart className="h-5 w-5 text-white/60" />
                    <div>
                      <Label className="text-white font-medium">New Matches</Label>
                      <p className="text-white/60 text-sm">Get notified about new connections</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.matchNotifications}
                    onCheckedChange={(checked) => updateSetting('matchNotifications', checked)}
                  />
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Discovery Settings */}
          <GlassCard variant="dark" surface="raised">
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-4">
                <MapPin className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-semibold text-white">Discovery Preferences</h2>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white font-medium">Discoverable</Label>
                    <p className="text-white/60 text-sm">Allow others to find you</p>
                  </div>
                  <Switch
                    checked={settings.discoverable}
                    onCheckedChange={(checked) => updateSetting('discoverable', checked)}
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-white font-medium">Maximum Distance</Label>
                  <div className="px-2">
                    <Slider
                      value={settings.maxDistance}
                      onValueChange={(value) => updateSetting('maxDistance', value)}
                      max={100}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-white/60 text-sm mt-1">
                      <span>1 km</span>
                      <span className="text-primary font-medium">{settings.maxDistance[0]} km</span>
                      <span>100+ km</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-white font-medium">Age Range</Label>
                  <div className="px-2">
                    <Slider
                      value={settings.ageRange}
                      onValueChange={(value) => updateSetting('ageRange', value)}
                      max={60}
                      min={18}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-white/60 text-sm mt-1">
                      <span>18</span>
                      <span className="text-primary font-medium">
                        {settings.ageRange[0]} - {settings.ageRange[1]} years
                      </span>
                      <span>60+</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Safety Settings */}
          <GlassCard variant="dark" surface="raised">
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-semibold text-white">Safety & Security</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white font-medium">Photo Verification</Label>
                    <p className="text-white/60 text-sm">Verify your photos for added trust</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {settings.photoVerification && (
                      <Badge className="bg-green-500/20 text-green-400">Verified</Badge>
                    )}
                    <Switch
                      checked={settings.photoVerification}
                      onCheckedChange={(checked) => updateSetting('photoVerification', checked)}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <GlassButton variant="subtle" className="w-full mb-3">
                    Block & Report Users
                  </GlassButton>
                  <GlassButton variant="subtle" className="w-full mb-3">
                    Safety Center
                  </GlassButton>
                  <GlassButton variant="subtle" className="w-full">
                    Privacy Policy
                  </GlassButton>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Save Button */}
          <div className="flex justify-center pt-4">
            <GlassButton variant="primary" surface="floating" className="px-8">
              Save All Settings
            </GlassButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPrivacy;
