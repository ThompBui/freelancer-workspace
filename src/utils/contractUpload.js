import mammoth from 'mammoth';

const ACCEPT = '.docx,.html,.htm,.txt';

export function getAcceptedContractExtensions() {
  return ACCEPT;
}

function stripHtmlWrapper(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const body = doc.body;
  if (!body) return html;
  return body.innerHTML.trim();
}

/** Google Docs: Tệp → Tải xuống → Microsoft Word (.docx) hoặc Trang web (.html) hoặc Văn bản thuần (.txt) */
export async function parseContractFile(file) {
  const name = file.name || 'template';
  const ext = name.split('.').pop()?.toLowerCase() ?? '';

  if (ext === 'txt') {
    const text = await file.text();
    return { content: text, format: 'text', fileName: name };
  }

  if (ext === 'html' || ext === 'htm') {
    const raw = await file.text();
    const content = stripHtmlWrapper(raw);
    return { content, format: 'html', fileName: name };
  }

  if (ext === 'docx') {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.convertToHtml({ arrayBuffer });
    const content = stripHtmlWrapper(result.value || '');
    if (!content) throw new Error('Không đọc được nội dung từ file Word.');
    return { content, format: 'html', fileName: name };
  }

  throw new Error('Chỉ hỗ trợ .docx, .html, .txt (xuất từ Google Docs).');
}
