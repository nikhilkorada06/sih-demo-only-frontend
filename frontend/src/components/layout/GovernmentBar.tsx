import React from 'react';
import { Globe, Accessibility, Moon, Sun, Bot } from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { useLanguage, Language } from '../../context/LanguageContext';
import { ASSETS } from '../../assets/assets';
import { Link } from 'react-router-dom';

interface GovernmentBarProps {
  onOpenAccessibilityModal: () => void;
}

export const GovernmentBar: React.FC<GovernmentBarProps> = ({ onOpenAccessibilityModal }) => {
  const { theme, toggleTheme } = useAccessibility();
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="bg-gov-blue text-white text-xs border-b border-gov-dark/40 select-none">
      <div className="max-w-portal mx-auto px-4 sm:px-6 lg:px-8 min-h-14 py-2 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2">
        {/* Left: Government of Maharashtra | Official Digital India Logo */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          <div className="flex items-center gap-2 font-medium tracking-wide text-xs sm:text-[13px]">
            <span className="font-semibold text-white whitespace-nowrap">{t('gov.state')}</span>
            <span className="text-blue-200 opacity-60">|</span>
            <img
              src={ASSETS.digitalIndia}
              alt="Digital India"
              className="h-8 sm:h-9 w-16 sm:w-20 object-contain rounded-md bg-white p-1"
            />
          </div>
        </div>

        {/* Right: Reference Utilities (Accessibility, Moon/Sun, Language, Chatbot) */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs ml-auto">
          {/* 1. Accessibility Control (Person / Accessibility Icon) */}
          <button
            onClick={onOpenAccessibilityModal}
            className="flex items-center gap-1.5 px-2 py-1 rounded bg-black/20 hover:bg-black/35 text-white border border-white/20 transition-colors cursor-pointer"
            title="Accessibility Menu"
            aria-label="Open Accessibility Menu"
          >
            <Accessibility className="w-4 h-4" />
            <span className="text-[11px] hidden md:inline">Accessibility</span>
          </button>

          {/* 2. Dark Mode Toggle (Moon in light mode, Sun in dark mode) */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1.5 px-2 py-1 rounded bg-black/20 hover:bg-black/35 text-white border border-white/20 transition-colors cursor-pointer"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme Mode"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-yellow-300" />
                <span className="text-[11px] hidden sm:inline">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-blue-100" />
                <span className="text-[11px] hidden sm:inline">Dark</span>
              </>
            )}
          </button>

          {/* 3. Language Selector (English / हिन्दी / मराठी) */}
          <div className="flex items-center gap-1 bg-black/20 px-2 py-0.5 rounded border border-white/20">
            <Globe className="w-4 h-4 text-blue-200" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="bg-transparent text-white text-xs font-medium focus:outline-none cursor-pointer py-0.5"
              aria-label="Select Portal Language"
            >
              <option value="en" className="text-black bg-white">English</option>
              <option value="hi" className="text-black bg-white">हिन्दी</option>
              <option value="mr" className="text-black bg-white">मराठी</option>
            </select>
          </div>

          {/* 4. Chatbot / Help Control */}
          <Link
            to="/help"
            className="flex items-center gap-1 px-2 py-1 rounded bg-black/20 hover:bg-black/35 text-white border border-white/20 transition-colors cursor-pointer"
            title="Citizen Chatbot & Help"
            aria-label="Chatbot and Help Support"
          >
            <Bot className="w-4 h-4 text-blue-100" />
            <span className="text-[11px] hidden sm:inline">Help</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
