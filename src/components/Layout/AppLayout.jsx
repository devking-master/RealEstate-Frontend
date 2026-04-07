import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileHeader from './MobileHeader';
import './Layout.css';

const AppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      <MobileHeader onMenuClick={() => setIsSidebarOpen(true)} />
      
      {/* Sidebar Overlay for mobile */}
      <div 
        className={`sidebar-overlay ${isSidebarOpen ? 'visible' : ''}`} 
        onClick={() => setIsSidebarOpen(false)}
      />

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="main-wrapper">
        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
