const STORAGE_KEY = 'thompbui-ai-settings';

const DEFAULTS = {
  apiKey: '',
  apiBase: 'https://api.openai.com/v1',
  model: 'gpt-4o-mini',
};

export function loadAISettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
  const envKey = import.meta.env.VITE_AI_API_KEY || '';
  return {
    ...DEFAULTS,
    apiKey: envKey,
    apiBase: import.meta.env.VITE_AI_API_BASE || DEFAULTS.apiBase,
    model: import.meta.env.VITE_AI_MODEL || DEFAULTS.model,
  };
}

export function saveAISettings(settings) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      apiKey: settings.apiKey?.trim() || '',
      apiBase: (settings.apiBase || DEFAULTS.apiBase).replace(/\/$/, ''),
      model: settings.model?.trim() || DEFAULTS.model,
    }),
  );
}

export function getEffectiveAIConfig() {
  const s = loadAISettings();
  return {
    apiKey: s.apiKey || import.meta.env.VITE_AI_API_KEY || '',
    apiBase: s.apiBase || import.meta.env.VITE_AI_API_BASE || DEFAULTS.apiBase,
    model: s.model || import.meta.env.VITE_AI_MODEL || DEFAULTS.model,
  };
}
