'use client';

import { useGame, BUILDING_CONFIG, type BuildingLevels } from '@/contexts/GameContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, TrendingUp, Home } from 'lucide-react';

export function BaseBuilding() {
  const { player, upgradeBuilding } = useGame();

  if (!player) return null;

  const buildings: Array<{
    key: keyof BuildingLevels;
    icon: string;
    description: string;
  }> = [
    { key: 'barracks', icon: '🏰', description: 'Houses Infantry units' },
    { key: 'droneCore', icon: '🎛️', description: 'Houses Drones' },
    { key: 'mechBay', icon: '⚙️', description: 'Houses Heavy Mechs' },
    { key: 'vehicleDepot', icon: '🚗', description: 'Houses Light Vehicles' },
    { key: 'artilleryStation', icon: '🎯', description: 'Houses Artillery' },
    { key: 'hangar', icon: '✈️', description: 'Houses Air Fighters & Bombers' },
  ];

  const calculateCapacity = (building: keyof BuildingLevels, level: number) => {
    const config = BUILDING_CONFIG[building];
    return Math.floor(config.baseCapacity * Math.pow(1 + config.capacityGrowth / 100, level - 1));
  };

  const calculateUpgradeCost = (currentLevel: number) => {
    return Math.pow(currentLevel + 1, 2) * 10;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white mb-6">Base Buildings</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {buildings.map((building) => {
          const config = BUILDING_CONFIG[building.key];
          const currentLevel = player.buildings[building.key];
          const upgradeCost = calculateUpgradeCost(currentLevel);
          const canAfford = player.tokens >= upgradeCost;
          const currentCapacity = calculateCapacity(building.key, currentLevel);
          const nextCapacity = calculateCapacity(building.key, currentLevel + 1);

          return (
            <Card
              key={building.key}
              className="bg-black/40 border-gray-700 hover:border-gray-600 transition-colors"
            >
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">{building.icon}</div>
                    <div>
                      <div>{config.name}</div>
                      <div className="text-sm text-gray-400 font-normal">
                        Level {currentLevel}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400">Capacity</div>
                    <div className="text-2xl font-bold text-blue-400">
                      {currentCapacity}
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-400">{building.description}</p>

                <div className="p-3 bg-gray-800/50 rounded-lg space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400 flex items-center gap-1">
                      <Home className="w-4 h-4" />
                      Current Housing
                    </span>
                    <span className="text-white font-bold">{currentCapacity} space</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400 flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      Next Level
                    </span>
                    <span className="text-green-400 font-bold">
                      {nextCapacity} space (+{nextCapacity - currentCapacity})
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm text-gray-400">Upgrade Cost:</span>
                  <span className="text-yellow-400 font-bold">{upgradeCost} tokens</span>
                </div>

                <Button
                  onClick={() => upgradeBuilding(building.key)}
                  disabled={!canAfford}
                  className={`w-full ${
                    canAfford
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-gray-700 text-gray-400'
                  }`}
                >
                  <Building className="w-4 h-4 mr-2" />
                  {canAfford ? 'Upgrade Building' : 'Insufficient Tokens'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
