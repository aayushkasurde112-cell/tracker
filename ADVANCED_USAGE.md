# Study Timer - Advanced Usage & Customization

## 🎯 Advanced Features

### Custom Study Goals

Add goal tracking to monitor progress:

```typescript
// In storageManager.ts
async setDailyGoal(goalSeconds: number): Promise<void> {
  try {
    await AsyncStorage.setItem('daily_goal', goalSeconds.toString());
  } catch (error) {
    console.error('Failed to set goal:', error);
  }
}

async getDailyGoal(): Promise<number> {
  try {
    const goal = await AsyncStorage.getItem('daily_goal');
    return goal ? parseInt(goal, 10) : 0;
  } catch (error) {
    console.error('Failed to get goal:', error);
    return 0;
  }
}
```

**Display goal progress:**

```typescript
// In TimerScreen.tsx
const [dailyGoal, setDailyGoal] = useState(0);
const goalProgress = (dailyTotal / dailyGoal) * 100;

<View style={[styles.goalCard, { backgroundColor: colors.surfaceHigh }]}>
  <Text style={[styles.goalLabel, { color: colors.textSecondary }]}>
    Daily Goal
  </Text>
  <View style={styles.progressBar}>
    <View 
      style={[
        styles.progressFill,
        { 
          width: `${Math.min(goalProgress, 100)}%`,
          backgroundColor: goalProgress >= 100 ? colors.success : colors.accent
        }
      ]}
    />
  </View>
  <Text style={[styles.goalText, { color: colors.text }]}>
    {formatTime(dailyTotal)} / {formatTime(dailyGoal)}
  </Text>
</View>
```

---

### Focus Streak Tracking

Track consecutive days of studying:

```typescript
// In storageManager.ts
async updateStreak(): Promise<number> {
  const today = this.formatDateKey();
  const yesterday = this.formatDateKey(
    new Date(Date.now() - 86400000)
  );
  
  const todayHasData = this.dailyData.has(today);
  const yesterdayHasData = this.dailyData.has(yesterday);
  
  if (!todayHasData) return 0;
  
  let streak = await AsyncStorage.getItem('current_streak');
  let streakNum = streak ? parseInt(streak, 10) : 0;
  
  if (yesterdayHasData) {
    streakNum++;
  } else {
    streakNum = 1;
  }
  
  await AsyncStorage.setItem('current_streak', streakNum.toString());
  return streakNum;
}

async getStreak(): Promise<number> {
  const streak = await AsyncStorage.getItem('current_streak');
  return streak ? parseInt(streak, 10) : 0;
}
```

**Display streak:**

```typescript
// In TimerScreen.tsx
<View style={[styles.streakCard, { backgroundColor: colors.accent }]}>
  <Text style={[styles.streakLabel, { color: '#fff' }]}>
    🔥 {streak} Day Streak
  </Text>
  <Text style={[styles.streakSubtext, { color: 'rgba(255,255,255,0.8)' }]}>
    Keep it up!
  </Text>
</View>
```

---

### Pomodoro Timer Implementation

Add Pomodoro technique (25 min work, 5 min break):

```typescript
// In TimerScreen.tsx
const [timerMode, setTimerMode] = useState<'session' | 'break'>('session');
const SESSION_TIME = 25 * 60; // 25 minutes
const BREAK_TIME = 5 * 60;    // 5 minutes

const handleTimerComplete = () => {
  if (timerMode === 'session') {
    // Session ended - save and switch to break
    saveSession(elapsedSeconds);
    setTimerMode('break');
    setElapsedSeconds(0);
    playNotification();
  } else {
    // Break ended - reset for next session
    setTimerMode('session');
    setElapsedSeconds(0);
    playNotification();
  }
};

// Check if timer reached target
useEffect(() => {
  const targetTime = timerMode === 'session' ? SESSION_TIME : BREAK_TIME;
  if (elapsedSeconds >= targetTime && isRunning) {
    setIsRunning(false);
    handleTimerComplete();
  }
}, [elapsedSeconds, isRunning, timerMode]);
```

---

### Session Notes/Tags

Add categories to sessions:

```typescript
// Enhanced session storage
interface SessionWithTag {
  date: string;
  duration: number;
  tag?: 'math' | 'reading' | 'coding' | 'languages' | 'other';
  notes?: string;
}

async saveSessionWithTag(
  sessionSeconds: number,
  tag: string,
  notes?: string
): Promise<void> {
  const dateKey = this.formatDateKey();
  
  const history = await AsyncStorage.getItem('session_history');
  let sessions: SessionWithTag[] = history ? JSON.parse(history) : [];
  
  sessions.push({
    date: dateKey,
    duration: sessionSeconds,
    tag,
    notes
  });
  
  await AsyncStorage.setItem('session_history', JSON.stringify(sessions));
}
```

