# Study Timer - Project Structure Reference

## 📁 Complete Directory Tree

```
study-timer/
│
├── 📄 App.tsx                          # Main app component (Root)
├── 📄 app.json                         # Expo configuration
├── 📄 babel.config.js                  # Babel transpiler setup
├── 📄 eas.json                         # EAS Build configuration
├── 📄 tsconfig.json                    # TypeScript configuration
├── 📄 package.json                     # Dependencies & scripts
├── 📄 package-lock.json                # Locked dependency versions
├── 📄 README.md                        # Main documentation
├── 📄 QUICKSTART.md                    # Quick setup guide
├── 📄 IMPLEMENTATION.md                # Architecture & implementation details
├── 📄 ADVANCED_USAGE.md                # Advanced features & customization
├── 📄 BUILD_DEPLOYMENT.md              # Build & release guide
│
├── 📁 src/
│   ├── 📁 screens/
│   │   ├── 📄 TimerScreen.tsx         # Timer UI component
│   │   └── 📄 WeeklyStatsScreen.tsx   # Weekly stats component
│   │
│   ├── 📁 utils/
│   │   └── 📄 storageManager.ts       # AsyncStorage management
│   │
│   ├── 📁 types/                      # (Future) TypeScript types
│   │   └── 📄 index.ts
│   │
│   ├── 📁 hooks/                      # (Future) Custom hooks
│   │   └── 📄 useTimer.ts
│   │
│   ├── 📁 styles/                     # (Future) Style utilities
│   │   └── 📄 theme.ts
│   │
│   └── 📁 components/                 # (Future) Reusable components
│       ├── 📄 TimeDisplay.tsx
│       ├── 📄 SessionCard.tsx
│       └── 📄 BarChart.tsx
│
├── 📁 assets/                         # (Future) App assets
│   ├── 📄 adaptive-icon.png
│   ├── 📄 favicon.png
│   └── 📁 fonts/
│
├── 📁 __tests__/                      # (Future) Test files
│   ├── 📄 storageManager.test.ts
│   ├── 📄 TimerScreen.test.tsx
│   └── 📄 WeeklyStatsScreen.test.tsx
│
├── 📁 .github/                        # (Future) GitHub workflows
│   └── 📁 workflows/
│       ├── 📄 build.yml
│       └── 📄 test.yml
│
├── 📁 .expo/                          # Expo cache (auto-generated)
├── 📁 node_modules/                   # Dependencies (auto-generated)
│
└── 📄 .gitignore                      # Git ignore rules
```

---

## 📄 File Descriptions

### Root Configuration Files

| File | Purpose |
|------|---------|
| `App.tsx` | Entry point, main component, navigation, theming |
| `app.json` | Expo app metadata, build config, plugins |
| `package.json` | Dependencies, scripts, version info |
| `tsconfig.json` | TypeScript compiler options |
| `babel.config.js` | Babel preset for React Native |
| `eas.json` | EAS cloud build configuration |

### Documentation Files

| File | Content |
|------|---------|
| `README.md` | Main docs, features, setup instructions |
| `QUICKSTART.md` | 5-minute setup guide |
| `IMPLEMENTATION.md` | Architecture, code examples, design patterns |
| `ADVANCED_USAGE.md` | Feature extensions, customization |
| `BUILD_DEPLOYMENT.md` | APK/IPA building, store submission |

### Source Code (`src/`)

| Directory | Contains |
|-----------|----------|
| `screens/` | Main UI screens (Timer, Weekly) |
| `utils/` | Helper functions (StorageManager) |
| `types/` | TypeScript type definitions (future) |
| `hooks/` | Custom React hooks (future) |
| `components/` | Reusable UI components (future) |
| `styles/` | Theme and styling utilities (future) |

### Testing & CI (`__tests__/` & `.github/`)

| Directory | Contains |
|-----------|----------|
| `__tests__/` | Jest unit & integration tests |
| `.github/workflows/` | GitHub Actions CI/CD pipelines |

---

## 🔄 Data Flow Architecture

```
User Action
    ↓
Component Handler
    ↓
storageManager Method
    ↓
AsyncStorage Operation
    ↓
State Update
    ↓
Re-render Component
    ↓
Visual Feedback
```

### Example: Save Session Flow

```typescript
// 1. User taps "Stop Session"
handleStartStop()
    ↓
// 2. Get current session duration
const sessionSeconds = elapsedSeconds
    ↓
// 3. Calculate new daily total
const newTotal = dailyTotal + sessionSeconds
    ↓
// 4. Call storage manager
storageManager.saveSession(sessionSeconds, newTotal)
    ↓
// 5. AsyncStorage.setItem() called
await AsyncStorage.setItem('daily_data', JSON.stringify(data))
    ↓
// 6. Update component state
setDailyTotal(newTotal)
setSessionHistory([...sessionHistory, sessionSeconds])
    ↓
// 7. UI re-renders with new values
<Text>{formatTime(dailyTotal)}</Text>  // Now shows updated value
```

---

## 📦 Dependencies Overview

### Core Dependencies

```json
{
  "expo": "~51.0.0",           // React Native framework
  "react": "18.2.0",           // React library
  "react-native": "0.74.1",    // Native components
  "@react-native-async-storage/async-storage": "^1.21.0"  // Local storage
}
```

### Dev Dependencies

```json
{
  "typescript": "~5.3.3",      // Type checking
  "@types/react": "~18.2.45",  // React types
  "@types/react-native": "~0.73.0",  // RN types
  "@babel/core": "^7.20.0"     // Transpiler
}
```

---

