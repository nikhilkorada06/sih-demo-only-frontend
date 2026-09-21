import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type FontSizeOption = 'sm' | 'md' | 'lg' | 'xl';
export type ContrastOption = 'normal' | 'high';
export type ThemeMode = 'light' | 'dark';

interface AccessibilityState {
  theme: ThemeMode;
  fontSize: FontSizeOption;
  contrast: ContrastOption;
  dyslexiaFont: boolean;
  enhancedSpacing: boolean;
  highlightLinks: boolean;
  pauseAnimations: boolean;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setFontSize: (size: FontSizeOption) => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  setContrast: (contrast: ContrastOption) => void;
  toggleContrast: () => void;
  setDyslexiaFont: (enabled: boolean) => void;
  toggleDyslexiaFont: () => void;
  setEnhancedSpacing: (enabled: boolean) => void;
  toggleEnhancedSpacing: () => void;
  setHighlightLinks: (enabled: boolean) => void;
  toggleHighlightLinks: () => void;
  setPauseAnimations: (paused: boolean) => void;
  togglePauseAnimations: () => void;
  resetAccessibility: () => void;
}

const STORAGE_KEY = 'mahasetu_a11y_prefs';
const THEME_STORAGE_KEY = 'mahasetu_theme_pref';

const defaultState = {
  theme: 'light' as ThemeMode,
  fontSize: 'md' as FontSizeOption,
  contrast: 'normal' as ContrastOption,
  dyslexiaFont: false,
  enhancedSpacing: false,
  highlightLinks: false,
  pauseAnimations: false
};

const AccessibilityContext = createContext<AccessibilityState | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
    } catch {}
    return defaultState.theme;
  });

  const [fontSize, setFontSizeState] = useState<FontSizeOption>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.fontSize || defaultState.fontSize;
      }
    } catch {}
    return defaultState.fontSize;
  });

  const [contrast, setContrastState] = useState<ContrastOption>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.contrast || defaultState.contrast;
      }
    } catch {}
    return defaultState.contrast;
  });

  const [dyslexiaFont, setDyslexiaFontState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return !!parsed.dyslexiaFont;
      }
    } catch {}
    return defaultState.dyslexiaFont;
  });

  const [enhancedSpacing, setEnhancedSpacingState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return !!parsed.enhancedSpacing;
      }
    } catch {}
    return defaultState.enhancedSpacing;
  });

  const [highlightLinks, setHighlightLinksState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return !!parsed.highlightLinks;
      }
    } catch {}
    return defaultState.highlightLinks;
  });

  const [pauseAnimations, setPauseAnimationsState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return !!parsed.pauseAnimations;
      }
    } catch {}
    return defaultState.pauseAnimations;
  });

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          fontSize,
          contrast,
          dyslexiaFont,
          enhancedSpacing,
          highlightLinks,
          pauseAnimations
        })
      );
    } catch {}
  }, [theme, fontSize, contrast, dyslexiaFont, enhancedSpacing, highlightLinks, pauseAnimations]);

  // Apply classes to documentElement
  useEffect(() => {
    const root = document.documentElement;

    // Dark Mode class
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Font size classes
    root.classList.remove('text-size-sm', 'text-size-md', 'text-size-lg', 'text-size-xl');
    root.classList.add(`text-size-${fontSize}`);

    // Contrast classes
    if (contrast === 'high') {
      root.classList.add('contrast-high');
    } else {
      root.classList.remove('contrast-high');
    }

    // Dyslexia friendly font
    if (dyslexiaFont) {
      root.classList.add('dyslexia-font');
    } else {
      root.classList.remove('dyslexia-font');
    }

    // Enhanced Spacing
    if (enhancedSpacing) {
      root.classList.add('enhanced-spacing');
    } else {
      root.classList.remove('enhanced-spacing');
    }

    // Highlight Links
    if (highlightLinks) {
      root.classList.add('highlight-links');
    } else {
      root.classList.remove('highlight-links');
    }

    // Pause animations & videos
    if (pauseAnimations) {
      root.classList.add('pause-animations');
      document.querySelectorAll<HTMLVideoElement>('video').forEach((video) => {
        try {
          video.pause();
        } catch {}
      });
    } else {
      root.classList.remove('pause-animations');
      document.querySelectorAll<HTMLVideoElement>('video[autoplay]').forEach((video) => {
        try {
          video.play();
        } catch {}
      });
    }
  }, [theme, fontSize, contrast, dyslexiaFont, enhancedSpacing, highlightLinks, pauseAnimations]);

  const fontLevels: FontSizeOption[] = ['sm', 'md', 'lg', 'xl'];

  const increaseFontSize = () => {
    const currentIndex = fontLevels.indexOf(fontSize);
    if (currentIndex < fontLevels.length - 1) {
      setFontSizeState(fontLevels[currentIndex + 1]);
    }
  };

  const decreaseFontSize = () => {
    const currentIndex = fontLevels.indexOf(fontSize);
    if (currentIndex > 0) {
      setFontSizeState(fontLevels[currentIndex - 1]);
    }
  };

  const setTheme = (t: ThemeMode) => setThemeState(t);
  const toggleTheme = () => setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  const setFontSize = (size: FontSizeOption) => setFontSizeState(size);
  const setContrast = (c: ContrastOption) => setContrastState(c);
  const toggleContrast = () => setContrastState((prev) => (prev === 'normal' ? 'high' : 'normal'));
  const setDyslexiaFont = (d: boolean) => setDyslexiaFontState(d);
  const toggleDyslexiaFont = () => setDyslexiaFontState((prev) => !prev);
  const setEnhancedSpacing = (e: boolean) => setEnhancedSpacingState(e);
  const toggleEnhancedSpacing = () => setEnhancedSpacingState((prev) => !prev);
  const setHighlightLinks = (h: boolean) => setHighlightLinksState(h);
  const toggleHighlightLinks = () => setHighlightLinksState((prev) => !prev);
  const setPauseAnimations = (p: boolean) => setPauseAnimationsState(p);
  const togglePauseAnimations = () => setPauseAnimationsState((prev) => !prev);

  const resetAccessibility = () => {
    setThemeState(defaultState.theme);
    setFontSizeState(defaultState.fontSize);
    setContrastState(defaultState.contrast);
    setDyslexiaFontState(defaultState.dyslexiaFont);
    setEnhancedSpacingState(defaultState.enhancedSpacing);
    setHighlightLinksState(defaultState.highlightLinks);
    setPauseAnimationsState(defaultState.pauseAnimations);
  };

  return (
    <AccessibilityContext.Provider
      value={{
        theme,
        fontSize,
        contrast,
        dyslexiaFont,
        enhancedSpacing,
        highlightLinks,
        pauseAnimations,
        setTheme,
        toggleTheme,
        setFontSize,
        increaseFontSize,
        decreaseFontSize,
        setContrast,
        toggleContrast,
        setDyslexiaFont,
        toggleDyslexiaFont,
        setEnhancedSpacing,
        toggleEnhancedSpacing,
        setHighlightLinks,
        toggleHighlightLinks,
        setPauseAnimations,
        togglePauseAnimations,
        resetAccessibility
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = (): AccessibilityState => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
