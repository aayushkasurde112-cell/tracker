# Study Timer - Troubleshooting & FAQ

## 🆘 Common Issues & Solutions

### 1. App Won't Start

#### Problem: "Cannot find module" errors

```
Error: Cannot find module 'react-native' or its extensions
```

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Or if using Yarn
rm -rf node_modules yarn.lock
yarn install

# Start fresh
npm start -c
```

---

#### Problem: "Expo not found"

```
expo: command not found
```

**Solution:**
```bash
# Install Expo CLI globally
npm install -g expo-cli

# Verify installation
expo --version

# Alternatively, use npx (no global install needed)
npx expo start
```

---

### 2. AsyncStorage Issues

#### Problem: Data not persisting

**Symptoms:**
- Data disappears when app closes
- Session not saved to daily total
- Weekly stats show zero

**Debugging:**
```typescript
// Check if storage is initialized
console.log('Storage initialized:', storageManager.initialized);

// Check stored data
const data = await AsyncStorage.getItem('study_timer_daily_data');
console.log('Stored data:', data);

// Try manual save
await AsyncStorage.setItem('test_key', 'test_value');
const value = await AsyncStorage.getItem('test_key');
console.log('Can write:', value === 'test_value');
```

**Solutions:**
- Ensure `storageManager.initialize()` is called on app start
- Check device has sufficient storage (>100 MB free)
- Verify AsyncStorage dependency installed: `npm list @react-native-async-storage/async-storage`
- Clear app cache: Settings > Apps > Study Timer > Storage > Clear Cache

---

#### Problem: AsyncStorage permission denied

**Error:**
```
Error: Permission denied
```

**Solution:**
```json
// In app.json, add permissions
{
  "expo": {
    "android": {
      "permissions": ["android.permission.WRITE_EXTERNAL_STORAGE"]
    }
  }
}
```

---

### 3. Timer Issues

#### Problem: Timer stops unexpectedly

**Symptoms:**
- Timer pauses without user action
- Seconds don't increment smoothly
- Timer jumps forward suddenly

**Debugging:**
```typescript
// Check interval is running
useEffect(() => {
  console.log('Interval effect - isRunning:', isRunning);
  
  if (isRunning) {
    console.log('Starting interval...');
    // Your interval code
  }
  
  return () => {
    console.log('Cleaning up interval');
  };
}, [isRunning]);
```

**Solutions:**
- Verify interval cleanup code in useEffect return
- Ensure setIsRunning is called correctly
- Check for memory leaks: avoid creating new functions in loop
- Test on real device (emulator may have performance issues)

---

#### Problem: Timer not accurate

**Symptoms:**
- Timer counts too fast/slow
- Interval doesn't run every 1000ms
- Time off by several seconds

**Solutions:**
```typescript
// Verify interval duration (should be 1000ms)
setInterval(() => {
  setElapsedSeconds((prev) => prev + 1);
}, 1000);  // ← Must be exactly 1000

// Alternative: use more accurate timing
const startTime = Date.now();
setInterval(() => {
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  setElapsedSeconds(elapsed);
}, 100);  // Check every 100ms for better accuracy
```

---

### 4. UI/Display Issues

#### Problem: Text appears cut off

**Symptoms:**
- Timer numbers not fully visible
- Daily total partially hidden
- Chart labels cut off

**Debugging:**
```typescript
// Add visual debug borders
<View style={[styles.container, { borderWidth: 1, borderColor: 'red' }]}>
  {/* Content */}
</View>
```

**Solutions:**
- Check SafeAreaView is wrapping content
- Verify padding/margin values aren't too large
- Test on different screen sizes
- Use `flex: 1` for proper spacing

---

#### Problem: Dark mode not working

**Symptoms:**
- App shows light background
- Text hard to read

**Solution:**
```typescript
// Verify colors in App.tsx
const COLORS = {
  background: '#0a0a0a',  // Should be very dark
  text: '#ffffff',        // Should be white
  // ...
};

// Check colors are passed to components
<TimerScreen colors={COLORS} />
```

---

### 5. Weekly Stats Not Showing

#### Problem: No data appears on weekly screen

**Symptoms:**
- Weekly view shows zeros
- Chart has no bars
- Day labels visible but no totals

**Debugging:**
```typescript
// Check data is loaded
useEffect(() => {
  const load = async () => {
    const data = await storageManager.getWeeklyStats();
    console.log('Weekly data:', data);
  };
  load();
}, []);
```

**Solutions:**
- Complete at least one study session first
- Check sessions are being saved (TimerScreen)
- Verify date formatting is consistent
- Clear cache and restart: `npm start -c`

---

### 6. Build Issues

#### Problem: Android build fails

```
Build failed at buildCommand
```

**Solutions:**
```bash
# 1. Clear all caches
rm -rf node_modules android/.gradle expo/
npm install

