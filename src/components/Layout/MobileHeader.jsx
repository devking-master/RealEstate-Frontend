import React from 'react';
import { Menu, Zap } from 'lucide-react';
import './Layout.css';

const MobileHeader = ({ onMenuClick }) => {
  return (
    <header className="mobile-header">
      <div className="mobile-logo-group">
        <div className="sidebar-logo">
          <Zap size={18} fill="currentColor" />
        </div>
        <span className="sidebar-brand visible">EstatePro</span>
      </div>
      <button className="menu-toggle" onClick={onMenuClick}>
        <Menu size={24} />
      </button>
    </header>
  );
};

export default MobileHeader;
