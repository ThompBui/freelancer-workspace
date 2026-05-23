import { looksLikeHtml } from './contractFormat.js';

function escapeHtmlValue(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function formatVariableValue(key, value, asHtml) {
  const str = value ?? '';
  if (!asHtml) return str;
  if (key === 'work_scope' || String(str).includes('\n')) {
    return escapeHtmlValue(String(str)).replace(/\n/g, '<br/>');
  }
  return escapeHtmlValue(String(str));
}

export function buildContractBody(template, variables, options = {}) {
  const asHtml = options.asHtml ?? looksLikeHtml(template);
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => formatVariableValue(key, variables[key], asHtml));
}

export function newContractId(prefix = 'HD') {
  return `${prefix}-${Date.now().toString().slice(-6)}`;
}

export function finalizeContractId(body, draftId, finalId) {
  const suffix = finalId.split('-').pop();
  return body.replace(/DRAFT/g, suffix).replace(/\{\{contract_id\}\}/g, suffix);
}
