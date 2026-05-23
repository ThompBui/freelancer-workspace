import { useRef, useState } from 'react';
import { Upload, RotateCcw, FileText, Info } from 'lucide-react';
import { parseContractFile, getAcceptedContractExtensions } from '../utils/contractUpload.js';
import { getPlaceholdersForType } from '../utils/contractTemplateStorage.js';

export default function ContractTemplatePanel({ type, template, onUpload, onReset }) {
  const inputRef = useRef(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const placeholders = getPlaceholdersForType(type);
  const label = type === 'client' ? 'Hợp đồng khách hàng' : 'Hợp đồng cộng tác viên';

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setError('');
    setLoading(true);
    try {
      const parsed = await parseContractFile(file);
      onUpload(type, parsed);
    } catch (err) {
      setError(err.message || 'Không đọc được file.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-950/50 p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-white flex items-center gap-2">
            <FileText size={16} className="text-indigo-400" />
            Mẫu: {label}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            {template.source === 'upload' ? `Từ Docs: ${template.fileName}` : template.fileName}
          </p>
        </div>
        {template.source === 'upload' && (
          <button
            type="button"
            onClick={() => onReset(type)}
            className="text-xs text-slate-400 hover:text-amber-300 flex items-center gap-1 shrink-0"
            title="Dùng lại mẫu mặc định"
          >
            <RotateCcw size={12} /> Mặc định
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={getAcceptedContractExtensions()}
        className="hidden"
        onChange={handleFile}
      />
      <button
        type="button"
        disabled={loading}
        onClick={() => inputRef.current?.click()}
        className="w-full py-2.5 rounded-lg border border-dashed border-slate-600 text-slate-300 hover:border-indigo-500 hover:text-indigo-300 text-sm flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <Upload size={16} />
        {loading ? 'Đang đọc file…' : 'Tải mẫu từ Google Docs (.docx / .html / .txt)'}
      </button>

      {error && <p className="text-xs text-rose-400">{error}</p>}

      <div className="flex gap-2 text-xs text-slate-500">
        <Info size={14} className="shrink-0 mt-0.5" />
        <p>
          Trong Docs, chèn biến dạng <code className="text-indigo-300">{'{{tên_biến}}'}</code> — hệ thống tự điền khi tạo HĐ.
          Xuất: <strong>Tệp → Tải xuống → Word (.docx)</strong> hoặc Trang web (.html).
        </p>
      </div>
      <p className="text-[10px] text-slate-600 leading-relaxed">
        Biến: {placeholders.map((p) => `{{${p}}}`).join(', ')}
      </p>
    </div>
  );
}
