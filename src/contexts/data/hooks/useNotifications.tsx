
import { useState, useCallback, useMemo } from 'react';
import { Notification } from '../../../types';
import { MOCK_NOTIFICATIONS } from '../mockData';

export function useNotifications() {
  // Utiliser useMemo pour éviter des calculs inutiles à chaque rendu
  const initialNotifications = useMemo(() => {
    return MOCK_NOTIFICATIONS.map(notif => ({
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
  }, []);
  
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  // Utiliser useCallback pour mémoriser les fonctions
  const markNotificationAsRead = useCallback((id: string) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notif => 
        notif.id === id ? { ...notif, lue: true } : notif
      )
    );
  }, []);

  const getUnreadNotificationsCount = useCallback(() => {
    return notifications.filter(notif => !notif.lue).length;
  }, [notifications]);

  // Nouvelle fonction pour ajouter une notification
  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'date'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      date: new Date().toISOString(),
      lue: false
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  // Nouvelle fonction pour filtrer les notifications
  const filterNotificationsByType = useCallback((type: 'info' | 'warning' | 'error' | 'success') => {
    return notifications.filter(notif => notif.type === type);
  }, [notifications]);

  return {
    notifications,
    markNotificationAsRead,
    getUnreadNotificationsCount,
    addNotification,
    filterNotificationsByType
  };
}
