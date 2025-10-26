'use client';

import { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { TopNavBar } from './TopNavBar';
import { StatsOverview } from './StatsOverview';
import { TroopTraining } from './TroopTraining';
import { BaseBuilding } from './BaseBuilding';
import { AttackablePlayers } from './AttackablePlayers';
import { ActivityLog } from './ActivityLog';
import { InfoGuide } from './InfoGuide';
import { ReferralHistory } from './ReferralPage';

type Tab = 'stats' | 'troops' | 'base' | 'attack' | 'activity' | 'alerts' | 'referral' | 'guide';

export function GameDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('stats');
  const { player, logout, resetGame, markNotificationRead, addDevTokens } = useGame();

  if (!player) return null;

  const renderContent = () => {
    switch (activeTab) {
      case 'stats':
        return <StatsOverview />;
      case 'troops':
        return <TroopTraining />;
      case 'base':
        return <BaseBuilding />;
      case 'attack':
        return <AttackablePlayers />;
      case 'activity':
        return <ActivityLog />;
      case 'alerts':
        return (
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-white mb-6 neon-text">Notifications</h2>
            {player.notifications.length === 0 ? (
              <div className="text-center text-muted-foreground py-12 rounded-lg border border-border bg-card/50">
                <p className="text-lg">No notifications yet</p>
              </div>
            ) : (
              player.notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-5 rounded-lg border transition-all duration-300 glow-card ${
                    notif.isRead
                      ? 'bg-card/50 border-border'
                      : 'bg-primary/10 border-primary/50 shadow-lg shadow-primary/20'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className={`text-xs font-medium px-3 py-1 rounded-full uppercase tracking-wide ${
                            notif.type === 'victory'
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                              : notif.type === 'defeat'
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                              : 'bg-primary/20 text-primary border border-primary/30'
                          }`}
                        >
                          {notif.type}
                        </span>
                        <span className="text-xs text-muted-foreground font-mono">
                          {new Date(notif.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-white leading-relaxed">{notif.message}</p>
                    </div>
                    {!notif.isRead && (
                      <button
                        onClick={() => markNotificationRead(notif.id)}
                        className="ml-4 px-4 py-2 bg-primary/20 hover:bg-primary/30 border border-primary/50 rounded-lg text-sm text-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
                      >
                        Mark Read
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        );
      case 'referral':
        return <ReferralHistory />;
      case 'guide':
        return <InfoGuide />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      <TopNavBar
        username={player.username}
        tokens={player.tokens}
        unreadCount={player.notifications.filter((n) => !n.isRead).length}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as Tab)}
        onLogout={logout}
        onReset={resetGame}
        onAddDevTokens={() => addDevTokens(1000)}
      />
      <div className="container mx-auto px-4 py-8 max-w-7xl">{renderContent()}</div>
    </div>
  );
}
