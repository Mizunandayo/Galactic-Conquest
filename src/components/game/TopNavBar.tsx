'use client';

import { Button } from '@/components/ui/button';
import { Coins, LogOut, RotateCcw, Sparkles } from 'lucide-react';

interface TopNavBarProps {
  username: string;
  tokens: number;
  unreadCount: number;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  onReset: () => void;
  onAddDevTokens: () => void;
}

export function TopNavBar({
  username,
  tokens,
  unreadCount,
  activeTab,
  onTabChange,
  onLogout,
  onReset,
  onAddDevTokens,
}: TopNavBarProps) {
  const tabs = [
    { id: 'stats', label: 'Stats' },
    { id: 'troops', label: 'Troops' },
    { id: 'base', label: 'Base' },
    { id: 'attack', label: 'Attack' },
    { id: 'activity', label: 'Activity' },
    { id: 'alerts', label: 'Alerts', badge: unreadCount },
    { id: 'referral', label: 'Referral' },
    { id: 'guide', label: 'Guide' },
  ];

  return (
    <nav className="border-b border-border/40 backdrop-blur-md sticky top-0 z-50 bg-background/80">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#bd34fe] to-[#47caff] flex items-center justify-center">
                <span className="text-lg">⚡</span>
              </div>
              <span className="text-xl font-semibold gradient-text">Galactic</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-1.5 h-1.5 rounded-full bg-[#47caff]" />
              {username}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card/50 border border-border/40">
              <Coins className="w-4 h-4 text-[#bd34fe]" />
              <span className="text-sm font-medium">{tokens.toFixed(2)}</span>
            </div>
            
            <Button
              onClick={onAddDevTokens}
              size="sm"
              variant="ghost"
              className="h-8 text-xs text-muted-foreground hover:text-foreground"
            >
              <Sparkles className="w-3.5 h-3.5" />
            </Button>
            
            <Button 
              onClick={onLogout} 
              size="sm" 
              variant="ghost"
              className="h-8 text-xs text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-3.5 h-3.5" />
            </Button>
            
            <Button 
              onClick={onReset} 
              size="sm" 
              variant="ghost"
              className="h-8 text-xs text-muted-foreground hover:text-destructive"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative px-1 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="absolute -top-1 -right-3 bg-[#bd34fe] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">
                  {tab.badge}
                </span>
              )}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#bd34fe] to-[#47caff]" />
              )}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
