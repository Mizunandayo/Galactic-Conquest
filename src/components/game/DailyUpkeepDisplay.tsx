'use client';

import { useGame, TROOP_CONFIG, type TroopData } from '@/contexts/GameContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, AlertTriangle, Clock } from 'lucide-react';

export function DailyUpkeepDisplay() {
  const { player, payDailyUpkeep, simulateUpkeep, payYesterdayUpkeep } = useGame();

  if (!player) return null;

  // Calculate total upkeep
  let totalUpkeep = 0;
  const upkeepBreakdown: Array<{ troop: string; count: number; cost: number }> = [];

  (Object.keys(player.troops) as Array<keyof TroopData>).forEach((troopType) => {
    const count = player.troops[troopType];
    if (count > 0) {
      const cost = count * TROOP_CONFIG[troopType].upkeep;
      totalUpkeep += cost;
      upkeepBreakdown.push({
        troop: TROOP_CONFIG[troopType].name,
        count,
        cost,
      });
    }
  });

  const canAfford = player.tokens >= totalUpkeep;
  const hoursSinceLastPayment = (Date.now() - player.lastUpkeepPaid) / (1000 * 60 * 60);
  const has24HoursPassed = hoursSinceLastPayment >= 24;
  const hoursUntil24 = Math.max(0, 24 - hoursSinceLastPayment);
  const minutesUntil24 = Math.floor((hoursUntil24 % 1) * 60);

  return (
    <Card className="bg-black/40 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          Daily Troop Upkeep
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {totalUpkeep === 0 ? (
          <p className="text-gray-400 text-center py-4">No troops to maintain</p>
        ) : (
          <>
            <div className="space-y-2">
              {upkeepBreakdown.map((item) => (
                <div
                  key={item.troop}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-gray-400">
                    {item.troop} x{item.count}
                  </span>
                  <span className="text-white">{item.cost.toFixed(2)} MCP/day</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-bold text-white">Total Daily Cost:</span>
                <span className="text-2xl font-bold text-yellow-400">
                  {totalUpkeep.toFixed(2)} MCP
                </span>
              </div>

              {has24HoursPassed && player.unpaidDays > 0 && (
                <div className="flex items-start gap-2 p-3 bg-red-900/30 border border-red-500/50 rounded-lg mb-3">
                  <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-red-300">
                    <p className="font-bold mb-1">Upkeep Overdue!</p>
                    <p>
                      {player.unpaidDays} day{player.unpaidDays > 1 ? 's' : ''} unpaid! Pay now to avoid desertion.
                    </p>
                  </div>
                </div>
              )}

              {!has24HoursPassed && (
                <div className="flex items-start gap-2 p-3 bg-blue-900/30 border border-blue-500/50 rounded-lg mb-3">
                  <Clock className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-300">
                    <p className="font-bold mb-1">Next Upkeep Payment</p>
                    <p>
                      Available in {Math.floor(hoursUntil24)}h {minutesUntil24}m
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {has24HoursPassed && player.unpaidDays > 0 ? (
                  <Button
                    onClick={() => payYesterdayUpkeep()}
                    disabled={player.tokens < (totalUpkeep * player.unpaidDays)}
                    className={`w-full ${
                      player.tokens >= (totalUpkeep * player.unpaidDays)
                        ? 'bg-orange-600 hover:bg-orange-700'
                        : 'bg-gray-700 text-gray-400'
                    }`}
                  >
                    {player.tokens >= (totalUpkeep * player.unpaidDays)
                      ? `Pay Yesterday's Upkeep (${(totalUpkeep * player.unpaidDays).toFixed(2)} MCP)`
                      : 'Insufficient Tokens'}
                  </Button>
                ) : (
                  <Button
                    onClick={() => payDailyUpkeep()}
                    disabled={!canAfford || !has24HoursPassed}
                    className={`w-full ${
                      canAfford && has24HoursPassed
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-gray-700 text-gray-400'
                    }`}
                  >
                    {!has24HoursPassed
                      ? `Pay Upkeep (Available in ${Math.floor(hoursUntil24)}h ${minutesUntil24}m)`
                      : canAfford
                      ? 'Pay Upkeep'
                      : 'Insufficient Tokens'}
                  </Button>
                )}
                <Button
                  onClick={() => simulateUpkeep()}
                  variant="outline"
                  className="w-full border-yellow-500/50 text-yellow-400 hover:bg-yellow-900/20"
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Simulate Not Paying (See Desertion)
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
