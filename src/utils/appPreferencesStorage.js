import { DEFAULT_LOCALE, isSupportedLocale, htmlLangForLocale } from '../i18n/localeMeta.js';

const KEY = 'thompbui_preferences';

const DEFAULTS = {
  theme: 'dark',
  locale: DEFAULT_LOCALE,
};

export function loadAppPreferences() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULTS };
    const parsed = JSON.parse(raw);
    return {
      theme: parsed.theme === 'light' ? 'light' : 'dark',
      locale: isSupportedLocale(parsed.locale) ? parsed.locale : DEFAULT_LOCALE,
    };
  } catch {
    return { ...DEFAULTS };
  }
}

export function saveAppPreferences(prefs) {
  const current = loadAppPreferences();
  const next = { ...current, ...prefs };
  if (next.locale && !isSupportedLocale(next.locale)) next.locale = DEFAULT_LOCALE;
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function applyThemeToDocument(theme) {
  document.documentElement.setAttribute('data-theme', theme === 'light' ? 'light' : 'dark');
}

export function applyLocaleToDocument(locale) {
  document.documentElement.lang = htmlLangForLocale(locale);
}
