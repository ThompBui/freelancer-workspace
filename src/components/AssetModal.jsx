import { X } from 'lucide-react';
import { ASSET_TYPES } from '../utils/assetStatus.js';

export default function AssetModal({ open, onClose, onSubmit, clients }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm no-print">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
          <h3 className="text-lg font-bold text-white">Thêm hạ tầng khách</h3>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-5 space-y-4">
          <div>
            <label className="text-sm text-slate-400 block mb-1.5">Tên dịch vụ</label>
            <input
              name="name"
              required
              placeholder="VD: techcorp.vn hoặc VPS 4GB"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="text-sm text-slate-400 block mb-1.5">Phân loại</label>
            <select
              name="type"
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            >
              {ASSET_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-slate-400 block mb-1.5">Khách hàng</label>
            <select
              name="clientId"
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="">Chọn khách hàng</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} — {c.company}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-slate-400 block mb-1.5">Ngày hết hạn</label>
              <input
                name="expiryDate"
                type="date"
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-sm text-slate-400 block mb-1.5">Phí gia hạn (VNĐ)</label>
              <input
                name="price"
                type="number"
                min="0"
                required
                placeholder="350000"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-slate-400 block mb-1.5">Ghi chú (note)</label>
            <textarea
              name="note"
              rows={3}
              placeholder="VD: DNS trỏ về Cloudflare, nhắc khách gia hạn trước 7 ngày…"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white resize-none focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2.5 text-sm text-slate-400 hover:text-white">
              Hủy
            </button>
            <button type="submit" className="px-5 py-2.5 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl">
              Thêm dịch vụ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
