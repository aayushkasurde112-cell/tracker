# Study Timer - Quick Start Guide

## 🚀 Getting Started (5 Minutes)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start Development
```bash
npm start
```

### Step 3: Run on Device/Emulator
```bash
# Android
npm run android

# iOS (macOS only)
npm run ios
```

---

## 📦 Building APK/IPA

### Via Expo (Cloud Build - Recommended)

**First time setup:**
```bash
npm install -g eas-cli
eas login
eas init
```

**Build for Android APK:**
```bash
eas build --platform android --local
```

**Build for iOS IPA:**
```bash
eas build --platform ios --local
```

Both will create signed, production-ready binaries.

---

## 📱 App Features

### Timer Screen
- **Start/Stop Button** - Begin and end study sessions
- **Session Timer** - Real-time display (HH:MM:SS)
- **Daily Total** - Cumulative study time
- **Session History** - All sessions completed today

### Weekly Stats
- **Bar Chart** - Visual daily breakdown
- **Week Summary** - Total hours + daily average
- **Day Details** - Individual daily stats with dates

---

## 💾 Data Persistence

All data is saved locally using AsyncStorage:
- **Session data**: Stored by date
- **History**: Last 30 days retained
- **Auto-sync**: Data persists between app restarts

---

## 🎨 Dark Theme Colors

| Use | Color |
|-----|-------|
| Background | `#0a0a0a` (Deep Black) |
| Surfaces | `#1a1a1a` to `#2a2a2a` (Dark Grays) |
| Text | `#ffffff` (White) |
| Accents | `#4f46e5` (Indigo) |
| Success | `#10b981` (Green) |

---

## 📂 Key Files

```
App.tsx                          Main entry point
src/screens/TimerScreen.tsx     Timer UI & logic
src/screens/WeeklyStatsScreen.tsx  Stats & charts
src/utils/storageManager.ts     Data management
```

---

## ❓ Common Issues

**"Cannot find module '@react-native-async-storage/async-storage'"**
```bash
npm install @react-native-async-storage/async-storage
```

**App won't start**
```bash
npm start -c  # Clear cache
```

**AsyncStorage not saving**
- Ensure app doesn't close immediately after pressing "Stop"
- Check device storage permissions

---

## 🔧 Customization

### Change Theme Colors
Edit `App.tsx` - `COLORS` object:
```typescript
const COLORS = {
  accent: '#4f46e5',  // Change this
  // ... other colors
};
```

### Adjust Timer Precision
Edit `TimerScreen.tsx` - interval frequency:
```typescript
setInterval(() => {
  setElapsedSeconds((prev) => prev + 1);  // Every 1 second
}, 1000);
```

---

## 📚 Learn More

- **Expo Docs**: https://docs.expo.dev
- **React Native**: https://reactnative.dev
- **AsyncStorage**: https://github.com/react-native-async-storage/async-storage

---

## ✅ Checklist

- [ ] Dependencies installed (`npm install`)
- [ ] App runs locally (`npm start`)
- [ ] Timer works (start/stop)
- [ ] Data persists (close & reopen app)
- [ ] Weekly view shows data
- [ ] Ready to build APK/IPA

---

Happy studying! 📚⏱️
