# Study Timer - Build & Deployment Guide

## 🏗️ Building for Production

### Option 1: Expo EAS Build (Recommended)

EAS (Expo Application Services) handles cloud builds for both Android and iOS.

#### Setup (One-time)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo account
eas login

# Initialize EAS in your project
eas init

# Follow prompts to create EAS project
```

#### Build Android APK

```bash
# Build with EAS (cloud)
eas build --platform android

# When prompted:
# - Choose: "apk" (APK for testing/direct install)
# - Choose: "Release" build type
```

**Output:** Download APK from Expo dashboard → Install on Android device

---

#### Build iOS IPA

```bash
# Build with EAS (requires Apple Developer account)
eas build --platform ios

# When prompted:
# - Choose: "ipa" (for TestFlight/App Store)
# - Provide Apple Developer credentials

# Or use: "adhoc" for direct device installation
```

**Output:** Download IPA → Use Apple Configurator or Xcode to install

---

#### Build Both Platforms

```bash
# Build both in one command
eas build --platform all

# Monitor build progress:
eas build:list
```

---

### Option 2: Local Android Build

Build APK locally without cloud services.

#### Prerequisites

```bash
# Install Java Development Kit (JDK) 11+
# Download: https://www.oracle.com/java/technologies/downloads/

# Install Android SDK
# Download Android Studio: https://developer.android.com/studio

# Set ANDROID_HOME environment variable
# macOS/Linux:
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools

# Windows:
setx ANDROID_HOME %USERPROFILE%\AppData\Local\Android\sdk
```

#### Build APK

```bash
# Clear cache and install dependencies
npm install
npm start -c

# Create production APK
eas build --platform android --local

# Or use Expo's standard build
expo build:android -t apk

# APK location: /android/app/build/outputs/apk/release/app-release.apk
```

---

### Option 3: Local iOS Build

Build IPA locally on macOS.

#### Prerequisites

```bash
# Install Xcode 13+
xcode-select --install

# Install CocoaPods
sudo gem install cocoapods

# Install Node dependencies
npm install
```

#### Build IPA

```bash
# Install iOS dependencies
cd ios
pod install
cd ..

# Build for iOS
eas build --platform ios --local

# Or use Xcode directly
# Open ios/StudyTimer.xcworkspace in Xcode
# Select: Product > Archive > Distribute App
```

---

## 📦 Signing Configuration

### Android Signing

#### Generate Keystore (First Time)

```bash
# Generate keystore file
keytool -genkey -v -keystore study_timer.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias study_timer_key

# You'll be prompted for:
# - Keystore password (SAVE THIS!)
# - Key password
# - Full name, organization, etc.

# Result: study_timer.keystore file created
```

#### Configure Signing in app.json

```json
{
  "expo": {
    "android": {
      "package": "com.studytimer.app",
      "versionCode": 1
    },
    "build": {
      "production": {
        "android": {
          "keystore": "path/to/study_timer.keystore"
        }
      }
    }
  }
}
```

#### Store Keystore Safely

```bash
# Create backup
cp study_timer.keystore ~/.android/study_timer.keystore

# Protect with permissions
chmod 600 study_timer.keystore
```

---

### iOS Signing

#### Create Apple Developer Account

1. Go to https://developer.apple.com
2. Enroll in Apple Developer Program ($99/year)
3. Create App ID and provisioning profiles
4. Download certificates

#### Configure in app.json

```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.studytimer.app",
      "buildNumber": "1"
    }
  }
}
```

---

## 🚀 Distribution

### Google Play Store

#### Prerequisites

1. Create Google Play Developer account ($25 one-time)
2. Create app listing in Play Console
3. Generate signed APK

#### Upload to Play Store

```bash
# Build signed APK
eas build --platform android --auto-submit

# Or manually upload APK to Play Console:
# 1. Go to Google Play Console
# 2. Select app
# 3. Release > Production > Create Release
# 4. Upload APK/AAB
# 5. Fill in description, screenshots, etc.
# 6. Review and publish
```

---

### Apple App Store

#### Prerequisites

1. Enroll in Apple Developer Program ($99/year)
2. Create app in App Store Connect
3. Get App Store certificates

#### Submit to App Store

```bash
# Build and auto-submit to TestFlight
eas build --platform ios --auto-submit

# Or manually:
# 1. Open App Store Connect
# 2. Select app
# 3. TestFlight > iOS Builds
# 4. Add new build
# 5. Wait for processing
# 6. Submit for review

