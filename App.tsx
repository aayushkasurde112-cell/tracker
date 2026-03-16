import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  StatusBar,
  ActivityIndicator,
  Text as RNText,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TimerScreen } from './src/screens/TimerScreen';
import { WeeklyStatsScreen } from './src/screens/WeeklyStatsScreen';
import { storageManager } from './src/utils/storageManager';

// Dark theme colors - refined minimal aesthetic
const COLORS = {
  background: '#0a0a0a',
  surface: '#1a1a1a',
  surfaceHigh: '#2a2a2a',
  text: '#ffffff',
  textSecondary: '#b0b0b0',
  accent: '#4f46e5', // Indigo
  accentLight: '#818cf8',
  success: '#10b981',
  danger: '#ef4444',
  border: '#333333',
  overlay: 'rgba(0, 0, 0, 0.4)',
};

export default function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [activeTab, setActiveTab] = useState<'timer' | 'weekly'>('timer');

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await storageManager.initialize();
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize app:', error);
        setIsInitialized(true); // Still proceed even if init fails
      }
    };

    initializeApp();
  }, []);

  if (!isInitialized) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
        <ActivityIndicator size="large" color={COLORS.accent} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      <View style={styles.content}>
        {activeTab === 'timer' ? (
          <TimerScreen colors={COLORS} />
        ) : (
          <WeeklyStatsScreen colors={COLORS} />
        )}
      </View>

      {/* Bottom Navigation */}
      <View style={styles.navigationBar}>
        <NavButton
          label="Timer"
          active={activeTab === 'timer'}
          onPress={() => setActiveTab('timer')}
          colors={COLORS}
        />
        <NavButton
          label="Weekly"
          active={activeTab === 'weekly'}
          onPress={() => setActiveTab('weekly')}
          colors={COLORS}
        />
      </View>
    </SafeAreaView>
  );
}

interface NavButtonProps {
  label: string;
  active: boolean;
  onPress: () => void;
  colors: typeof COLORS;
}

const NavButton = ({ label, active, onPress, colors }: NavButtonProps) => {
  return (
    <TouchableOpacity
      style={[
        styles.navButton,
        active && { borderTopWidth: 3, borderTopColor: colors.accent },
      ]}
      onPress={onPress}
    >
      <RNText
        style={[
          styles.navLabel,
          {
            color: active ? colors.accent : colors.textSecondary,
            fontWeight: active ? '700' : '500',
          },
        ]}
      >
        {label}
      </RNText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  navigationBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  navButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
  },
  navLabel: {
    fontSize: 13,
    letterSpacing: 0.5,
  },
});

export { COLORS };
