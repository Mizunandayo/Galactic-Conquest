'use client';

import { useGame } from '@/contexts/GameContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Copy, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export function ReferralHistory() {
  const { player } = useGame();
  const [copied, setCopied] = useState(false);

  if (!player) return null;

  const handleCopyReferralCode = () => {
    navigator.clipboard.writeText(player.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold text-white mb-6">Referral System</h2>

      <Card className="bg-black/40 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            Your Referral Code
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-800/50 rounded-lg p-4 border border-purple-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Share this code with friends:</p>
                <p className="text-2xl font-bold text-purple-400">{player.referralCode}</p>
              </div>
              <Button
                onClick={handleCopyReferralCode}
                size="sm"
                className="bg-purple-600 hover:bg-purple-700"
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
            <p className="text-sm text-blue-300">
              💡 <strong>Referral Bonuses:</strong> New players who use your code get <strong>50 MCP</strong> bonus tokens (instead of 25 MCP). Help grow the galaxy!
            </p>
          </div>

          {player.referredBy && (
            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3">
              <p className="text-sm text-green-300">
                ✅ You were referred by: <strong className="text-white">{player.referredBy}</strong>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-black/40 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Users className="w-5 h-5 text-green-400" />
              Players You Invited
            </span>
            <span className="text-sm bg-green-600 px-3 py-1 rounded-full">
              {player.referredPlayers.length} Total
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {player.referredPlayers.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <Users className="w-12 h-12 mx-auto mb-3 text-gray-600" />
              <p className="text-lg mb-2">No referrals yet</p>
              <p className="text-sm">Share your referral code to invite commanders to your alliance!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {player.referredPlayers.map((username, index) => (
                <div
                  key={username}
                  className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-white font-semibold">{username}</p>
                      <p className="text-xs text-gray-400">Joined your alliance</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 text-sm font-semibold">Active</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-black/40 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Referral Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
              <p className="text-sm text-gray-400 mb-1">Total Invites</p>
              <p className="text-3xl font-bold text-purple-400">{player.referredPlayers.length}</p>
            </div>
            <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
              <p className="text-sm text-gray-400 mb-1">Your Starting Bonus</p>
              <p className="text-3xl font-bold text-green-400">
                {player.referredBy ? '50' : '25'} <span className="text-base">MCP</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
