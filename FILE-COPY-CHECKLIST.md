# 📋 File Copy Checklist

## ✅ Already Created Files

These files have been automatically created in the correct locations:

- ✓ `package.json`
- ✓ `tsconfig.json`
- ✓ `tailwind.config.ts`
- ✓ `next.config.ts`
- ✓ `postcss.config.mjs`
- ✓ `components.json`
- ✓ `.gitignore`
- ✓ `.eslintrc.json`
- ✓ `next-env.d.ts`
- ✓ `README.md`
- ✓ `SETUP-GUIDE.md`
- ✓ `public/.well-known/farcaster.json`
- ✓ `src/app/layout.tsx`
- ✓ `src/app/page.tsx`
- ✓ `src/app/globals.css`
- ✓ `src/contexts/GameContext.tsx` **(MOST IMPORTANT - ALL GAME LOGIC)**
- ✓ `src/components/FarcasterWrapper.tsx`
- ✓ `src/components/auth/LoginForm.tsx`
- ✓ `src/components/auth/RegisterForm.tsx`
- ✓ `src/lib/utils.ts`

## 📝 Files to Copy from `codes` Folder

### From `codes/` → `src/components/game/`

| Source File (in codes/) | Destination (in galactic-conquest/) | Status |
|------------------------|-------------------------------------|--------|
| `GameDashboard.tsx` | `src/components/game/GameDashboard.tsx` | ⏳ TODO |
| `ActivityLog-1.tsx` | `src/components/game/ActivityLog.tsx` | ⏳ TODO |
| `AttackModal.tsx` | `src/components/game/AttackModal.tsx` | ⏳ TODO |
| `BaseBuilding.tsx` | `src/components/game/BaseBuilding.tsx` | ⏳ TODO |
| `AttackablePlayers.tsx` | `src/components/game/AttackablePlayers.tsx` | ⏳ TODO |
| `DailyUpkeepDisplay.tsx` | `src/components/game/DailyUpkeepDisplay.tsx` | ⏳ TODO |
| `ReferralHistory.tsx` | `src/components/game/ReferralPage.tsx` | ⏳ TODO |
| `InfoGuide.tsx` | `src/components/game/InfoGuide.tsx` | ⏳ TODO |
| `BattleDisplay.tsx` | `src/components/game/BattleDisplay.tsx` | ⏳ TODO |

**Note:** Some components (TopNavBar, StatsOverview, TroopTraining, etc.) may be embedded within these files or need to be created.

## 🤖 Quick Copy Commands

### PowerShell (Windows)

```powershell
# Set paths
$codes = "c:\Users\trist\Desktop\Programming\galacticconquest\codes"
$gc = "c:\Users\trist\Desktop\Programming\galacticconquest\galactic-conquest"

# Copy all game components
Copy-Item "$codes\GameDashboard.tsx" "$gc\src\components\game\GameDashboard.tsx" -Force
Copy-Item "$codes\ActivityLog-1.tsx" "$gc\src\components\game\ActivityLog.tsx" -Force
Copy-Item "$codes\AttackModal.tsx" "$gc\src\components\game\AttackModal.tsx" -Force
Copy-Item "$codes\BaseBuilding.tsx" "$gc\src\components\game\BaseBuilding.tsx" -Force
Copy-Item "$codes\AttackablePlayers.tsx" "$gc\src\components\game\AttackablePlayers.tsx" -Force
Copy-Item "$codes\DailyUpkeepDisplay.tsx" "$gc\src\components\game\DailyUpkeepDisplay.tsx" -Force
Copy-Item "$codes\ReferralHistory.tsx" "$gc\src\components\game\ReferralPage.tsx" -Force
Copy-Item "$codes\InfoGuide.tsx" "$gc\src\components\game\InfoGuide.tsx" -Force
Copy-Item "$codes\BattleDisplay.tsx" "$gc\src\components\game\BattleDisplay.tsx" -Force

Write-Host "✅ All game components copied!" -ForegroundColor Green
```

### Bash/Linux/Mac

```bash
# Set paths
codes="c:/Users/trist/Desktop/Programming/galacticconquest/codes"
gc="c:/Users/trist/Desktop/Programming/galacticconquest/galactic-conquest"

# Copy all game components
cp "$codes/GameDashboard.tsx" "$gc/src/components/game/GameDashboard.tsx"
cp "$codes/ActivityLog-1.tsx" "$gc/src/components/game/ActivityLog.tsx"
cp "$codes/AttackModal.tsx" "$gc/src/components/game/AttackModal.tsx"
cp "$codes/BaseBuilding.tsx" "$gc/src/components/game/BaseBuilding.tsx"
cp "$codes/AttackablePlayers.tsx" "$gc/src/components/game/AttackablePlayers.tsx"
cp "$codes/DailyUpkeepDisplay.tsx" "$gc/src/components/game/DailyUpkeepDisplay.tsx"
cp "$codes/ReferralHistory.tsx" "$gc/src/components/game/ReferralPage.tsx"
cp "$codes/InfoGuide.tsx" "$gc/src/components/game/InfoGuide.tsx"
cp "$codes/BattleDisplay.tsx" "$gc/src/components/game/BattleDisplay.tsx"

echo "✅ All game components copied!"
```

## 📦 After Copying Files

1. **Install dependencies:**
   ```powershell
   cd galactic-conquest
   npm install
   ```

2. **Install shadcn/ui components:**
   ```powershell
   npx shadcn@latest add button card input label tabs badge alert dialog select separator scroll-area toast
   ```

3. **Run the dev server:**
   ```powershell
   npm run dev
   ```

4. **Open browser:**
   Navigate to `http://localhost:3000`

## 🔍 Verification

After copying all files, your `src/components/game/` folder should contain:

- ✓ GameDashboard.tsx
- ✓ ActivityLog.tsx
- ✓ AttackModal.tsx
- ✓ BaseBuilding.tsx
- ✓ AttackablePlayers.tsx
- ✓ DailyUpkeepDisplay.tsx
- ✓ ReferralPage.tsx
- ✓ InfoGuide.tsx
- ✓ BattleDisplay.tsx

## 🎯 Missing Components?

If some components are referenced but don't exist in your `codes` folder, you may need to extract them from within existing files or create them. Look for:

- **TopNavBar** - Usually extracted from GameDashboard
- **StatsOverview** - May be embedded in GameDashboard
- **TroopTraining** - Check if it's part of another component
- **TroopStats** - Might be embedded
- **BuildingUpgrades** - Could be part of BaseBuilding
- **MapSelection** - May be within AttackModal
- **UserList** - Could be part of AttackablePlayers

## 💡 Pro Tip

If you encounter import errors for missing components after copying, check the GameDashboard.tsx imports. You may need to either:

1. Create placeholder components
2. Comment out imports temporarily
3. Extract embedded components into separate files

The game logic is already complete in `GameContext.tsx`, so once all UI components are in place, everything should work!
