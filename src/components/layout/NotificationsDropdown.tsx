import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, Circle } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const NotificationsDropdown = () => {
  const { notifications, markNotificationAsRead, getUnreadNotificationsCount } = useData();
  const unreadCount = getUnreadNotificationsCount();
  const hasUnreadNotifications = unreadCount > 0;

  const handleNotificationClick = (id: string) => {
    markNotificationAsRead(id);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative">
          <Bell className="h-5 w-5 text-gray-500" />
          {hasUnreadNotifications && (
            <Badge className="absolute -top-1 -right-1 rounded-full px-2 py-0.5 text-xs font-bold bg-red-500 text-white">
              {unreadCount}
            </Badge>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 mr-2">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              onClick={() => handleNotificationClick(notification.id)}
              className="flex items-start space-x-2"
            >
              <div>
                <div className="text-sm font-medium">{notification.message}</div>
                <div className="text-xs text-gray-500">{new Date(notification.date).toLocaleDateString()}</div>
              </div>
              {!notification.lue && (
                <Circle className="h-2 w-2 ml-auto text-blue-500" fill="blue" />
              )}
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem className="justify-center">
            Pas de nouvelles notifications
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsDropdown;
