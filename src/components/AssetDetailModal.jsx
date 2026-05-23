import { X, Globe, HardDrive, Building2, Calendar, Banknote, StickyNote } from 'lucide-react';
import { formatVND } from '../utils/format.js';
import ContactChannels from './ContactChannels.jsx';
import { useAppPreferences } from '../context/AppPreferencesContext.jsx';
import { labelDemoStatus } from '../utils/demoStatusLabels.js';

function statusClass(status) {
  if (status === 'Sắp hết hạn') return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  if (status === 'Quá hạn') return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
  return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
}

export default function AssetDetailModal({ open, asset, client, onClose }) {
  const { t } = useAppPreferences();
  if (!open || !asset) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 no-print">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl">
        <div className="flex items-start justify-between gap-4 p-5 border-b border-slate-800 shrink-0">
          <div className="flex items-start gap-3 min-w-0">
            <div className="p-3 bg-slate-800 rounded-xl text-indigo-400 shrink-0">
              {asset.type === 'Tên miền' ? <Globe size={22} /> : <HardDrive size={22} />}
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-bold text-white truncate">{asset.name}</h3>
              <p className="text-sm text-slate-400">{asset.type}</p>
              <span className={`inline-block mt-2 px-3 py-1 text-xs font-medium rounded-lg border ${statusClass(asset.status)}`}>
                {labelDemoStatus(asset.status, t)}
              </span>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 shrink-0">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          <section className="grid grid-cols-2 gap-4">
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mb-1">
                <Calendar size={12} /> Ngày hết hạn
              </p>
              <p className="text-white font-mono text-sm">{asset.expiryDate}</p>
            </div>
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mb-1">
                <Banknote size={12} /> Phí gia hạn
              </p>
              <p className="text-emerald-400 font-semibold">{formatVND(asset.price)}</p>
            </div>
          </section>

          {asset.note && (
            <section className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mb-2">
                <StickyNote size={12} /> Ghi chú hạ tầng
              </p>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{asset.note}</p>
            </section>
          )}

          <section className="border-t border-slate-800 pt-5">
            <p className="text-sm font-semibold text-white flex items-center gap-2 mb-1">
              <Building2 size={16} className="text-indigo-400" />
              Khách hàng / Công ty
            </p>
            {client ? (
              <>
                <p className="text-lg font-bold text-white mt-2">{client.company}</p>
                <p className="text-sm text-slate-400 mb-4">Đại diện: {client.name}</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">Liên hệ nhanh</p>
                <ContactChannels contact={client} />
              </>
            ) : (
              <p className="text-sm text-slate-500 mt-2">Chưa gắn khách hàng cho dịch vụ này.</p>
            )}
          </section>
        </div>

        <div className="p-5 border-t border-slate-800 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 text-sm font-medium"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
