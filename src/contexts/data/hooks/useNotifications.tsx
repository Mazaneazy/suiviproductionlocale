
import { useState } from 'react';
import { Notification } from '../../../types';
import { MOCK_NOTIFICATIONS } from '../mockData';

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  const markNotificationAsRead = (id: string) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, lue: true } : notif
    ));
  };

  const getUnreadNotificationsCount = () => {
    return notifications.filter(notif => !notif.lue).length;
  };

  return {
    notifications,
    markNotificationAsRead,
    getUnreadNotificationsCount
  };
}
