
import { Notification } from '../../../types';
import { generateId } from '../utils';

export const createNotification = (notification: Omit<Notification, 'id'>) => {
  return { ...notification, id: generateId() };
};

export const countUnreadNotifications = (notifications: Notification[]): number => {
  return notifications.filter(notif => !notif.lue).length;
};

export const markNotificationAsRead = (
  notifications: Notification[], 
  id: string
): Notification[] => {
  return notifications.map(notif => 
    notif.id === id ? { ...notif, lue: true } : notif
  );
};
