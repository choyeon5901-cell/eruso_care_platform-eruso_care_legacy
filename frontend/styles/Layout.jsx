import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/layout.css';

/* ── App Header ── */
export function AppHeader({ title, showBack = false, right }) {
  const navigate = useNavigate();

  return (
    <header className="app-header">
      {showBack ? (
        <button className="header-back-btn" onClick={() => navigate(-1)}>
          ←
        </button>
      ) : (
        <a href="/" className="header-logo">
          <div className="header-logo-icon">💊</div>
          <span className="header-logo-text">약<span>픽</span></span>
        </a>
      )}

      {title && (
        <>
          <span className="header-spacer" />
          <h1 className="header-title">{title}</h1>
        </>
      )}
      <span className="header-spacer" />
      {right && <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>{right}</div>}
    </header>
  );
}

/* ── Bottom Navigation ── */
const NAV_ITEMS = [
  { path: '/',         icon: '🏠', label: '홈' },
  { path: '/map',      icon: '🗺️', label: '약국 찾기' },
  { path: '/orders',   icon: '📋', label: '주문' },
  { path: '/upload',   icon: '📄', label: '처방전' },
  { path: '/profile',  icon: '👤', label: '내 정보' },
];

export function BottomNav({ pendingCount = 0 }) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="bottom-nav">
      {NAV_ITEMS.map(({ path, icon, label }) => {
        const active = location.pathname === path ||
                      (path !== '/' && location.pathname.startsWith(path));
        return (
          <button
            key={path}
            className={`bottom-nav-item${active ? ' active' : ''}`}
            onClick={() => navigate(path)}
          >
            <span className="nav-icon">{icon}</span>
            {label === '주문' && pendingCount > 0 && (
              <span className="nav-badge">{pendingCount > 9 ? '9+' : pendingCount}</span>
            )}
            <span>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}

/* ── Bottom Sheet ── */
export function BottomSheet({ children, onClose }) {
  return (
    <div className="bottom-sheet-overlay" onClick={onClose}>
      <div className="bottom-sheet" onClick={e => e.stopPropagation()}>
        <div className="bottom-sheet-handle" />
        {children}
      </div>
    </div>
  );
}

/* ── Section Header ── */
export function SectionHeader({ title, link, onLinkClick }) {
  return (
    <div className="section-header">
      <h2 className="section-title">{title}</h2>
      {link && (
        <button className="section-link" onClick={onLinkClick}>
          {link} →
        </button>
      )}
    </div>
  );
}
