import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        px-3 py-1.5 text-sm font-medium transition-colors duration-200 border
        ${isDark 
          ? 'bg-white/20 border-white/30 text-white hover:bg-white/30' 
          : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
        }
      `}
    >
      {isDark ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
    </button>
  );
};

export default ThemeToggle;
