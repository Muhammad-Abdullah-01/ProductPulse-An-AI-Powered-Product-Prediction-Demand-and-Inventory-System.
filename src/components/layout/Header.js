import React from 'react';
import { Search, Bell, Settings, ChevronDown, Menu } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function Header({ onMenuToggle }) {
  const { theme, toggle } = useTheme();

  return (
    <header className="header">
      {/* Mobile Hamburger */}
      <button className="hamburger" onClick={onMenuToggle} aria-label="Toggle menu">
        <span /><span /><span />
      </button>

      {/* Logo */}
      <div className="header-logo">
        <span className="header-logo-name">ProductPulse</span>
        <span className="header-logo-subtitle">AI Demand Intelligence</span>
      </div>

      {/* Theme Toggle */}
      <div className="theme-toggle" title="Toggle theme">
        <button className={`theme-btn ${theme === 'light' ? 'active' : ''}`} onClick={() => toggle('light')} aria-label="Light mode">☀️</button>
        <button className={`theme-btn ${theme === 'dark' ? 'active' : ''}`} onClick={() => toggle('dark')} aria-label="Dark mode">🌙</button>
      </div>

      {/* Search */}
      <div className="header-search">
        <Search size={15} className="header-search-icon" />
        <input type="text" placeholder="Search products, categories…" />
      </div>

      {/* Actions */}
      <div className="header-actions">
        <div className="tooltip-wrap">
          <button className="icon-btn" aria-label="Notifications">
            <Bell size={17} />
            <span className="notif-badge" />
          </button>
          <span className="tooltip-box">3 new alerts</span>
        </div>

        <div className="tooltip-wrap">
          <button className="icon-btn" aria-label="Settings">
            <Settings size={17} />
          </button>
          <span className="tooltip-box">System settings</span>
        </div>

        <div className="user-avatar-btn">
          <div className="user-avatar">AS</div>
          <span className="user-name">Alex S.</span>
          <ChevronDown size={13} style={{ color: 'var(--text-muted)' }} />
        </div>
      </div>
    </header>
  );
}
