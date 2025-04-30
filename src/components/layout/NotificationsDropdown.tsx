
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Check } from 'lucide-react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useData } from '../../contexts/DataContext';

const NotificationsDropdown: React.FC = () => {
  const { notifications, markNotificationAsRead, getUnreadNotificationsCount } = useData();
  const navigate = useNavigate();

  const handleNotificationClick = (notif: any) => {
    markNotificationAsRead(notif.id);
    if (notif.link) {
      navigate(notif.link);
    }
  };

  const unreadCount = getUnreadNotificationsCount();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-certif-red rounded-full w-5 h-5 flex items-center justify-center text-white text-xs">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length > 0 ? (
          notifications.slice(0, 5).map((notif) => (
            <DropdownMenuItem 
              key={notif.id} 
              className={`flex flex-col items-start p-3 ${!notif.lue ? 'bg-certif-lightblue' : ''}`}
              onClick={() => handleNotificationClick(notif)}
            >
              <div className="flex justify-between w-full">
                <span className={`text-sm font-medium ${notif.type === 'warning' ? 'text-certif-yellow' : notif.type === 'alert' ? 'text-certif-red' : 'text-certif-blue'}`}>
                  {notif.type === 'warning' ? 'Attention' : notif.type === 'alert' ? 'Alerte' : 'Information'}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(notif.date).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm mt-1">{notif.message}</p>
              {!notif.lue && (
                <div className="flex justify-end w-full mt-1">
                  <span className="text-xs text-certif-blue flex items-center">
                    <Check size={12} className="mr-1" /> Cliquer pour marquer comme lu
                  </span>
                </div>
              )}
            </DropdownMenuItem>
          ))
        ) : (
          <div className="p-3 text-center text-gray-500">
            Aucune notification
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsDropdown;
