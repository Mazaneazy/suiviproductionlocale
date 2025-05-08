
import React from 'react';
import Navigation from './Navigation';
import { useIsMobile } from '@/hooks/use-mobile';

const Sidebar: React.FC = () => {
  const isMobile = useIsMobile();
  
  // Si nous sommes sur mobile, ne pas rendre le sidebar car il sera affiché dans le menu
  if (isMobile) return null;
  
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
