import { X } from 'lucide-react';

export default function CollaboratorModal({ open, onClose, onSubmit }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm no-print">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
          <h3 className="text-lg font-bold text-white">Thêm cộng tác viên</h3>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-5 space-y-4">
          <div>
            <label className="text-sm text-slate-400 block mb-1.5">Họ tên</label>
            <input name="name" required placeholder="VD: Phạm Văn Dev" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500" />
          </div>
          <div>
            <label className="text-sm text-slate-400 block mb-1.5">Email</label>
            <input name="email" type="email" required className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500" />
          </div>
          <div>
            <label className="text-sm text-slate-400 block mb-1.5">Số điện thoại</label>
            <input name="phone" type="tel" placeholder="090xxxxxxx" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500" />
          </div>
          <div>
            <label className="text-sm text-slate-400 block mb-1.5">Link Facebook (Messenger)</label>
            <input
              name="facebook"
              type="url"
              placeholder="facebook.com/username hoặc m.me/username"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
            <p className="text-[10px] text-slate-500 mt-1">Dùng để mở chat Messenger khi bấm Nhắn tin</p>
          </div>
          <div>
            <label className="text-sm text-slate-400 block mb-1.5">Số Zalo</label>
            <input
              name="zalo"
              type="tel"
              placeholder="090xxxxxxx"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
            <p className="text-[10px] text-slate-500 mt-1">Mở Zalo chat trực tiếp với số này</p>
          </div>
          <div>
            <label className="text-sm text-slate-400 block mb-1.5">Kỹ năng (phẩy cách)</label>
            <input name="skills" placeholder="React, Node, UI" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2.5 text-sm text-slate-400 hover:text-white">
              Hủy
            </button>
            <button type="submit" className="px-5 py-2.5 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl">
              Thêm cộng tác viên
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