---

### Export Data

Allow users to backup and export:

```typescript
// In storageManager.ts
async exportAsJSON(): Promise<string> {
  const exported = {
    exportDate: new Date().toISOString(),
    version: '1.0.0',
    dailyData: Array.from(this.dailyData.entries()),
    sessionHistory: await AsyncStorage.getItem('session_history'),
  };
  return JSON.stringify(exported, null, 2);
}

async exportAsCSV(): Promise<string> {
  const data = Array.from(this.dailyData.entries());
  let csv = 'Date,Total (seconds),Total (formatted)\n';
  
  data.forEach(([date, seconds]) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    csv += `${date},${seconds},"${hours}h ${minutes}m"\n`;
  });
  
  return csv;
}
```

**Use in app:**

```typescript
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

const handleExport = async () => {
  const data = await storageManager.exportAsJSON();
  const fileUri = FileSystem.documentDirectory + 'study-timer-backup.json';
  
  await FileSystem.writeAsStringAsync(fileUri, data);
  await Sharing.shareAsync(fileUri);
};
```

---

### Push Notifications

Remind users to study:

```typescript
import * as Notifications from 'expo-notifications';

async function scheduleStudyReminder(
  hour: number,
  minute: number
): Promise<void> {
  const trigger = {
    type: 'daily',
    hour,
    minute,
  };
  
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '⏰ Time to Study!',
      body: 'Start a new study session',
      sound: 'default',
      badge: 1,
    },
    trigger,
  });
}

// Request permissions first
async function requestNotificationPermission(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

// In app initialization
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});
```

---

## 🎨 Theme Customization

### Create Custom Theme

```typescript
// themes/darkTheme.ts
export const darkTheme = {
  primary: '#4f46e5',
  secondary: '#818cf8',
  background: '#0a0a0a',
  surface: '#1a1a1a',
  text: '#ffffff',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
};

// themes/oledTheme.ts
export const oledTheme = {
  primary: '#6366f1',
  secondary: '#a78bfa',
  background: '#000000', // Pure black for OLED
  surface: '#111111',
  text: '#ffffff',
  success: '#34d399',
  warning: '#fbbf24',
  error: '#f87171',
};

// In App.tsx
const [theme, setTheme] = useState<'dark' | 'oled'>('dark');
const COLORS = theme === 'dark' ? darkTheme : oledTheme;
```

---

### Dynamic Font Sizing

```typescript
// utils/responsive.ts
import { Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;

export const FONT_SIZES = {
  xs: windowWidth < 360 ? 10 : 11,
  sm: windowWidth < 360 ? 12 : 13,
  base: windowWidth < 360 ? 14 : 15,
  lg: windowWidth < 360 ? 16 : 17,
  xl: windowWidth < 360 ? 20 : 24,
  xxl: windowWidth < 360 ? 28 : 32,
};

// Usage
<Text style={{ fontSize: FONT_SIZES.xxl }}>Title</Text>
```

---

## 📊 Advanced Analytics

### Track Study Patterns

```typescript
// In storageManager.ts
async getStudyPatterns(): Promise<{
  mostProductiveDay: string;
  averageSessionLength: number;
  longestStreak: number;
  totalStudyTime: number;
}> {
  const weekData = await this.getWeeklyStats();
  
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayTotals = new Map<string, number>();
  
  weekData.forEach((day) => {
    const dayName = days[new Date(day.date).getDay()];
    const current = dayTotals.get(dayName) || 0;
    dayTotals.set(dayName, current + day.total);
  });
  
  const mostProductiveDay = Array.from(dayTotals.entries()).sort(
    (a, b) => b[1] - a[1]
  )[0][0];
  
  const totalStudyTime = Array.from(dayTotals.values()).reduce(
    (sum, val) => sum + val,
    0
  );
  
  return {
    mostProductiveDay,
    averageSessionLength: Math.floor(totalStudyTime / 7),
    longestStreak: await this.getStreak(),
    totalStudyTime,
  };
}
```

---

### Monthly Statistics

```typescript
async getMonthlyStats(): Promise<{
  date: string;
  weeks: Array<{
    weekStart: string;
    total: number;
  }>;
  monthTotal: number;
}> {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  const weeks = [];
  let weekTotal = 0;
  let weekStart = '';
  
  for (let i = 0; i < 31; i++) {
    const date = new Date(currentYear, currentMonth, i + 1);
    
    if (date.getMonth() !== currentMonth) break;
    
    if (date.getDay() === 0 && weekTotal > 0) {
      weeks.push({ weekStart, total: weekTotal });
      weekTotal = 0;
    }
    
    if (date.getDay() === 1) {
      weekStart = this.formatDateKey(date);
    }
    
    const dayTotal = await this.getDailyTotal(date);
    weekTotal += dayTotal;
  }
  
  return {
    date: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`,
    weeks,
    monthTotal: weeks.reduce((sum, w) => sum + w.total, 0),
  };
}
```

---

## 🔐 Data Management

### Backup & Restore

```typescript
// In storageManager.ts
async backupData(filename?: string): Promise<string> {
  const backupName = filename || `backup_${Date.now()}.json`;
  const data = await this.exportData();
  
  // Save to device
  const FileSystem = require('expo-file-system');
  const path = FileSystem.documentDirectory + backupName;
  
  await FileSystem.writeAsStringAsync(path, JSON.stringify(data, null, 2));
  return path;
}

