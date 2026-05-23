import { MessageCircle, ArrowLeft } from 'lucide-react';
import UserAvatar from './UserAvatar.jsx';
import ContactChannels from './ContactChannels.jsx';

export default function FreelancerChatPanel({ freelancer, colorClass, onBack }) {
  return (
    <div className="page-shell animate-fade-in no-print">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft size={16} /> Quay lại danh sách
      </button>

      <div className="page-card-lg">
        <div className="flex items-center gap-4 mb-6">
          <UserAvatar name={freelancer.name} colorClass={colorClass} size="lg" />
          <div>
            <h2 className="page-title">{freelancer.name}</h2>
            <p className="text-sm text-slate-400">{freelancer.email}</p>
          </div>
        </div>

        <p className="text-sm text-slate-400 mb-4 flex items-center gap-2">
          <MessageCircle size={16} className="text-indigo-400" />
          Chọn kênh liên hệ — mở Gmail, Messenger, Zalo hoặc gọi điện
        </p>

        <ContactChannels
          contact={{
            name: freelancer.name,
            email: freelancer.email,
            phone: freelancer.phone,
            facebook: freelancer.facebook,
            zalo: freelancer.zalo,
          }}
        />
      </div>
    </div>
  );
}
