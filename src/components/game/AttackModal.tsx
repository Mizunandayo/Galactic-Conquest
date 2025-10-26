'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGame, TROOP_CONFIG, type TroopData, type BattleMap, type ScoutTier } from '@/contexts/GameContext';
import { BattleDisplay } from './BattleDisplay';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Swords, 
  Shield, 
  AlertTriangle, 
  Eye, 
  RefreshCw, 
  Map as MapIcon,
  MapPin,
  Clock,
  Coins,
  Zap,
  Flame
} from 'lucide-react';

interface AttackModalProps {
  targetUsername: string;
  onClose: () => void;
}

export function AttackModal({ targetUsername, onClose }: AttackModalProps) {
  const { player, mockPlayers, attackPlayer, scoutPlayer, getMapForTarget, rerollMapForTarget, calculateTravelCost } = useGame();
  const [attackTroops, setAttackTroops] = useState<Partial<TroopData>>({});
  const [showBattle, setShowBattle] = useState(false);
  const [battleResult, setBattleResult] = useState<any>(null);
  const [scoutResult, setScoutResult] = useState<string | null>(null);
  const [scoutedTroops, setScoutedTroops] = useState<Partial<TroopData> | null>(null);
  const [currentMap, setCurrentMap] = useState<BattleMap | null>(null);
  const [selectedScoutTier, setSelectedScoutTier] = useState<ScoutTier | 'none'>('none');
  const [scoutDeployed, setScoutDeployed] = useState(false);

  const target = mockPlayers.find((p) => p.username === targetUsername);

  // Initialize map on mount
  useEffect(() => {
    if (target) {
      setCurrentMap(getMapForTarget(targetUsername));
    }
  }, [targetUsername, getMapForTarget, target]);

  if (!player || !target) return null;

  const handleTroopChange = (troopType: keyof TroopData, value: string) => {
    const numValue = parseInt(value) || 0;
    const maxAvailable = player.troops[troopType];
    const actualValue = Math.min(Math.max(0, numValue), maxAvailable);
    
    setAttackTroops((prev) => ({
      ...prev,
      [troopType]: actualValue,
    }));
  };

  const handleDeployScout = () => {
    if (selectedScoutTier === 'none') {
      setScoutResult('✅ No scout deployed (0% cost). Proceeding without intelligence.');
      setScoutDeployed(true);
      return;
    }

    const result = scoutPlayer(targetUsername, selectedScoutTier as ScoutTier);
    
    if (player.tokens < result.cost) {
      setScoutResult(`❌ Insufficient tokens for ${selectedScoutTier} scout (${result.cost} MCP required)`);
      return;
    }

    setScoutResult(result.message);
    if (result.success && result.troopCounts) {
      setScoutedTroops(result.troopCounts);
    }
    setScoutDeployed(true);
  };

  const handleMapReroll = () => {
    if (!currentMap) return;
    
    const result = rerollMapForTarget(targetUsername);
    
    if (player.tokens < result.cost) {
      alert(`Insufficient tokens for reroll (${result.cost} MCP required)`);
      return;
    }

    setCurrentMap(result.map);
  };

  const handleAttack = () => {
    if (!currentMap) return;

    // Check attack energy
    if (player.attackEnergy === 0) {
      const fourHoursInMs = 4 * 60 * 60 * 1000;
      const timeUntilNextAttack = Math.max(0, fourHoursInMs - (Date.now() - player.lastAttackRegen));
      const hoursRemaining = Math.floor(timeUntilNextAttack / (1000 * 60 * 60));
      const minutesRemaining = Math.floor((timeUntilNextAttack % (1000 * 60 * 60)) / (1000 * 60));
      alert(`⚠️ No attack energy! Next attack available in ${hoursRemaining}h ${minutesRemaining}m`);
      return;
    }

    const troopCount = Object.values(attackTroops).reduce((sum, count) => sum + (count || 0), 0);
    if (troopCount === 0) {
      alert('Please select at least one troop to attack with');
      return;
    }

    // Calculate travel cost
    const travelInfo = calculateTravelCost(target.coordinates);
    if (player.tokens < travelInfo.cost) {
      alert(`Insufficient tokens for travel (${travelInfo.cost} MCP required)`);
      return;
    }

    // Simulate battle
    const attackPower = Object.keys(attackTroops).reduce((sum, key) => {
      const troopType = key as keyof TroopData;
      const count = attackTroops[troopType] || 0;
      let power = count * TROOP_CONFIG[troopType].power;

      // Apply map boost
      if (currentMap.boost && currentMap.boost.troop === troopType) {
        power *= (1 + currentMap.boost.amount / 100);
      }

      // Disabled troops contribute 0 power
      if (currentMap.disabled === troopType) {
        power = 0;
      }

      return sum + power;
    }, 0);

    const battleWon = attackPower > 0 && Math.random() < 0.7;
    let lossRate = battleWon ? 0.3 + Math.random() * 0.2 : 0.6 + Math.random() * 0.3;

    // Blessed maps can reduce losses
    if (currentMap.type === 'blessed' && currentMap.specialEffect?.includes('Evasion')) {
      lossRate *= 0.75; // 25% less losses
    }

    let stolenTokens = battleWon ? target.miningStash * (1 - lossRate) : 0;

    // Blessed maps can boost rewards
    if (battleWon && currentMap.type === 'blessed' && currentMap.specialEffect?.includes('Mining reward')) {
      stolenTokens *= 1.20; // +20% reward
    }

    setBattleResult({
      won: battleWon,
      stolenTokens,
      lossRate,
    });

    // Execute attack (pass travel time and scout tier)
    attackPlayer(targetUsername, attackTroops, currentMap, travelInfo.time, selectedScoutTier);
    setShowBattle(true);
  };

  const totalTroops = Object.values(attackTroops).reduce((sum, count) => sum + (count || 0), 0);
  const travelInfo = calculateTravelCost(target.coordinates);

  // Calculate next reroll cost
  const rerollCount = player.activities.filter(a => 
    a.type === 'map_reroll' && a.message.includes(targetUsername)
  ).length;
  const nextRerollCost = Math.min(10 * Math.pow(2, rerollCount), 80);

  const getMapTypeColor = (type: string) => {
    switch (type) {
      case 'standard': return 'bg-blue-500';
      case 'unstable': return 'bg-red-500';
      case 'blessed': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <>
      <Dialog open onOpenChange={onClose}>
        <DialogContent className="max-w-4xl bg-gradient-to-br from-gray-900 to-black border-red-500/50 text-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Swords className="w-6 h-6 text-red-500" />
                Attack {targetUsername}
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-red-900/30 border border-red-500/50 rounded">
                <Flame className="w-4 h-4 text-red-400" />
                <span className="text-sm text-white font-bold">
                  {player.attackEnergy}/8 Attacks
                </span>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Target Information */}
            <Card className="bg-black/40 border-gray-700 p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-400" />
                    Target Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Commander:</span>
                      <span className="text-white font-bold">{target.username}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Defense:</span>
                      <span className="text-blue-400">{target.defense}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Protected Wallet:</span>
                      <span className="text-gray-400">{target.tokens} MCP</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Attackable Stash:</span>
                      <span className="text-red-400 font-bold">{target.miningStash.toFixed(1)} MCP</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                    <MapIcon className="w-5 h-5 text-purple-400" />
                    Travel Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Target Coordinates:</span>
                      <span className="text-purple-400">({target.coordinates.x}, {target.coordinates.y})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Distance:</span>
                      <span className="text-cyan-400">{travelInfo.distance} units</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Travel Time:</span>
                      <span className="text-yellow-400">~{travelInfo.time} minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Travel Cost:</span>
                      <span className="text-yellow-400">{travelInfo.cost} MCP</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Battle Map Display */}
            {currentMap && (
              <Card className="bg-black/40 border-gray-700 p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MapIcon className="w-5 h-5 text-cyan-400" />
                    <h3 className="text-lg font-bold text-white">{currentMap.name}</h3>
                    <Badge className={getMapTypeColor(currentMap.type)}>
                      {currentMap.type.toUpperCase()}
                    </Badge>
                  </div>
                  <Button
                    onClick={handleMapReroll}
                    size="sm"
                    variant="outline"
                    className="text-xs"
                    disabled={player.tokens < nextRerollCost}
                  >
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Reroll ({nextRerollCost} MCP)
                  </Button>
                </div>
                
                <p className="text-gray-300 text-sm mb-3">{currentMap.description}</p>
                
                <div className="grid grid-cols-3 gap-2">
                  {currentMap.boost && (
                    <div className="bg-green-900/30 border border-green-500/50 rounded p-2">
                      <p className="text-xs text-green-400 mb-1">✨ BOOST</p>
                      <p className="text-sm text-white">
                        {TROOP_CONFIG[currentMap.boost.troop].name} +{currentMap.boost.amount}%
                      </p>
                    </div>
                  )}
                  {currentMap.disabled && (
                    <div className="bg-red-900/30 border border-red-500/50 rounded p-2">
                      <p className="text-xs text-red-400 mb-1">🚫 DISABLED</p>
                      <p className="text-sm text-white">
                        {TROOP_CONFIG[currentMap.disabled].name}
                      </p>
                    </div>
                  )}
                  {currentMap.specialEffect && (
                    <div className="bg-purple-900/30 border border-purple-500/50 rounded p-2">
                      <p className="text-xs text-purple-400 mb-1">⚡ SPECIAL</p>
                      <p className="text-xs text-white">{currentMap.specialEffect}</p>
                    </div>
                  )}
                </div>

                <p className="text-xs text-gray-400 mt-2">
                  💡 Map is locked for this target for 10 minutes. Reroll cost doubles: 10 → 20 → 40 → 80 MCP (max)
                </p>
              </Card>
            )}

            {/* Scout System - Four Options including No Scout */}
            <Card className="bg-black/40 border-gray-700 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Eye className="w-5 h-5 text-cyan-400" />
                  Scout Enemy Base {!scoutDeployed && <span className="text-sm text-yellow-400">(Step 1)</span>}
                </h3>
              </div>

              {!scoutDeployed ? (
                <>
                  <p className="text-sm text-gray-400 mb-3">Choose your scout type and deploy before selecting troops. Cost is percentage of target's stash:</p>
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    <Button
                      onClick={() => setSelectedScoutTier('none')}
                      size="sm"
                      variant={selectedScoutTier === 'none' ? 'default' : 'outline'}
                      className="flex flex-col h-auto py-2"
                    >
                      <span className="text-xs font-bold">No Scout</span>
                      <span className="text-xs text-gray-400">0%</span>
                      <span className="text-xs text-gray-400">No intel</span>
                    </Button>
                    <Button
                      onClick={() => setSelectedScoutTier('basic')}
                      size="sm"
                      variant={selectedScoutTier === 'basic' ? 'default' : 'outline'}
                      className="flex flex-col h-auto py-2"
                    >
                      <span className="text-xs font-bold">Basic Scout</span>
                      <span className="text-xs text-gray-400">5% • 100%</span>
                      <span className="text-xs text-gray-400">Rough estimate</span>
                    </Button>
                    <Button
                      onClick={() => setSelectedScoutTier('advanced')}
                      size="sm"
                      variant={selectedScoutTier === 'advanced' ? 'default' : 'outline'}
                      className="flex flex-col h-auto py-2"
                    >
                      <span className="text-xs font-bold">Advanced Scout</span>
                      <span className="text-xs text-gray-400">10% • 90%</span>
                      <span className="text-xs text-gray-400">Approx counts</span>
                    </Button>
                    <Button
                      onClick={() => setSelectedScoutTier('elite')}
                      size="sm"
                      variant={selectedScoutTier === 'elite' ? 'default' : 'outline'}
                      className="flex flex-col h-auto py-2"
                    >
                      <span className="text-xs font-bold">Elite Recon</span>
                      <span className="text-xs text-gray-400">20% • 80%</span>
                      <span className="text-xs text-gray-400">Exact + map</span>
                    </Button>
                  </div>
                  
                  <Button
                    onClick={handleDeployScout}
                    className="w-full bg-cyan-600 hover:bg-cyan-700"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Deploy {selectedScoutTier === 'none' ? 'Without Scout' : `${selectedScoutTier.charAt(0).toUpperCase() + selectedScoutTier.slice(1)} Scout`}
                  </Button>
                </>
              ) : (
                <div className="bg-green-900/30 border border-green-500/50 rounded p-3">
                  <p className="text-sm text-green-300 mb-2">✅ Scout deployed!</p>
                  {selectedScoutTier !== 'none' && (
                    <p className="text-xs text-gray-400">Used: {selectedScoutTier.charAt(0).toUpperCase() + selectedScoutTier.slice(1)} Scout</p>
                  )}
                </div>
              )}

              {scoutResult && (
                <div className={`p-3 rounded text-sm mb-3 ${
                  scoutResult.includes('✅') 
                    ? 'bg-green-900/30 border border-green-500/50 text-green-300' 
                    : 'bg-red-900/30 border border-red-500/50 text-red-300'
                }`}>
                  {scoutResult}
                </div>
              )}

              {scoutedTroops && (
                <div className="grid grid-cols-4 gap-2">
                  {(Object.keys(scoutedTroops) as Array<keyof TroopData>).map((troopType) => {
                    const count = scoutedTroops[troopType] || 0;
                    if (count === 0) return null;
                    return (
                      <div key={troopType} className="bg-gray-800/50 rounded p-2 text-center">
                        <p className="text-xs text-gray-400">{TROOP_CONFIG[troopType].name}</p>
                        <p className="text-lg font-bold text-white">{count}</p>
                      </div>
                    );
                  })}
                </div>
              )}

              {!scoutDeployed && (
                <p className="text-xs text-gray-400 mt-2">
                  💡 Scout costs are based on target's attackable stash ({target.miningStash.toFixed(1)} MCP). Deploy scout first before selecting troops.
                </p>
              )}
            </Card>

            {/* Troop Selection - Disabled until scout deployed */}
            <Card className={`bg-black/40 border-gray-700 p-4 ${!scoutDeployed ? 'opacity-50' : ''}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Select Attack Force {scoutDeployed && <span className="text-sm text-yellow-400">(Step 2)</span>}</h3>
                {!scoutDeployed && (
                  <Badge variant="destructive">Deploy Scout First</Badge>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                {(Object.keys(TROOP_CONFIG) as Array<keyof TroopData>).map((troopType) => {
                  const config = TROOP_CONFIG[troopType];
                  const available = player.troops[troopType];
                  const isDisabled = currentMap?.disabled === troopType;
                  const isBoosted = currentMap?.boost?.troop === troopType;

                  return (
                    <div key={troopType} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-white flex items-center gap-2">
                          {config.name}
                          {isDisabled && <Badge variant="destructive" className="text-xs">DISABLED</Badge>}
                          {isBoosted && <Badge variant="default" className="text-xs bg-green-600">+{currentMap.boost?.amount}%</Badge>}
                        </Label>
                        <span className="text-sm text-gray-400">Available: {available}</span>
                      </div>
                      <Input
                        type="number"
                        min="0"
                        max={available}
                        value={attackTroops[troopType] || ''}
                        onChange={(e) => handleTroopChange(troopType, e.target.value)}
                        className="bg-gray-800 border-gray-600 text-white"
                        disabled={isDisabled || !scoutDeployed}
                        placeholder={isDisabled ? 'Disabled by map' : !scoutDeployed ? 'Deploy scout first' : '0'}
                      />
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Warning */}
            {totalTroops > 0 && (
              <div className="flex items-start gap-2 p-3 bg-yellow-900/30 border border-yellow-500/50 rounded">
                <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                <div className="text-sm text-yellow-300">
                  <p className="font-bold">Warning:</p>
                  <p>You will lose 30-50% of your troops if you win, 60-90% if you lose.</p>
                  <p>Stolen tokens will be added to your attackable stash, not your protected wallet.</p>
                  <p>Travel cost: {travelInfo.cost} MCP • Travel time: {travelInfo.time} min (troops will return after battle)</p>
                </div>
              </div>
            )}

            {/* Attack Energy Warning */}
            {player.attackEnergy === 0 && (
              <div className="flex items-start gap-2 p-3 bg-red-900/30 border border-red-500/50 rounded">
                <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
                <div className="text-sm text-red-300">
                  <p className="font-bold">No Attack Energy!</p>
                  <p>Attack energy regenerates at 1 per 4 hours (max 8).</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button onClick={onClose} variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={handleAttack}
                disabled={totalTroops === 0 || player.tokens < travelInfo.cost || !scoutDeployed || player.attackEnergy === 0}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                <Swords className="w-4 h-4 mr-2" />
                Launch Attack ({totalTroops} troops)
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Battle Display */}
      {showBattle && battleResult && currentMap && (
        <BattleDisplay
          attacker={player.username}
          defender={targetUsername}
          attackerTroops={attackTroops}
          defenderTroops={scoutedTroops || {}}
          map={currentMap}
          result={battleResult}
          onComplete={() => {
            setShowBattle(false);
            onClose();
          }}
        />
      )}
    </>
  );
}
