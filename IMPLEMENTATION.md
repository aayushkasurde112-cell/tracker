# Study Timer - Implementation Guide

## 🏗️ Architecture

### Component Hierarchy
```
App (Root)
├── Navigation & State Management
├── TimerScreen
│   ├── Session Timer Display
│   ├── Start/Stop Button
│   ├── Daily Total Display
│   └── Session History List
└── WeeklyStatsScreen
    ├── Week Summary Cards
    ├── Bar Chart Visualization
    └── Daily Breakdown List
```

### Data Flow
```
TimerScreen
  ↓
storageManager.saveSession()
  ↓
AsyncStorage.setItem()
  ↓
Retrieved by WeeklyStatsScreen
  ↓
storageManager.getWeeklyStats()
```

---

## 📋 Core Features Implementation

### 1. Timer Functionality (`TimerScreen.tsx`)

**How it works:**
```typescript
// Start timer - setInterval runs every 1000ms
setInterval(() => {
  setElapsedSeconds((prev) => prev + 1);
}, 1000);

// Stop timer - save session
await storageManager.saveSession(elapsedSeconds, newTotal);
```

**Key variables:**
- `elapsedSeconds` - Current session duration in seconds
- `isRunning` - Timer active state
- `dailyTotal` - Accumulated study time for today
- `sessionHistory` - Array of all sessions today

**Session save flow:**
1. User presses "Stop"
2. Get session duration (`elapsedSeconds`)
3. Calculate new daily total
4. Persist both to AsyncStorage
5. Reset timer for next session

---

### 2. Daily Total Tracking

**Automatic aggregation:**
- On app launch: Load today's total from storage
- After session ends: Add session duration to total
- Daily reset: New date = new total (automatic via date keys)

**Date-based storage key:**
```typescript
// Format: YYYY-MM-DD
const dateKey = `2024-01-15`;  // e.g., today
const total = dailyData.get(dateKey);  // Get today's total
```

**Persistence:**
- Each day gets its own key in AsyncStorage
- Data survives app restarts indefinitely
- Weekly view retrieves last 7 days

---

### 3. Weekly Comparison (`WeeklyStatsScreen.tsx`)

**Bar chart implementation:**
```typescript
// Get height based on daily total
const getBarHeight = (seconds: number): number => {
  const maxHeight = 160; // pixels
  return (seconds / maxDaily) * maxHeight;  // Scale to max
};

// Render bars
{weekData.map((day) => (
  <View style={{
    height: getBarHeight(day.total),
    backgroundColor: day.isToday ? accent : light
  }} />
))}
```

**Visual features:**
- Maximum bar height adjusts to highest daily value
- Today highlighted with primary accent color
- Day names abbreviated (Sun, Mon, Tue...)
- Daily totals shown below bars

---

### 4. Persistent Storage (`storageManager.ts`)

**Storage structure:**
```
AsyncStorage
├── study_timer_daily_data
│   └── Map<dateKey, totalSeconds>
│       {
│         "2024-01-15": 14400,   // 4 hours
│         "2024-01-16": 18000    // 5 hours
│       }
└── study_timer_session_history
    └── Array<{date, duration}>
        [
          {date: "2024-01-15", duration: 3600},
          {date: "2024-01-15", duration: 10800}
        ]
```

**Key methods:**

| Method | Purpose |
|--------|---------|
| `initialize()` | Load data from AsyncStorage on app start |
| `getDailyTotal(date?)` | Get total seconds for a specific day |
| `saveSession()` | Save session and update daily total |
| `getSessionHistory(date?)` | Get all sessions for a day |
| `getWeeklyStats()` | Get last 7 days of data |

---

## 🎨 Styling & Theme

### Color System
All colors defined in `App.tsx`:
```typescript
const COLORS = {
  background: '#0a0a0a',    // App background
  surface: '#1a1a1a',       // Cards & panels
  surfaceHigh: '#2a2a2a',   // Elevated surfaces
  text: '#ffffff',          // Primary text
  textSecondary: '#b0b0b0', // Secondary text
  accent: '#4f46e5',        // Primary action (indigo)
  success: '#10b981',       // Success state (green)
  danger: '#ef4444',        // Danger state (red)
};
```

### Typography

| Element | Size | Weight | Letter Spacing |
|---------|------|--------|-----------------|
| Screen Title | 32px | 800 | -0.5px |
| Card Label | 12-13px | 600 | 0.5px |
| Timer Display | 56px | 700 | -1px |
| Daily Value | 24px | 700 | -0.5px |
| Body Text | 14-15px | 500-600 | 0-0.3px |

### Dark Mode
- No light mode (intentional minimalism)
- All text rendered as white/light gray on dark backgrounds
- Consistent throughout both screens
- Accessible contrast ratios (WCAG AA+)

---

## 🔄 State Management

### React State Hooks
```typescript
// Timer screen state
const [elapsedSeconds, setElapsedSeconds] = useState(0);
const [isRunning, setIsRunning] = useState(false);
const [dailyTotal, setDailyTotal] = useState(0);
const [sessionHistory, setSessionHistory] = useState<number[]>([]);

// Weekly screen state
const [weekData, setWeekData] = useState<DayStats[]>([]);
const [weekTotal, setWeekTotal] = useState(0);
```

### App-level Navigation
```typescript
const [activeTab, setActiveTab] = useState<'timer' | 'weekly'>('timer');
```

**Tab switching:**
- Bottom nav buttons trigger tab state change
- Active tab renders corresponding screen
- State preserved when switching back

---

## 💾 AsyncStorage Operations

### Write Operations
```typescript
// Save single key-value
await AsyncStorage.setItem('key', JSON.stringify(value));

// Save multiple keys
await AsyncStorage.multiSet([
  ['key1', value1],
  ['key2', value2]
]);
```

