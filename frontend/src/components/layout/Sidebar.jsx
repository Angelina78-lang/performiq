import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const Sidebar = ({ onClose = null }) => {
  const { user, logout } = useAuth();
  const loc = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/employees', label: 'Employees', icon: '👥' },
    { path: '/ai-recommendations', label: 'AI Insights', icon: '✨' },
    { path: '/analytics', label: 'Analytics', icon: '📈' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-mark">E</div>
        <div className="brand-text">
          Perform<span>IQ</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-label">Main</div>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${loc.pathname === item.path ? 'active' : ''}`}
            onClick={onClose}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-foot">
        <button
          onClick={() => {
            logout();
            onClose?.();
          }}
          style={{
            background: 'none',
            border: 'none',
            color: 'inherit',
            cursor: 'pointer',
            width: '100%',
            textAlign: 'left',
            padding: '8px 0',
            fontSize: 'inherit',
          }}
        >
          🚪 Logout
        </button>
        <div style={{ marginTop: '12px', fontSize: '10px', lineHeight: 1.4 }}>
          Logged in as <strong>{user?.name || 'User'}</strong>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
