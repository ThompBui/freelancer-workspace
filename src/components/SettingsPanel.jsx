import { useState } from 'react';

import { Settings, Sparkles, Save, Eye, EyeOff, CheckCircle2, Sun, Moon, Languages } from 'lucide-react';

import { loadAISettings, saveAISettings } from '../utils/aiSettingsStorage.js';

import { useAppPreferences } from '../context/AppPreferencesContext.jsx';



function AppearanceSettings({ onSaved }) {

  const { theme, locale, locales, setTheme, setLocale, t } = useAppPreferences();

  const [saved, setSaved] = useState(false);



  const persist = (next) => {

    if (next.theme) setTheme(next.theme);

    if (next.locale) setLocale(next.locale);

    setSaved(true);

    onSaved?.(t('settings.saved'));

    setTimeout(() => setSaved(false), 2500);

  };



  return (

    <div className="page-card space-y-5">

      <div className="flex items-center gap-2 pb-2 border-b border-[var(--app-border)]">

        <Sun size={18} className="text-indigo-400" />

        <h3 className="section-title">{t('settings.appearance')}</h3>

      </div>



      <div>

        <label className="text-sm text-[var(--app-text-muted)] block mb-1.5">{t('settings.theme')}</label>

        <div className="grid grid-cols-2 gap-2">

          <button

            type="button"

            onClick={() => persist({ theme: 'dark' })}

            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${

              theme === 'dark'

                ? 'border-indigo-500 bg-indigo-500/15 text-indigo-300'

                : 'border-[var(--app-border)] text-[var(--app-text)] hover:bg-[var(--app-hover)]'

            }`}

          >

            <Moon size={16} /> {t('settings.themeDark')}

          </button>

          <button

            type="button"

            onClick={() => persist({ theme: 'light' })}

            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${

              theme === 'light'

                ? 'border-indigo-500 bg-indigo-500/15 text-indigo-600'

                : 'border-[var(--app-border)] text-[var(--app-text)] hover:bg-[var(--app-hover)]'

            }`}

          >

            <Sun size={16} /> {t('settings.themeLight')}

          </button>

        </div>

      </div>



      <div>

        <label className="text-sm text-[var(--app-text-muted)] block mb-1.5">{t('settings.language')}</label>

        <select value={locale} onChange={(e) => persist({ locale: e.target.value })} className="input-theme select-theme w-full">

          {locales.map((l) => (
            <option key={l.code} value={l.code}>
              {l.label}
            </option>
          ))}

        </select>

      </div>



      {saved && (

        <p className="text-xs text-emerald-500 flex items-center gap-1">

          <CheckCircle2 size={14} /> {t('settings.saved')}

        </p>

      )}

    </div>

  );

}



function AISettings({ onSaved }) {

  const { t } = useAppPreferences();

  const initial = loadAISettings();

  const [apiKey, setApiKey] = useState(initial.apiKey);

  const [apiBase, setApiBase] = useState(initial.apiBase);

  const [model, setModel] = useState(initial.model);

  const [showKey, setShowKey] = useState(false);

  const [saved, setSaved] = useState(false);



  const handleSubmit = (e) => {

    e.preventDefault();

    saveAISettings({ apiKey, apiBase, model });

    setSaved(true);

    onSaved?.(t('settings.savedAi'));

    setTimeout(() => setSaved(false), 2500);

  };



  return (

    <form onSubmit={handleSubmit} className="page-card space-y-4">

      <div className="flex items-center gap-2 pb-2 border-b border-[var(--app-border)]">

        <Sparkles size={18} className="text-indigo-400" />

        <h3 className="section-title">{t('settings.aiSection')}</h3>

      </div>

      <p className="text-xs text-[var(--app-text-muted)] leading-relaxed">{t('settings.aiHint')}</p>



      <div>

        <label className="text-sm text-[var(--app-text-muted)] block mb-1.5">{t('settings.apiKey')}</label>

        <div className="relative">

          <input

            type={showKey ? 'text' : 'password'}

            value={apiKey}

            onChange={(e) => setApiKey(e.target.value)}

            placeholder="sk-..."

            className="input-theme w-full pr-10"

            autoComplete="off"

          />

          <button

            type="button"

            onClick={() => setShowKey(!showKey)}

            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--app-text-muted)] hover:text-[var(--app-text-heading)]"

          >

            {showKey ? <EyeOff size={16} /> : <Eye size={16} />}

          </button>

        </div>

      </div>



      <div>

        <label className="text-sm text-[var(--app-text-muted)] block mb-1.5">{t('settings.apiBase')}</label>

        <input value={apiBase} onChange={(e) => setApiBase(e.target.value)} placeholder="https://api.openai.com/v1" className="input-theme w-full" />

      </div>



      <div>

        <label className="text-sm text-[var(--app-text-muted)] block mb-1.5">{t('settings.model')}</label>

        <input value={model} onChange={(e) => setModel(e.target.value)} placeholder="gpt-4o-mini" className="input-theme w-full" />

      </div>



      <button type="submit" className="btn-page-primary w-full sm:w-auto">

        {saved ? <CheckCircle2 size={16} /> : <Save size={16} />}

        {saved ? t('settings.saved') : t('settings.save')}

      </button>

    </form>

  );

}



export default function SettingsPanel({ contextKey = 'appearance', onSaved }) {

  const { t } = useAppPreferences();



  return (

    <div className="page-shell animate-fade-in no-print max-w-2xl">

      <div>

        <h2 className="page-title flex items-center gap-2">

          <Settings size={22} className="text-[var(--app-text-muted)]" />

          {t('settings.title')}

        </h2>

        <p className="page-desc">{t('settings.desc')}</p>

      </div>



      {contextKey === 'appearance' && <AppearanceSettings onSaved={onSaved} />}

      {contextKey === 'ai' && <AISettings onSaved={onSaved} />}

    </div>

  );

}


