'use client';

import { useGame, TROOP_CONFIG } from '@/contexts/GameContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DailyUpkeepDisplay } from './DailyUpkeepDisplay';
import { Coins, Zap, TrendingUp, Lock, ArrowDownToLine, Info, HelpCircle, Sparkles, Target, Shield, Rocket, Award, Activity } from 'lucide-react';

export function StatsOverview() {
  const {
    player,
    claimMiningStash,
    collectReturningTroops,
    upgradeStat,
    stakeTokens,
    getActualStashSize,
  } = useGame();

  if (!player) return null;

  const actualStashSize = getActualStashSize();
  const stashPercentage = (player.miningStash / actualStashSize) * 100;

  // Calculate total upkeep
  let totalUpkeep = 0;
  (Object.keys(player.troops) as Array<keyof typeof player.troops>).forEach((troopType) => {
    totalUpkeep += player.troops[troopType] * TROOP_CONFIG[troopType].upkeep;
  });

  return (
    <div className="space-y-12 fade-in pb-12">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#bd34fe]/10 via-transparent to-[#47caff]/10 rounded-3xl blur-3xl -z-10" />
        <div className="text-center space-y-4 py-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#bd34fe]/10 border border-[#bd34fe]/20 rounded-full text-sm">
            <Sparkles className="w-4 h-4 text-[#bd34fe]" />
            <span className="gradient-text font-medium">Commander Dashboard</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            <span className="gradient-text">Welcome Back,</span>
            <br />
            <span className="text-foreground">{player.username}</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your galactic empire awaits. Monitor resources, upgrade abilities, and dominate the battlefield.
          </p>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border/40 bg-gradient-to-br from-[#bd34fe]/5 to-transparent backdrop-blur-sm hover:scale-105 transition-transform duration-300">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#bd34fe]/10 rounded-xl">
                <Coins className="w-6 h-6 text-[#bd34fe]" />
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total Balance</p>
                <p className="text-3xl font-bold gradient-text">{player.tokens.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Activity className="w-3 h-3" />
              <span>+{(player.stats.engineer * 0.001).toFixed(3)} MCP/s</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-gradient-to-br from-[#47caff]/5 to-transparent backdrop-blur-sm hover:scale-105 transition-transform duration-300">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#47caff]/10 rounded-xl">
                <Award className="w-6 h-6 text-[#47caff]" />
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Power Level</p>
                <p className="text-3xl font-bold text-[#47caff]">
                  {player.stats.attack + player.stats.defense + player.stats.engineer}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Target className="w-3 h-3" />
              <span>Total Stats Combined</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-gradient-to-br from-green-500/5 to-transparent backdrop-blur-sm hover:scale-105 transition-transform duration-300">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/10 rounded-xl">
                <Shield className="w-6 h-6 text-green-400" />
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Army Size</p>
                <p className="text-3xl font-bold text-green-400">
                  {Object.values(player.troops).reduce((sum, count) => sum + count, 0).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Rocket className="w-3 h-3" />
              <span>Active Troops</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mining Stash - Hero Card */}
      <Card className="border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[#bd34fe]/5 via-transparent to-[#47caff]/5" />
        <CardContent className="pt-8 pb-8 relative">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-[#bd34fe]/10 rounded-lg">
                  <Coins className="w-5 h-5 text-[#bd34fe]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Mining Stash</h2>
                  <p className="text-sm text-muted-foreground">Auto-generating passive income</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">Available Now</p>
              <p className="text-4xl font-bold gradient-text">{player.miningStash.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground mt-1">of {actualStashSize} MCP capacity</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2 mb-6">
            <div className="w-full bg-secondary/50 rounded-full h-3 overflow-hidden">
              <div
                className="progress-gradient h-3 transition-all duration-500 relative"
                style={{ width: `${Math.min(stashPercentage, 100)}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </div>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground flex items-center gap-1">
                <Activity className="w-3 h-3" />
                Mining at {(player.stats.engineer * 0.001).toFixed(3)} MCP/second
              </span>
              <span className="font-mono text-[#bd34fe]">{stashPercentage.toFixed(1)}% Full</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={claimMiningStash}
              disabled={player.miningStash === 0 || player.claimEnergy === 0}
              className="flex-1 bg-gradient-to-r from-[#bd34fe] to-[#47caff] hover:from-[#bd34fe]/90 hover:to-[#47caff]/90 text-white disabled:opacity-50 h-12 text-lg font-semibold shadow-lg shadow-[#bd34fe]/20"
              size="lg"
            >
              <ArrowDownToLine className="w-5 h-5 mr-2" />
              Claim Tokens
              {player.claimEnergy === 0 && <span className="ml-2 text-sm font-normal">(No Energy)</span>}
            </Button>
            <Button
              onClick={() => {
                const amount = prompt('Enter tokens to stake (increases capacity 1:1):');
                if (amount && !isNaN(parseInt(amount))) stakeTokens(parseInt(amount));
              }}
              variant="outline"
              size="lg"
              className="border-[#bd34fe]/40 hover:bg-[#bd34fe]/10 hover:border-[#bd34fe]/60 h-12"
            >
              <Lock className="w-4 h-4 mr-2" />
              Stake Tokens
            </Button>
          </div>

          {player.stakedTokens > 0 && (
            <div className="mt-4 px-4 py-3 bg-gradient-to-r from-[#bd34fe]/5 to-[#47caff]/5 rounded-xl border border-[#bd34fe]/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#bd34fe]" />
                  <span className="text-sm text-muted-foreground">Staked Tokens</span>
                </div>
                <div className="text-right">
                  <p className="font-mono font-bold text-[#bd34fe]">{player.stakedTokens.toLocaleString()} MCP</p>
                  <p className="text-xs text-muted-foreground">+{player.stakedTokens} capacity boost</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Commander Stats */}
      <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium">Commander Stats</CardTitle>
            <div className="group relative">
              <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
              <div className="absolute right-0 top-6 w-64 p-3 bg-popover border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <strong>Engineer:</strong> Increases mining rate<br/>
                  <strong>Attack:</strong> Boosts damage in battles<br/>
                  <strong>Defense:</strong> Reduces incoming damage
                </p>
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Upgrade costs increase with each level</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {(Object.keys(player.stats) as Array<keyof typeof player.stats>).map((stat) => {
            const level = player.stats[stat];
            const upgradeCost = Math.pow(level + 1, 2) * 10;
            const canAfford = player.tokens >= upgradeCost;
            
            // Get stat descriptions
            const statInfo: Record<string, { emoji: string; benefit: string; color: string }> = {
              engineer: { emoji: '⚙️', benefit: `+${(level * 0.001).toFixed(3)} MCP/s`, color: 'text-[#47caff]' },
              attack: { emoji: '⚔️', benefit: `+${level}% damage`, color: 'text-[#bd34fe]' },
              defense: { emoji: '🛡️', benefit: `+${level}% protection`, color: 'text-green-400' },
              stashSize: { emoji: '📦', benefit: `${level} capacity`, color: 'text-amber-400' },
            };
            
            const info = statInfo[stat];
            
            return (
              <div key={stat} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/40 hover:border-border/60 transition-colors group">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{info.emoji}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium capitalize">{stat}</p>
                        <span className="px-2 py-0.5 bg-secondary rounded text-xs text-muted-foreground font-mono">
                          Level {level}
                        </span>
                      </div>
                      <p className={`text-xs ${info.color} font-medium mt-0.5`}>
                        {info.benefit}
                      </p>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => upgradeStat(stat)}
                  disabled={!canAfford}
                  size="sm"
                  variant="ghost"
                  className={canAfford ? "text-[#bd34fe] hover:bg-[#bd34fe]/10 hover:text-[#bd34fe]" : ""}
                >
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {upgradeCost} MCP
                </Button>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Daily Upkeep */}
      <DailyUpkeepDisplay />

      {/* Returning Troops */}
      {player.returningTroops.length > 0 && (
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-medium">Returning Troops</CardTitle>
              <span className="text-xs text-muted-foreground">{player.returningTroops.length} active</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {player.returningTroops.map((returning) => {
              const timeLeft = Math.max(0, returning.returnsAt - Date.now());
              const minutes = Math.floor(timeLeft / 60000);
              const seconds = Math.floor((timeLeft % 60000) / 1000);
              const isReady = timeLeft === 0;

              return (
                <div
                  key={returning.id}
                  className={`p-3 rounded-lg border transition-all ${
                    isReady 
                      ? 'bg-[#bd34fe]/10 border-[#bd34fe]/30' 
                      : 'bg-secondary/30 border-border/40'
                  }`}
                >
                  <div className="flex justify-between items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium mb-1">
                        <span className="text-muted-foreground">From:</span> {returning.origin}
                      </p>
                      <p className="text-xs text-muted-foreground font-mono truncate">
                        {Object.entries(returning.troops)
                          .filter(([_, count]) => count && count > 0)
                          .map(([type, count]) => `${count} ${TROOP_CONFIG[type as keyof typeof TROOP_CONFIG].name}`)
                          .join(', ')}
                      </p>
                    </div>
                    {isReady ? (
                      <Button
                        onClick={() => collectReturningTroops(returning.id)}
                        size="sm"
                        className="bg-[#bd34fe] hover:bg-[#bd34fe]/90 text-white"
                      >
                        Collect
                      </Button>
                    ) : (
                      <span className="text-xs font-mono text-muted-foreground whitespace-nowrap">
                        {minutes}m {seconds}s
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Energy Info */}
      <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#47caff]" />
              Energy Systems
            </CardTitle>
            <div className="group relative">
              <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
              <div className="absolute right-0 top-6 w-64 p-3 bg-popover border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Energy regenerates automatically over time. You need Claim Energy to collect tokens and Attack Energy to raid other players.
                </p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-[#47caff]/5 rounded-lg border border-[#47caff]/20">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Claim Energy</span>
              <span className="font-mono font-medium text-[#47caff]">{player.claimEnergy}/5</span>
            </div>
            <div className="w-full bg-secondary/50 rounded-full h-1.5 mb-2">
              <div
                className="bg-[#47caff] h-1.5 rounded-full transition-all"
                style={{ width: `${(player.claimEnergy / 5) * 100}%` }}
              />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Needed to claim mining stash</p>
              <p className="text-xs text-[#47caff]">+1 every 4h</p>
            </div>
          </div>
          
          <div className="p-3 bg-[#bd34fe]/5 rounded-lg border border-[#bd34fe]/20">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Attack Energy</span>
              <span className="font-mono font-medium text-[#bd34fe]">{player.attackEnergy}/8</span>
            </div>
            <div className="w-full bg-secondary/50 rounded-full h-1.5 mb-2">
              <div
                className="bg-[#bd34fe] h-1.5 rounded-full transition-all"
                style={{ width: `${(player.attackEnergy / 8) * 100}%` }}
              />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Needed to attack other players</p>
              <p className="text-xs text-[#bd34fe]">+1 every 4h</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
