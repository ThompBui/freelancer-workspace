import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ChevronRight } from 'lucide-react';

const PANEL_W = 300;

export default function HeaderIconDropdown({
  icon: Icon,
  label,
  badge = 0,
  accent = 'slate',
  items = [],
  emptyText,
  viewAllLabel,
  onViewAll,
}) {
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState(null);
  const anchorRef = useRef(null);

  const updateRect = useCallback(() => {
    if (!anchorRef.current) return;
    const r = anchorRef.current.getBoundingClientRect();
    const left = Math.min(Math.max(8, r.right - PANEL_W), window.innerWidth - PANEL_W - 8);
    setRect({ top: r.bottom + 6, left, width: PANEL_W });
  }, []);

  useEffect(() => {
    if (!open) return;
    updateRect();
    const close = (e) => {
      if (anchorRef.current?.contains(e.target)) return;
      if (e.target.closest?.('[data-header-dropdown]')) return;
      setOpen(false);
    };
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect, true);
    document.addEventListener('mousedown', close);
    return () => {
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect, true);
      document.removeEventListener('mousedown', close);
    };
  }, [open, updateRect]);

  const accentRing = {
    slate: 'hover:bg-[var(--app-hover)] hover:text-[var(--app-text-heading)]',
    indigo: 'hover:bg-indigo-500/15 hover:text-indigo-600 dark:hover:text-indigo-300',
    amber: 'hover:bg-amber-500/15 hover:text-amber-600 dark:hover:text-amber-300',
  }[accent];

  const toggle = () => {
    setOpen((v) => {
      if (!v) setTimeout(updateRect, 0);
      return !v;
    });
  };

  const panel =
    open &&
    rect &&
    createPortal(
      <div
        data-header-dropdown
        className="fixed z-[110] rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] shadow-2xl overflow-hidden flex flex-col"
        style={{ top: rect.top, left: rect.left, width: rect.width, maxHeight: 'min(360px, calc(100vh - 80px))' }}
        role="menu"
        aria-label={label}
      >
        <div className="px-3 py-2 border-b border-[var(--app-border)] shrink-0">
          <p className="text-xs font-semibold text-[var(--app-text-heading)]">{label}</p>
        </div>
        <ul className="flex-1 overflow-y-auto py-1 min-h-0">
          {items.length === 0 ? (
            <li className="px-3 py-4 text-xs text-[var(--app-text-muted)] text-center">{emptyText}</li>
          ) : (
            items.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setOpen(false);
                    item.onClick?.();
                  }}
                  className="w-full text-left px-3 py-2.5 hover:bg-[var(--app-hover)] transition-colors flex items-start gap-2 group"
                >
                  {item.unread && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />}
                  <span className={`flex-1 min-w-0 text-sm leading-snug truncate ${item.unread ? 'font-medium text-[var(--app-text-heading)]' : 'text-[var(--app-text)]'}`}>
                    {item.title}
                  </span>
                  {item.time && (
                    <span className="text-[10px] text-[var(--app-text-muted)] shrink-0 mt-0.5">{item.time}</span>
                  )}
                </button>
              </li>
            ))
          )}
        </ul>
        {onViewAll && (
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onViewAll();
            }}
            className="shrink-0 flex items-center justify-center gap-1 px-3 py-2.5 text-xs font-medium text-indigo-600 dark:text-indigo-300 border-t border-[var(--app-border)] hover:bg-indigo-500/10"
          >
            {viewAllLabel} <ChevronRight size={12} />
          </button>
        )}
      </div>,
      document.body,
    );

  return (
    <>
      <button
        ref={anchorRef}
        type="button"
        onClick={toggle}
        title={label}
        aria-label={label}
        aria-expanded={open}
        className={`relative p-2 rounded-lg text-[var(--app-text-muted)] transition-colors ${accentRing} ${open ? 'bg-[var(--app-hover)] text-[var(--app-text-heading)]' : ''}`}
      >
        <Icon size={20} strokeWidth={2} />
        {badge > 0 && (
          <span
            className={`absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full text-[9px] font-bold text-white flex items-center justify-center ${
              accent === 'amber' ? 'bg-amber-500' : 'bg-rose-500'
            }`}
          >
            {badge > 99 ? '99+' : badge}
          </span>
        )}
      </button>
      {panel}
    </>
  );
}
