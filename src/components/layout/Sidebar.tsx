
import React from 'react';
import Navigation from './Navigation';

const Sidebar: React.FC = () => {
  return (
    <aside className="hidden md:block w-64 bg-white border-r border-gray-200 p-4">
      <Navigation />
    </aside>
  );
};

export default Sidebar;
