import AsyncStorage from '@react-native-async-storage/async-storage';

interface StorageData {
  date: string;
  total: number;
}

const STORAGE_KEYS = {
  DAILY_DATA: 'study_timer_daily_data',
  SESSION_HISTORY: 'study_timer_session_history',
  CURRENT_DATE: 'study_timer_current_date',
};

class StorageManager {
  private initialized = false;
  private dailyData: Map<string, number> = new Map();

  async initialize(): Promise<void> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.DAILY_DATA);
      if (data) {
        const parsed = JSON.parse(data);
        this.dailyData = new Map(parsed);
      }
      this.initialized = true;
    } catch (error) {
      console.error('Storage initialization error:', error);
      this.initialized = true;
    }
  }

  private formatDateKey(date: Date = new Date()): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private async persistData(): Promise<void> {
    try {
      const data = Array.from(this.dailyData.entries());
      await AsyncStorage.setItem(STORAGE_KEYS.DAILY_DATA, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to persist data:', error);
    }
  }

  async getDailyTotal(date?: Date): Promise<number> {
    const dateKey = this.formatDateKey(date);
    return this.dailyData.get(dateKey) || 0;
  }

  async saveSession(sessionSeconds: number, newDailyTotal: number, date?: Date): Promise<void> {
    const dateKey = this.formatDateKey(date);
    this.dailyData.set(dateKey, newDailyTotal);
    
    // Also save session history
    const sessionHistory = await AsyncStorage.getItem(STORAGE_KEYS.SESSION_HISTORY);
    let history: { date: string; duration: number }[] = [];
    
    if (sessionHistory) {
      try {
        history = JSON.parse(sessionHistory);
      } catch {
        history = [];
      }
    }

    history.push({
      date: dateKey,
      duration: sessionSeconds,
    });

    // Keep only last 30 days of session history
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const cutoffDate = this.formatDateKey(thirtyDaysAgo);

    history = history.filter((h) => h.date >= cutoffDate);

    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SESSION_HISTORY, JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save session history:', error);
    }

    await this.persistData();
  }

  async getSessionHistory(date?: Date): Promise<number[]> {
    try {
      const sessionHistory = await AsyncStorage.getItem(STORAGE_KEYS.SESSION_HISTORY);
      if (!sessionHistory) return [];

      const dateKey = this.formatDateKey(date);
      const parsed = JSON.parse(sessionHistory);
      
      return parsed
        .filter((item: { date: string; duration: number }) => item.date === dateKey)
        .map((item: { date: string; duration: number }) => item.duration);
    } catch (error) {
      console.error('Failed to get session history:', error);
      return [];
    }
  }

  async getWeeklyStats(): Promise<StorageData[]> {
    try {
      const today = new Date();
      const weekStats: StorageData[] = [];

      // Get last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateKey = this.formatDateKey(date);
        const total = this.dailyData.get(dateKey) || 0;

        weekStats.push({
          date: dateKey,
          total,
        });
      }

      return weekStats;
    } catch (error) {
      console.error('Failed to get weekly stats:', error);
      return [];
    }
  }

  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.DAILY_DATA,
        STORAGE_KEYS.SESSION_HISTORY,
        STORAGE_KEYS.CURRENT_DATE,
      ]);
      this.dailyData.clear();
    } catch (error) {
      console.error('Failed to clear data:', error);
    }
  }

  async exportData(): Promise<{
    dailyData: Array<[string, number]>;
    timestamp: string;
  }> {
    return {
      dailyData: Array.from(this.dailyData.entries()),
      timestamp: new Date().toISOString(),
    };
  }
}

export const storageManager = new StorageManager();
