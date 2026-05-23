/** Supported UI locales — English is the global default. */
export const LOCALE_META = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'zh-CN', label: '简体中文', short: 'ZH' },
  { code: 'ja', label: '日本語', short: 'JA' },
  { code: 'es', label: 'Español', short: 'ES' },
  { code: 'pt', label: 'Português', short: 'PT' },
  { code: 'ko', label: '한국어', short: 'KO' },
  { code: 'vi', label: 'Tiếng Việt', short: 'VI' },
];

export const SUPPORTED_LOCALES = LOCALE_META.map((l) => l.code);

export const DEFAULT_LOCALE = 'en';

export function isSupportedLocale(code) {
  return SUPPORTED_LOCALES.includes(code);
}

export function htmlLangForLocale(code) {
  const map = {
    en: 'en',
    vi: 'vi',
    'zh-CN': 'zh-Hans',
    ja: 'ja',
    es: 'es',
    pt: 'pt',
    ko: 'ko',
  };
  return map[code] ?? 'en';
}
