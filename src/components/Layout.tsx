
import React, { useState, useEffect } from 'react';
import Header from './layout/Header';
import Sidebar from './layout/Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  
  // Fermer le menu mobile quand on change de page ou quand l'écran devient plus grand
  useEffect(() => {
    if (!isMobile) {
      setMobileMenuOpen(false);
    }
  }, [isMobile]);

  return (
    <div className="min-h-screen bg-certif-lightgray flex flex-col">
      <Header 
        mobileMenuOpen={mobileMenuOpen} 
        setMobileMenuOpen={setMobileMenuOpen} 
      />

      <div className="flex-1 flex relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-grid-certif-blue/30" />
        </div>
        
        <Sidebar />

        <main className={`flex-1 p-4 md:p-8 overflow-auto transition-all duration-300 ${mobileMenuOpen && isMobile ? 'opacity-50' : 'opacity-100'}`}>
          <div className="container mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
