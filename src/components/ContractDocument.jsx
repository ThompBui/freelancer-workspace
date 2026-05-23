import { useMemo } from 'react';
import { toDisplayHtml } from '../utils/contractFormat.js';
import '../styles/contract-document.css';

export default function ContractDocument({ content, format = 'text', className = '' }) {
  const html = useMemo(() => toDisplayHtml(content, format), [content, format]);

  if (!html) {
    return <p className="text-slate-500 text-sm text-center py-12">Chưa có nội dung hợp đồng.</p>;
  }

  return (
    <div
      className={`contract-doc-wrapper rounded-xl overflow-hidden ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