# 2. Check Java is installed
java -version

# 3. Check Android SDK
echo $ANDROID_HOME

# 4. Update SDK tools
# Android Studio > SDK Manager > Check for updates

# 5. Try local build
eas build --platform android --local
```

---

#### Problem: iOS build fails (macOS only)

```
Pod install failed
```

**Solutions:**
```bash
# 1. Clean pods
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..

# 2. Update CocoaPods
sudo gem install cocoapods

# 3. Try local build
eas build --platform ios --local
```

---

### 7. Navigation Issues

#### Problem: Can't switch between tabs

**Symptoms:**
- Buttons don't respond to taps
- Screen doesn't change
- Both tabs show same content

**Debugging:**
```typescript
// Check navigation state
console.log('Current tab:', activeTab);

// Check button tap handler
<TouchableOpacity onPress={() => {
  console.log('Tab pressed:', 'timer');
  setActiveTab('timer');
}}>
```

**Solutions:**
- Ensure `activeTab` state is being updated
- Verify TouchableOpacity is wrapping buttons
- Check conditional rendering logic
- Test with hardcoded values

---

### 8. Performance Issues

#### Problem: App is slow/laggy

**Symptoms:**
- Scroll stutter
- Button response delay
- Chart rendering slow

**Solutions:**
```typescript
// 1. Use React.memo for heavy components
export const BarChart = React.memo(({ data }) => {
  return <View>{/* Chart code */}</View>;
});

// 2. Optimize re-renders
useCallback(() => { /* handler */ }, [deps])

// 3. Use useMemo for expensive calculations
const weekTotal = useMemo(() => {
  return data.reduce((sum, day) => sum + day.total, 0);
}, [data]);

// 4. Check for console.log in production
// Remove debug logs before building
```

---

### 9. Data Loss

#### Problem: Data disappeared!

**Symptoms:**
- Sessions gone after update
- Daily total reset
- Week stats empty

**Prevention:**
```typescript
// Add data validation on load
async function loadData() {
  try {
    const data = await storageManager.getDailyTotal();
    if (data < 0) throw new Error('Invalid data');
    setDailyTotal(data);
  } catch (error) {
    console.error('Data corruption:', error);
    // Use backup or default value
  }
}
```

**Recovery:**
- Check if backup exists in device storage
- Look in AsyncStorage directly
- Restore from cloud backup if enabled

---

### 10. Device/Emulator Issues

#### Problem: App crashes on emulator

**Symptoms:**
- Instant crash on open
- Red screen with errors
- Emulator slow

**Solutions:**
```bash
# Restart emulator
emulator -list-avds
emulator -avd Pixel_4_API_31 -no-boot-anim

# Allocate more RAM
# Android Studio > AVD Manager > Edit > Memory = 4GB

