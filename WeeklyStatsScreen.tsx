import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Dimensions,
} from 'react-native';
import { storageManager } from '../utils/storageManager';

interface WeeklyStatsScreenProps {
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

interface DayStats {
  date: string;
  dayName: string;
  total: number;
  isToday: boolean;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const WeeklyStatsScreen: React.FC<WeeklyStatsScreenProps> = ({ colors }) => {
  const [weekData, setWeekData] = useState<DayStats[]>([]);
  const [weekTotal, setWeekTotal] = useState(0);
  const [maxDaily, setMaxDaily] = useState(0);

  useEffect(() => {
    const loadWeeklyData = async () => {
      const data = await storageManager.getWeeklyStats();
      
      const today = new Date();
      const todayDateStr = formatDateKey(today);

      const processedData = data.map((item) => ({
        date: item.date,
        dayName: DAY_NAMES[new Date(item.date).getDay()],
        total: item.total,
        isToday: item.date === todayDateStr,
      }));

      setWeekData(processedData);
      
      const total = data.reduce((sum, item) => sum + item.total, 0);
      const max = Math.max(...data.map((item) => item.total), 0);
      
      setWeekTotal(total);
      setMaxDaily(max > 0 ? max : 3600); // Default to 1 hour for scaling
    };

    loadWeeklyData();

    // Refresh data when screen is focused
    const interval = setInterval(loadWeeklyData, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getBarHeight = (seconds: number): number => {
    if (maxDaily === 0) return 0;
    const maxHeight = 160;
    return (seconds / maxDaily) * maxHeight;
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Weekly Overview</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Last 7 days
        </Text>
      </View>

      {/* Week Summary */}
      <View
        style={[
          styles.summaryCard,
          { backgroundColor: colors.surfaceHigh, borderColor: colors.border },
        ]}
      >
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
            Total Study Time
          </Text>
          <Text style={[styles.summaryValue, { color: colors.accent }]}>
            {formatTime(weekTotal)}
          </Text>
        </View>
        <View
          style={[styles.summaryDivider, { backgroundColor: colors.border }]}
        />
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
            Daily Average
          </Text>
          <Text style={[styles.summaryValue, { color: colors.success }]}>
            {formatTime(Math.floor(weekTotal / 7))}
          </Text>
        </View>
      </View>

      {/* Bar Chart */}
      <View
        style={[
          styles.chartCard,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.chartTitle, { color: colors.text }]}>
          Daily Breakdown
        </Text>
        
        <View style={styles.chartContainer}>
          {weekData.map((day, index) => (
            <View key={index} style={styles.barColumn}>
              <View style={styles.barWrapper}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: getBarHeight(day.total),
                      backgroundColor: day.isToday ? colors.accent : colors.accentLight,
                    },
                  ]}
                />
              </View>
              <Text
                style={[
                  styles.barLabel,
                  {
                    color: day.isToday ? colors.accent : colors.textSecondary,
                    fontWeight: day.isToday ? '700' : '500',
                  },
                ]}
              >
                {day.dayName.substring(0, 3)}
              </Text>
              <Text style={[styles.barValue, { color: colors.text }]}>
                {day.total > 0 ? formatTime(day.total) : '—'}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Detailed Stats */}
      <View style={styles.detailedSection}>
        <Text style={[styles.detailedTitle, { color: colors.text }]}>
          Day by Day
        </Text>
        
        {weekData.map((day, index) => (
          <View
            key={index}
            style={[
              styles.dayRow,
              {
                backgroundColor: day.isToday ? colors.surfaceHigh : colors.surface,
                borderColor: colors.border,
                borderWidth: day.isToday ? 1 : 0,
              },
            ]}
          >
            <View>
              <Text
                style={[
                  styles.dayName,
                  {
                    color: colors.text,
                    fontWeight: day.isToday ? '700' : '600',
                  },
                ]}
              >
                {day.dayName}
              </Text>
              <Text style={[styles.dayDate, { color: colors.textSecondary }]}>
                {new Date(day.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </Text>
            </View>
            <Text
              style={[
                styles.dayTotal,
                {
                  color: day.isToday ? colors.success : colors.accentLight,
                  fontWeight: day.isToday ? '700' : '600',
                },
              ]}
            >
              {day.total > 0 ? formatTime(day.total) : '—'}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

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
    marginBottom: 28,
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
  summaryCard: {
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 24,
    marginBottom: 24,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 11,
    letterSpacing: 0.5,
    fontWeight: '600',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  summaryDivider: {
    width: 1,
    marginHorizontal: 16,
  },
  chartCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 20,
    textTransform: 'uppercase',
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 220,
    marginBottom: 8,
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginHorizontal: 4,
  },
  barWrapper: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: 160,
    marginBottom: 12,
  },
  bar: {
    width: '100%',
    borderRadius: 6,
    minHeight: 4,
  },
  barLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  barValue: {
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  detailedSection: {
    marginTop: 8,
  },
  detailedTitle: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  dayRow: {
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayName: {
    fontSize: 15,
    letterSpacing: 0.2,
    marginBottom: 3,
  },
  dayDate: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  dayTotal: {
    fontSize: 16,
    letterSpacing: -0.3,
  },
});
