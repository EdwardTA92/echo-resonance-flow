
import React, { useState } from 'react';
import ResonanceMap from './ResonanceMap';
import ProfileManagement from './ProfileManagement';
import MessagingSystem from './MessagingSystem';
import SettingsPrivacy from './SettingsPrivacy';
import MatchResults from './MatchResults';
import Navigation from './Navigation';

const MainApp = ({ user }: { user: any }) => {
  const [currentView, setCurrentView] = useState('resonance');
  const [userProfile, setUserProfile] = useState(user);

  const handleNavigate = (view: string) => {
    setCurrentView(view);
  };

  const handleProfileSave = (profileData: any) => {
    setUserProfile({ ...userProfile, ...profileData });
  };

  const handleMessage = (matchId: string) => {
    setCurrentView('messages');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'resonance':
        return <ResonanceMap user={userProfile} />;
      case 'profile':
        return (
          <ProfileManagement
            user={userProfile}
            onSave={handleProfileSave}
            onBack={() => setCurrentView('resonance')}
          />
        );
      case 'messages':
        return (
          <MessagingSystem
            user={userProfile}
            onBack={() => setCurrentView('resonance')}
          />
        );
      case 'settings':
        return (
          <SettingsPrivacy
            user={userProfile}
            onBack={() => setCurrentView('resonance')}
          />
        );
      case 'matches':
        return (
          <MatchResults
            user={userProfile}
            onBack={() => setCurrentView('resonance')}
            onMessage={handleMessage}
          />
        );
      case 'search':
        return <ResonanceMap user={userProfile} />; // Placeholder for now
      default:
        return <ResonanceMap user={userProfile} />;
    }
  };

  return (
    <div className="relative min-h-screen">
      {renderCurrentView()}
      <Navigation
        currentView={currentView}
        onNavigate={handleNavigate}
        user={userProfile}
        unreadMessages={3}
        newMatches={2}
      />
    </div>
  );
};

export default MainApp;
