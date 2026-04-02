import React from 'react';
import theme from '../styles/theme';

export default function AppHeader({ title, rightAction }) {
  return (
    <div
      style={{
        height: theme.layout.headerHeight,
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(10px)',
        borderBottom: `1px solid ${theme.colors.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 18px',
        position: 'sticky',
        top: 0,
        zIndex: 20,
      }}
    >
      <div
        style={{
          fontSize: 20,
          fontWeight: 800,
          color: theme.colors.text,
          letterSpacing: '-0.3px',
        }}
      >
        {title}
      </div>
      <div>{rightAction}</div>
    </div>
  );
}