## 🚀 Build Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `start` | `expo start` | Start dev server |
| `android` | `expo start --android` | Run on Android emulator |
| `ios` | `expo start --ios` | Run on iOS simulator |
| `web` | `expo start --web` | Run in web browser |
| `build:android` | `eas build --platform android` | Build Android APK |
| `build:ios` | `eas build --platform ios` | Build iOS IPA |
| `build` | `eas build` | Build both platforms |

---

## 🏗️ Expanded Structure (Future)

As the app grows, consider this structure:

```
study-timer/
├── src/
│   ├── screens/
│   │   ├── TimerScreen/
│   │   │   ├── index.tsx
│   │   │   ├── styles.ts
│   │   │   └── useTimer.ts
│   │   │
│   │   └── WeeklyStatsScreen/
│   │       ├── index.tsx
│   │       ├── styles.ts
│   │       └── useWeeklyStats.ts
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Text.tsx
│   │   │
│   │   ├── timer/
│   │   │   ├── TimerDisplay.tsx
│   │   │   ├── SessionCard.tsx
│   │   │   └── SessionList.tsx
│   │   │
│   │   └── charts/
│   │       ├── BarChart.tsx
│   │       └── Legend.tsx
│   │
│   ├── hooks/
│   │   ├── useTimer.ts
│   │   ├── useStorage.ts
│   │   ├── useWeeklyStats.ts
│   │   └── useTheme.ts
│   │
│   ├── utils/
│   │   ├── storageManager.ts
│   │   ├── formatters.ts
│   │   ├── constants.ts
│   │   └── helpers.ts
│   │
│   ├── types/
│   │   ├── index.ts
│   │   ├── storage.ts
│   │   └── ui.ts
│   │
│   └── styles/
│       ├── theme.ts
│       ├── colors.ts
│       └── spacing.ts
│
├── __tests__/
│   ├── unit/
│   │   ├── storageManager.test.ts
│   │   ├── formatters.test.ts
│   │   └── helpers.test.ts
│   │
│   ├── integration/
│   │   ├── TimerFlow.test.tsx
│   │   └── StorageFlow.test.tsx
│   │
│   └── e2e/
│       └── AppFlow.test.ts
│
├── scripts/
│   ├── prebuild.js
│   ├── postbuild.js
│   └── generateTypes.ts
│
├── docs/
│   ├── ARCHITECTURE.md
│   ├── COMPONENTS.md
│   ├── API.md
│   └── CONTRIBUTING.md
│
└── .github/
    ├── workflows/
    │   ├── ci.yml
    │   ├── build.yml
    │   └── release.yml
    │
    └── ISSUE_TEMPLATE/
        ├── bug_report.md
        └── feature_request.md
```

---

## 📝 File Naming Conventions

### Components
- Files: PascalCase (e.g., `TimerScreen.tsx`)
- Exports: Named or default export matching filename
- Styles: Inline with component or separate `.styles.ts`

### Utilities
- Files: camelCase (e.g., `storageManager.ts`)
- Functions: camelCase (e.g., `formatTime()`)
- Classes: PascalCase (e.g., `StorageManager`)

### Types
- Files: Describe content (e.g., `index.ts`, `storage.ts`)
- Interfaces: PascalCase with `I` prefix optional (e.g., `ISession` or `Session`)
- Types: PascalCase (e.g., `TimerState`)

### Tests
- Files: `[component].test.ts[x]` (e.g., `TimerScreen.test.tsx`)
- Test suites: `describe('ComponentName', ...)`
- Tests: `test('should...', ...)`

---

## 🔐 Security Considerations

### Sensitive Files (in `.gitignore`)
```
node_modules/
.env
.env.local
*.keystore
study_timer.keystore
.DS_Store
.idea/
.vscode/
```

### Secrets Management
```bash
# Never commit:
- API keys
- Signing keystores
- Firebase config
- Credentials

# Store in:
- Environment variables
- .env (local only)
- Expo Secrets
```

---

## 📊 Metrics & Monitoring

### Bundle Size Targets
- Initial download: < 50 MB
- JS bundle: < 1 MB
- Native code: < 30 MB

### Performance Targets
- TTI (Time to Interactive): < 2 seconds
- FCP (First Contentful Paint): < 1 second
- Memory: < 50 MB average

---

## 🔄 Development Workflow

### Daily Development
```bash
npm start              # Start dev server
npm run android        # Run on emulator
# Make changes → Hot reload automatically
```

### Pre-Commit
```bash
npx tsc --noEmit      # Type check
npm test              # Run tests
```

### Before Release
```bash
npm run build:android  # Build APK
npm run build:ios      # Build IPA
# Test builds on real devices
# Update version numbers
# Update changelog
```

---

## 🎯 Key Design Principles

1. **Single Responsibility** - Each file has one purpose
2. **DRY** - Don't Repeat Yourself, extract shared logic
3. **Separation of Concerns** - UI, logic, storage isolated
4. **Type Safety** - Strict TypeScript throughout
5. **Minimal Dependencies** - Only essential packages
6. **Scalability** - Structure supports growth
7. **Maintainability** - Clear, documented code
8. **Testability** - Functions easily testable

---

## 📚 Quick Reference

### Import Paths
```typescript
// Absolute imports (if configured)
import { TimerScreen } from '@/screens/TimerScreen';
import { storageManager } from '@/utils/storageManager';

// Relative imports
import { storageManager } from '../utils/storageManager';
```

### Common Tasks
```typescript
// Format time
formatTime(3661)  // "01:01:01"

// Get week stats
const stats = await storageManager.getWeeklyStats();

// Save session
await storageManager.saveSession(duration, total);

// Format date key
formatDateKey(new Date())  // "2024-01-15"
```

---

**Last Updated:** March 16, 2024  
**Version:** 1.0.0
