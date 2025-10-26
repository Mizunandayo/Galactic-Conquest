'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { TROOP_CONFIG, type TroopData, type BattleMap } from '@/contexts/GameContext';
import { Swords, Trophy, Skull, Map } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface BattleDisplayProps {
  attacker: string;
  defender: string;
  attackerTroops: Partial<TroopData>;
  defenderTroops: Partial<TroopData>;
  map: BattleMap;
  result: {
    won: boolean;
    stolenTokens: number;
    lossRate: number;
  };
  onComplete: () => void;
}

export function BattleDisplay({
  attacker,
  defender,
  attackerTroops,
  map,
  result,
  onComplete,
}: BattleDisplayProps) {
  const [phase, setPhase] = useState<'combat' | 'result'>('combat');

  useEffect(() => {
    // Show combat for 5 seconds
    const timer = setTimeout(() => {
      setPhase('result');
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const troopIcons: Record<keyof TroopData, string> = {
    infantry: '🪖',
    lightVehicles: '🏎️',
    heavyMechs: '🤖',
    artillery: '🎯',
    airFighters: '✈️',
    bombers: '💣',
    drones: '🚁',
  };

  const getMapTypeColor = (type: string) => {
    switch (type) {
      case 'standard': return 'bg-blue-500';
      case 'unstable': return 'bg-red-500';
      case 'blessed': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Dialog open onOpenChange={onComplete}>
      <DialogContent className="max-w-4xl bg-gradient-to-br from-red-900 via-purple-900 to-black border-red-500/50 text-white">
        {phase === 'combat' ? (
          <div className="space-y-6 py-8">
            {/* Battle Header */}
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2">⚔️ Battle in Progress ⚔️</h2>
              <div className="flex items-center justify-center gap-4 text-xl">
                <span className="text-blue-400 font-bold">{attacker}</span>
                <Swords className="w-6 h-6 text-red-500 animate-pulse" />
                <span className="text-red-400 font-bold">{defender}</span>
              </div>
            </div>

            {/* Map Information */}
            <div className="bg-black/30 rounded-lg border border-gray-700 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Map className="w-5 h-5 text-cyan-400" />
                <h3 className="text-xl font-bold text-white">{map.name}</h3>
                <Badge className={getMapTypeColor(map.type)}>
                  {map.type.toUpperCase()}
                </Badge>
              </div>
              <p className="text-gray-300 text-sm mb-3">{map.description}</p>
              
              <div className="grid grid-cols-3 gap-2">
                {map.boost && (
                  <div className="bg-green-900/30 border border-green-500/50 rounded p-2">
                    <p className="text-xs text-green-400 mb-1">BOOST</p>
                    <p className="text-sm text-white">
                      {TROOP_CONFIG[map.boost.troop].name} +{map.boost.amount}%
                    </p>
                  </div>
                )}
                {map.disabled && (
                  <div className="bg-red-900/30 border border-red-500/50 rounded p-2">
                    <p className="text-xs text-red-400 mb-1">DISABLED</p>
                    <p className="text-sm text-white">
                      {TROOP_CONFIG[map.disabled].name}
                    </p>
                  </div>
                )}
                {map.specialEffect && (
                  <div className="bg-purple-900/30 border border-purple-500/50 rounded p-2">
                    <p className="text-xs text-purple-400 mb-1">SPECIAL</p>
                    <p className="text-xs text-white">{map.specialEffect}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Combat Animation */}
            <div className="relative h-64 bg-black/30 rounded-lg border border-gray-700 overflow-hidden">
              {/* Attacker troops (left side) */}
              <div className="absolute left-0 top-0 bottom-0 w-1/2 p-4 flex flex-wrap gap-2 content-start">
                {(Object.keys(attackerTroops) as Array<keyof TroopData>).map(
                  (troopType) => {
                    const count = attackerTroops[troopType] || 0;
                    if (count === 0 || map.disabled === troopType) return null;
                    return (
                      <div
                        key={troopType}
                        className="relative text-2xl animate-bounce"
                        style={{
                          animationDelay: `${Math.random() * 0.5}s`,
                          animationDuration: '1s',
                        }}
                      >
                        {troopIcons[troopType]}
                        {map.boost?.troop === troopType && (
                          <span className="absolute -top-1 -right-1 text-xs text-green-400">⬆</span>
                        )}
                      </div>
                    );
                  }
                )}
              </div>

              {/* Battle effects (center) */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-6xl animate-spin">⚡</div>
              </div>

              {/* Defender side (right side) */}
              <div className="absolute right-0 top-0 bottom-0 w-1/2 p-4 flex flex-wrap gap-2 content-start justify-end">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="text-2xl animate-pulse"
                    style={{
                      animationDelay: `${Math.random() * 0.5}s`,
                      animationDuration: '1.5s',
                    }}
                  >
                    🛡️
                  </div>
                ))}
              </div>
            </div>

            {/* Battle Log */}
            <div className="text-center text-gray-300 animate-pulse">
              Calculating battle outcome...
            </div>
          </div>
        ) : (
          <div className="space-y-6 py-8">
            {/* Result Header */}
            <div className="text-center">
              {result.won ? (
                <>
                  <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4 animate-bounce" />
                  <h2 className="text-4xl font-bold text-green-400 mb-2">
                    VICTORY!
                  </h2>
                  <p className="text-xl text-gray-300">
                    {attacker} defeated {defender}
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    Battlefield: {map.name}
                  </p>
                </>
              ) : (
                <>
                  <Skull className="w-16 h-16 text-red-400 mx-auto mb-4" />
                  <h2 className="text-4xl font-bold text-red-400 mb-2">DEFEAT</h2>
                  <p className="text-xl text-gray-300">
                    {attacker} was defeated by {defender}
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    Battlefield: {map.name}
                  </p>
                </>
              )}
            </div>

            {/* Battle Statistics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-black/40 rounded-lg border border-gray-700">
                <h3 className="text-sm text-gray-400 mb-1">Troops Lost</h3>
                <p className="text-3xl font-bold text-red-400">
                  {(result.lossRate * 100).toFixed(0)}%
                </p>
              </div>
              <div className="p-4 bg-black/40 rounded-lg border border-gray-700">
                <h3 className="text-sm text-gray-400 mb-1">
                  {result.won ? 'Tokens Stolen' : 'Tokens Lost'}
                </h3>
                <p className="text-3xl font-bold text-yellow-400">
                  {result.stolenTokens.toFixed(1)} MCP
                </p>
              </div>
            </div>

            {result.won && (
              <div className="p-4 bg-green-900/30 border border-green-500/50 rounded-lg text-center">
                <p className="text-green-400">
                  💰 Stolen tokens added to your <strong>attackable stash</strong>
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Claim them to your protected wallet before you get attacked!
                </p>
              </div>
            )}

            {/* Surviving Troops */}
            <div className="p-4 bg-black/40 rounded-lg border border-gray-700">
              <h3 className="text-lg font-bold mb-3">Surviving Forces</h3>
              <div className="grid grid-cols-4 gap-3">
                {(Object.keys(attackerTroops) as Array<keyof TroopData>).map(
                  (troopType) => {
                    const sent = attackerTroops[troopType] || 0;
                    const survived = Math.floor(sent * (1 - result.lossRate));
                    if (sent === 0) return null;
                    return (
                      <div
                        key={troopType}
                        className="text-center p-2 bg-gray-800/50 rounded"
                      >
                        <div className="text-2xl mb-1">{troopIcons[troopType]}</div>
                        <div className="text-xs text-gray-400">
                          {TROOP_CONFIG[troopType].name}
                        </div>
                        <div className="text-sm font-bold text-white">
                          {survived}/{sent}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>

            <div className="text-center text-gray-400 text-sm">
              Returning to base...
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
