import { Mail, Phone, ExternalLink } from 'lucide-react';
import { buildMessengerUrl, buildZaloUrl, buildGmailUrl, buildTelUrl, openExternalChat } from '../utils/chatLinks.js';

function ChannelButton({ label, sublabel, icon, gradient, disabled, disabledHint, onClick }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex items-center gap-2.5 sm:gap-3 p-3 sm:p-4 rounded-lg sm:rounded-xl border w-full text-left transition-all ${
        disabled
          ? 'border-slate-800 bg-slate-900/40 opacity-45 cursor-not-allowed'
          : `${gradient} border-transparent hover:brightness-110 shadow-md`
      }`}
    >
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${disabled ? 'bg-slate-800' : 'bg-white/20'}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${disabled ? 'text-slate-500' : 'text-white'}`}>{label}</p>
        <p className={`text-xs truncate mt-0.5 ${disabled ? 'text-slate-600' : 'text-white/75'}`}>
          {disabled ? disabledHint : sublabel}
        </p>
      </div>
      {!disabled && <ExternalLink size={16} className="text-white/60 shrink-0" />}
    </button>
  );
}

/** Gmail, Messenger, Zalo, gọi điện — dùng chung CRM / hạ tầng */
export default function ContactChannels({ contact, compact = false }) {
  const { name, company, email, phone, facebook, zalo } = contact || {};
  const gmailUrl = buildGmailUrl(email);
  const messengerUrl = buildMessengerUrl(facebook);
  const zaloUrl = buildZaloUrl(zalo || phone);
  const telUrl = buildTelUrl(phone);

  const gridClass = compact ? 'grid grid-cols-1 sm:grid-cols-2 gap-3' : 'grid grid-cols-1 sm:grid-cols-2 gap-3';

  return (
    <div className="space-y-3">
      {(name || company) && (
        <div className="text-sm text-slate-400">
          {company && <p className="text-white font-medium">{company}</p>}
          {name && <p>{name}</p>}
        </div>
      )}
      <div className={gridClass}>
        <ChannelButton
          label="Gmail"
          sublabel={email || '—'}
          disabled={!gmailUrl}
          disabledHint="Chưa có email"
          gradient="bg-gradient-to-br from-rose-600 to-red-700"
          icon={<Mail size={20} className="text-white" />}
          onClick={() => openExternalChat(gmailUrl)}
        />
        <ChannelButton
          label="Messenger"
          sublabel={facebook || 'Facebook'}
          disabled={!messengerUrl}
          disabledHint="Chưa có link Facebook"
          gradient="bg-gradient-to-br from-[#0084FF] to-[#006AFF]"
          icon={
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" aria-hidden>
              <path d="M12 2C6.48 2 2 6.13 2 11.06c0 2.91 1.46 5.5 3.74 7.2L5 22l3.87-2.13c1.05.29 2.16.45 3.13.45 5.52 0 10-4.13 10-9.06S17.52 2 12 2z" />
            </svg>
          }
          onClick={() => openExternalChat(messengerUrl)}
        />
        <ChannelButton
          label="Zalo"
          sublabel={zalo || phone || '—'}
          disabled={!zaloUrl}
          disabledHint="Chưa có số Zalo"
          gradient="bg-gradient-to-br from-[#0068FF] to-[#0047CC]"
          icon={<span className="text-white font-bold text-base">Z</span>}
          onClick={() => openExternalChat(zaloUrl)}
        />
        <ChannelButton
          label="Gọi điện"
          sublabel={phone || '—'}
          disabled={!telUrl}
          disabledHint="Chưa có SĐT"
          gradient="bg-gradient-to-br from-emerald-600 to-teal-700"
          icon={<Phone size={20} className="text-white" />}
          onClick={() => {
            if (telUrl) window.location.href = telUrl;
          }}
        />
      </div>
    </div>
  );
}
