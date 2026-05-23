import en from './en.js';
import vi from './vi.js';
import zhCN from './zh-CN.js';
import ja from './ja.js';
import es from './es.js';
import pt from './pt.js';
import ko from './ko.js';
import { deepMerge } from './deepMerge.js';
import { DEFAULT_LOCALE, isSupportedLocale } from './localeMeta.js';

export { LOCALE_META, SUPPORTED_LOCALES, DEFAULT_LOCALE, isSupportedLocale, htmlLangForLocale } from './localeMeta.js';

const RAW = {
  en,
  vi,
  'zh-CN': zhCN,
  ja,
  es,
  pt,
  ko,
};

/** Resolved messages: non-English locales merged over English for missing keys. */
export function getLocaleMessages(code) {
  const key = isSupportedLocale(code) ? code : DEFAULT_LOCALE;
  if (key === 'en') return en;
  return deepMerge(en, RAW[key]);
}

export function createTranslator(locale) {
  const dict = getLocaleMessages(locale);
  return (key, vars) => {
    const parts = key.split('.');
    let cur = dict;
    for (const part of parts) {
      cur = cur?.[part];
    }
    if (typeof cur !== 'string') return key;
    if (!vars) return cur;
    return cur.replace(/\{(\w+)\}/g, (_, k) => (vars[k] != null ? String(vars[k]) : `{${k}}`));
  };
}
