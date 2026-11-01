import { NotificationSettings } from '../types';
import { soundEffects } from './audio';

export interface ToastAlert {
  id: string;
  title: string;
  body: string;
  timestamp: number;
}

export const REMINDER_MESSAGES = [
  'Time for a crisp sip! 💧 Your cactus is thirsty for its next +5% growth.',
  'Hydration check! Take a drink to protect your consecutive streak. 🌵',
  'Water break! Every drop helps your garden flourish beautifully.',
  'Your body and your cactus both need a refresh right now! 🌿',
  'Keep the momentum going! Tap Fill Up after your next glass of water.',
];

class NotificationManager {
  private listener: ((toast: ToastAlert) => void) | null = null;
  private intervalId: number | null = null;

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
  }

  public getPermissionStatus(): NotificationPermission {
    if (!this.isSupported()) return 'denied';
    return Notification.permission;
  }

  public async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) return 'denied';
    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch {
      return 'denied';
    }
  }

  public setToastListener(cb: (toast: ToastAlert) => void) {
    this.listener = cb;
  }

  public sendNotification(title: string, body: string, sound = true): void {
    if (sound) {
      soundEffects.playWaterDrop();
    }

    // Always trigger in-app toast notification for responsive visual feedback
    if (this.listener) {
      this.listener({
        id: Math.random().toString(36).substring(2, 9),
        title,
        body,
        timestamp: Date.now(),
      });
    }

    // Trigger system browser push notification if permitted
    if (this.isSupported() && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: 'cactusdrop-hydration-reminder',
        });
      } catch (err) {
        console.warn('Browser notification trigger failed:', err);
      }
    }
  }

  public sendTestReminder(sound = true) {
    this.sendNotification(
      'CactusDrop Reminder 💧',
      'This is a sample hydration reminder! Keep your cactus hydrated and happy.',
      sound
    );
  }

  public isWithinActiveHours(startTime: string, endTime: string): boolean {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);

    const startMinutes = (startH || 0) * 60 + (startM || 0);
    const endMinutes = (endH || 0) * 60 + (endM || 0);

    if (startMinutes <= endMinutes) {
      return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
    } else {
      // Overnight range (e.g. 22:00 to 06:00)
      return currentMinutes >= startMinutes || currentMinutes <= endMinutes;
    }
  }

  public startScheduleWatcher(
    settings: NotificationSettings,
    getLastDrinkTimestamp: () => number
  ) {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    if (!settings.enabled) return;

    // Check every 60 seconds
    this.intervalId = window.setInterval(() => {
      if (!settings.enabled) return;

      if (!this.isWithinActiveHours(settings.startTime, settings.endTime)) {
        return;
      }

      const lastDrinkTime = getLastDrinkTimestamp();
      const elapsedMinutes = (Date.now() - lastDrinkTime) / (1000 * 60);

      if (elapsedMinutes >= settings.frequencyMinutes) {
        const randomMsg = REMINDER_MESSAGES[Math.floor(Math.random() * REMINDER_MESSAGES.length)];
        this.sendNotification('Hydration Reminder 🌵', randomMsg, settings.sound);
      }
    }, 60000);
  }

  public stopScheduleWatcher() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

export const notificationManager = new NotificationManager();
