import { useAuth } from '../../context/AuthContext.jsx';
import { initials } from '../../utils/helpers.js';

const Navbar = ({ pageTitle = 'Dashboard', pageSubtitle = '', onMenuToggle = null }) => {
  const { user } = useAuth();

  return (
    <nav className="navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {onMenuToggle && (
          <button 
            className="menu-toggle-desktop" 
            onClick={onMenuToggle}
            style={{
              fontSize: '18px',
              color: 'var(--text-soft)',
              width: '36px',
              height: '36px',
              background: 'var(--surface)',
              border: '1px solid var(--border-soft)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--brand)';
              e.currentTarget.style.background = 'var(--surface-3)';
              e.currentTarget.style.borderColor = 'var(--brand)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-soft)';
              e.currentTarget.style.background = 'var(--surface)';
              e.currentTarget.style.borderColor = 'var(--border-soft)';
            }}
            title="Toggle Sidebar"
          >
            ☰
          </button>
        )}
        <div className="navbar-title">
          <h2>{pageTitle}</h2>
          {pageSubtitle && <p>{pageSubtitle}</p>}
        </div>
      </div>

      <div className="navbar-right">

        <div className="user-chip">
          <div
            className="user-avatar"
            style={{
              background: `linear-gradient(135deg, #38bdf8, #6366f1)`,
            }}
          >
            {initials(user?.name)}
          </div>
          <div className="user-meta">
            <strong>{user?.name || 'User'}</strong>
            <span>{user?.role || 'admin'}</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
