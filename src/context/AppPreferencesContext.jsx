import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import {
  loadAppPreferences,
  saveAppPreferences,
  applyThemeToDocument,
  applyLocaleToDocument,
} from '../utils/appPreferencesStorage.js';
import { createTranslator, LOCALE_META } from '../i18n/index.js';

const AppPreferencesContext = createContext(null);

export function AppPreferencesProvider({ children }) {
  const [prefs, setPrefs] = useState(() => loadAppPreferences());

  useEffect(() => {
    applyThemeToDocument(prefs.theme);
    applyLocaleToDocument(prefs.locale);
  }, [prefs.theme, prefs.locale]);

  const setTheme = useCallback((theme) => {
    setPrefs(() => saveAppPreferences({ theme }));
  }, []);

  const setLocale = useCallback((locale) => {
    setPrefs(() => saveAppPreferences({ locale }));
  }, []);

  const t = useMemo(() => createTranslator(prefs.locale), [prefs.locale]);

  const value = {
    theme: prefs.theme,
    locale: prefs.locale,
    locales: LOCALE_META,
    setTheme,
    setLocale,
    t,
    isLight: prefs.theme === 'light',
  };

  return <AppPreferencesContext.Provider value={value}>{children}</AppPreferencesContext.Provider>;
}

export function useAppPreferences() {
  const ctx = useContext(AppPreferencesContext);
  if (!ctx) throw new Error('useAppPreferences must be used within AppPreferencesProvider');
  return ctx;
}
