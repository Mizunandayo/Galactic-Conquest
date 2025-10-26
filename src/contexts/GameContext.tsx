 'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { safeLocalStorage } from '@/lib/safeLocalStorage';

// Storage version - increment to force data reset
const DATA_VERSION = '3';

// Types
export interface TroopData {
  infantry: number;
  lightVehicles: number;
  heavyMechs: number;
  artillery: number;
  airFighters: number;
  bombers: number;
  drones: number;
}

export interface BuildingLevels {
  barracks: number;
  droneCore: number;
  mechBay: number;
  vehicleDepot: number;
  artilleryStation: number;
  hangar: number;
}

export interface CommanderStats {
  engineer: number;
  attack: number;
  defense: number;
  stashSize: number;
}

export interface TrainingItem {
  id: string;
  troopType: keyof TroopData;
  quantity: number;
  completesAt: number;
  notified?: boolean;
}

export interface ReturningTroops {
  id: string;
  troops: Partial<TroopData>;
  returnsAt: number;
  origin: string;
}

export interface LockedMap {
  targetUsername: string;
  map: BattleMap;
  lockedUntil: number;
}

export interface Activity {
  id: string;
  type: string;
  message: string;
  timestamp: number;
}

export interface Notification {
  id: string;
  type: string;
  message: string;
  isRead: boolean;
  timestamp: number;
}

export interface BattleMap {
  id: string;
  name: string;
  type: 'standard' | 'unstable' | 'blessed';
  description: string;
  boost?: { troop: keyof TroopData; amount: number };
  disabled?: keyof TroopData;
  specialEffect?: string;
}

export interface PlayerCoordinates {
  x: number;
  y: number;
}

export interface ScoutResult {
  success: boolean;
  troopCounts?: Partial<TroopData>;
  message: string;
  cost: number;
  tier: ScoutTier | 'none';
}

export type ScoutTier = 'basic' | 'advanced' | 'elite';

export interface PlayerState {
  username: string;
  tokens: number;
  miningStash: number;
  troops: TroopData;
  buildings: BuildingLevels;
  stats: CommanderStats;
  trainingQueue: TrainingItem[];
  returningTroops: ReturningTroops[];
  activities: Activity[];
  notifications: Notification[];
  lastUpkeepPaid: number;
  unpaidDays: number;
  coordinates: PlayerCoordinates;
  lockedMaps: LockedMap[];
  referralCode: string;
  referredBy?: string;
  referredPlayers: string[];
  claimEnergy: number;
  lastClaimRegen: number;
  attackEnergy: number;
  lastAttackRegen: number;
  stakedTokens: number;
}

