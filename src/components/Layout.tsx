import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Bell, FileText, FileCheck, ClipboardCheck, CreditCard, Home, BarChart, LogOut, User, Check, Inbox } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import { useToast } from '../hooks/use-toast';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentUser, logout, hasAccess } = useAuth();
  const { notifications, markNotificationAsRead, getUnreadNotificationsCount } = useData();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast({
      title: "Déconnexion réussie",
      description: "Vous avez été déconnecté avec succès.",
    });
    navigate('/login');
  };

  const handleNotificationClick = (notif: any) => {
    markNotificationAsRead(notif.id);
    if (notif.link) {
      navigate(notif.link);
    }
  };

  const unreadCount = getUnreadNotificationsCount();

  // Définir les liens de navigation avec les modules associés
  const navLinks = [
    { to: '/dashboard', icon: <Home size={20} />, label: 'Tableau de bord', module: null }, // Accessible à tous
    { to: '/accueil', icon: <Inbox size={20} />, label: 'Accueil', module: 'acceuil' },
    { to: '/dossiers', icon: <FileText size={20} />, label: 'Dossiers', module: 'dossiers' },
    { to: '/notes-frais', icon: <CreditCard size={20} />, label: 'Notes de frais', module: 'notes-frais' },
    { to: '/inspections', icon: <ClipboardCheck size={20} />, label: 'Inspections', module: 'inspections' },
    { to: '/certificats', icon: <FileCheck size={20} />, label: 'Certificats', module: 'certificats' },
    { to: '/statistiques', icon: <BarChart size={20} />, label: 'Statistiques', module: 'statistiques' },
    { to: '/responsable-technique', icon: <FileText size={20} />, label: 'Responsable Technique', module: 'responsable-technique' },
  ];

  // Filtrer les liens selon les droits d'accès de l'utilisateur
  const filteredNavLinks = navLinks.filter(link => 
    link.module === null || hasAccess(link.module)
  );

  // Adapter le titre du lien Dossier selon le rôle de l'utilisateur
  const adaptLinkLabels = (link: any) => {
    if (link.to === '/dossiers' && currentUser?.role === 'acceuil') {
      return 'Réception des dossiers';
    }
    return link.label;
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-certif-lightgray flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-2 px-4 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                  </svg>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="py-4">
                  <nav className="flex flex-col space-y-4">
                    {filteredNavLinks.map(link => (
                      <Link
                        key={link.to}
                        to={link.to}
                        className={`flex items-center space-x-2 py-2 px-3 rounded-md ${isActive(link.to) ? 'bg-certif-lightblue text-certif-blue font-medium' : 'hover:bg-gray-100'}`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.icon}
                        <span>{adaptLinkLabels(link)}</span>
                      </Link>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
            <Link to="/" className="text-xl font-bold text-certif-blue flex items-center">
              <FileCheck className="mr-2 text-certif-green" />
              CertifFlow
            </Link>
          </div>

          <div className="flex items-center space-x-4">
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

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar>
                    <AvatarImage src="" alt={currentUser?.name} />
                    <AvatarFallback>{currentUser?.name?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center">
                  <User className="mr-2" size={16} />
                  <span>{currentUser?.name}</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-sm text-muted-foreground">
                  Rôle: {currentUser?.role}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="flex items-center text-certif-red">
                  <LogOut className="mr-2" size={16} />
                  <span>Se déconnecter</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Sidebar - Hidden on mobile */}
        <aside className="hidden md:block w-64 bg-white border-r border-gray-200 p-4">
          <nav className="space-y-2">
            {filteredNavLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center space-x-2 py-2 px-3 rounded-md ${isActive(link.to) ? 'bg-certif-lightblue text-certif-blue font-medium' : 'hover:bg-gray-100'} transition-colors`}
              >
                {link.icon}
                <span>{adaptLinkLabels(link)}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