# Or test on real device instead
npm run android  # Targets connected device first
```

---

#### Problem: App crashes on real device

**Symptoms:**
- Works in emulator but crashes on phone
- Different behavior on different devices

**Solutions:**
- Test on multiple devices if possible
- Check device OS version (app requires Android 5.0+, iOS 12.0+)
- Enable remote debugging: `npm start` then shake device
- Review device-specific storage limits

---

## ❓ Frequently Asked Questions

### General Questions

**Q: Is my study data safe?**
A: Yes! Data is stored only on your device using AsyncStorage. No data is sent to servers. Make a backup by exporting if you want extra safety.

---

**Q: Can I use the app offline?**
A: Completely! The app works 100% offline. No internet needed for any features.

---

**Q: Will my data survive a factory reset?**
A: No. Factory reset clears all app data including study sessions. Always backup important data using the export feature.

---

**Q: Can I sync data across devices?**
A: Not in the base version. You can export data as JSON and import on another device manually. Cloud sync can be added as a feature.

---

### Technical Questions

**Q: How much storage space does the app use?**
A: The app itself is ~40-50 MB. Data storage depends on usage—typically a few KB per day, so 1 year of data ≈ 1-2 MB.

---

**Q: Does the app drain battery?**
A: Minimal impact. The timer runs an interval every 1 second, which has negligible battery drain. Background mode isn't supported.

---

**Q: Can I modify the source code?**
A: Yes! This is your own version. Feel free to customize colors, add features, change logic, etc.

---

**Q: How do I report bugs?**
A: Check this troubleshooting guide first, then:
1. Try clearing cache: `npm start -c`
2. Check console logs for errors
3. Review the Implementation guide
4. Try on a different device if possible

---

### Feature Questions

**Q: How do I set a daily study goal?**
A: Not in v1.0, but see ADVANCED_USAGE.md for goal tracking implementation.

---

**Q: Can I get notifications/reminders?**
A: Not in v1.0, but see ADVANCED_USAGE.md for notification setup using expo-notifications.

---

**Q: How do I backup my data?**
A: See ADVANCED_USAGE.md > "Export Data" section for JSON/CSV export.

---

**Q: Can I track multiple study subjects?**
A: Not in v1.0, but see ADVANCED_USAGE.md for session tags/categories implementation.

---

### Build & Distribution Questions

**Q: How do I build an APK for Android?**
A: See BUILD_DEPLOYMENT.md > "Building for Production" section.

---

**Q: How do I submit to Google Play Store?**
A: See BUILD_DEPLOYMENT.md > "Distribution" > "Google Play Store" section.

---

**Q: How do I build on Windows/Linux?**
A: Use EAS cloud builds: `eas build --platform android` works on any platform.

---

**Q: Can I build without a Mac for iOS?**
A: Yes! Use EAS: `eas build --platform ios` builds in cloud. Mac not required.

---

### Development Questions

**Q: What if I want to add a new feature?**
A: 
1. Review IMPLEMENTATION.md for architecture
2. See ADVANCED_USAGE.md for example features
3. Create new files in src/screens or src/components
4. Test thoroughly before deploying

---

**Q: How do I add TypeScript strict mode?**
A: Already enabled in tsconfig.json. Run `npx tsc --noEmit` to check types.

---

**Q: Can I add Firebase or cloud backend?**
A: Yes, see ADVANCED_USAGE.md for Firebase setup examples.

---

## 🔧 Debug Checklist

Before asking for help, verify:

- [ ] Error message copied exactly
- [ ] Cleared cache: `npm start -c`
- [ ] Reinstalled dependencies: `npm install`
- [ ] Tried on real device (if emulator issue)
- [ ] Checked console logs: `console.error()`
- [ ] Verified AsyncStorage initialized
- [ ] Updated all packages: `npm update`
- [ ] Checked .env file exists (if used)
- [ ] Verified ANDROID_HOME / Java (Android)
- [ ] Checked CocoaPods updated (iOS)

---

## 📞 Getting Help

### Documentation Order
1. This FAQ (what you're reading)
2. QUICKSTART.md (5-minute setup)
3. IMPLEMENTATION.md (code & architecture)
4. ADVANCED_USAGE.md (features)
5. BUILD_DEPLOYMENT.md (building/releasing)

### Online Resources
- **Expo Docs**: https://docs.expo.dev/
- **React Native Docs**: https://reactnative.dev/docs/getting-started
- **AsyncStorage**: https://github.com/react-native-async-storage/async-storage
- **Stack Overflow**: Tag `[expo]` and `[react-native]`

### Community
- Expo Discord: https://chat.expo.dev
- React Native Discord: https://discord.gg/reactnative
- GitHub Issues: If building from source

---

## 📝 Reporting Issues Effectively

If something isn't working, provide:

```
App Version: 1.0.0
Device: iPhone 12 / Pixel 6
OS: iOS 16 / Android 12
React Native: 0.74.1

What happened:
[Clear description]

Expected behavior:
[What should have happened]

Steps to reproduce:
1. ...
2. ...
3. ...

Error message:
[Full error text from console]

Screenshots:
[If UI related]
```

---

## 🚀 Performance Tips

### For Users

- Close other apps while studying for faster timer response
- Restart phone weekly to clear memory
- Disable background app refresh if not needed
- Use WiFi instead of cellular for updates

### For Developers

- Use production builds for testing (faster than dev)
- Remove console.log statements before release
- Profile with Flipper debugger
- Test on real device before publishing

---

**Last Updated:** March 16, 2024  
**Version:** 1.0.0

If you can't find your answer here, check the main README.md!