# Review typically takes 24-48 hours
```

---

## 📋 Pre-Release Checklist

### Code Quality
- [ ] All features working correctly
- [ ] No console errors or warnings
- [ ] TypeScript compilation passes
- [ ] Code reviewed and tested

### App Metadata
- [ ] App name finalized
- [ ] Version number incremented
- [ ] Package ID correct
- [ ] App icons prepared

### Documentation
- [ ] README updated
- [ ] Privacy policy written
- [ ] Terms of service ready
- [ ] Changelog prepared

### Testing
- [ ] Tested on real devices
- [ ] Tested on multiple screen sizes
- [ ] Storage data persists
- [ ] All buttons responsive
- [ ] UI renders correctly

### Compliance
- [ ] Privacy policy included in app
- [ ] Required permissions requested
- [ ] Data handling explained
- [ ] Age rating appropriate

---

## 🔧 Version Management

### Update Version Numbers

#### In app.json
```json
{
  "expo": {
    "version": "1.1.0",
    "android": {
      "versionCode": 2
    },
    "ios": {
      "buildNumber": "2"
    }
  }
}
```

#### Semantic Versioning

```
MAJOR.MINOR.PATCH
1.0.0

MAJOR (1) - Breaking changes
MINOR (0) - New features
PATCH (0) - Bug fixes

Examples:
1.0.0 → 1.0.1 (bug fix)
1.0.0 → 1.1.0 (new feature)
1.0.0 → 2.0.0 (breaking change)
```

---

## 📊 Monitoring & Analytics

### Enable Crash Reporting

```bash
# Add Sentry for error tracking
npm install @sentry/react-native

# Configure in App.tsx
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
  environment: 'production',
});

export default Sentry.wrap(App);
```

---

### Add Analytics

```bash
# Add Firebase Analytics
npm install @react-native-firebase/analytics

# Configure in App.tsx
import analytics from '@react-native-firebase/analytics';

const logSessionStart = async () => {
  await analytics().logEvent('study_session_started', {
    timestamp: new Date().toISOString(),
  });
};
```

---

## 🔄 Continuous Integration

### GitHub Actions Setup

Create `.github/workflows/build.yml`:

```yaml
name: Build

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build
        run: eas build --platform android --auto-submit
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
```

---

## 🐛 Build Troubleshooting

### Android Build Fails

```bash
# Clear Gradle cache
cd android && ./gradlew clean && cd ..

# Rebuild
npm start -c
eas build --platform android --local
```

### iOS Build Fails

```bash
# Clear pods cache
cd ios && rm -rf Pods Podfile.lock && pod install && cd ..

# Rebuild
eas build --platform ios --local
```

### "SDK not found" Error

```bash
# Update Android SDK
# Android Studio > SDK Manager > Install latest SDK
# Set ANDROID_HOME path correctly
echo $ANDROID_HOME  # Verify it's set

# On macOS:
export ANDROID_HOME=$HOME/Library/Android/sdk
```

---

## 📱 Installation Methods

### Android Installation

#### Direct APK Install
```bash
# Connect device or start emulator
adb install -r app-release.apk
```

#### Via Google Play Store
1. Go to Play Store
2. Search "Study Timer"
3. Tap Install
4. App installs automatically

---

### iOS Installation

#### TestFlight Install
1. Receive TestFlight invite email
2. Open link in email or App Store
3. Tap "Open in App Store"
4. Tap "Install"

#### Direct IPA Install
```bash
# Using Apple Configurator (macOS)
# 1. Connect iPhone
# 2. Apple Configurator > Add > Select IPA
# 3. Choose device and install

# Or using Xcode:
# 1. Xcode > Window > Devices and Simulators
# 2. Select device
# 3. Drag IPA to installed apps section
```

---

## 🔐 Security Best Practices

### Code Obfuscation

```bash
# Enable proguard for Android (in eas.json)
{
  "build": {
    "production": {
      "android": {
        "enableProguard": true
      }
    }
  }
}
```

### Secure Storage

```typescript
// For sensitive data, use Secure Storage
import * as SecureStore from 'expo-secure-store';

// Store API keys securely
await SecureStore.setItemAsync('api_key', secretKey);
const key = await SecureStore.getItemAsync('api_key');
```

---

## 📈 Performance Benchmarks

### Target Metrics

| Metric | Target |
|--------|--------|
| App Size | < 50 MB |
| Startup Time | < 2 seconds |
| Memory Usage | < 50 MB |
| Battery Impact | < 2% per hour |

### Optimize Bundle Size

```bash
# Analyze bundle
npm install --save-dev react-native-bundle-visualizer

# Generate report
react-native-bundle-visualizer android
```

---

## 🎉 Post-Release

### Monitor Ratings & Reviews

1. Google Play Console / App Store Connect
2. Check daily for feedback
3. Respond to reviews professionally
4. Track crash reports

### Plan Updates

```bash
# Version 1.1.0 - Q2 2024
- Add goal tracking
- Improve notifications
- Bug fixes

# Version 2.0.0 - Q3 2024
- Cloud sync
- Social features
- Advanced analytics
```

---

## 📚 Additional Resources

- [Expo Documentation](https://docs.expo.dev)
- [Android Build Docs](https://developer.android.com/build)
- [iOS Build Docs](https://developer.apple.com/documentation/xcode)
- [Google Play Guidelines](https://play.google.com/console/about/gp-best-practices/)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)

---

**Last Updated:** March 16, 2024  
**Version:** 1.0.0
