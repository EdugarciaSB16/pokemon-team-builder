import { useEffect } from 'react';
import { useTeamStore } from '@/features/team/store';
import Notification from './Notification';

export default function NotificationProvider() {
  const { notification, clearNotification } = useTeamStore();

  useEffect(() => {
    if (notification?.duration) {
      const timer = setTimeout(clearNotification, notification.duration);
      return () => clearTimeout(timer);
    }
  }, [notification, clearNotification]);

  if (!notification) return null;

  return (
    <Notification notification={notification} onClose={clearNotification} />
  );
}
