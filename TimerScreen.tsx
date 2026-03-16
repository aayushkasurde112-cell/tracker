import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { storageManager } from '../utils/storageManager';

interface TimerScreenProps {
  colors: {
    background: string;
    surface: string;
    surfaceHigh: string;
    text: string;
    textSecondary: string;
    accent: string;
    accentLight: string;
    success: string;
    danger: string;
    border: string;
    overlay: string;
  };
}

export const TimerScreen: React.FC<TimerScreenProps> = ({ colors }) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [dailyTotal, setDailyTotal] = useState(0);
  const [sessionHistory, setSessionHistory] = useState<number[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      const total = await storageManager.getDailyTotal();
      const history = await storageManager.getSessionHistory();
      setDailyTotal(total);
      setSessionHistory(history);
    };

    loadData();
  }, []);

  // Timer effect
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const handleStartStop = async () => {
    if (isRunning) {
      // Stop the timer
      setIsRunning(false);
      if (elapsedSeconds > 0) {
        // Save the session and update daily total
        const newSessionHistory = [...sessionHistory, elapsedSeconds];
        const newTotal = dailyTotal + elapsedSeconds;

        setSessionHistory(newSessionHistory);
        setDailyTotal(newTotal);

        await storageManager.saveSession(elapsedSeconds, newTotal);
        setElapsedSeconds(0);
      }
    } else {
      // Start the timer
      setIsRunning(true);
    }
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const formatDailyTotal = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Study Timer</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Focus on what matters
        </Text>
      </View>

      {/* Current Session Timer */}
      <View
        style={[
          styles.timerCard,
          { backgroundColor: colors.surfaceHigh, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.sessionLabel, { color: colors.textSecondary }]}>
          Current Session
        </Text>
        <Text style={[styles.timerDisplay, { color: colors.accent }]}>
          {formatTime(elapsedSeconds)}
        </Text>
      </View>

      {/* Daily Total */}
      <View
        style={[
          styles.dailyTotalCard,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.dailyLabel, { color: colors.textSecondary }]}>
          Today's Total
        </Text>
        <View style={styles.dailyValueContainer}>
          <Text style={[styles.dailyValue, { color: colors.success }]}>
            {formatDailyTotal(dailyTotal)}
          </Text>
        </View>
      </View>

      {/* Action Button */}
      <TouchableOpacity
        onPress={handleStartStop}
        activeOpacity={0.8}
        style={[
          styles.actionButton,
          {
            backgroundColor: isRunning ? colors.danger : colors.accent,
          },
        ]}
      >
        <Text style={[styles.buttonText, { color: '#fff' }]}>
          {isRunning ? 'Stop Session' : 'Start Session'}
        </Text>
      </TouchableOpacity>

      {/* Session History */}
      {sessionHistory.length > 0 && (
        <View style={styles.historySection}>
          <Text style={[styles.historyTitle, { color: colors.text }]}>
            Today's Sessions
          </Text>
          <View
            style={[
              styles.historyContainer,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            {sessionHistory.map((session, index) => (
              <View
                key={index}
                style={[
                  styles.historyItem,
                  {
                    borderBottomColor: colors.border,
                    borderBottomWidth: index < sessionHistory.length - 1 ? 1 : 0,
                  },
                ]}
              >
                <Text style={[styles.historyIndex, { color: colors.textSecondary }]}>
                  Session {index + 1}
                </Text>
                <Text style={[styles.historyTime, { color: colors.accentLight }]}>
                  {formatDailyTotal(session)}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    letterSpacing: 0.3,
    fontWeight: '500',
  },
  timerCard: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  sessionLabel: {
    fontSize: 12,
    letterSpacing: 0.5,
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  timerDisplay: {
    fontSize: 56,
    fontWeight: '700',
    letterSpacing: -1,
    fontVariant: ['tabular-nums'],
  },
  dailyTotalCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dailyLabel: {
    fontSize: 13,
    letterSpacing: 0.5,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  dailyValueContainer: {
    alignItems: 'flex-end',
  },
  dailyValue: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  actionButton: {
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 32,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  historySection: {
    marginTop: 16,
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  historyContainer: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  historyIndex: {
    fontSize: 12,
    fontWeight: '500',
  },
  historyTime: {
    fontSize: 14,
    fontWeight: '600',
  },
});
