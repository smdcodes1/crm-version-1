const listeners = new Set();

export async function requestNotificationPermission() {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }
  try {
    return await Notification.requestPermission();
  } catch {
    return 'denied';
  }
}

export function subscribeToNotifications(listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function triggerNotification(title, body, type = 'followup') {
  const notif= {
    id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    title,
    body,
    type,
    timestamp: new Date().toISOString(),
    read: false,
  };

  // 1. Try Browser Notification API
  if (typeof window !== 'undefined' && 'Notification' in window) {
    if (Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: '/favicon.ico',
        });
      } catch (err) {
        console.warn('Native notification failed, falling back to in-app notification', err);
      }
    }
  }

  // 2. Broadcast to In-App notification system
  listeners.forEach((listener) => listener(notif));

  return notif;
}