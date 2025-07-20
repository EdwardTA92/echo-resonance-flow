
import React from 'react';
import { Glass, GlassButton } from '@/components/ui/glass';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Search, 
  Heart, 
  MessageSquare, 
  User, 
  Settings,
  Bell,
  Zap
} from 'lucide-react';

interface NavigationProps {
  currentView: string;
  onNavigate: (view: string) => void;
  user: any;
  unreadMessages?: number;
  newMatches?: number;
}

const Navigation = ({ currentView, onNavigate, user, unreadMessages = 0, newMatches = 0 }: NavigationProps) => {
  const navItems = [
    { id: 'resonance', icon: Home, label: 'Discover', badge: null },
    { id: 'search', icon: Search, label: 'Search', badge: null },
    { id: 'matches', icon: Heart, label: 'Matches', badge: newMatches },
    { id: 'messages', icon: MessageSquare, label: 'Messages', badge: unreadMessages },
    { id: 'profile', icon: User, label: 'Profile', badge: null },
  ];

  return (
    <Glass 
      variant="dark" 
      surface="raised" 
      className="fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-3 rounded-2xl z-50"
    >
      <div className="flex items-center space-x-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <div key={item.id} className="relative">
              <GlassButton
                variant={isActive ? 'primary' : 'subtle'}
                surface="interactive"
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all ${
                  isActive ? 'scale-110' : 'hover:scale-105'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-primary-foreground' : 'text-white/80'}`} />
                <span className={`text-xs mt-1 ${isActive ? 'text-primary-foreground' : 'text-white/60'}`}>
                  {item.label}
                </span>
              </GlassButton>
              
              {item.badge && item.badge > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground min-w-[20px] h-5 rounded-full flex items-center justify-center text-xs">
                  {item.badge > 99 ? '99+' : item.badge}
                </Badge>
              )}
            </div>
          );
        })}
        
        {/* Settings button */}
        <div className="ml-2 pl-2 border-l border-white/20">
          <GlassButton
            variant="subtle"
            surface="interactive"
            onClick={() => onNavigate('settings')}
            className="flex items-center justify-center w-12 h-12 rounded-xl"
          >
            <Settings className="h-5 w-5 text-white/80" />
          </GlassButton>
        </div>
      </div>
    </Glass>
  );
};

export default Navigation;
