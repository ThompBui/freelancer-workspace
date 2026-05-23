import { X, Coffee } from 'lucide-react';
import { COFFEE_QR_URL } from '../constants/brand.js';
import { useAppPreferences } from '../context/AppPreferencesContext.jsx';

export default function CoffeeSupportModal({ open, onClose }) {
  const { t } = useAppPreferences();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-3 sm:p-4 no-print" role="dialog" aria-modal>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div className="relative w-full max-w-sm bg-[var(--app-surface)] border border-[var(--app-border)] rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--app-border)]">
          <div className="flex items-center gap-2">
            <Coffee size={18} className="text-amber-500" />
            <div>
              <h3 className="text-sm font-bold text-[var(--app-text-heading)]">{t('coffee.title')}</h3>
              <p className="text-[11px] text-[var(--app-text-muted)]">{t('coffee.subtitle')}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-[var(--app-text-muted)] hover:bg-[var(--app-hover)] hover:text-[var(--app-text-heading)]">
            <X size={18} />
          </button>
        </div>
        <div className="p-4 flex flex-col items-center gap-3">
          <p className="text-xs text-[var(--app-text-muted)] text-center">{t('coffee.scan')}</p>
          <div className="bg-white p-3 rounded-xl shadow-inner">
            <img src={COFFEE_QR_URL} alt="QR chuyển khoản ACB" className="w-56 h-56 object-contain" />
          </div>
        </div>
        <div className="px-4 pb-4">
          <button type="button" onClick={onClose} className="btn-page-primary w-full">
            {t('coffee.close')}
          </button>
        </div>
      </div>
    </div>
  );
}
