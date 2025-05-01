
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';
import Navigation from './Navigation';
import NotificationsDropdown from './NotificationsDropdown';
import UserDropdown from './UserDropdown';

interface HeaderProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  return (
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
                <Navigation 
                  onItemClick={() => setMobileMenuOpen(false)} 
                />
              </div>
            </SheetContent>
          </Sheet>
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/b3a4f946-cb80-4ff5-9096-718b92e2e94a.png" 
              alt="ANOR Logo" 
              className="h-10 mr-3" 
            />
            <div className="flex flex-col">
              <span className="text-lg font-bold text-certif-blue">Suivi de la Certification</span>
              <span className="text-sm text-certif-blue">des Produits Locaux</span>
            </div>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <NotificationsDropdown />
          <UserDropdown />
        </div>
      </div>
    </header>
  );
};

export default Header;
