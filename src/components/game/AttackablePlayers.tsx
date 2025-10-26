'use client';

import { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AttackModal } from './AttackModal';
import { Swords, Shield, Coins, Target, MapPin, Clock, Zap } from 'lucide-react';

export function AttackablePlayers() {
  const { player, mockPlayers, calculateTravelCost, simulateDefense } = useGame();
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);
  const [simulateResult, setSimulateResult] = useState<string | null>(null);

  if (!player) return null;

  // Filter players based on defense vs attack
  const attackablePlayers = mockPlayers.filter(
    (p) => p.defense < player.stats.attack && p.username !== player.username
  );

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white mb-6">Attack Operations</h2>

      {/* Player Coordinates */}
      <Card className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-purple-500/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-purple-400" />
            <div>
              <h3 className="text-sm text-gray-300">Your Home Planet</h3>
              <p className="text-lg font-bold text-white">
                Coordinates: ({player.coordinates.x}, {player.coordinates.y})
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Simulate Attack on Me Button */}
      <Card className="bg-gradient-to-r from-red-900/50 to-orange-900/50 border-red-500/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Test Your Defenses</h3>
              <p className="text-sm text-gray-300">
                Simulate an attack on your base to see how you'd fare
              </p>
            </div>
            <Button
              onClick={() => {
                const result = simulateDefense();
                setSimulateResult(result);
                setTimeout(() => setSimulateResult(null), 5000);
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              <Target className="w-4 h-4 mr-2" />
              Simulate Attack on Me
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Simulate Attack Result */}
      {simulateResult && (
        <Card className="bg-blue-900/30 border-blue-500/50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Target className="w-5 h-5 text-blue-400 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-bold text-blue-300 mb-1">Simulation Result</h3>
                <p className="text-sm text-white whitespace-pre-line">{simulateResult}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Attackable Players List */}
      <Card className="bg-black/40 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Swords className="w-5 h-5" />
            Available Targets ({attackablePlayers.length})
          </CardTitle>
          <p className="text-sm text-gray-400">
            Only players with Defense &lt; {player.stats.attack} (your Attack) appear here
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {attackablePlayers.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Shield className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No attackable players found</p>
              <p className="text-sm">Upgrade your Attack stat to find more targets</p>
            </div>
          ) : (
            attackablePlayers.map((target) => {
              const travelInfo = calculateTravelCost(target.coordinates);
              return (
                <div
                  key={target.username}
                  className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-white">{target.username}</h3>
                        <div className="flex items-center gap-1 text-sm text-blue-400">
                          <Shield className="w-4 h-4" />
                          <span>Defense: {target.defense}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                        <div className="flex items-center gap-1 text-gray-400">
                          <Coins className="w-4 h-4 text-yellow-500" />
                          <span>Protected Wallet: {target.tokens} MCP</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Target className="w-4 h-4 text-red-500" />
                          <span className="text-red-400 font-bold">
                            Attackable Stash: {target.miningStash.toFixed(1)} MCP
                          </span>
                        </div>
                      </div>
                      
                      {/* Travel Information */}
                      <div className="flex items-center gap-4 text-xs bg-black/30 rounded p-2">
                        <div className="flex items-center gap-1 text-purple-400">
                          <MapPin className="w-3 h-3" />
                          <span>({target.coordinates.x}, {target.coordinates.y})</span>
                        </div>
                        <div className="flex items-center gap-1 text-cyan-400">
                          <Zap className="w-3 h-3" />
                          <span>{travelInfo.distance} units away</span>
                        </div>
                        <div className="flex items-center gap-1 text-yellow-400">
                          <Clock className="w-3 h-3" />
                          <span>~{travelInfo.time} min travel</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-400">
                          <Coins className="w-3 h-3" />
                          <span>{travelInfo.cost} MCP travel cost</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        onClick={() => setSelectedTarget(target.username)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        <Swords className="w-4 h-4 mr-2" />
                        Attack
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      {/* Attack Modal */}
      {selectedTarget && (
        <AttackModal
          targetUsername={selectedTarget}
          onClose={() => setSelectedTarget(null)}
        />
      )}
    </div>
  );
}
