import { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';

import { createPortal } from 'react-dom';

import { Search, Sparkles, Loader2, X, ArrowRight } from 'lucide-react';

import { buildWorkspaceContext } from '../utils/workspaceContext.js';

import { runWorkspaceSearch, SEARCH_EXAMPLES } from '../utils/workspaceSearch.js';

import { useAppPreferences } from '../context/AppPreferencesContext.jsx';



const HEADER_OFFSET = '3.5rem';

const PANEL_GAP = 6;

const PANEL_MAX_W = 768;

const VIEWPORT_PAD = 8;



function SearchForm({ query, setQuery, loading, inputRef, onSubmit, onFocus, onClear, compact, t }) {

  return (

    <form

      className={`flex items-center gap-2 bg-[var(--app-surface-elevated)] border border-[var(--app-border)] rounded-xl focus-within:border-indigo-500/60 focus-within:ring-1 focus-within:ring-indigo-500/30 transition-all ${

        compact ? 'px-2.5 sm:px-3 py-1.5' : 'px-3 py-2.5'

      }`}

      onSubmit={onSubmit}

    >

      <Sparkles size={compact ? 16 : 18} className="text-indigo-400 shrink-0" />

      <input

        ref={inputRef}

        type="search"

        value={query}

        onChange={(e) => setQuery(e.target.value)}

        onFocus={onFocus}

        placeholder={t('search.placeholder')}

        className="flex-1 min-w-0 bg-transparent text-sm text-[var(--app-text-heading)] placeholder:text-[var(--app-text-muted)] focus:outline-none"

        autoComplete="off"

      />

      {!compact && (

        <kbd className="hidden md:inline text-[10px] text-[var(--app-text-muted)] bg-[var(--app-bg)] px-1.5 py-0.5 rounded border border-[var(--app-border)] shrink-0">

          Ctrl+K

        </kbd>

      )}

      {query && (

        <button type="button" onClick={onClear} className="p-1 text-[var(--app-text-muted)] hover:text-[var(--app-text-heading)]">

          <X size={14} />

        </button>

      )}

      <button

        type="submit"

        disabled={loading || !query.trim()}

        className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-40 shrink-0"

        title={t('search.submitTitle')}

      >

        {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}

      </button>

    </form>

  );

}



export default function WorkspaceAISearch({ workspaceData, onNavigate }) {

  const { t } = useAppPreferences();

  const [query, setQuery] = useState('');

  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState(null);

  const inputRef = useRef(null);

  const headerInputRef = useRef(null);

  const anchorRef = useRef(null);

  const [panelPos, setPanelPos] = useState(null);

  const updatePanelPos = useCallback(() => {

    const el = anchorRef.current;

    if (!el) return;

    const rect = el.getBoundingClientRect();

    const width = Math.min(PANEL_MAX_W, window.innerWidth - VIEWPORT_PAD * 2, Math.max(rect.width, 520));

    let left = rect.left + rect.width / 2 - width / 2;

    left = Math.max(VIEWPORT_PAD, Math.min(left, window.innerWidth - width - VIEWPORT_PAD));

    setPanelPos({

      top: rect.bottom + PANEL_GAP,

      left,

      width,

      maxHeight: `calc(100dvh - ${rect.bottom + PANEL_GAP + VIEWPORT_PAD}px)`,

    });

  }, []);



  const ctx = useCallback(() => buildWorkspaceContext(workspaceData), [workspaceData]);



  const runSearch = async (text) => {

    const q = (text ?? query).trim();

    if (!q) return;

    setLoading(true);

    setResult(null);

    setOpen(true);

    try {

      const res = await runWorkspaceSearch(q, ctx());

      setResult(res);

    } finally {

      setLoading(false);

    }

  };



  const handleSubmit = (e) => {

    e.preventDefault();

    runSearch();

  };



  const handleClear = () => {

    setQuery('');

    setResult(null);

  };



  const openPanel = useCallback(() => {

    setOpen(true);

    setTimeout(() => inputRef.current?.focus(), 50);

  }, []);



  useLayoutEffect(() => {

    if (!open) {

      setPanelPos(null);

      return;

    }

    updatePanelPos();

    window.addEventListener('resize', updatePanelPos);

    window.addEventListener('scroll', updatePanelPos, true);

    return () => {

      window.removeEventListener('resize', updatePanelPos);

      window.removeEventListener('scroll', updatePanelPos, true);

    };

  }, [open, updatePanelPos]);



  useEffect(() => {

    const onKey = (e) => {

      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {

        e.preventDefault();

        openPanel();

      }

      if (e.key === 'Escape') setOpen(false);

    };

    window.addEventListener('keydown', onKey);

    return () => window.removeEventListener('keydown', onKey);

  }, [openPanel]);



  const sourceLabel = {

    local: t('search.sourceLocal'),

    ai: t('search.sourceAi'),

    hint: t('search.sourceHint'),

    error: t('search.sourceError'),

  };



  const dropdown =

    open &&

    panelPos &&

    createPortal(

      <>

        <div className="fixed inset-0 z-[90] bg-black/25" style={{ top: HEADER_OFFSET }} onClick={() => setOpen(false)} aria-hidden />

        <div

          className="fixed z-[100] bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl shadow-2xl overflow-hidden flex flex-col sm:flex-row"

          style={{ top: panelPos.top, left: panelPos.left, width: panelPos.width, maxHeight: panelPos.maxHeight }}

          role="dialog"

          aria-label={t('search.dialogLabel')}

        >

          <button

            type="button"

            onClick={() => setOpen(false)}

            className="absolute top-2 right-2 z-10 p-1.5 rounded-lg text-[var(--app-text-muted)] hover:text-[var(--app-text-heading)] hover:bg-[var(--app-hover)]"

            aria-label={t('common.close')}

          >

            <X size={16} />

          </button>

          <div className="relative w-full sm:w-56 shrink-0 border-b sm:border-b-0 sm:border-r border-[var(--app-border)] p-2.5 sm:pr-8 overflow-y-auto">

            <p className="text-[10px] font-medium text-[var(--app-text-muted)] uppercase tracking-wide mb-1.5 pr-6">{t('search.panelTitle')}</p>

            <SearchForm query={query} setQuery={setQuery} loading={loading} inputRef={inputRef} onSubmit={handleSubmit} onFocus={() => setOpen(true)} onClear={handleClear} compact t={t} />

            <div className="mt-2">

              <p className="text-[10px] text-[var(--app-text-muted)] mb-1">{t('search.examples')}</p>

              <div className="flex flex-col gap-1 max-h-[9.5rem] overflow-y-auto no-scrollbar">

                {SEARCH_EXAMPLES.map((ex) => (

                  <button

                    key={ex}

                    type="button"

                    onClick={() => {

                      setQuery(ex);

                      runSearch(ex);

                    }}

                    className="text-left text-[11px] px-2 py-1 rounded-md bg-[var(--app-surface-elevated)] text-[var(--app-text)] hover:bg-indigo-500/20 hover:text-indigo-300 border border-[var(--app-border)] leading-snug"

                  >

                    {ex}

                  </button>

                ))}

              </div>

            </div>

            <p className="mt-2 text-[10px] text-[var(--app-text-muted)] leading-snug">

              {t('search.hint')} <strong className="text-[var(--app-text)]">{t('search.settingsLink')}</strong>.

            </p>

          </div>

          <div className="flex-1 min-w-0 p-2.5 sm:p-3 overflow-y-auto min-h-[5.5rem] sm:min-h-[7.5rem]">

            {loading && (

              <p className="text-sm text-[var(--app-text-muted)] flex items-center gap-2">

                <Loader2 size={16} className="animate-spin text-indigo-400" />

                {t('search.analyzing')}

              </p>

            )}

            {!loading && result && (

              <div className="space-y-3">

                <p className="text-sm sm:text-base text-[var(--app-text-heading)] leading-relaxed whitespace-pre-wrap">{result.answer}</p>

                {result.bullets?.length > 0 && (

                  <ul className="text-xs sm:text-sm text-[var(--app-text-muted)] space-y-1.5 border-t border-[var(--app-border)] pt-3">

                    {result.bullets.map((b, i) => (

                      <li key={i} className="leading-snug">

                        {b}

                      </li>

                    ))}

                  </ul>

                )}

                <p className="text-[10px] text-[var(--app-text-muted)] flex items-center gap-1">

                  <Sparkles size={10} className="text-indigo-500" />

                  {sourceLabel[result.source] ?? result.source}

                </p>

                {result.action && onNavigate && (

                  <button

                    type="button"

                    onClick={() => {

                      onNavigate(result.action.tab, result.action.contextKey);

                      setOpen(false);

                    }}

                    className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-lg border border-indigo-500/30"

                  >

                    {t('search.openRelated')} <ArrowRight size={14} />

                  </button>

                )}

              </div>

            )}

            {!loading && !result && (

              <div className="h-full flex flex-col items-center justify-center text-center px-2 py-4">

                <Sparkles size={20} className="text-indigo-500/40 mb-1.5" />

                <p className="text-xs text-[var(--app-text-muted)]">{t('search.resultPlaceholder')}</p>

              </div>

            )}

          </div>

        </div>

      </>,

      document.body,

    );



  return (

    <>

      <div ref={anchorRef} className="relative min-w-0 w-full z-[60]">

        <SearchForm query={query} setQuery={setQuery} loading={loading} inputRef={headerInputRef} onSubmit={handleSubmit} onFocus={openPanel} onClear={handleClear} compact t={t} />

      </div>

      {dropdown}

    </>

  );

}


