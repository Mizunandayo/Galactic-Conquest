'use client';

import React, { useEffect } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

export function FarcasterWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const init = async () => {
      try {
        await sdk.actions.ready();
      } catch (error) {
        console.error('Farcaster SDK error:', error);
      }
    };
    init();
  }, []);

  return <>{children}</>;
}
