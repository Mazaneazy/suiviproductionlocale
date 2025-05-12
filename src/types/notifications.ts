
import { type User } from './users';

export interface Notification {
  id: string;
  message: string;
  date: string;
  lue: boolean;
  type: 'info' | 'warning' | 'error' | 'success';
  lienDossier?: string;
  userId?: string;
  titre?: string;
  lien?: string;
  dateCreation?: string;
  lu?: boolean;
}

export interface NotificationContextType {
  notifications: Notification[];
  markNotificationAsRead: (id: string) => void;
  getUnreadNotificationsCount: () => number;
  addNotification?: (notification: Omit<Notification, 'id' | 'date'>) => void;
}
