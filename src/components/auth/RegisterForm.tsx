'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface RegisterFormProps {
  onRegister: (username: string, referralCode: string) => void;
  onSwitchToLogin: () => void;
}

export function RegisterForm({ onRegister, onSwitchToLogin }: RegisterFormProps) {
  const [username, setUsername] = useState('');
  const [referralCode, setReferralCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onRegister(username.trim(), referralCode.trim());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-black p-4">
      <Card className="w-full max-w-md bg-black/80 border-purple-500/50 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="text-6xl mb-4">🚀</div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Join the Conquest
          </CardTitle>
          <p className="text-gray-400 mt-2">Create Your Commander Profile</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-300">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="bg-gray-900 border-gray-700 text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="referralCode" className="text-gray-300">
                Referral Code (Optional)
              </Label>
              <Input
                id="referralCode"
                type="text"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                placeholder="Enter referral code"
                className="bg-gray-900 border-gray-700 text-white"
              />
              <p className="text-xs text-gray-500">Get bonus tokens with a referral code!</p>
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg py-6"
            >
              🎮 Create Account
            </Button>
          </form>
          <div className="mt-4 text-center">
            <button
              onClick={onSwitchToLogin}
              className="text-sm text-gray-400 hover:text-white"
            >
              Already have an account? Login
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
