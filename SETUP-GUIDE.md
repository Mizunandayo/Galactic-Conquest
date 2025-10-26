# 🚀 Galactic Conquest - Complete Setup Guide

## 📋 Overview

Your Galactic Conquest game has been set up with the proper folder structure. This guide will help you complete the setup and get the game running.

## 📁 Current Structure

```
galactic-conquest/
├── public/
│   └── .well-known/
│       └── farcaster.json ✓
├── src/
│   ├── app/
│   │   ├── layout.tsx ✓
│   │   ├── page.tsx ✓
│   │   └── globals.css ✓
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx ✓
│   │   │   └── RegisterForm.tsx ✓
│   │   ├── game/ (needs files copied)
│   │   ├── ui/ (will be generated)
│   │   └── FarcasterWrapper.tsx ✓
│   ├── contexts/
│   │   └── GameContext.tsx ✓ (ALL GAME LOGIC IS HERE!)
│   ├── hooks/
│   ├── lib/
│   │   └── utils.ts ✓
│   └── spacetime_module_bindings/
├── spacetime-server/
│   └── src/
│       └── lib.rs
├── package.json ✓
├── tsconfig.json ✓
├── tailwind.config.ts ✓
├── next.config.ts ✓
├── postcss.config.mjs ✓
├── components.json ✓
├── .gitignore ✓
├── .eslintrc.json ✓
└── README.md ✓
```

## 🎯 Step-by-Step Setup

### Step 1: Install Dependencies

```powershell
cd galactic-conquest
npm install
```

This will install all required packages including:
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Farcaster SDK
- And all other dependencies

### Step 2: Copy Remaining Game Components

You need to copy the following files from the `codes` folder to `galactic-conquest/src/components/game/`:

**Required Game Components:**
1. `GameDashboard.tsx` → `src/components/game/GameDashboard.tsx`
2. `ActivityLog-1.tsx` → `src/components/game/ActivityLog.tsx`
3. `AttackModal.tsx` → `src/components/game/AttackModal.tsx`
4. `BaseBuilding.tsx` → `src/components/game/BaseBuilding.tsx`  
5. `AttackablePlayers.tsx` → `src/components/game/AttackablePlayers.tsx`
6. `DailyUpkeepDisplay.tsx` → `src/components/game/DailyUpkeepDisplay.tsx`
7. `ReferralHistory.tsx` → `src/components/game/ReferralPage.tsx`
8. `InfoGuide.tsx` → `src/components/game/InfoGuide.tsx`
9. `BattleDisplay.tsx` → `src/components/game/BattleDisplay.tsx`

**Additional Components Needed:**
- `TopNavBar.tsx`
- `StatsOverview.tsx`
- `TroopTraining.tsx`
- `TroopStats.tsx`
- `BuildingUpgrades.tsx`
- `MapSelection.tsx`
- `UserList.tsx`

**PowerShell Command to Copy Files:**
```powershell
# Copy game components
$codes = "c:\Users\trist\Desktop\Programming\galacticconquest\codes"
$game = "c:\Users\trist\Desktop\Programming\galacticconquest\galactic-conquest\src\components\game"

Copy-Item "$codes\GameDashboard.tsx" "$game\GameDashboard.tsx" -Force
Copy-Item "$codes\ActivityLog-1.tsx" "$game\ActivityLog.tsx" -Force
Copy-Item "$codes\AttackModal.tsx" "$game\AttackModal.tsx" -Force
Copy-Item "$codes\BaseBuilding.tsx" "$game\BaseBuilding.tsx" -Force
Copy-Item "$codes\AttackablePlayers.tsx" "$game\AttackablePlayers.tsx" -Force
Copy-Item "$codes\DailyUpkeepDisplay.tsx" "$game\DailyUpkeepDisplay.tsx" -Force
Copy-Item "$codes\ReferralHistory.tsx" "$game\ReferralPage.tsx" -Force
Copy-Item "$codes\InfoGuide.tsx" "$game\InfoGuide.tsx" -Force
Copy-Item "$codes\BattleDisplay.tsx" "$game\BattleDisplay.tsx" -Force
```

