'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGame } from '@/contexts/GameContext';

interface LoginFormProps {
  onLogin: () => void;
  onSwitchToRegister: () => void;
}

export function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const { login } = useGame();

  const handleDemoLogin = () => {
    login('DemoCommander');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-black p-4">
      <Card className="w-full max-w-md bg-black/80 border-purple-500/50 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="text-6xl mb-4">🚀</div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Galactic Conquest
          </CardTitle>
          <p className="text-gray-400 mt-2">Welcome Back, Commander</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleDemoLogin}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg py-6"
          >
            🎮 Start Demo Game
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-black/80 text-gray-400">New to the game?</span>
            </div>
          </div>
          <Button
            onClick={onSwitchToRegister}
            variant="outline"
            className="w-full border-gray-700 text-gray-300 hover:text-white"
          >
            Create New Account
          </Button>
          <div className="text-center text-sm text-gray-500 mt-4">
            <p>This is a demo version - all progress saved locally</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
