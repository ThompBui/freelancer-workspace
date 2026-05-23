import { CONTRACT_PRINT_CSS, toDisplayHtml } from './contractFormat.js';

export function openContractPrint(content, format = 'text') {
  const html = toDisplayHtml(content, format);
  const w = window.open('', '_blank');
  if (!w) return;
  w.document.write(`<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8"/>
  <title>In hợp đồng</title>
  <style>${CONTRACT_PRINT_CSS}</style>
</head>
<body>${html}</body>
</html>`);
  w.document.close();
  w.focus();
  setTimeout(() => w.print(), 400);
}
