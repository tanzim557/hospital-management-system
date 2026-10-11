import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import {
  PhoneCall,
  Sun,
  Moon,
  Sparkles,
  ArrowUp
} from 'lucide-react';

export default function FloatingDock() {
  const { theme, toggleTheme } = useTheme();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="floating-action-dock">
      {showScrollTop && (
        <button
          type="button"
          className="dock-pill-btn dock-top-btn"
          onClick={scrollToTop}
          title="Scroll to Top"
          aria-label="Scroll to Top"
        >
          <ArrowUp size={18} />
        </button>
      )}

      <button
        type="button"
        className="dock-pill-btn dock-theme-btn"
        onClick={toggleTheme}
        title={`Active theme: ${theme.toUpperCase()}. Click to switch theme`}
        aria-label="Switch Theme"
      >
        {theme === 'light' ? (
          <Sun size={15} style={{ color: '#f59e0b' }} />
        ) : theme === 'dark' ? (
          <Moon size={15} style={{ color: '#38bdf8' }} />
        ) : (
          <Sparkles size={15} style={{ color: '#0284c7' }} />
        )}
        <span>{theme === 'light' ? 'Light Theme' : theme === 'dark' ? 'Midnight Theme' : 'Royal Sapphire'}</span>
      </button>

      <a href="tel:1066" className="dock-pill-btn dock-emergency-btn" title="Instant Emergency 1066">
        <PhoneCall size={15} />
        <span>Emergency 1066</span>
      </a>
    </div>
  );
}
