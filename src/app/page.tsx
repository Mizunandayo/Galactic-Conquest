'use client';

import { useState, useEffect } from 'react';
import { useGame } from '@/contexts/GameContext';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { LoginForm } from '@/components/auth/LoginForm';
import { GameDashboard } from '@/components/game/GameDashboard';
import { sdk } from "@farcaster/miniapp-sdk";

export default function Home() {
  useEffect(() => {
    const initializeFarcaster = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 100));
        if (document.readyState !== 'complete') {
          await new Promise(resolve => {
            if (document.readyState === 'complete') {
              resolve(void 0);
            } else {
              window.addEventListener('load', () => resolve(void 0), { once: true });
            }
          });
        }

        await sdk.actions.ready();
        console.log("Farcaster SDK initialized successfully - app fully loaded");
      } catch (error) {
        console.error('Failed to initialize Farcaster SDK:', error);
        setTimeout(async () => {
          try {
            await sdk.actions.ready();
            console.log('Farcaster SDK initialized on retry');
          } catch (retryError) {
            console.error('Farcaster SDK retry failed:', retryError);
          }
        }, 1000);
      }
    };
    initializeFarcaster();
  }, []);

  const [authMode, setAuthMode] = useState<'register' | 'login'>('login');
  const { player, isAuthenticated, login, register } = useGame();

  const handleRegister = (username: string, referralCode: string) => {
    register(username, referralCode || undefined);
  };

  const handleLogin = () => {
    // For demo, auto-login with a test user
    login('DemoCommander');
  };

  if (!isAuthenticated || !player) {
    if (authMode === 'register') {
      return (
        <RegisterForm
          onRegister={handleRegister}
          onSwitchToLogin={() => setAuthMode('login')}
        />
      );
    }

    return (
      <LoginForm
        onLogin={handleLogin}
        onSwitchToRegister={() => setAuthMode('register')}
      />
    );
  }

  return <GameDashboard />;
}
