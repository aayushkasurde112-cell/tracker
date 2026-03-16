# Study Timer 

A minimal, production-ready study session tracker with dark mode interface, daily totals, and weekly comparison charts.

## Features

✅ **Dark Mode Interface** - Refined minimal aesthetic with indigo accents  
✅ **Start/Stop Timer** - Track individual study sessions  
✅ **Daily Total Tracking** - Automatically aggregate session time  
✅ **Persistent Storage** - AsyncStorage saves data end-of-day  
✅ **Weekly Comparison** - Visual bar chart and detailed breakdown  
✅ **Session History** - View all sessions for the current day  
✅ **Clean Dashboard** - Unified timer, daily, and weekly stats  

## Project Structure

```
study-timer/
├── App.tsx                          # Main app component with navigation
├── src/
│   ├── screens/
│   │   ├── TimerScreen.tsx         # Timer and daily tracking UI
│   │   └── WeeklyStatsScreen.tsx   # Weekly comparison and analytics
│   └── utils/
│       └── storageManager.ts        # AsyncStorage persistence layer
├── app.json                         # Expo configuration
├── package.json                     # Dependencies
├── tsconfig.json                    # TypeScript config
├── babel.config.js                  # Babel preset
├── eas.json                         # EAS Build configuration
└── README.md                        # This file
```

## Prerequisites

- **Node.js** 18.13.0+ with npm 9.2.0+
- **Expo CLI** (`npm install -g expo-cli`)
- **EAS CLI** for building (optional): `npm install -g eas-cli`

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

This will install:
- `expo` - React Native framework
- `react-native` - Core framework
- `@react-native-async-storage/async-storage` - Local data persistence
- TypeScript & dev dependencies

### 2. Run Development Server

```bash
# Start the development server
npm start

# For Android emulator
npm run android

# For iOS simulator (macOS only)
npm run ios

# For web preview
npm run web
```

## Building for Production

### Build with EAS (Recommended)

#### Prerequisites:
1. Create Expo account: https://expo.dev/signup
2. Install EAS CLI: `npm install -g eas-cli`
3. Link project: `eas init` (follow prompts)
4. Login: `eas login`

#### Build Commands:

```bash
# Build for Android (produces APK)
npm run build:android

# Build for iOS (produces IPA, macOS only)
npm run build:ios

# Build for both platforms
npm run build
```

The builds will be processed in the cloud and available for download from your Expo dashboard.

### Local Build (Alternative)

If you prefer local builds without EAS:

```bash
# For Android with Expo Go
npm start
# Then press 'a' in the terminal to open on Android device/emulator

# For iOS with Expo Go (macOS)
npm start
# Then press 'i' to open on iOS simulator
```

## Architecture Overview

### Timer Screen (`TimerScreen.tsx`)
- Displays current session timer with start/stop button
- Shows today's total study time
- Lists all sessions completed today
- Saves sessions to AsyncStorage on completion

### Weekly Stats Screen (`WeeklyStatsScreen.tsx`)
- Bar chart visualization of daily study time
- Highlights today's data
- Shows week total and daily average
- Detailed day-by-day breakdown with dates

### Storage Manager (`storageManager.ts`)
- Handles AsyncStorage persistence
- Manages date-based data keys
- Provides weekly stats calculation
- Maintains session history (last 30 days)
- Supports data export and clearing

## Data Structure

### Daily Data Storage
```json
{
  "2024-01-15": 14400,  // seconds (4 hours)
  "2024-01-16": 18000   // seconds (5 hours)
}
```

### Session History Storage
```json
[
  { "date": "2024-01-15", "duration": 3600 },
  { "date": "2024-01-15", "duration": 10800 },
  { "date": "2024-01-16", "duration": 18000 }
]
```

## Color Scheme (Dark Theme)

| Element | Color | Hex |
|---------|-------|-----|
| Background | Deep Black | `#0a0a0a` |
| Surface | Dark Gray | `#1a1a1a` |
| Surface High | Medium Gray | `#2a2a2a` |
| Primary Text | White | `#ffffff` |
| Secondary Text | Light Gray | `#b0b0b0` |
| Accent | Indigo | `#4f46e5` |
| Accent Light | Light Indigo | `#818cf8` |
| Success | Green | `#10b981` |
| Danger | Red | `#ef4444` |

## Key Features Explained

### Timer Functionality
1. Press "Start Session" to begin timing
2. Timer displays hours:minutes:seconds
3. Press "Stop Session" to end - automatically saves
4. Session is added to today's total
5. Data persists even after app closes

### Daily Total Tracking
- Aggregates all session durations for the current day
- Displayed prominently with green accent
- Automatically updates when sessions complete
- Resets at midnight (new day)

### Weekly Comparison
- Shows last 7 days of study time
- Bar chart with visual scaling
- Today highlighted with primary accent color
- Includes week totals and daily averages
- Detailed breakdown with dates

### Persistent Storage
- All data saved to device's AsyncStorage
- No internet required
- Data survives app restarts
- Session history kept for 30 days
- Export capability for backup

## TypeScript Configuration

The project uses strict TypeScript settings:
- Type-safe components and utilities
- Optional: Run `npx tsc --noEmit` to check types
- All React Native APIs properly typed

## Performance Optimizations

- **Minimal Re-renders**: Only affected screens update on state change
- **Efficient Storage**: Async operations don't block UI
- **Optimized Charts**: Bar chart uses flexbox for smooth rendering
- **Memory Management**: Intervals properly cleaned up on unmount

## Troubleshooting

### Build Issues
```bash
# Clear cache
expo start -c

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### AsyncStorage Not Working
- Ensure `@react-native-async-storage/async-storage` is installed
- Check device has sufficient storage space
- Try clearing app cache: `Settings > Apps > Study Timer > Storage > Clear Cache`

### Timer Not Persisting
- Verify AsyncStorage is initialized before using
- Check device permissions for app storage access
- Ensure session is stopped (not running) when app closes

## Development Notes

- Hot reload enabled for rapid development
- Console logs visible in Expo Go app
- TypeScript compilation in real-time
- Easy to add features (notifications, goals, etc.)

## Future Enhancement Ideas

- Push notifications for study reminders
- Goal setting and progress tracking
- Break timer and Pomodoro technique
- Data export to CSV
- Cloud sync across devices
- Detailed analytics and trends
- Focus streak tracking
- Custom study categories

## License

MIT - Feel free to use and modify for your needs

## Support

For issues:
1. Check Expo documentation: https://docs.expo.dev
2. Review React Native docs: https://reactnative.dev
3. Check AsyncStorage guide: https://react-native-async-storage.github.io/async-storage/

---

**Happy studying!** 📚⏱️
