
import React from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import Navigation from './Navigation';
import { useIsMobile } from '@/hooks/use-mobile';

interface SidebarProps {
  mobileMenuOpen?: boolean;
  setMobileMenuOpen?: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ mobileMenuOpen = false, setMobileMenuOpen = () => {} }) => {
  const isMobile = useIsMobile();

  const handleNavigationClick = () => {
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  };

  // Mobile sidebar using Sheet component
  if (isMobile) {
    return (
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <div className="h-full flex flex-col">
            <div className="p-4 mb-6 flex justify-center">
              <img 
                src="/lovable-uploads/b3a4f946-cb80-4ff5-9096-718b92e2e94a.png" 
                alt="ANOR Logo" 
                className="h-16 transition-transform hover:scale-105 duration-300" 
              />
            </div>
            <Navigation onItemClick={handleNavigationClick} />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop sidebar
  return (
    <aside className="hidden md:block w-64 bg-white border-r border-gray-200 p-4 shadow-md">
      <div className="mb-6 flex justify-center">
        <img 
          src="/lovable-uploads/b3a4f946-cb80-4ff5-9096-718b92e2e94a.png" 
          alt="ANOR Logo" 
          className="h-16 transition-transform hover:scale-105 duration-300" 
        />
      </div>
      <Navigation />
    </aside>
  );
};

export default Sidebar;
