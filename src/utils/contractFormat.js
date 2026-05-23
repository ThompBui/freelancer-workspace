function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function looksLikeHtml(content) {
  if (!content || typeof content !== 'string') return false;
  const t = content.trim();
  return t.startsWith('<') && /<(article|div|p|html|body|table|h[1-6])\b/i.test(t);
}

/** Loại bỏ script; giữ định dạng cơ bản từ Docs */
export function sanitizeContractHtml(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  doc.querySelectorAll('script, iframe, object, embed').forEach((el) => el.remove());
  const body = doc.body;
  if (!body) return '';
  const inner = body.innerHTML.trim();
  return `<article class="contract-doc contract-doc--imported">${inner}</article>`;
}

function isNationalHeader(line, index) {
  if (index > 5) return false;
  return /CỘNG HÒA|Độc lập|Độc Lập/i.test(line) || /^-+$/.test(line.trim());
}

function isTitleLine(line) {
  return /^HỢP ĐỒNG/i.test(line) || (line.length < 70 && line === line.toUpperCase() && /HỢP ĐỒNG|CỘNG TÁC|GIAO VIỆC/i.test(line));
}

function splitSignatureRow(line) {
  const parts = line.split(/\s{3,}/).map((p) => p.trim()).filter(Boolean);
  if (parts.length >= 2) return parts;
  const mid = Math.ceil(line.length / 2);
  return [line.slice(0, mid).trim(), line.slice(mid).trim()];
}

function buildSignatureHtml(lines) {
  const headers = [];
  const subs = [];
  for (const line of lines) {
    const t = line.trim();
    if (!t) continue;
    if (/ĐẠI DIỆN/i.test(t)) {
      const parts = splitSignatureRow(t);
      headers.push(...parts);
    } else if (/Ký|ký/.test(t)) {
      const parts = splitSignatureRow(t);
      subs.push(...parts);
    }
  }
  const cols = Math.max(headers.length, 2);
  let html = '<div class="contract-signatures">';
  for (let i = 0; i < cols; i += 1) {
    html += `<div class="contract-sign-col">
      <p>${escapeHtml(headers[i] || `ĐẠI DIỆN ${i === 0 ? 'BÊN A' : 'BÊN B'}`)}</p>
      <p class="contract-sign-line">${escapeHtml(subs[i] || '(Ký, ghi rõ họ tên)')}</p>
    </div>`;
  }
  html += '</div>';
  return html;
}

/** Chuyển văn bản thuần (mẫu mặc định) sang HTML căn chuẩn */
export function formatPlainContractToHtml(text) {
  if (!text) return '';
  const lines = text.split('\n');
  const sigIndex = lines.findIndex((l) => /ĐẠI DIỆN/i.test(l));
  const parts = [];
  let headerCount = 0;

  for (let i = 0; i < lines.length; i += 1) {
    if (sigIndex >= 0 && i >= sigIndex) break;
    const raw = lines[i];
    const t = raw.trim();
    if (!t) {
      parts.push('<div class="contract-spacer"></div>');
      continue;
    }
    if (isNationalHeader(t, i)) {
      const cls = headerCount === 0 ? 'contract-national' : 'contract-national-sub';
      parts.push(`<p class="${cls}">${escapeHtml(t)}</p>`);
      headerCount += 1;
      continue;
    }
    if (/^-{3,}$/.test(t)) {
      parts.push(`<p class="contract-rule">${escapeHtml(t)}</p>`);
      continue;
    }
    if (isTitleLine(t)) {
      parts.push(`<p class="contract-title">${escapeHtml(t)}</p>`);
      continue;
    }
    if (/^Số:/i.test(t)) {
      parts.push(`<p class="contract-meta-center">${escapeHtml(t)}</p>`);
      continue;
    }
    if (/^Điều \d+/i.test(t)) {
      parts.push(`<p class="contract-clause">${escapeHtml(t)}</p>`);
      continue;
    }
    if (/^BÊN [AB]/i.test(t) || /^HAI BÊN/i.test(t)) {
      parts.push(`<p class="contract-party">${escapeHtml(t)}</p>`);
      continue;
    }
    if (/^Hôm nay/i.test(t)) {
      parts.push(`<p class="contract-intro">${escapeHtml(t)}</p>`);
      continue;
    }
    parts.push(`<p class="contract-paragraph">${escapeHtml(t)}</p>`);
  }

  if (sigIndex >= 0) {
    parts.push(buildSignatureHtml(lines.slice(sigIndex)));
  }

  return `<article class="contract-doc">${parts.join('')}</article>`;
}

export function toDisplayHtml(content, format = 'text') {
  if (!content) return '';
  if (format === 'html' || looksLikeHtml(content)) return sanitizeContractHtml(content);
  return formatPlainContractToHtml(content);
}

export const CONTRACT_PRINT_CSS = `
  body { margin: 0; background: #fff; }
  .contract-doc {
    font-family: 'Times New Roman', Times, serif;
    font-size: 14pt;
    line-height: 1.5;
    color: #000;
    max-width: 21cm;
    margin: 0 auto;
    padding: 2cm 2.2cm;
  }
  .contract-national, .contract-national-sub, .contract-title, .contract-meta-center, .contract-rule { text-align: center; }
  .contract-national, .contract-national-sub { font-weight: 700; }
  .contract-title { font-weight: 700; text-transform: uppercase; }
  .contract-paragraph, .contract-intro, .contract-party { text-align: justify; }
  .contract-paragraph, .contract-intro { text-indent: 1.27cm; }
  .contract-clause { font-weight: 700; text-align: justify; }
  .contract-signatures { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-top: 2.5em; }
  .contract-sign-col { text-align: center; }
  .contract-sign-line { margin-top: 4.5em; font-style: italic; font-weight: 400; }
`;
