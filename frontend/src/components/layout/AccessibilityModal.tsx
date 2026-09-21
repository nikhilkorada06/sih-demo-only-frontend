import React from 'react';
import {
  Type,
  Eye,
  Sliders,
  RotateCcw,
  BookOpen,
  Pause,
  Check,
  Link as LinkIcon
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useAccessibility, FontSizeOption } from '../../context/AccessibilityContext';

interface AccessibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccessibilityModal: React.FC<AccessibilityModalProps> = ({ isOpen, onClose }) => {
  const {
    fontSize,
    setFontSize,
    contrast,
    setContrast,
    dyslexiaFont,
    toggleDyslexiaFont,
    enhancedSpacing,
    toggleEnhancedSpacing,
    highlightLinks,
    toggleHighlightLinks,
    pauseAnimations,
    togglePauseAnimations,
    resetAccessibility
  } = useAccessibility();

  const fontOptions: { key: FontSizeOption; label: string; scale: string }[] = [
    { key: 'sm', label: 'Small (90%)', scale: 'A-' },
    { key: 'md', label: 'Default (100%)', scale: 'A' },
    { key: 'lg', label: 'Large (112%)', scale: 'A+' },
    { key: 'xl', label: 'Extra Large (125%)', scale: 'A++' }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Accessibility & Display Options"
      subtitle="Customize text size, contrast, typography, and motion across the portal"
      maxWidth="md"
    >
      <div className="space-y-6">
        {/* 1. Font Size Scaling (Increase / Decrease text) */}
        <div>
          <label className="text-xs font-bold text-gov-blue uppercase tracking-wide flex items-center gap-1.5 mb-2.5">
            <Type size={16} className="text-gov-blue" />
            <span>Text Size Adjustment (Font Scaling)</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {fontOptions.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setFontSize(opt.key)}
                className={`p-3 rounded-lg border text-center transition-all cursor-pointer ${
                  fontSize === opt.key
                    ? 'border-gov-blue bg-gov-lightblue text-gov-blue font-bold shadow-xs'
                    : 'border-gov-border hover:bg-gov-surface text-gov-textPrimary'
                }`}
              >
                <div className="text-lg font-bold">{opt.scale}</div>
                <div className="text-[11px] text-gov-textSecondary mt-0.5">{opt.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 2. High Contrast Mode */}
        <div>
          <label className="text-xs font-bold text-gov-blue uppercase tracking-wide flex items-center gap-1.5 mb-2.5">
            <Eye size={16} className="text-gov-blue" />
            <span>Color Contrast</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setContrast('normal')}
              className={`p-3 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                contrast === 'normal'
                  ? 'border-gov-blue bg-gov-lightblue text-gov-blue font-bold shadow-xs'
                  : 'border-gov-border hover:bg-gov-surface text-gov-textPrimary'
              }`}
            >
              <div>
                <div className="text-xs font-bold">Standard Colors</div>
                <div className="text-[11px] text-gov-textSecondary">Default government theme</div>
              </div>
              {contrast === 'normal' && <Check size={16} className="text-gov-blue" />}
            </button>

            <button
              onClick={() => setContrast('high')}
              className={`p-3 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                contrast === 'high'
                  ? 'border-yellow-400 bg-black text-yellow-300 font-bold shadow-xs'
                  : 'border-gov-border hover:bg-gov-surface text-gov-textPrimary'
              }`}
            >
              <div>
                <div className="text-xs font-bold">High Contrast</div>
                <div className="text-[11px] text-gov-textSecondary">WCAG AAA compliant dark</div>
              </div>
              {contrast === 'high' && <Check size={16} className="text-yellow-400" />}
            </button>
          </div>
        </div>

        {/* 3. Typography, Spacing & Motion Options */}
        <div className="space-y-3 pt-1 border-t border-gov-border">
          <label className="text-xs font-bold text-gov-blue uppercase tracking-wide flex items-center gap-1.5">
            <Sliders size={16} className="text-gov-blue" />
            <span>Reading & Motion Preferences</span>
          </label>

          {/* Dyslexia Toggle */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-gov-surface border border-gov-border">
            <div className="flex items-center gap-3">
              <BookOpen size={18} className="text-gov-blue" />
              <div>
                <p className="text-xs font-bold text-gov-textPrimary">Dyslexia Friendly Font</p>
                <p className="text-[11px] text-gov-textSecondary">Use weighted baseline letterforms</p>
              </div>
            </div>
            <input
              type="checkbox"
              aria-label="Dyslexia Friendly Font"
              checked={dyslexiaFont}
              onChange={toggleDyslexiaFont}
              className="w-4 h-4 text-gov-blue rounded focus:ring-gov-blue cursor-pointer"
            />
          </div>

          {/* Enhanced Spacing & Line Height */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-gov-surface border border-gov-border">
            <div className="flex items-center gap-3">
              <Type size={18} className="text-gov-blue" />
              <div>
                <p className="text-xs font-bold text-gov-textPrimary">Enhanced Text Spacing & Line Height</p>
                <p className="text-[11px] text-gov-textSecondary">Expands line height and letter tracking</p>
              </div>
            </div>
            <input
              type="checkbox"
              aria-label="Enhanced Text Spacing & Line Height"
              checked={enhancedSpacing}
              onChange={toggleEnhancedSpacing}
              className="w-4 h-4 text-gov-blue rounded focus:ring-gov-blue cursor-pointer"
            />
          </div>

          {/* Highlight Links */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-gov-surface border border-gov-border">
            <div className="flex items-center gap-3">
              <LinkIcon size={18} className="text-gov-blue" />
              <div>
                <p className="text-xs font-bold text-gov-textPrimary">Highlight Links</p>
                <p className="text-[11px] text-gov-textSecondary">High-visibility underline on clickable links</p>
              </div>
            </div>
            <input
              type="checkbox"
              aria-label="Highlight Links"
              checked={highlightLinks}
              onChange={toggleHighlightLinks}
              className="w-4 h-4 text-gov-blue rounded focus:ring-gov-blue cursor-pointer"
            />
          </div>

          {/* Pause Animations Toggle */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-gov-surface border border-gov-border">
            <div className="flex items-center gap-3">
              <Pause size={18} className="text-gov-blue" />
              <div>
                <p className="text-xs font-bold text-gov-textPrimary">Pause Animations & Videos</p>
                <p className="text-[11px] text-gov-textSecondary">Halts carousel motion and background video</p>
              </div>
            </div>
            <input
              type="checkbox"
              aria-label="Pause Animations & Videos"
              checked={pauseAnimations}
              onChange={togglePauseAnimations}
              className="w-4 h-4 text-gov-blue rounded focus:ring-gov-blue cursor-pointer"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gov-border">
          <button
            onClick={resetAccessibility}
            className="flex items-center gap-1.5 text-xs text-gov-textSecondary hover:text-gov-blue transition-colors cursor-pointer"
          >
            <RotateCcw size={14} />
            <span>Reset to Default</span>
          </button>
          <Button variant="primary" size="sm" onClick={onClose}>
            Apply & Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