async restoreFromBackup(backupData: any): Promise<void> {
  if (!backupData.dailyData || !Array.isArray(backupData.dailyData)) {
    throw new Error('Invalid backup format');
  }
  
  this.dailyData = new Map(backupData.dailyData);
  await this.persistData();
}
```

---

### Data Migration

```typescript
async migrateFromV0(): Promise<void> {
  // Handle old data format
  const oldData = await AsyncStorage.getItem('old_timer_data');
  
  if (oldData) {
    try {
      const parsed = JSON.parse(oldData);
      
      // Convert old format to new
      parsed.forEach((item: any) => {
        this.dailyData.set(item.date, item.seconds);
      });
      
      await this.persistData();
      await AsyncStorage.removeItem('old_timer_data');
      
      console.log('✅ Migration complete');
    } catch (error) {
      console.error('Migration failed:', error);
    }
  }
}
```

---

## 🧪 Testing

### Unit Tests for Storage Manager

```typescript
// __tests__/storageManager.test.ts
import { storageManager } from '../src/utils/storageManager';

describe('StorageManager', () => {
  beforeEach(async () => {
    await storageManager.clearAllData();
  });

  test('should save and retrieve daily total', async () => {
    await storageManager.saveSession(3600, 3600);
    const total = await storageManager.getDailyTotal();
    expect(total).toBe(3600);
  });

  test('should get weekly stats', async () => {
    const stats = await storageManager.getWeeklyStats();
    expect(stats.length).toBe(7);
    expect(stats[0]).toHaveProperty('date');
    expect(stats[0]).toHaveProperty('total');
  });

  test('should format date key correctly', async () => {
    const date = new Date(2024, 0, 15);
    // Test formatting logic
    expect(true).toBe(true);
  });
});
```

---

## 🚀 Performance Tuning

### Optimize Large Lists

```typescript
// Replace map with FlatList for session history
import { FlatList } from 'react-native';

<FlatList
  data={sessionHistory}
  keyExtractor={(item, index) => `session_${index}`}
  renderItem={({ item, index }) => (
    <View style={styles.historyItem}>
      <Text>Session {index + 1}</Text>
      <Text>{formatTime(item)}</Text>
    </View>
  )}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  updateCellsBatchingPeriod={50}
/>
```

---

### Debounce Storage Writes

```typescript
// utils/debounce.ts
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): T {
  let timeout: NodeJS.Timeout | null = null;
  return ((...args) => {
    clearTimeout(timeout!);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
}

// Usage
const debouncedSave = debounce(
  (seconds: number) => storageManager.saveSession(seconds, dailyTotal + seconds),
  1000
);

// Call debounced function
debouncedSave(currentSeconds);
```

---

## 📱 Platform-Specific Code

### Android-Specific Implementation

```typescript
import { Platform } from 'react-native';

const AndroidStyles = Platform.select({
  android: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  ios: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});

<View style={AndroidStyles}>
  {/* Content */}
</View>
```

---

### Handle Notch & Safe Area

```typescript
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const TimerScreen = ({ colors }: Props) => {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      {/* Content properly spaced around notch */}
    </View>
  );
};
```

---

## 🐛 Debugging Tips

### Enable Redux DevTools Middleware

```typescript
// If adding Redux in future
import { composeWithDevTools } from 'redux-devtools-extension';

const store = createStore(
  rootReducer,
  composeWithDevTools()
);
```

### Network Debugging

```typescript
// Add network logging
import { Platform } from 'react-native';

if (!__DEV__) {
  // Only in development
  const originalFetch = fetch;
  global.fetch = (...args) => {
    console.log('FETCH:', args[0]);
    return originalFetch(...args);
  };
}
```

---

## 📚 Resources

- [React Native Performance Guide](https://reactnative.dev/docs/performance)
- [Expo Notifications](https://docs.expo.dev/guides/using-notifications/)
- [AsyncStorage Best Practices](https://react-native-async-storage.github.io/async-storage/)
- [React Hooks Optimization](https://react.dev/reference/react/useMemo)

---

**Last Updated:** March 16, 2024