### Read Operations
```typescript
// Get single value
const data = await AsyncStorage.getItem('key');
const parsed = JSON.parse(data);

// Get multiple keys
const values = await AsyncStorage.multiGet(['key1', 'key2']);
```

### Error Handling
All AsyncStorage calls wrapped in try-catch:
```typescript
try {
  await storageManager.saveSession(...);
} catch (error) {
  console.error('Storage error:', error);
  // App continues - graceful degradation
}
```

---

## 📱 Screen Layout

### Timer Screen
```
┌─────────────────────────────┐
│ Study Timer                 │ ← Header
│ Focus on what matters       │
├─────────────────────────────┤
│      Current Session        │ ← Session card
│      00:15:32               │
├─────────────────────────────┤
│ Today's Total       2h 15m  │ ← Daily total
├─────────────────────────────┤
│    [ Stop Session ]         │ ← Action button
├─────────────────────────────┤
│ Today's Sessions            │ ← History header
│ Session 1       00:45:00    │
│ Session 2       01:30:32    │ ← History items
└─────────────────────────────┘
```

### Weekly Screen
```
┌─────────────────────────────┐
│ Weekly Overview             │ ← Header
│ Last 7 days                 │
├─────────────────────────────┤
│ Total Study Time: 28h       │ ← Summary cards
│ Daily Average:    4h        │
├─────────────────────────────┤
│ Daily Breakdown             │ ← Chart
│   ▄▄▄     ▄▄▄▄▄   ▄▄▄▄▄    │
│   Sun Mon  Tue Wed Thu Fri  │
├─────────────────────────────┤
│ Day by Day                  │ ← Details
│ Monday (Jan 15)        3h   │
│ Tuesday (Jan 16)       5h   │ ← Day items
└─────────────────────────────┘
```

---

## 🔧 Time Formatting

### Utility Function
```typescript
function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  return `${String(hours).padStart(2, '0')}:`
       + `${String(minutes).padStart(2, '0')}:`
       + `${String(secs).padStart(2, '0')}`;
}

// Example: 3661 seconds → "01:01:01"
```

### Date Formatting
```typescript
function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Example: new Date(2024, 0, 15) → "2024-01-15"
```

---

## 🚀 Performance Optimizations

### Render Optimization
- Tab screens only render when active
- ScrollView prevents layout shifts
- FlatList could replace maps for large lists

### Storage Optimization
- Session history limited to 30 days
- Data stored efficiently in JSON format
- Only relevant data loaded at app start

### Memory Management
```typescript
// Cleanup interval on unmount
useEffect(() => {
  return () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };
}, [isRunning]);
```

---

## 📦 Dependency Overview

| Package | Version | Purpose |
|---------|---------|---------|
| `expo` | ~51.0.0 | React Native framework |
| `react-native` | 0.74.1 | Core native library |
| `@react-native-async-storage/async-storage` | ^1.21.0 | Local storage |
| `typescript` | ~5.3.3 | Type safety |
| `react` | 18.2.0 | React library |

---

## 🔐 Security Considerations

### Data Security
- Data stored locally on device (no server transmission)
- No authentication required (single-user app)
- Data can be exported for backup
- User can clear data anytime

### Input Validation
- Timer seconds are always positive integers
- Date validation via Date objects
- No user text input (no injection risk)

---

## 🐛 Debugging

### Console Logging
```typescript
console.log('Session saved:', elapsedSeconds);
console.error('Storage error:', error);
```

### Check Stored Data
```typescript
// Access via React Native debugger or:
const data = await AsyncStorage.getItem('key');
console.log(JSON.parse(data));
```

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Data not persisting | Check AsyncStorage is initialized |
| Timer stops abruptly | Verify interval cleanup code |
| Weekly chart wrong | Check date formatting consistency |
| App crashes on load | Add error boundaries in try-catch |

---

## 📈 Extending the App

### Add Goal Tracking
```typescript
// In storageManager.ts
async saveGoal(hoursPerDay: number) {
  await AsyncStorage.setItem('goal', hoursPerDay.toString());
}
```

### Add Notifications
```typescript
// In TimerScreen.tsx
import * as Notifications from 'expo-notifications';

Notifications.scheduleNotificationAsync({
  content: { title: 'Study session complete!' },
  trigger: { seconds: 1 }
});
```

### Add Cloud Sync
```typescript
// Sync to Firebase or custom backend
async syncToCloud(data) {
  await fetch('https://api.example.com/sync', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}
```

---

## 📚 Key Files Reference

| File | Responsibility |
|------|-----------------|
| `App.tsx` | Navigation, theming, app initialization |
| `TimerScreen.tsx` | Timer UI, session logic, daily tracking |
| `WeeklyStatsScreen.tsx` | Chart rendering, weekly data display |
| `storageManager.ts` | All AsyncStorage operations |
| `app.json` | Expo configuration & metadata |
| `package.json` | Dependencies & build scripts |

---

## ✅ Testing Checklist

- [ ] Timer starts and stops correctly
- [ ] Session time is accurate
- [ ] Daily total updates after session
- [ ] Data persists after app restart
- [ ] Weekly chart displays correct bars
- [ ] Today is highlighted in chart
- [ ] Day names display correctly
- [ ] Time formatting is consistent
- [ ] UI renders without errors
- [ ] No console errors

---

## 📖 Further Reading

- [Expo Documentation](https://docs.expo.dev)
- [React Native Basics](https://reactnative.dev/docs/getting-started)
- [AsyncStorage Docs](https://react-native-async-storage.github.io/async-storage/)
- [React Hooks Guide](https://react.dev/reference/react/hooks)

---

**Last Updated:** March 16, 2024  
**Version:** 1.0.0
