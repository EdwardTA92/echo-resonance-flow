
import React, { useState, useRef, useEffect } from 'react';
import { Glass, GlassCard, GlassButton } from '@/components/ui/glass';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Send, Phone, Video, MoreVertical, ArrowLeft, Heart, Star } from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'system';
}

interface Chat {
  id: string;
  matchId: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: Date;
  unread: number;
  isOnline: boolean;
  resonanceScore: number;
}

const MessagingSystem = ({ user, onBack }: { user: any; onBack: () => void }) => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const mockChats: Chat[] = [
    {
      id: '1',
      matchId: 'match-1',
      name: 'Sarah Chen',
      avatar: '/api/placeholder/40/40',
      lastMessage: 'That sounds amazing! I love hiking too 🏔️',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      unread: 2,
      isOnline: true,
      resonanceScore: 94
    },
    {
      id: '2',
      matchId: 'match-2',
      name: 'Alex Rodriguez',
      avatar: '/api/placeholder/40/40',
      lastMessage: 'Coffee sounds perfect! How about Saturday?',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      unread: 0,
      isOnline: false,
      resonanceScore: 87
    },
    {
      id: '3',
      matchId: 'match-3',
      name: 'Emma Thompson',
      avatar: '/api/placeholder/40/40',
      lastMessage: 'Thanks for the book recommendation!',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      unread: 1,
      isOnline: true,
      resonanceScore: 91
    }
  ];

  const mockMessages: Message[] = [
    {
      id: '1',
      senderId: 'match-1',
      content: 'Hey! I saw we both love photography. Your landscape shots are incredible!',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      type: 'text'
    },
    {
      id: '2',
      senderId: user.id,
      content: 'Thank you! I noticed you enjoy hiking too. Have you been to Yosemite?',
      timestamp: new Date(Date.now() - 50 * 60 * 1000),
      type: 'text'
    },
    {
      id: '3',
      senderId: 'match-1',
      content: 'That sounds amazing! I love hiking too 🏔️',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      type: 'text'
    }
  ];

  const selectedChatData = mockChats.find(chat => chat.id === selectedChat);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        senderId: user.id,
        content: message,
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, newMessage]);
      setMessage('');
    }
  };

  if (!selectedChat) {
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
                <h1 className="text-2xl font-bold text-white">Messages</h1>
              </div>
              <Badge variant="secondary" className="bg-primary/20 text-primary-foreground">
                {mockChats.filter(c => c.unread > 0).length} New
              </Badge>
            </div>
          </Glass>

          {/* Chat List */}
          <div className="grid gap-4">
            {mockChats.map((chat) => (
              <GlassCard
                key={chat.id}
                variant="dark"
                surface="interactive"
                glow="subtle"
                className="cursor-pointer hover:scale-[1.01] transition-transform"
                onClick={() => {
                  setSelectedChat(chat.id);
                  setMessages(mockMessages);
                }}
              >
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={chat.avatar} />
                      <AvatarFallback className="bg-primary/20 text-primary-foreground">
                        {chat.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {chat.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-black-primary"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-white font-semibold truncate">{chat.name}</h3>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          <Heart className="h-4 w-4 text-primary fill-primary" />
                          <span className="text-primary font-medium text-sm">{chat.resonanceScore}%</span>
                        </div>
                        <span className="text-white/60 text-sm">
                          {chat.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                    <p className="text-white/70 text-sm truncate">{chat.lastMessage}</p>
                  </div>
                  
                  {chat.unread > 0 && (
                    <Badge className="bg-primary text-primary-foreground min-w-[24px] h-6 rounded-full flex items-center justify-center">
                      {chat.unread}
                    </Badge>
                  )}
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black-primary flex flex-col">
      {/* Chat Header */}
      <Glass variant="dark" surface="raised" className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-4">
            <GlassButton 
              variant="subtle" 
              onClick={() => setSelectedChat(null)}
              className="p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </GlassButton>
            
            <div className="relative">
              <Avatar className="h-12 w-12">
                <AvatarImage src={selectedChatData?.avatar} />
                <AvatarFallback className="bg-primary/20 text-primary-foreground">
                  {selectedChatData?.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              {selectedChatData?.isOnline && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black-primary"></div>
              )}
            </div>
            
            <div>
              <h2 className="text-white font-semibold">{selectedChatData?.name}</h2>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <Heart className="h-3 w-3 text-primary fill-primary" />
                  <span className="text-primary text-sm">{selectedChatData?.resonanceScore}% Resonance</span>
                </div>
                <span className="text-white/60 text-sm">
                  {selectedChatData?.isOnline ? 'Online' : 'Last seen 2h ago'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <GlassButton variant="subtle" className="p-2">
              <Phone className="h-5 w-5" />
            </GlassButton>
            <GlassButton variant="subtle" className="p-2">
              <Video className="h-5 w-5" />
            </GlassButton>
            <GlassButton variant="subtle" className="p-2">
              <MoreVertical className="h-5 w-5" />
            </GlassButton>
          </div>
        </div>
      </Glass>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  msg.senderId === user.id
                    ? 'bg-primary text-primary-foreground ml-12'
                    : 'bg-white/10 text-white mr-12 backdrop-blur-md border border-white/20'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <p className={`text-xs mt-1 ${
                  msg.senderId === user.id ? 'text-primary-foreground/70' : 'text-white/60'
                }`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <Glass variant="dark" surface="raised" className="p-4 border-t border-white/10">
        <div className="max-w-4xl mx-auto flex items-center space-x-4">
          <div className="flex-1">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message..."
              className="bg-white/5 border-white/20 text-white"
            />
          </div>
          <GlassButton
            variant="primary"
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="p-3"
          >
            <Send className="h-5 w-5" />
          </GlassButton>
        </div>
      </Glass>
    </div>
  );
};

export default MessagingSystem;