### Step 3: Install shadcn/ui Components

The UI components need to be generated using shadcn CLI:

```powershell
# Install all UI components at once
npx shadcn@latest add button card input label tabs badge alert dialog select separator scroll-area
```

Or install them one by one as needed:
```powershell
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add label
# ... and so on
```

### Step 4: Run the Development Server

```powershell
npm run dev
```

The game should now be running at `http://localhost:3000`

## 🎮 Game Features

### Core Systems (All in GameContext.tsx)
- **Authentication**: Register/Login with username
- **Resource Management**: Mining tokens, stash management
- **Troop Training**: 7 different unit types
- **Building Upgrades**: 6 different structures
- **Commander Stats**: Engineer, Attack, Defense, Stash Size
- **PvP Combat**: Attack other players
- **Battle Maps**: 15 different maps with unique modifiers
- **Scouting**: 3 tiers of reconnaissance
- **Energy Systems**: Claim energy (5 max) and Attack energy (8 max)
- **Daily Upkeep**: Pay to maintain troops or face desertion
- **Referral System**: Invite friends for bonuses
- **Staking**: Stake tokens to increase stash capacity

### Troop Types
1. **Infantry** - Basic ground units
2. **Light Vehicles** - Fast attack vehicles
3. **Heavy Mechs** - Powerful armored units
4. **Artillery** - Long-range bombardment
5. **Air Fighters** - Air superiority
6. **Bombers** - Heavy air strikes
7. **Drones** - Automated combat units

### Building Types
1. **Barracks** - Infantry capacity
2. **Drone Core** - Drone capacity
3. **Mech Bay** - Heavy Mech capacity
4. **Vehicle Depot** - Light Vehicle capacity
5. **Artillery Station** - Artillery capacity
6. **Hangar** - Air unit capacity

## 🔧 Troubleshooting

### If Components Are Missing:
1. Check that all files from the `codes` folder are copied to the correct locations
2. Ensure file names match exactly (case-sensitive)
3. Remove the `-1` suffix from filenames when copying

### If UI Components Don't Work:
```powershell
npx shadcn@latest init
```
Then add components individually.

### If TypeScript Errors Persist:
```powershell
npm run build
```
This will show any actual errors that need fixing.

### Clear Cache and Reinstall:
```powershell
Remove-Item -Recurse -Force node_modules, .next
npm install
npm run dev
```

## 📝 Important Files

### GameContext.tsx (src/contexts/GameContext.tsx)
**THIS IS THE HEART OF THE GAME!**
- Contains all state management
- All game logic and functions
- Combat calculations
- Resource management
- Training queues
- Notification system
- LocalStorage persistence

### Configuration Files
- `package.json` - All dependencies
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.ts` - Tailwind CSS styling
- `next.config.ts` - Next.js configuration
- `components.json` - shadcn/ui configuration

## 🚀 Next Steps

1. **Complete file copying** from codes folder
2. **Install dependencies** with `npm install`
3. **Add UI components** with shadcn CLI
4. **Run dev server** with `npm run dev`
5. **Test the game** at http://localhost:3000

## 💡 Tips

- The game uses localStorage, so all data persists in your browser
- Use the "Demo Game" button for quick testing
- Check the Activity Log to see all game events
- The InfoGuide in-game explains all mechanics
- Use Developer tools (console) to debug issues

## 📦 Production Build

When ready to deploy:
```powershell
npm run build
npm run start
```

## 🆘 Need Help?

1. Check all files are in the correct locations
2. Ensure all dependencies are installed
3. Look for TypeScript errors in VS Code
4. Check the browser console for runtime errors
5. Verify all imports are correct

## 🎉 Success Indicators

✓ No TypeScript errors
✓ Development server running
✓ Can see login/register screen
✓ Can create account and login
✓ Game dashboard loads
✓ Mining stash increases over time
✓ Can train troops
✓ Can attack other players

---

**Your game structure is ready! Follow the steps above to complete the setup.**
