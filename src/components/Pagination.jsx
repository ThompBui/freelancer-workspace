import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppPreferences } from '../context/AppPreferencesContext.jsx';

export default function Pagination({ page, totalPages, total, from, to, onPageChange }) {
  const { t } = useAppPreferences();
  if (total === 0) return null;

  const pages = [];
  const maxButtons = 5;
  let start = Math.max(1, page - 2);
  let end = Math.min(totalPages, start + maxButtons - 1);
  start = Math.max(1, end - maxButtons + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3 pt-3 sm:pt-4 px-2 sm:px-0 border-t border-[var(--app-border)]">
      <p className="text-xs sm:text-sm text-[var(--app-text-muted)]">
        {t('common.showing')} <span className="text-[var(--app-text)] font-medium">{from}–{to}</span> /{' '}
        <span className="text-[var(--app-text)] font-medium">{total}</span> {t('common.items')}
        <span className="text-[var(--app-text-muted)] ml-1">(20/page)</span>
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="p-2 rounded-lg border border-[var(--app-border)] text-[var(--app-text-muted)] hover:bg-[var(--app-hover)] hover:text-[var(--app-text-heading)] disabled:opacity-40 disabled:pointer-events-none transition-colors"
          aria-label={t('common.prevPage')}
        >
          <ChevronLeft size={18} />
        </button>
        {start > 1 && (
          <>
            <button type="button" onClick={() => onPageChange(1)} className="min-w-9 h-9 rounded-lg text-sm text-[var(--app-text-muted)] hover:bg-[var(--app-hover)]">
              1
            </button>
            {start > 2 && <span className="text-[var(--app-text-muted)] px-1">…</span>}
          </>
        )}
        {pages.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={`min-w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
              p === page ? 'bg-indigo-600 text-white' : 'text-[var(--app-text-muted)] hover:bg-[var(--app-hover)] hover:text-[var(--app-text-heading)]'
            }`}
          >
            {p}
          </button>
        ))}
        {end < totalPages && (
          <>
            {end < totalPages - 1 && <span className="text-[var(--app-text-muted)] px-1">…</span>}
            <button type="button" onClick={() => onPageChange(totalPages)} className="min-w-9 h-9 rounded-lg text-sm text-[var(--app-text-muted)] hover:bg-[var(--app-hover)]">
              {totalPages}
            </button>
          </>
        )}
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="p-2 rounded-lg border border-[var(--app-border)] text-[var(--app-text-muted)] hover:bg-[var(--app-hover)] hover:text-[var(--app-text-heading)] disabled:opacity-40 disabled:pointer-events-none transition-colors"
          aria-label={t('common.nextPage')}
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
