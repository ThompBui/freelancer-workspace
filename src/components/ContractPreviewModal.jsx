import { X, Printer, FileSignature } from 'lucide-react';
import ContractDocument from './ContractDocument.jsx';
import { openContractPrint } from '../utils/contractPrint.js';

export default function ContractPreviewModal({
  open,
  title,
  subtitle,
  body,
  bodyFormat = 'text',
  typeLabel,
  onClose,
  onPrint,
  onSave,
  saveLabel = 'Lưu hợp đồng',
}) {
  if (!open || !body) return null;

  const handlePrint = () => {
    if (onPrint) onPrint();
    else openContractPrint(body, bodyFormat);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 no-print">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl">
        <div className="flex items-start justify-between gap-4 p-5 border-b border-slate-800 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FileSignature size={20} className="text-indigo-400" />
              {typeLabel && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {typeLabel}
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-white">{title}</h3>
            {subtitle && <p className="text-sm text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0 bg-slate-200/90 p-4 md:p-6">
          <ContractDocument content={body} format={bodyFormat} className="shadow-lg max-w-3xl mx-auto" />
        </div>

        <div className="flex flex-wrap justify-end gap-2 p-5 border-t border-slate-800 shrink-0">
          <button type="button" onClick={onClose} className="px-4 py-2.5 text-sm text-slate-400 hover:text-white rounded-xl hover:bg-slate-800">
            Đóng
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2.5 text-sm font-medium rounded-xl border border-slate-600 text-slate-200 hover:bg-slate-800 flex items-center gap-2"
          >
            <Printer size={16} /> In / PDF
          </button>
          {onSave && (
            <button type="button" onClick={onSave} className="px-5 py-2.5 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl">
              {saveLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
