
import { useState } from 'react';
import { Notification } from '../../../types';
import { MOCK_NOTIFICATIONS } from '../mockData';

export function useNotifications() {
  // Map the notifications to the correct interface
  const mappedNotifications: Notification[] = MOCK_NOTIFICATIONS.map(notif => ({
    id: notif.id,
    message: notif.message,
    date: notif.dateCreation || new Date().toISOString(),
    lue: notif.lu !== undefined ? notif.lu : false,
    type: (notif.type as 'info' | 'warning' | 'error' | 'success') || 'info',
    lienDossier: notif.lien,
    userId: notif.userId,
    titre: notif.titre,
    lien: notif.lien,
    dateCreation: notif.dateCreation,
    lu: notif.lu
  }));
  
  const [notifications, setNotifications] = useState<Notification[]>(mappedNotifications);

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
