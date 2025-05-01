
import React from 'react';
import Navigation from './Navigation';

const Sidebar: React.FC = () => {
  return (
    <aside className="hidden md:block w-64 bg-white border-r border-gray-200 p-4 shadow-sm">
      <div className="mb-6 flex justify-center">
        <img 
          src="/lovable-uploads/b3a4f946-cb80-4ff5-9096-718b92e2e94a.png" 
          alt="ANOR Logo" 
          className="h-16" 
        />
      </div>
      <Navigation />
    </aside>
  );
};

export default Sidebar;
