'use client';

import { useState } from 'react';
import { useGame, TROOP_CONFIG, type TroopData } from '@/contexts/GameContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, Swords, Users, Clock, Coins, HelpCircle, Info, CheckCircle } from 'lucide-react';

export function TroopTraining() {
  const { player, trainTroops, collectTroops } = useGame();
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  if (!player) return null;

  const handleTrain = (troopType: keyof TroopData, quantity: number) => {
    if (quantity > 0) {
      trainTroops(troopType, quantity);
      setQuantities({ ...quantities, [troopType]: 0 });
    }
  };

  // Get troop icons and descriptions
  const troopInfo: Record<string, { Icon: any; description: string; color: string }> = {
    infantry: { Icon: Users, description: 'Basic ground units, cheap and fast', color: 'text-blue-400' },
    lightVehicles: { Icon: Swords, description: 'Fast and mobile units', color: 'text-[#bd34fe]' },
    heavyMechs: { Icon: Shield, description: 'Armored powerhouses', color: 'text-amber-400' },
    artillery: { Icon: Shield, description: 'Long-range bombardment', color: 'text-red-400' },
    airFighters: { Icon: Users, description: 'Air superiority', color: 'text-cyan-400' },
    bombers: { Icon: Swords, description: 'Heavy air strikes', color: 'text-orange-400' },
    drones: { Icon: Users, description: 'Automated reconnaissance', color: 'text-green-400' },
  };

  return (
    <div className="space-y-10 fade-in pb-12">
      {/* Hero Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#bd34fe]/10 border border-[#bd34fe]/20 rounded-full text-sm mb-2">
          <Shield className="w-4 h-4 text-[#bd34fe]" />
          <span className="gradient-text font-medium">Army Management</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
          <span className="gradient-text">Build Your Forces</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Train powerful troops and dominate the battlefield
        </p>
      </div>

      {/* Quick Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="border-border/40 bg-gradient-to-br from-blue-500/5 to-transparent backdrop-blur-sm">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-6 h-6 text-blue-400" />
              <span className="text-2xl font-bold">{(player.troops.infantry || 0).toLocaleString()}</span>
            </div>
            <p className="text-xs font-medium">Infantry</p>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-gradient-to-br from-[#bd34fe]/5 to-transparent backdrop-blur-sm">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between mb-2">
              <Swords className="w-6 h-6 text-[#bd34fe]" />
              <span className="text-2xl font-bold">{(player.troops.lightVehicles || 0).toLocaleString()}</span>
            </div>
            <p className="text-xs font-medium">Light Vehicles</p>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-gradient-to-br from-amber-500/5 to-transparent backdrop-blur-sm">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between mb-2">
              <Shield className="w-6 h-6 text-amber-400" />
              <span className="text-2xl font-bold">{(player.troops.heavyMechs || 0).toLocaleString()}</span>
            </div>
            <p className="text-xs font-medium">Heavy Mechs</p>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-gradient-to-br from-red-500/5 to-transparent backdrop-blur-sm">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between mb-2">
              <Shield className="w-6 h-6 text-red-400" />
              <span className="text-2xl font-bold">{(player.troops.artillery || 0).toLocaleString()}</span>
            </div>
            <p className="text-xs font-medium">Artillery</p>
          </CardContent>
        </Card>
      </div>

      {/* Wallet Display */}
      <Card className="border-[#47caff]/30 bg-gradient-to-r from-[#47caff]/5 to-[#bd34fe]/5 backdrop-blur-sm">
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#bd34fe]/20 rounded-xl">
                <Coins className="w-6 h-6 text-[#bd34fe]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Available Balance</p>
                <p className="text-2xl font-bold gradient-text">{player.tokens.toLocaleString()} MCP</p>
              </div>
            </div>
            <div className="text-right text-xs text-muted-foreground">
              <p>Use tokens to train troops</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Training Queue */}
      {player.trainingQueue.length > 0 && (
        <Card className="border-[#bd34fe]/30 bg-gradient-to-br from-[#bd34fe]/5 to-transparent backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#bd34fe]" />
                <CardTitle className="text-xl font-bold">Training Queue</CardTitle>
              </div>
              <span className="px-3 py-1 bg-[#bd34fe]/20 rounded-full text-xs font-medium text-[#bd34fe]">
                {player.trainingQueue.length} in progress
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {player.trainingQueue.map((item) => {
              const config = TROOP_CONFIG[item.troopType];
              const timeLeft = Math.max(0, item.completesAt - Date.now());
              const minutes = Math.floor(timeLeft / 60000);
              const seconds = Math.floor((timeLeft % 60000) / 1000);
              const isComplete = timeLeft === 0;
              const info = troopInfo[item.troopType];
              const Icon = info?.Icon || Users;

              return (
                <div
                  key={item.id}
                  className={`p-3 rounded-lg border transition-all ${
                    isComplete
                      ? 'bg-green-500/10 border-green-500/30'
                      : 'bg-secondary/30 border-border/40'
                  }`}
                >
                  <div className="flex justify-between items-center gap-3">
                    <div className="flex items-center gap-3 flex-1">
                      <Icon className={`w-4 h-4 ${info?.color || 'text-muted-foreground'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">
                          {item.quantity}x {config.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {isComplete ? (
                            <span className="flex items-center gap-1 text-green-400">
                              <CheckCircle className="w-3 h-3" />
                              Ready to collect!
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {minutes}m {seconds}s remaining
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    {isComplete && (
                      <Button
                        onClick={() => collectTroops(item.id)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        Collect
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Train New Troops Section */}
      <div className="space-y-6">
        {/* Section Header */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold gradient-text">Train New Troops</h2>
          <p className="text-muted-foreground">Select a unit type and choose how many to train</p>
        </div>

        {/* Wallet Display - Prominent */}
        <Card className="border-[#47caff]/40 bg-gradient-to-r from-[#47caff]/10 to-[#bd34fe]/10 backdrop-blur-sm">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center justify-center gap-3">
              <Coins className="w-8 h-8 text-[#47caff]" />
              <div>
                <p className="text-sm text-muted-foreground">Your Balance</p>
                <p className="text-3xl font-bold gradient-text">{player.tokens.toLocaleString()} MCP</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Troop Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {(Object.keys(TROOP_CONFIG) as Array<keyof TroopData>).map((troopType) => {
            const config = TROOP_CONFIG[troopType];
            const quantity = quantities[troopType] || 0;
            const totalCost = config.cost * quantity;
            const canAfford = player.tokens >= totalCost;
            const trainingTime = config.trainingTime;
            const info = troopInfo[troopType];
            const Icon = info?.Icon || Users;
            const currentCount = player.troops[troopType] || 0;

            return (
              <Card
                key={troopType}
                className="border-border/40 bg-black/50 hover:border-[#bd34fe]/40 transition-all duration-300 hover:shadow-lg hover:shadow-[#bd34fe]/10"
              >
                <CardContent className="pt-6 pb-6 space-y-4">
                  {/* Troop Header with Icon */}
                  <div className="flex items-start gap-4">
                    <div className={`p-4 rounded-xl bg-black/50 ${info?.color || ''}`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-1">{config.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{info?.description}</p>
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/50 rounded-full text-xs">
                        <Shield className="w-3 h-3" />
                        <span>You own: <strong>{currentCount.toLocaleString()}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid - Larger and clearer */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-center">
                      <Coins className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                      <p className="text-xs text-muted-foreground mb-1">Cost Each</p>
                      <p className="text-lg font-bold text-blue-400">{config.cost}</p>
                      <p className="text-xs text-muted-foreground">MCP</p>
                    </div>
                    <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-center">
                      <Clock className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                      <p className="text-xs text-muted-foreground mb-1">Train Time</p>
                      <p className="text-lg font-bold text-amber-400">{trainingTime}</p>
                      <p className="text-xs text-muted-foreground">seconds</p>
                    </div>
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-center">
                      <Swords className="w-4 h-4 text-red-400 mx-auto mb-1" />
                      <p className="text-xs text-muted-foreground mb-1">Power</p>
                      <p className="text-lg font-bold text-red-400">{config.power}</p>
                      <p className="text-xs text-muted-foreground">per unit</p>
                    </div>
                  </div>

                  {/* Quantity Input - Larger with presets */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium">How many to train?</label>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        min="0"
                        value={quantity || ''}
                        onChange={(e) =>
                          setQuantities({
                            ...quantities,
                            [troopType]: parseInt(e.target.value) || 0,
                          })
                        }
                        placeholder="Enter quantity..."
                        className="flex-1 bg-black/50 border-border/60 h-12 text-lg"
                      />
                      <Button
                        onClick={() => setQuantities({ ...quantities, [troopType]: 10 })}
                        variant="outline"
                        size="sm"
                        className="px-4 h-12"
                      >
                        +10
                      </Button>
                      <Button
                        onClick={() => setQuantities({ ...quantities, [troopType]: 50 })}
                        variant="outline"
                        size="sm"
                        className="px-4 h-12"
                      >
                        +50
                      </Button>
                    </div>
                  </div>

                  {/* Cost Summary - Prominent */}
                  {quantity > 0 && (
                    <div className={`p-4 rounded-lg border-2 ${
                      canAfford 
                        ? 'bg-[#bd34fe]/10 border-[#bd34fe]/40' 
                        : 'bg-destructive/10 border-destructive/40'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Total Cost:</span>
                        <span className={`text-2xl font-bold ${canAfford ? 'gradient-text' : 'text-destructive'}`}>
                          {totalCost.toLocaleString()} MCP
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Training {quantity} unit{quantity > 1 ? 's' : ''}</span>
                        <span>Balance: {player.tokens.toLocaleString()} MCP</span>
                      </div>
                    </div>
                  )}

                  {/* Train Button - Large and prominent */}
                  <Button
                    onClick={() => handleTrain(troopType, quantity)}
                    disabled={!canAfford || quantity === 0}
                    className={`w-full h-14 text-lg font-semibold ${
                      canAfford && quantity > 0
                        ? 'bg-gradient-to-r from-[#bd34fe] to-[#47caff] hover:opacity-90 text-white shadow-lg shadow-[#bd34fe]/20'
                        : ''
                    }`}
                    size="lg"
                  >
                    {quantity === 0 ? 'Enter Quantity Above' : 
                     !canAfford ? '❌ Not Enough MCP' : 
                     `✓ Start Training ${quantity} ${config.name}`}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Beginner's Guide Section */}
      <Card className="border-[#47caff]/30 bg-gradient-to-br from-[#47caff]/5 to-[#bd34fe]/5 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Info className="w-5 h-5 text-[#47caff]" />
            <span className="gradient-text">Beginner's Guide</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-secondary/30 rounded-lg border border-border/40">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">💡 Start with Infantry</h4>
                  <p className="text-sm text-muted-foreground">
                    Infantry is cheap and trains fast. Perfect for beginners to build their first army quickly!
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-secondary/30 rounded-lg border border-border/40">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-500/10 rounded-lg">
                  <Clock className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">⏱️ Training Takes Time</h4>
                  <p className="text-sm text-muted-foreground">
                    Units train in real-time, even when you're offline. Check back to collect them!
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-secondary/30 rounded-lg border border-border/40">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#bd34fe]/10 rounded-lg">
                  <Coins className="w-5 h-5 text-[#bd34fe]" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">💰 Manage Your Budget</h4>
                  <p className="text-sm text-muted-foreground">
                    Don't spend all your MCP at once. Save some for upgrades and daily upkeep costs.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-secondary/30 rounded-lg border border-border/40">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <Swords className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">⚔️ Mix Your Army</h4>
                  <p className="text-sm text-muted-foreground">
                    Different troops have different strengths. A balanced army is stronger in battle!
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-[#bd34fe]/10 to-[#47caff]/10 border border-[#bd34fe]/20 rounded-lg">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <span>📊</span> Quick Reference
            </h4>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>• <strong className="text-foreground">Power:</strong> Higher power = stronger in battle</p>
              <p>• <strong className="text-foreground">Cost:</strong> MCP tokens required to train each unit</p>
              <p>• <strong className="text-foreground">Training Queue:</strong> You can train multiple units at once</p>
              <p>• <strong className="text-foreground">Daily Upkeep:</strong> Troops cost tokens daily (check Stats tab)</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
