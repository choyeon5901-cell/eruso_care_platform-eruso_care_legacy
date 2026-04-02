import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import theme from '../styles/theme';

const tabs = [
  { label: '홈', path: '/home', icon: '🏠' },
  { label: '지도', path: '/map', icon: '📍' },
  { label: '주문', path: '/orders', icon: '📦' },
  { label: '메뉴', path: '/menu', icon: '☰' },
];

export default function BottomTab() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: theme.layout.maxWidth,
        height: theme.layout.bottomTabHeight,
        background: 'rgba(255,255,255,0.96)',
        borderTop: `1px solid ${theme.colors.border}`,
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 30,
        backdropFilter: 'blur(12px)',
      }}
    >
      {tabs.map((tab) => {
        const active = location.pathname === tab.path;
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            style={{
              border: 'none',
              background: 'transparent',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              color: active ? theme.colors.primary : theme.colors.subtext,
              fontWeight: active ? 700 : 500,
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: 22 }}>{tab.icon}</span>
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