interface GameContextType {
  player: PlayerState | null;
  isAuthenticated: boolean;
  login: (username: string) => void;
  register: (username: string, referralCode?: string) => void;
  logout: () => void;
  resetGame: () => void;
  trainTroops: (troopType: keyof TroopData, quantity: number) => void;
  collectTroops: (trainingId: string) => void;
  upgradeBuilding: (building: keyof BuildingLevels) => void;
  upgradeStat: (stat: keyof CommanderStats) => void;
  claimMiningStash: () => void;
  payDailyUpkeep: () => void;
  payYesterdayUpkeep: () => void;
  attackPlayer: (targetUsername: string, troops: Partial<TroopData>, map: BattleMap, travelTime: number, scoutTier: ScoutTier | 'none') => void;
  scoutPlayer: (targetUsername: string, tier: ScoutTier) => ScoutResult;
  simulateUpkeep: () => void;
  getMapForTarget: (targetUsername: string) => BattleMap;
  rerollMapForTarget: (targetUsername: string) => { map: BattleMap; cost: number };
  collectReturningTroops: (returningId: string) => void;
  markNotificationRead: (notificationId: string) => void;
  getRandomMap: () => BattleMap;
  calculateTravelCost: (targetCoords: PlayerCoordinates) => { time: number; cost: number; distance: number };
  simulateDefense: () => string;
  referPlayer: (referralCode: string) => void;
  addDevTroops: (troopType: keyof TroopData, amount: number) => void;
  addDevTokens: (amount: number) => void;
  stakeTokens: (amount: number) => boolean;
  getActualStashSize: () => number;
  mockPlayers: Array<{ 
    username: string; 
    defense: number; 
    tokens: number; 
    miningStash: number;
    coordinates: PlayerCoordinates;
    troops: Partial<TroopData>;
  }>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// Troop config
export const TROOP_CONFIG: Record<keyof TroopData, { 
  name: string; 
  cost: number; 
  trainingTime: number;
  space: number;
  upkeep: number;
  power: number;
}> = {
  infantry: { name: 'Infantry', cost: 1, trainingTime: 120, space: 1, upkeep: 0.05, power: 1 },
  lightVehicles: { name: 'Light Vehicles', cost: 3, trainingTime: 300, space: 3, upkeep: 0.10, power: 2 },
  heavyMechs: { name: 'Heavy Mechs', cost: 8, trainingTime: 600, space: 5, upkeep: 0.20, power: 5 },
  artillery: { name: 'Artillery', cost: 6, trainingTime: 480, space: 4, upkeep: 0.15, power: 4 },
  airFighters: { name: 'Air Fighters', cost: 5, trainingTime: 420, space: 3, upkeep: 0.18, power: 3 },
  bombers: { name: 'Bombers', cost: 10, trainingTime: 720, space: 6, upkeep: 0.25, power: 6 },
  drones: { name: 'Drones', cost: 2, trainingTime: 240, space: 2, upkeep: 0.08, power: 1.5 },
};

export const BUILDING_CONFIG: Record<keyof BuildingLevels, {
  name: string;
  baseCapacity: number;
  capacityGrowth: number;
}> = {
  barracks: { name: 'Barracks', baseCapacity: 50, capacityGrowth: 20 },
  droneCore: { name: 'Drone Core', baseCapacity: 40, capacityGrowth: 10 },
  mechBay: { name: 'Mech Bay', baseCapacity: 30, capacityGrowth: 15 },
  vehicleDepot: { name: 'Vehicle Depot', baseCapacity: 30, capacityGrowth: 15 },
  artilleryStation: { name: 'Artillery Station', baseCapacity: 20, capacityGrowth: 15 },
  hangar: { name: 'Hangar', baseCapacity: 20, capacityGrowth: 15 },
};

export const BATTLE_MAPS: BattleMap[] = [
  { id: 'solara', name: 'Desert Planet – Solara', type: 'standard', description: 'Open dunes, fast movement', boost: { troop: 'lightVehicles', amount: 25 }, disabled: 'drones' },
  { id: 'cryon', name: 'Ice World – Cryon', type: 'standard', description: 'Slippery terrain, energy disruption', boost: { troop: 'infantry', amount: 15 }, disabled: 'airFighters' },
  { id: 'inferna', name: 'Lava Fortress – Inferna', type: 'standard', description: 'Harsh heat, solid ground', boost: { troop: 'heavyMechs', amount: 30 }, disabled: 'artillery' },
  { id: 'karis', name: 'Asteroid Field – Karis Belt', type: 'standard', description: 'Floating debris field', boost: { troop: 'airFighters', amount: 20 }, disabled: 'heavyMechs' },
  { id: 'delga', name: 'Swamp Moon – Delga', type: 'standard', description: 'Fog & swamps', boost: { troop: 'artillery', amount: 25 }, disabled: 'lightVehicles' },
  { id: 'zentrix', name: 'Cyber Colony – Zentrix', type: 'standard', description: 'AI-controlled world', boost: { troop: 'drones', amount: 20 }, disabled: 'bombers' },
  { id: 'echelon', name: 'Urban Wasteland – Echelon City', type: 'standard', description: 'City ruins', boost: { troop: 'infantry', amount: 15 } },
  { id: 'magnetic', name: 'Magnetic Storm Zone', type: 'unstable', description: 'EM interference', disabled: 'drones', specialEffect: 'Random power drain' },
  { id: 'volcanic', name: 'Volcanic Rift', type: 'unstable', description: 'Heavy terrain damage', disabled: 'lightVehicles', specialEffect: 'Passive burn damage' },
  { id: 'frozen', name: 'Frozen Orbit', type: 'unstable', description: 'Flight impossible', disabled: 'bombers', specialEffect: 'Extreme cold' },
  { id: 'nebula', name: 'Dark Nebula', type: 'unstable', description: 'No long-range targeting', disabled: 'artillery', specialEffect: 'Zero visibility' },
  { id: 'toxic', name: 'Toxic Mire', type: 'unstable', description: 'Armor corrosion', disabled: 'heavyMechs', specialEffect: 'Corrosive atmosphere' },
  { id: 'crystal', name: 'Crystal Ridge', type: 'blessed', description: 'Rich crystal fields', specialEffect: '+20% Mining reward after battle' },
  { id: 'nova', name: 'Nova Plains', type: 'blessed', description: 'Solar plains', specialEffect: '+15% All units' },
  { id: 'phantom', name: 'Phantom Belt', type: 'blessed', description: 'Space anomaly', specialEffect: '+25% Evasion (reduces losses)' },
];

const MOCK_PLAYERS = [
  { username: 'Commander_Alpha', defense: 1, tokens: 850, miningStash: 45, coordinates: { x: 250, y: 380 }, troops: { infantry: 15, lightVehicles: 8, drones: 12 } },
  { username: 'Space_Pirate_99', defense: 2, tokens: 1200, miningStash: 78, coordinates: { x: 680, y: 120 }, troops: { heavyMechs: 5, artillery: 7, bombers: 3 } },
  { username: 'Galactic_Warrior', defense: 1, tokens: 650, miningStash: 32, coordinates: { x: 420, y: 590 }, troops: { infantry: 20, airFighters: 6, drones: 10 } },
  { username: 'Nova_Striker', defense: 3, tokens: 1500, miningStash: 120, coordinates: { x: 890, y: 750 }, troops: { heavyMechs: 8, bombers: 4, artillery: 10 } },
  { username: 'Cosmic_Raider', defense: 1, tokens: 920, miningStash: 56, coordinates: { x: 150, y: 920 }, troops: { lightVehicles: 12, airFighters: 8, drones: 15 } },
];

// Create fresh player data
function createFreshPlayer(username: string, referredBy?: string): PlayerState {
  const referralCode = `REF${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  const bonusTokens = referredBy ? 50 : 25;
  
  return {
    username,
    tokens: 1000 + bonusTokens,
    miningStash: 0,
    troops: { infantry: 10, lightVehicles: 5, heavyMechs: 2, artillery: 3, airFighters: 4, bombers: 1, drones: 8 },
    buildings: { barracks: 1, droneCore: 1, mechBay: 1, vehicleDepot: 1, artilleryStation: 1, hangar: 1 },
    stats: { engineer: 1, attack: 1, defense: 1, stashSize: 100 },
    trainingQueue: [],
    returningTroops: [],
    activities: [],
    notifications: [],
    lastUpkeepPaid: Date.now(),
    unpaidDays: 0,
    coordinates: { x: Math.floor(Math.random() * 1000), y: Math.floor(Math.random() * 1000) },
    lockedMaps: [],
    referralCode,
    referredBy,
    referredPlayers: [],
    claimEnergy: 5,
    lastClaimRegen: Date.now(),
    attackEnergy: 8,
    lastAttackRegen: Date.now(),
    stakedTokens: 0,
  };
}

// Clear all old game data
function clearOldData() {
  if (typeof window === 'undefined') return;
  try {
    const keys = safeLocalStorage.keys();
    keys.forEach(key => {
      if (key.startsWith('gc_') || key.startsWith('galactic_conquest_')) {
        safeLocalStorage.removeItem(key);
      }
    });
  } catch (e) {
    console.error('Failed to clear old data:', e);
  }
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [player, setPlayer] = useState<PlayerState | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check version and load player on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const storedVersion = safeLocalStorage.getItem('gc_data_version');
      
      // If version mismatch, clear all old data
      if (storedVersion !== DATA_VERSION) {
        console.log('Data version mismatch - clearing old data...');
        clearOldData();
        safeLocalStorage.setItem('gc_data_version', DATA_VERSION);
        return;
      }

      const currentUser = safeLocalStorage.getItem('gc_current_user');
      if (currentUser) {
        const savedData = safeLocalStorage.getItem(`gc_player_${currentUser}`);
        if (savedData) {
          const parsed = JSON.parse(savedData);
          // Validate critical fields
          if (parsed?.username && parsed?.coordinates && parsed?.stats && parsed?.returningTroops !== undefined) {
            // Add energy fields if they don't exist (migration)
            if (parsed.claimEnergy === undefined) parsed.claimEnergy = 5;
            if (parsed.lastClaimRegen === undefined) parsed.lastClaimRegen = Date.now();
            if (parsed.attackEnergy === undefined) parsed.attackEnergy = 8;
            if (parsed.lastAttackRegen === undefined) parsed.lastAttackRegen = Date.now();
            if (parsed.stakedTokens === undefined) parsed.stakedTokens = 0;
            setPlayer(parsed);
            setIsAuthenticated(true);
          } else {
            console.warn('Invalid player data, clearing...');
            safeLocalStorage.removeItem(`gc_player_${currentUser}`);
            safeLocalStorage.removeItem('gc_current_user');
          }
        }
      }
    } catch (e) {
      console.error('Failed to load player data:', e);
      clearOldData();
      if (typeof window !== 'undefined') {
        safeLocalStorage.setItem('gc_data_version', DATA_VERSION);
      }
    }
  }, []);

  // Save player data whenever it changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (player && isAuthenticated) {
      try {
        safeLocalStorage.setItem(`gc_player_${player.username}`, JSON.stringify(player));
      } catch (e) {
        console.error('Failed to save player data:', e);
      }
    }
  }, [player, isAuthenticated]);

  // Mining simulation & Energy regeneration
  useEffect(() => {
    if (!player || !isAuthenticated) return;
    const interval = setInterval(() => {
      setPlayer((prev) => {
        if (!prev) return prev;
        const now = Date.now();
        const miningRate = prev.stats.engineer * 0.001;
        const actualStashSize = 10 + prev.stakedTokens; // Base 10 + 1:1 staked tokens
        const newStash = Math.min(prev.miningStash + miningRate, actualStashSize);
        
        // Regenerate claim energy (1 per 4 hours)
        let newClaimEnergy = prev.claimEnergy;
        let newLastClaimRegen = prev.lastClaimRegen;
        if (prev.claimEnergy < 5) {
          const claimTimeSinceRegen = now - prev.lastClaimRegen;
          const fourHoursInMs = 4 * 60 * 60 * 1000;
          const energyToAdd = Math.floor(claimTimeSinceRegen / fourHoursInMs);
          if (energyToAdd > 0) {
            newClaimEnergy = Math.min(prev.claimEnergy + energyToAdd, 5);
            newLastClaimRegen = prev.lastClaimRegen + (energyToAdd * fourHoursInMs);
          }
        }
        
        // Regenerate attack energy (1 per 4 hours)
        let newAttackEnergy = prev.attackEnergy;
        let newLastAttackRegen = prev.lastAttackRegen;
        if (prev.attackEnergy < 8) {
          const attackTimeSinceRegen = now - prev.lastAttackRegen;
          const fourHoursInMs = 4 * 60 * 60 * 1000;
          const energyToAdd = Math.floor(attackTimeSinceRegen / fourHoursInMs);
          if (energyToAdd > 0) {
            newAttackEnergy = Math.min(prev.attackEnergy + energyToAdd, 8);
            newLastAttackRegen = prev.lastAttackRegen + (energyToAdd * fourHoursInMs);
          }
        }
        
        // Check if 24 hours have passed for automatic unpaid day increment
        let newUnpaidDays = prev.unpaidDays;
        const hoursSinceLastPayment = (now - prev.lastUpkeepPaid) / (1000 * 60 * 60);
        if (hoursSinceLastPayment >= 24 && prev.unpaidDays === 0) {
          newUnpaidDays = 1;
        }
        
        return { 
          ...prev, 
          miningStash: newStash,
          claimEnergy: newClaimEnergy,
          lastClaimRegen: newLastClaimRegen,
          attackEnergy: newAttackEnergy,
          lastAttackRegen: newLastAttackRegen,
          unpaidDays: newUnpaidDays,
        };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [player, isAuthenticated]);

  // Training queue notifications (only once per batch)
  useEffect(() => {
    if (!player || !isAuthenticated) return;
    const interval = setInterval(() => {
      const now = Date.now();
      setPlayer((prev) => {
        if (!prev) return prev;
        let updated = { ...prev };
        let changed = false;
        
        updated.trainingQueue = prev.trainingQueue.map((item) => {
          if (item.completesAt <= now && !item.notified) {
            updated.notifications = [
              {
                id: `notif-${Date.now()}-${Math.random()}`,
                type: 'training',
                message: `${TROOP_CONFIG[item.troopType].name} training complete! (${item.quantity} units ready)`,
                isRead: false,
                timestamp: now,
              },
              ...updated.notifications,
            ];
            changed = true;
            return { ...item, notified: true };
          }
          return item;
        });
        
        return changed ? updated : prev;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [player, isAuthenticated]);

  // Returning troops notifications
  useEffect(() => {
    if (!player || !isAuthenticated) return;
    const interval = setInterval(() => {
      const now = Date.now();
      setPlayer((prev) => {
        if (!prev) return prev;
        let updated = { ...prev };
        let changed = false;
        
        prev.returningTroops.forEach((returning) => {
          if (returning.returnsAt <= now) {
            const existing = updated.notifications.find(n => n.message.includes(returning.id));
            if (!existing) {
              updated.notifications = [
                {
                  id: `notif-${Date.now()}-${Math.random()}`,
                  type: 'returning',
                  message: `Troops have returned from ${returning.origin}! Collect them now.`,
                  isRead: false,
                  timestamp: now,
                },
                ...updated.notifications,
              ];
              changed = true;
            }
          }
        });
        
        return changed ? updated : prev;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [player, isAuthenticated]);

  const addActivity = useCallback((type: string, message: string) => {
    setPlayer((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        activities: [
          { id: `activity-${Date.now()}-${Math.random()}`, type, message, timestamp: Date.now() },
          ...prev.activities.slice(0, 49),
        ],
      };
    });
  }, []);

  const login = useCallback((username: string) => {
    if (typeof window === 'undefined') return;
    
    try {
      const savedData = safeLocalStorage.getItem(`gc_player_${username}`);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed?.username && parsed?.coordinates && parsed?.stats && parsed?.returningTroops !== undefined) {
          setPlayer(parsed);
          setIsAuthenticated(true);
          safeLocalStorage.setItem('gc_current_user', username);
          return;
        }
      }
    } catch (e) {
      console.error('Login failed:', e);
    }
    // Create new player if data doesn't exist or is invalid
    const newPlayer = createFreshPlayer(username);
    setPlayer(newPlayer);
    setIsAuthenticated(true);
    safeLocalStorage.setItem(`gc_player_${username}`, JSON.stringify(newPlayer));
    safeLocalStorage.setItem('gc_current_user', username);
  }, []);

  const register = useCallback((username: string, referralCode?: string) => {
    if (typeof window === 'undefined') return;
    
    let referredBy: string | undefined = undefined;
    
    // Check if referral code is valid
    if (referralCode) {
      try {
        const allKeys = safeLocalStorage.keys();
        for (const key of allKeys) {
          if (key.startsWith('gc_player_')) {
            try {
              const keyData = safeLocalStorage.getItem(key);
              const data = JSON.parse(keyData || '{}');
              if (data.referralCode === referralCode) {
                referredBy = data.username;
                // Add this player to the referrer's list
                data.referredPlayers = [...(data.referredPlayers || []), username];
                safeLocalStorage.setItem(key, JSON.stringify(data));
                break;
              }
            } catch (e) {
              console.error('Error checking referral:', e);
            }
          }
        }
      } catch (e) {
        console.error('Error processing referral code:', e);
      }
    }
    
    const newPlayer = createFreshPlayer(username, referredBy);
    setPlayer(newPlayer);
    setIsAuthenticated(true);
    safeLocalStorage.setItem(`gc_player_${username}`, JSON.stringify(newPlayer));
    safeLocalStorage.setItem('gc_current_user', username);
  }, []);

  const logout = useCallback(() => {
    setPlayer(null);
    setIsAuthenticated(false);
    if (typeof window !== 'undefined') {
      try {
        safeLocalStorage.removeItem('gc_current_user');
      } catch (e) {
        console.error('Failed to remove current user:', e);
      }
    }
  }, []);

  const resetGame = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    if (confirm('⚠️ Reset all game data? This cannot be undone!')) {
      clearOldData();
      safeLocalStorage.setItem('gc_data_version', DATA_VERSION);
      setPlayer(null);
      setIsAuthenticated(false);
      alert('✅ Game data reset! Please register or login.');
    }
  }, []);

  const trainTroops = useCallback((troopType: keyof TroopData, quantity: number) => {
    setPlayer((prev) => {
      if (!prev) return prev;
      const config = TROOP_CONFIG[troopType];
      const totalCost = config.cost * quantity;
      if (prev.tokens < totalCost) return prev;
      const trainingItem: TrainingItem = {
        id: `training-${Date.now()}-${Math.random()}`,
        troopType,
        quantity,
        completesAt: Date.now() + config.trainingTime * 1000,
      };
      addActivity('training', `Started training ${quantity} ${config.name}`);
      return { ...prev, tokens: prev.tokens - totalCost, trainingQueue: [...prev.trainingQueue, trainingItem] };
    });
  }, [addActivity]);

  const collectTroops = useCallback((trainingId: string) => {
    setPlayer((prev) => {
      if (!prev) return prev;
      const item = prev.trainingQueue.find((t) => t.id === trainingId);
      if (!item || item.completesAt > Date.now()) return prev;
      const updated = { ...prev, troops: { ...prev.troops } };
      updated.troops[item.troopType] += item.quantity;
      updated.trainingQueue = prev.trainingQueue.filter((t) => t.id !== trainingId);
      addActivity('collected', `Collected ${item.quantity} ${TROOP_CONFIG[item.troopType].name}`);
      return updated;
    });
  }, [addActivity]);

  const upgradeBuilding = useCallback((building: keyof BuildingLevels) => {
    setPlayer((prev) => {
      if (!prev) return prev;
      const currentLevel = prev.buildings[building];
      const upgradeCost = Math.pow(currentLevel + 1, 2) * 10;
      if (prev.tokens < upgradeCost) return prev;
      addActivity('upgrade', `Upgraded ${BUILDING_CONFIG[building].name} to level ${currentLevel + 1}`);
      return {
        ...prev,
        tokens: prev.tokens - upgradeCost,
        buildings: { ...prev.buildings, [building]: currentLevel + 1 },
      };
    });
  }, [addActivity]);

  const upgradeStat = useCallback((stat: keyof CommanderStats) => {
    setPlayer((prev) => {
      if (!prev) return prev;
      const currentLevel = prev.stats[stat];
      const upgradeCost = Math.pow(currentLevel + 1, 2) * 10;
      if (prev.tokens < upgradeCost) return prev;
      addActivity('stat_upgrade', `Upgraded ${stat} to level ${currentLevel + 1}`);
      return {
        ...prev,
        tokens: prev.tokens - upgradeCost,
        stats: { ...prev.stats, [stat]: currentLevel + 1 },
      };
    });
  }, [addActivity]);

  const claimMiningStash = useCallback(() => {
    setPlayer((prev) => {
      if (!prev || prev.miningStash === 0) return prev;
      
      // Check claim energy
      if (prev.claimEnergy === 0) {
        const fourHoursInMs = 4 * 60 * 60 * 1000;
        const timeUntilNextClaim = Math.max(0, fourHoursInMs - (Date.now() - prev.lastClaimRegen));
        const hoursRemaining = Math.floor(timeUntilNextClaim / (1000 * 60 * 60));
        const minutesRemaining = Math.floor((timeUntilNextClaim % (1000 * 60 * 60)) / (1000 * 60));
        alert(`⚠️ No claim energy! Next claim available in ${hoursRemaining}h ${minutesRemaining}m`);
        return prev;
      }
      
      addActivity('claim', `Claimed ${prev.miningStash.toFixed(2)} tokens from mining stash`);
      return { 
        ...prev, 
        tokens: prev.tokens + prev.miningStash, 
        miningStash: 0,
        claimEnergy: prev.claimEnergy - 1,
      };
    });
  }, [addActivity]);

  const payDailyUpkeep = useCallback(() => {
    setPlayer((prev) => {
      if (!prev) return prev;
      let totalUpkeep = 0;
      (Object.keys(prev.troops) as Array<keyof TroopData>).forEach((troopType) => {
        totalUpkeep += prev.troops[troopType] * TROOP_CONFIG[troopType].upkeep;
      });
      if (prev.tokens < totalUpkeep) {
        addActivity('upkeep_failed', `Failed to pay upkeep (${totalUpkeep.toFixed(2)} tokens needed)`);
        return prev;
      }
      addActivity('upkeep', `Paid ${totalUpkeep.toFixed(2)} tokens for daily upkeep`);
      return { ...prev, tokens: prev.tokens - totalUpkeep, lastUpkeepPaid: Date.now(), unpaidDays: 0 };
    });
  }, [addActivity]);

  const payYesterdayUpkeep = useCallback(() => {
    setPlayer((prev) => {
      if (!prev || prev.unpaidDays === 0) return prev;
      let totalUpkeep = 0;
      (Object.keys(prev.troops) as Array<keyof TroopData>).forEach((troopType) => {
        totalUpkeep += prev.troops[troopType] * TROOP_CONFIG[troopType].upkeep;
      });
      const totalOwed = totalUpkeep * prev.unpaidDays;
      if (prev.tokens < totalOwed) return prev;
      
      // Desertion only starts from Day 2 onwards, Day 1 you can still pay without penalty
      if (prev.unpaidDays === 1) {
        // Day 1: Just pay, no desertion
        addActivity('upkeep_paid', `Paid overdue upkeep (1 day). No desertion yet!`);
        return { ...prev, tokens: prev.tokens - totalOwed, lastUpkeepPaid: Date.now(), unpaidDays: 0 };
      }
      
      // Day 2+: Desertion applies
      // desertionRates[0] = 10% for Day 2, [1] = 15% for Day 3, etc.
      const desertionRates = [0.10, 0.15, 0.25, 0.45];
      const rate = desertionRates[Math.min(prev.unpaidDays - 2, 3)] || 0.45;
      const updatedTroops = { ...prev.troops };
      (Object.keys(updatedTroops) as Array<keyof TroopData>).forEach((troopType) => {
        const deserted = Math.floor(updatedTroops[troopType] * rate);
        updatedTroops[troopType] = Math.max(0, updatedTroops[troopType] - deserted);
      });
      addActivity('upkeep_paid', `Paid overdue upkeep (${prev.unpaidDays} days). ${(rate * 100).toFixed(0)}% troops deserted.`);
      return { ...prev, tokens: prev.tokens - totalOwed, troops: updatedTroops, lastUpkeepPaid: Date.now(), unpaidDays: 0 };
    });
  }, [addActivity]);

  const scoutPlayer = useCallback((targetUsername: string, tier: ScoutTier): ScoutResult => {
    const target = MOCK_PLAYERS.find(p => p.username === targetUsername);
    if (!target) return { success: false, message: 'Target not found', cost: 0, tier };
    
    let costPercentage = 0;
    let successRate = 1.0;
    let showExact = false;
    
    if (tier === 'basic') {
      costPercentage = 0.05; // 5%
      successRate = 1.0; // 100%
      showExact = false;
    } else if (tier === 'advanced') {
      costPercentage = 0.10; // 10%
      successRate = 0.9; // 90%
      showExact = true;
    } else if (tier === 'elite') {
      costPercentage = 0.20; // 20%
      successRate = 0.8; // 80%
      showExact = true;
    }
    
    const cost = Math.max(1, Math.floor(target.miningStash * costPercentage));
    
    // Deduct scout cost from unattackable MCP (tokens)
    setPlayer((prev) => {
      if (!prev || prev.tokens < cost) return prev;
      addActivity('scout', `Scouted ${targetUsername} (${tier} scout) - Cost: ${cost} MCP`);
      return {
        ...prev,
        tokens: prev.tokens - cost,
      };
    });
    
    const success = Math.random() < successRate;
    if (!success) {
      return { 
        success: false, 
        message: '🚫 Signal jammed. No data acquired.', 
        cost,
        tier
      };
    }
    
    if (tier === 'basic') {
      const totalTroops = Object.values(target.troops).reduce((sum, count) => sum + (count || 0), 0);
      return { 
        success: true, 
        message: `✅ Basic Scout: Estimated ${totalTroops} total troops (rough estimate). Cost: ${cost} MCP (5% of stash)`,
        cost,
        tier
      };
    }
    
    return { 
      success: true, 
      troopCounts: target.troops, 
      message: tier === 'elite'
        ? `✅ Elite Recon: Exact troop counts revealed + map modifier shown! Cost: ${cost} MCP (20% of stash)` 
        : `✅ Advanced Scout: Approximate troop counts revealed. Cost: ${cost} MCP (10% of stash)`,
      cost,
      tier
    };
  }, [addActivity]);

  const getMapForTarget = useCallback((targetUsername: string): BattleMap => {
    if (!player) return BATTLE_MAPS[0];
    
    const now = Date.now();
    const validLocks = player.lockedMaps.filter(lock => lock.lockedUntil > now);
    
    const existingLock = validLocks.find(lock => lock.targetUsername === targetUsername);
    if (existingLock) {
      return existingLock.map;
    }
    
    const newMap = BATTLE_MAPS[Math.floor(Math.random() * BATTLE_MAPS.length)];
    
    const newLock: LockedMap = {
      targetUsername,
      map: newMap,
      lockedUntil: now + 10 * 60 * 1000,
    };
    
    setPlayer((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        lockedMaps: [...validLocks, newLock],
      };
    });
    
    return newMap;
  }, [player]);

  const rerollMapForTarget = useCallback((targetUsername: string): { map: BattleMap; cost: number } => {
    if (!player) return { map: BATTLE_MAPS[0], cost: 0 };
    
    const now = Date.now();
    const validLocks = player.lockedMaps.filter(lock => lock.lockedUntil > now && lock.targetUsername !== targetUsername);
    
    const rerollCount = player.activities.filter(a => 
      a.type === 'map_reroll' && a.message.includes(targetUsername)
    ).length;
    
    const cost = Math.min(10 * Math.pow(2, rerollCount), 80);
    
    const newMap = BATTLE_MAPS[Math.floor(Math.random() * BATTLE_MAPS.length)];
    
    const newLock: LockedMap = {
      targetUsername,
      map: newMap,
      lockedUntil: now + 10 * 60 * 1000,
    };
    
    setPlayer((prev) => {
      if (!prev) return prev;
      addActivity('map_reroll', `Rerolled battle map for ${targetUsername} (${cost} MCP)`);
      return {
        ...prev,
        tokens: prev.tokens - cost,
        lockedMaps: [...validLocks, newLock],
      };
    });
    
    return { map: newMap, cost };
  }, [player, addActivity]);

  const calculateTravelCost = useCallback((targetCoords: PlayerCoordinates) => {
    if (!player) return { time: 0, cost: 0, distance: 0 };
    const dx = targetCoords.x - player.coordinates.x;
    const dy = targetCoords.y - player.coordinates.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const time = Math.floor(5 + distance / 10);
    const cost = Math.floor(distance * 0.2);
    return { time, cost, distance: Math.floor(distance) };
  }, [player]);

  const collectReturningTroops = useCallback((returningId: string) => {
    setPlayer((prev) => {
      if (!prev) return prev;
      const returning = prev.returningTroops.find((r) => r.id === returningId);
      if (!returning || returning.returnsAt > Date.now()) return prev;
      
      const updatedTroops = { ...prev.troops };
      (Object.keys(returning.troops) as Array<keyof TroopData>).forEach((troopType) => {
        updatedTroops[troopType] += returning.troops[troopType] || 0;
      });
      
      addActivity('collected_returning', `Collected returning troops from ${returning.origin}`);
      
      return {
        ...prev,
        troops: updatedTroops,
        returningTroops: prev.returningTroops.filter((r) => r.id !== returningId),
      };
    });
  }, [addActivity]);

  const simulateUpkeep = useCallback(() => {
    setPlayer((prev) => {
      if (!prev) return prev;
      
      const newUnpaidDays = prev.unpaidDays + 1;
      
      // Day 1: No desertion yet, just warning
      if (newUnpaidDays === 1) {
        addActivity('upkeep_simulation', `⚠️ DAY 1 UNPAID: No desertion yet. Pay tomorrow to avoid losing troops!`);
        return {
          ...prev,
          unpaidDays: newUnpaidDays,
          lastUpkeepPaid: prev.lastUpkeepPaid - (24 * 60 * 60 * 1000),
        };
      }
      
      // Check if all troops should desert (Day 6+)
      if (newUnpaidDays >= 6) {
        const totalTroops = Object.values(prev.troops).reduce((sum, count) => sum + count, 0);
        const emptyTroops: TroopData = {
          infantry: 0,
          lightVehicles: 0,
          heavyMechs: 0,
          artillery: 0,
          airFighters: 0,
          bombers: 0,
          drones: 0,
        };
        
        addActivity('upkeep_simulation', `⚠️ DAY ${newUnpaidDays}: Base ABANDONED! All ${totalTroops} troops deserted (100%)`);
        
        return {
          ...prev,
          troops: emptyTroops,
          unpaidDays: newUnpaidDays,
          lastUpkeepPaid: prev.lastUpkeepPaid - (24 * 60 * 60 * 1000),
        };
      }
      
      // Daily desertion rates starting from Day 2
      const desertionRates = [0.10, 0.15, 0.25, 0.45]; // Day 2, 3, 4, 5
      const rate = desertionRates[newUnpaidDays - 2];
      
      const updatedTroops = { ...prev.troops };
      const desertedByType: Record<string, number> = {};
      let totalDeserted = 0;
      
      (Object.keys(updatedTroops) as Array<keyof TroopData>).forEach((troopType) => {
        const deserted = Math.floor(updatedTroops[troopType] * rate);
        desertedByType[troopType] = deserted;
        totalDeserted += deserted;
        updatedTroops[troopType] = Math.max(0, updatedTroops[troopType] - deserted);
      });
      
      const desertionDetails = Object.entries(desertedByType)
        .filter(([_, count]) => count > 0)
        .map(([type, count]) => `${count} ${TROOP_CONFIG[type as keyof TroopData].name}`)
        .join(', ');
      
      addActivity(
        'upkeep_simulation', 
        `⚠️ DAY ${newUnpaidDays} UNPAID: ${(rate * 100).toFixed(0)}% deserted (${totalDeserted} total) - ${desertionDetails || 'None'}`
      );
      
      return {
        ...prev,
        troops: updatedTroops,
        unpaidDays: newUnpaidDays,
        lastUpkeepPaid: prev.lastUpkeepPaid - (24 * 60 * 60 * 1000),
      };
    });
  }, [addActivity]);

  const attackPlayer = useCallback((targetUsername: string, attackTroops: Partial<TroopData>, map: BattleMap, travelTime: number, scoutTier: ScoutTier | 'none') => {
    setPlayer((prev) => {
      if (!prev) return prev;
      
      // Check attack energy
      if (prev.attackEnergy === 0) {
        return prev; // Energy check should be done in AttackModal, but safety check here
      }
      let attackPower = 0;
      (Object.keys(attackTroops) as Array<keyof TroopData>).forEach((troopType) => {
        const count = attackTroops[troopType] || 0;
        let power = count * TROOP_CONFIG[troopType].power;
        if (map.boost && map.boost.troop === troopType) power *= (1 + map.boost.amount / 100);
        if (map.disabled === troopType) power = 0;
        attackPower += power;
      });
      const battleWon = attackPower > 0 && Math.random() < 0.7;
      let lossRate = battleWon ? 0.3 + Math.random() * 0.2 : 0.6 + Math.random() * 0.3;
      if (map.type === 'blessed' && map.specialEffect?.includes('Evasion')) lossRate *= 0.75;
      const updatedTroops = { ...prev.troops };
      const survivingTroops: Partial<TroopData> = {};
      
      (Object.keys(attackTroops) as Array<keyof TroopData>).forEach((troopType) => {
        const sent = attackTroops[troopType] || 0;
        const survived = Math.floor(sent * (1 - lossRate));
        updatedTroops[troopType] = updatedTroops[troopType] - sent;
        if (survived > 0) {
          survivingTroops[troopType] = survived;
        }
      });
      
      const returningEntry: ReturningTroops = {
        id: `returning-${Date.now()}-${Math.random()}`,
        troops: survivingTroops,
        returnsAt: Date.now() + travelTime * 60 * 1000,
        origin: targetUsername,
      };
      const target = MOCK_PLAYERS.find((p) => p.username === targetUsername);
      let stolenTokens = battleWon && target ? target.miningStash * (1 - lossRate) : 0;
      const stolenPercentage = battleWon && target ? ((stolenTokens / target.miningStash) * 100) : 0;
      if (battleWon && map.type === 'blessed' && map.specialEffect?.includes('Mining reward')) stolenTokens *= 1.20;
      
      // Create detailed attack message
      const troopsUsed = (Object.keys(attackTroops) as Array<keyof TroopData>)
        .filter(t => (attackTroops[t] || 0) > 0)
        .map(t => `${attackTroops[t]} ${TROOP_CONFIG[t].name}`)
        .join(', ');
      
      const scoutInfo = scoutTier === 'none' ? 'No scout' : `${scoutTier.charAt(0).toUpperCase() + scoutTier.slice(1)} scout`;
      
      const attackMessage = battleWon 
        ? `⚔️ VICTORY vs ${targetUsername} | Map: ${map.name} | Troops: ${troopsUsed} | Scout: ${scoutInfo} | Stolen: ${stolenPercentage.toFixed(1)}% (${stolenTokens.toFixed(2)} MCP)` 
        : `❌ DEFEAT vs ${targetUsername} | Map: ${map.name} | Troops: ${troopsUsed} | Scout: ${scoutInfo} | Lost battle`;
      
      addActivity(battleWon ? 'attack_won' : 'attack_lost', attackMessage);
      
      return {
        ...prev,
        troops: updatedTroops,
        returningTroops: [...prev.returningTroops, returningEntry],
        miningStash: Math.min(prev.miningStash + stolenTokens, 10 + prev.stakedTokens),
        attackEnergy: prev.attackEnergy - 1,
        notifications: [{
          id: `notif-${Date.now()}-${Math.random()}`,
          type: battleWon ? 'victory' : 'defeat',
          message: battleWon ? `Victory! +${stolenTokens.toFixed(2)} tokens to stash. Troops returning in ${travelTime} min.` : `Defeated on ${map.name}. Survivors returning in ${travelTime} min.`,
          isRead: false,
          timestamp: Date.now(),
        }, ...prev.notifications],
      };
    });
  }, [addActivity]);

  const markNotificationRead = useCallback((notificationId: string) => {
    setPlayer((prev) => {
      if (!prev) return prev;
      return { ...prev, notifications: prev.notifications.map((n) => n.id === notificationId ? { ...n, isRead: true } : n) };
    });
  }, []);

  const getRandomMap = useCallback((): BattleMap => {
    return BATTLE_MAPS[Math.floor(Math.random() * BATTLE_MAPS.length)];
  }, []);

  const simulateDefense = useCallback((): string => {
    if (!player) return 'No player data available';
    
    // Create a mock attacker
    const attackerUsername = `Raider_${Math.floor(Math.random() * 999)}`;
    const mockAttacker = {
      username: attackerUsername,
      attack: player.stats.defense + Math.floor(Math.random() * 3),
      troops: {
        infantry: 15 + Math.floor(Math.random() * 10),
        lightVehicles: 8 + Math.floor(Math.random() * 5),
        heavyMechs: 3 + Math.floor(Math.random() * 3),
        drones: 10 + Math.floor(Math.random() * 5),
      },
    };
    
    // Calculate defender power (your troops)
    let defenderPower = 0;
    (Object.keys(player.troops) as Array<keyof TroopData>).forEach((troopType) => {
      defenderPower += player.troops[troopType] * TROOP_CONFIG[troopType].power;
    });
    
    // Calculate attacker power
    let attackerPower = 0;
    (Object.keys(mockAttacker.troops) as Array<keyof typeof mockAttacker.troops>).forEach((key) => {
      attackerPower += mockAttacker.troops[key] * TROOP_CONFIG[key].power;
    });
    
    const defenseSuccessful = defenderPower > attackerPower || Math.random() < 0.4;
    const lossPercentage = defenseSuccessful ? (0.2 + Math.random() * 0.2) : (0.6 + Math.random() * 0.3);
    const tokensLost = player.miningStash * lossPercentage;
    
    // Actually update the player's stash
    setPlayer((prev) => {
      if (!prev) return prev;
      
      const attackerTroopsList = Object.entries(mockAttacker.troops)
        .map(([type, count]) => `${count} ${TROOP_CONFIG[type as keyof TroopData].name}`)
        .join(', ');
      
      const defenseMessage = defenseSuccessful
        ? `🛡️ DEFENDED vs ${attackerUsername} | Lost ${lossPercentage.toFixed(0)}% (${tokensLost.toFixed(2)} MCP) | Attacker used: ${attackerTroopsList}`
        : `💔 RAIDED by ${attackerUsername} | Lost ${lossPercentage.toFixed(0)}% (${tokensLost.toFixed(2)} MCP) | Attacker used: ${attackerTroopsList}`;
      
      addActivity(defenseSuccessful ? 'defense_success' : 'defense_failed', defenseMessage);
      
      return {
        ...prev,
        miningStash: Math.max(0, prev.miningStash - tokensLost),
      };
    });
    
    let message = `🎯 Defense Simulation Executed!\n\n`;
    message += `Attacker: ${attackerUsername}\n`;
    message += `Attacker Power: ${attackerPower.toFixed(0)}\n`;
    message += `Your Defense Power: ${defenderPower.toFixed(0)}\n`;
    message += `Attacker Troops: ${Object.entries(mockAttacker.troops).map(([t, c]) => `${c} ${TROOP_CONFIG[t as keyof TroopData].name}`).join(', ')}\n\n`;
    
    if (defenseSuccessful) {
      message += `✅ DEFENSE SUCCESSFUL!\n`;
      message += `Lost ${lossPercentage.toFixed(0)}% of your stash: ${tokensLost.toFixed(2)} MCP\n`;
      message += `Most of your troops survived.`;
    } else {
      message += `❌ DEFENSE FAILED!\n`;
      message += `Lost ${lossPercentage.toFixed(0)}% of your stash: ${tokensLost.toFixed(2)} MCP\n`;
      message += `Significant troop losses expected.\n\n`;
      message += `💡 Tip: Upgrade your Defense stat or train more troops!`;
    }
    
    message += `\n\nYour attackable stash has been updated in the game.`;
    
    return message;
  }, [player, addActivity, setPlayer]);

  // Developer functions
  const addDevTroops = useCallback((troopType: keyof TroopData, amount: number) => {
    setPlayer((prev) => {
      if (!prev) return prev;
      const updatedTroops = { ...prev.troops };
      updatedTroops[troopType] = updatedTroops[troopType] + amount;
      addActivity('dev', `🛠️ [DEV] Added ${amount} ${TROOP_CONFIG[troopType].name}`);
      return { ...prev, troops: updatedTroops };
    });
  }, [addActivity]);

  const addDevTokens = useCallback((amount: number) => {
    setPlayer((prev) => {
      if (!prev) return prev;
      addActivity('dev', `🛠️ [DEV] Added ${amount} MCP tokens`);
      return { ...prev, tokens: prev.tokens + amount };
    });
  }, [addActivity]);

  const stakeTokens = useCallback((amount: number): boolean => {
    if (!player || player.tokens < amount || amount < 1) return false;
    
    setPlayer((prev) => {
      if (!prev || prev.tokens < amount) return prev;
      addActivity('stake', `🔒 Staked ${amount} MCP tokens to increase stash size (+${amount} capacity)`);
      return {
        ...prev,
        tokens: prev.tokens - amount,
        stakedTokens: prev.stakedTokens + amount,
      };
    });
    
    return true;
  }, [player, addActivity]);

  const getActualStashSize = useCallback((): number => {
    if (!player) return 10;
    return 10 + player.stakedTokens; // Base 10 + 1:1 ratio
  }, [player]);

  const referPlayer = useCallback((referralCode: string) => {
    // Implementation for referring a player
  }, []);

  const value: GameContextType = {
    player,
    isAuthenticated,
    login,
    register,
    logout,
    resetGame,
    trainTroops,
    collectTroops,
    upgradeBuilding,
    upgradeStat,
    claimMiningStash,
    payDailyUpkeep,
    payYesterdayUpkeep,
    attackPlayer,
    scoutPlayer,
    simulateUpkeep,
    markNotificationRead,
    getMapForTarget,
    rerollMapForTarget,
    getRandomMap,
    calculateTravelCost,
    collectReturningTroops,
    simulateDefense,
    referPlayer,
    addDevTroops,
    addDevTokens,
    stakeTokens,
    getActualStashSize,
    mockPlayers: MOCK_PLAYERS,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
