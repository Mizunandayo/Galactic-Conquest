'use client';

import { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Swords,
  Shield,
  TrendingUp,
  Home,
  Users,
  Coins,
  DollarSign,
  CheckCircle,
  Filter,
} from 'lucide-react';

export function ActivityLog() {
  const { player } = useGame();
  const [filter, setFilter] = useState<string>('all');

  if (!player) return null;

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'training':
        return <Users className="w-4 h-4" />;
      case 'collected':
        return <CheckCircle className="w-4 h-4" />;
      case 'collected_returning':
        return <CheckCircle className="w-4 h-4" />;
      case 'upgrade':
        return <Home className="w-4 h-4" />;
      case 'stat_upgrade':
        return <TrendingUp className="w-4 h-4" />;
      case 'claim':
        return <Coins className="w-4 h-4" />;
      case 'upkeep':
      case 'upkeep_paid':
      case 'upkeep_failed':
      case 'upkeep_simulation':
        return <DollarSign className="w-4 h-4" />;
      case 'attack_won':
        return <Swords className="w-4 h-4 text-green-400" />;
      case 'attack_lost':
        return <Swords className="w-4 h-4 text-red-400" />;
      case 'defense_success':
      case 'defense_failed':
        return <Shield className="w-4 h-4" />;
      case 'scout':
      case 'map_reroll':
        return <Swords className="w-4 h-4 text-blue-400" />;
      default:
        return <CheckCircle className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'training':
        return 'bg-blue-500/20 text-blue-400';
      case 'collected':
      case 'collected_returning':
        return 'bg-green-500/20 text-green-400';
      case 'upgrade':
        return 'bg-purple-500/20 text-purple-400';
      case 'stat_upgrade':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'claim':
        return 'bg-green-500/20 text-green-400';
      case 'upkeep':
      case 'upkeep_paid':
      case 'upkeep_failed':
      case 'upkeep_simulation':
        return 'bg-orange-500/20 text-orange-400';
      case 'attack_won':
        return 'bg-green-500/20 text-green-400';
      case 'attack_lost':
        return 'bg-red-500/20 text-red-400';
      case 'defense_success':
        return 'bg-blue-500/20 text-blue-400';
      case 'defense_failed':
        return 'bg-red-500/20 text-red-400';
      case 'scout':
      case 'map_reroll':
        return 'bg-cyan-500/20 text-cyan-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  // Filter activities based on selected filter
  const filteredActivities = player.activities.filter((activity) => {
    if (filter === 'all') return true;
    
    switch (filter) {
      case 'training':
        return activity.type === 'training' || activity.type === 'collected' || activity.type === 'collected_returning';
      case 'attacks':
        return activity.type === 'attack_won' || activity.type === 'attack_lost';
      case 'defense':
        return activity.type === 'defense_success' || activity.type === 'defense_failed';
      case 'scout':
        return activity.type === 'scout' || activity.type === 'map_reroll';
      case 'upkeep':
        return activity.type === 'upkeep' || activity.type === 'upkeep_paid' || activity.type === 'upkeep_failed' || activity.type === 'upkeep_simulation';
      case 'mining':
        return activity.type === 'claim';
      case 'upgrades':
        return activity.type === 'upgrade' || activity.type === 'stat_upgrade';
      default:
        return true;
    }
  });

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold text-white mb-6">Activity Log</h2>

      <Card className="bg-black/40 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Recent Actions</CardTitle>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Filter activities" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="all" className="text-white">All Activities</SelectItem>
                  <SelectItem value="training" className="text-white">Training & Troops</SelectItem>
                  <SelectItem value="attacks" className="text-white">Attacks</SelectItem>
                  <SelectItem value="defense" className="text-white">Defense</SelectItem>
                  <SelectItem value="scout" className="text-white">Scout & Maps</SelectItem>
                  <SelectItem value="upkeep" className="text-white">Upkeep</SelectItem>
                  <SelectItem value="mining" className="text-white">Mining</SelectItem>
                  <SelectItem value="upgrades" className="text-white">Upgrades</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredActivities.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              {filter === 'all' 
                ? 'No activities yet. Start training troops or upgrading your base!'
                : `No ${filter} activities found. Try a different filter.`
              }
            </div>
          ) : (
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-3">
                {filteredActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-3 bg-gray-800/30 rounded-lg border border-gray-700"
                  >
                    <div
                      className={`p-2 rounded-lg flex-shrink-0 ${getActivityColor(
                        activity.type
                      )}`}
                    >
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm">{activity.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
