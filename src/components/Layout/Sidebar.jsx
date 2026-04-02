import { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Building2, 
  Users, 
  Wallet, 
  FileText, 
  Receipt, 
  FolderOpen, 
  Settings,
  Zap,
  Bell,
  LogOut,
  ChevronRight,
  User,
  ExternalLink
} from 'lucide-react';
import './Layout.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const navItems = [
    { path: '/', label: 'Overview', icon: BarChart3 },
    { path: '/properties', label: 'Properties', icon: Building2 },
    { path: '/clients', label: 'Clients', icon: Users },
    { path: '/transactions', label: 'Transactions', icon: Wallet },
    { path: '/invoices', label: 'Invoices', icon: FileText },
    { path: '/receipts', label: 'Receipts', icon: Receipt },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Close drop-up when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
            <Zap size={18} fill="currentColor" />
        </div>
        <span className="sidebar-brand">EstatePro</span>
      </div>
      
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            {({ isActive }) => (
              <>
                <item.icon size={20} className="nav-item-icon" strokeWidth={isActive ? 2.5 : 2} />
                <span className="nav-label">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-action">
            <Bell size={20} className="nav-item-icon" />
            <span className="nav-label">Updates</span>
        </button>
        <NavLink to="/settings" className="nav-item">
            <Settings size={20} className="nav-item-icon" />
            <span className="nav-label">Settings</span>
        </NavLink>
        
        <div 
            className="sidebar-profile-container" 
            onMouseEnter={() => setIsProfileOpen(true)}
            onMouseLeave={() => setIsProfileOpen(false)}
            ref={profileRef}
        >
            {isProfileOpen && (
                <div className="drop-up-menu">
                    <div className="drop-up-header">
                        <p className="drop-up-user">Signed in as</p>
                        <p className="drop-up-email">admin@estatepro.com</p>
                    </div>
                    <div className="drop-up-divider"></div>
                    <button className="drop-up-item">
                        <User size={16} /> <span>View Profile</span>
                    </button>
                    <button className="drop-up-item">
                        <ExternalLink size={16} /> <span>Support</span>
                    </button>
                    <div className="drop-up-divider"></div>
                    <button onClick={handleLogout} className="drop-up-item logout">
                        <LogOut size={16} /> <span>Sign out</span>
                    </button>
                </div>
            )}
            
            <div className={`sidebar-profile-box ${isProfileOpen ? 'active' : ''}`}>
                <div className="avatar small">AD</div>
                <div className="user-details nav-label">
                    <span className="user-name">Admin</span>
                    <ChevronRight size={14} className={`profile-chevron ${isProfileOpen ? 'rotate' : ''}`} />
                </div>
            </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
