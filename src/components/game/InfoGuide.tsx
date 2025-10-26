'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';

export function InfoGuide() {
  return (
    <ScrollArea className="h-[calc(100vh-200px)]">
      <div className="space-y-6 pr-4">
        <Card className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border-blue-500/50">
          <CardHeader>
            <CardTitle className="text-blue-400 text-2xl flex items-center gap-2">
              <span className="text-3xl">📖</span>
              Welcome to Galactic Conquest
            </CardTitle>
            <CardDescription className="text-gray-300">
              Your complete guide to dominating the galaxy
            </CardDescription>
          </CardHeader>
        </Card>

        <Accordion type="multiple" className="space-y-4">
          {/* Core Stats */}
          <AccordionItem value="stats">
            <Card className="bg-black/50 border-purple-500/50">
              <AccordionTrigger className="px-6 hover:no-underline">
                <CardTitle className="text-purple-400 text-lg flex items-center gap-2">
                  <span className="text-2xl">📊</span>
                  Commander Stats & Mining
                </CardTitle>
              </AccordionTrigger>
              <AccordionContent>
                <CardContent className="space-y-4 text-gray-300">
                  <div className="space-y-3">
                    <div className="bg-green-900/20 p-4 rounded-lg border border-green-500/30">
                      <div className="font-bold text-green-400 mb-2 flex items-center gap-2">
                        <span>⚙️</span> Engineer
                      </div>
                      <p>Determines your passive mining rate (MCP/s). Higher levels mean faster token generation.</p>
                      <p className="text-sm text-gray-400 mt-2">Base: 0.001 MCP/s | Upgrade Cost: Level² × 10 tokens</p>
                    </div>

                    <div className="bg-red-900/20 p-4 rounded-lg border border-red-500/30">
                      <div className="font-bold text-red-400 mb-2 flex items-center gap-2">
                        <span>⚔️</span> Attack
                      </div>
                      <p>Offensive power in battles. Higher attack increases damage and lets you target better-defended bases.</p>
                      <p className="text-sm text-gray-400 mt-2">Used in battle calculations and target filtering</p>
                    </div>

                    <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-500/30">
                      <div className="font-bold text-blue-400 mb-2 flex items-center gap-2">
                        <span>🛡️</span> Defense
                      </div>
                      <p>Protection against attacks. If your defense is higher than an attacker's attack stat, they cannot target you.</p>
                      <p className="text-sm text-gray-400 mt-2">Higher defense = fewer potential attackers</p>
                    </div>

                    <div className="bg-yellow-900/20 p-4 rounded-lg border border-yellow-500/30">
                      <div className="font-bold text-yellow-400 mb-2 flex items-center gap-2">
                        <span>📦</span> Stash Size
                      </div>
                      <p>Maximum unclaimed MCP storage. Mined tokens accumulate here until you claim them.</p>
                      <p className="text-sm text-gray-400 mt-2">Base: 100 MCP | Claim when stash fills up</p>
                    </div>
                  </div>
                </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>

          {/* Troops */}
          <AccordionItem value="troops">
            <Card className="bg-black/50 border-blue-500/50">
              <AccordionTrigger className="px-6 hover:no-underline">
                <CardTitle className="text-blue-400 text-lg flex items-center gap-2">
                  <span className="text-2xl">⚔️</span>
                  Troop System
                </CardTitle>
              </AccordionTrigger>
              <AccordionContent>
                <CardContent className="space-y-4 text-gray-300">
                  <p className="font-semibold">Each troop type has unique strengths and weaknesses:</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <div className="font-bold mb-2">👥 Infantry (10 tokens)</div>
                      <p className="text-sm text-green-400">✓ Strong vs: Drones</p>
                      <p className="text-sm text-red-400">✗ Weak vs: Light Vehicles</p>
                    </div>

                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <div className="font-bold mb-2">🚙 Light Vehicles (50 tokens)</div>
                      <p className="text-sm text-green-400">✓ Strong vs: Artillery, Infantry</p>
                      <p className="text-sm text-red-400">✗ Weak vs: Heavy Mechs</p>
                    </div>

                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <div className="font-bold mb-2">🤖 Heavy Mechs (120 tokens)</div>
                      <p className="text-sm text-green-400">✓ Strong vs: Infantry, Light Vehicles</p>
                      <p className="text-sm text-red-400">✗ Weak vs: Artillery, Bombers</p>
                    </div>

                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <div className="font-bold mb-2">🎯 Artillery (80 tokens)</div>
                      <p className="text-sm text-green-400">✓ Strong vs: Heavy Mechs</p>
                      <p className="text-sm text-red-400">✗ Weak vs: Air Fighters</p>
                    </div>

                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <div className="font-bold mb-2">✈️ Air Fighters (150 tokens)</div>
                      <p className="text-sm text-green-400">✓ Strong vs: Bombers, Light Vehicles</p>
                      <p className="text-sm text-red-400">✗ Weak vs: Infantry (AA)</p>
                    </div>

                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <div className="font-bold mb-2">🛩️ Bombers (200 tokens)</div>
                      <p className="text-sm text-green-400">✓ Strong vs: Artillery, Heavy Mechs</p>
                      <p className="text-sm text-red-400">✗ Weak vs: Air Fighters</p>
                    </div>

                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <div className="font-bold mb-2">🚁 Drones (30 tokens)</div>
                      <p className="text-sm text-green-400">✓ Strong vs: Infantry, Light Vehicles</p>
                      <p className="text-sm text-red-400">✗ Weak vs: Heavy Mechs, Air Fighters</p>
                    </div>
                  </div>

                  <div className="bg-orange-900/20 p-4 rounded-lg border border-orange-500/30 mt-4">
                    <div className="font-bold text-orange-400 mb-2">⚠️ Troop Upkeep</div>
                    <p>Each troop requires daily maintenance tokens. Failure to pay causes random desertion:</p>
                    <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                      <li>Day 1: 10% desertion</li>
                      <li>Day 2: 15% desertion</li>
                      <li>Day 3: 25% desertion</li>
                      <li>Day 4+: 45%+ desertion</li>
                    </ul>
                  </div>
                </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>

          {/* Base Buildings */}
          <AccordionItem value="base">
            <Card className="bg-black/50 border-orange-500/50">
              <AccordionTrigger className="px-6 hover:no-underline">
                <CardTitle className="text-orange-400 text-lg flex items-center gap-2">
                  <span className="text-2xl">🏰</span>
                  Base & Housing
                </CardTitle>
              </AccordionTrigger>
              <AccordionContent>
                <CardContent className="space-y-4 text-gray-300">
                  <p>Buildings provide housing capacity for your troops. Each troop type requires space:</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <div className="font-bold mb-2">🏛️ Barracks</div>
                      <p className="text-sm">Base capacity: 50 space</p>
                      <p className="text-sm text-blue-400">+20% per level upgrade</p>
                    </div>

                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <div className="font-bold mb-2">🏭 Vehicle Depot</div>
                      <p className="text-sm">Base capacity: 30 space</p>
                      <p className="text-sm text-blue-400">+15% per level upgrade</p>
                    </div>

                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <div className="font-bold mb-2">⚙️ Mech Bay</div>
                      <p className="text-sm">Base capacity: 30 space</p>
                      <p className="text-sm text-blue-400">+15% per level upgrade</p>
                    </div>

                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <div className="font-bold mb-2">🎖️ Artillery Station</div>
                      <p className="text-sm">Base capacity: 20 space</p>
                      <p className="text-sm text-blue-400">+15% per level upgrade</p>
                    </div>

                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <div className="font-bold mb-2">🛫 Hangar</div>
                      <p className="text-sm">Base capacity: 20 space</p>
                      <p className="text-sm text-blue-400">+15% per level upgrade</p>
                    </div>

                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <div className="font-bold mb-2">📡 Drone Core</div>
                      <p className="text-sm">Base capacity: 40 space</p>
                      <p className="text-sm text-blue-400">+10% per level upgrade</p>
                    </div>

                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <div className="font-bold mb-2">🏰 Command Center</div>
                      <p className="text-sm">Boosts global capacity</p>
                      <p className="text-sm text-blue-400">+5% all housing per level</p>
                    </div>
                  </div>

                  <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-500/30">
                    <div className="font-bold text-blue-400 mb-2">💡 Housing Mechanics</div>
                    <p className="text-sm">Infantry uses 1 space, Heavy Mechs use 5 space, Bombers use 6 space, etc.</p>
                    <p className="text-sm mt-2">Upgrade buildings to increase capacity and train more troops!</p>
                  </div>
                </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>

          {/* Battle System */}
          <AccordionItem value="battle">
            <Card className="bg-black/50 border-red-500/50">
              <AccordionTrigger className="px-6 hover:no-underline">
                <CardTitle className="text-red-400 text-lg flex items-center gap-2">
                  <span className="text-2xl">⚔️</span>
                  Battle & Map System
                </CardTitle>
              </AccordionTrigger>
              <AccordionContent>
                <CardContent className="space-y-4 text-gray-300">
                  <div className="space-y-3">
                    <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-500/30">
                      <div className="font-bold text-purple-400 mb-2">🗺️ Battle Maps</div>
                      <p>Each attack generates a random map with unique modifiers:</p>
                      <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                        <li><strong>Inferna Plains:</strong> +30% Heavy Mechs, Artillery disabled</li>
                        <li><strong>Crystal Wastes:</strong> +25% Air Fighters, Infantry disabled</li>
                        <li><strong>Neon Ruins:</strong> +20% Drones, Heavy Mechs disabled</li>
                        <li><strong>Frost Sector 9:</strong> +25% Artillery, Bombers disabled</li>
                        <li><strong>Dust Belt:</strong> +30% Infantry, Air Fighters disabled</li>
                        <li><strong>Omega Orbit:</strong> +15% Bombers, Drones disabled</li>
                        <li><strong>Bio Hive:</strong> +25% Drones, Artillery disabled</li>
                      </ul>
                    </div>

                    <div className="bg-red-900/20 p-4 rounded-lg border border-red-500/30">
                      <div className="font-bold text-red-400 mb-2">🎲 Battle Resolution</div>
                      <p>Combat is resolved using:</p>
                      <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                        <li>Troop power weights (Infantry: 1, Heavy Mechs: 8, etc.)</li>
                        <li>Map modifiers and disabled units</li>
                        <li>Strength/weakness interactions</li>
                        <li>Random variance for unpredictability</li>
                      </ul>
                      <p className="mt-3"><strong>Casualties:</strong></p>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        <li>Winner: 30-50% troop losses</li>
                        <li>Loser: 60-90% troop losses</li>
                      </ul>
                    </div>

                    <div className="bg-yellow-900/20 p-4 rounded-lg border border-yellow-500/30">
                      <div className="font-bold text-yellow-400 mb-2">💰 Loot System</div>
                      <p>Winners steal tokens based on surviving troops:</p>
                      <p className="text-sm mt-2">If 50% of your army survives → steal 50% of defender's stash</p>
                      <p className="text-sm">Capped at 10% of defender's total tokens or 500 MCP max</p>
                    </div>

                    <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-500/30">
                      <div className="font-bold text-blue-400 mb-2">🔄 Map Rerolling</div>
                      <p>Don't like the map? Reroll for a cost:</p>
                      <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                        <li>1st reroll: 2 MCP</li>
                        <li>2nd reroll: 4 MCP</li>
                        <li>3rd reroll: 8 MCP</li>
                        <li>4th+ reroll: Doubles each time</li>
                      </ul>
                      <p className="text-sm mt-2 text-gray-400">Map locks for 10 minutes after attack</p>
                    </div>
                  </div>
                </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>

          {/* Strategy Tips */}
          <AccordionItem value="strategy">
            <Card className="bg-black/50 border-green-500/50">
              <AccordionTrigger className="px-6 hover:no-underline">
                <CardTitle className="text-green-400 text-lg flex items-center gap-2">
                  <span className="text-2xl">🎯</span>
                  Strategy & Tips
                </CardTitle>
              </AccordionTrigger>
              <AccordionContent>
                <CardContent className="space-y-4 text-gray-300">
                  <div className="space-y-3">
                    <div className="bg-green-900/20 p-4 rounded-lg border border-green-500/30">
                      <div className="font-bold text-green-400 mb-2">💡 Early Game</div>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        <li>Focus on upgrading Engineer first for passive income</li>
                        <li>Train cheap Infantry and Drones to start</li>
                        <li>Build Barracks and Drone Core for housing</li>
                        <li>Don't forget to claim your stash regularly!</li>
                      </ul>
                    </div>

                    <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-500/30">
                      <div className="font-bold text-blue-400 mb-2">⚔️ Mid Game</div>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        <li>Diversify your army - counter compositions win battles</li>
                        <li>Upgrade Defense to avoid being targeted</li>
                        <li>Pay troop upkeep to prevent desertion</li>
                        <li>Scout enemies before attacking</li>
                      </ul>
                    </div>

                    <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-500/30">
                      <div className="font-bold text-purple-400 mb-2">🏆 Late Game</div>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        <li>Max out Attack to access well-defended targets</li>
                        <li>Train expensive units (Bombers, Air Fighters)</li>
                        <li>Upgrade Command Center for global capacity boost</li>
                        <li>Coordinate attacks based on map modifiers</li>
                      </ul>
                    </div>

                    <div className="bg-yellow-900/20 p-4 rounded-lg border border-yellow-500/30">
                      <div className="font-bold text-yellow-400 mb-2">⚠️ Common Mistakes</div>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        <li>Training only one troop type (easy to counter)</li>
                        <li>Neglecting stat upgrades (falling behind)</li>
                        <li>Not paying upkeep (losing troops to desertion)</li>
                        <li>Attacking without checking the map modifier</li>
                        <li>Letting stash fill to max (wasting mining time)</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>
        </Accordion>
      </div>
    </ScrollArea>
  );
}
