import { CONTRACT_TEMPLATE, FREELANCER_CONTRACT_TEMPLATE } from '../data/mockData.js';

const STORAGE_PREFIX = 'thompbui-contract-template-';
const LEGACY_STORAGE_PREFIX = 'freelanceos-contract-template-';

export const CLIENT_PLACEHOLDERS = [
  'contract_id',
  'current_date',
  'client_company',
  'client_name',
  'client_email',
  'client_phone',
  'project_name',
  'project_value',
];

export const FREELANCER_PLACEHOLDERS = [
  'contract_id',
  'current_date',
  'owner_name',
  'freelancer_name',
  'freelancer_email',
  'freelancer_phone',
  'project_name',
  'work_scope',
  'payment_amount',
  'payment_terms',
  'deadline',
];

export function getPlaceholdersForType(type) {
  return type === 'client' ? CLIENT_PLACEHOLDERS : FREELANCER_PLACEHOLDERS;
}

export function getDefaultTemplate(type) {
  return {
    content: type === 'client' ? CONTRACT_TEMPLATE : FREELANCER_CONTRACT_TEMPLATE,
    format: 'text',
    fileName: 'Mẫu hệ thống',
    uploadedAt: null,
    source: 'default',
  };
}

export function loadStoredTemplate(type) {
  try {
    let raw = localStorage.getItem(`${STORAGE_PREFIX}${type}`);
    if (!raw) raw = localStorage.getItem(`${LEGACY_STORAGE_PREFIX}${type}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.content) return parsed;
  } catch {
    /* ignore */
  }
  return null;
}

export function saveStoredTemplate(type, data) {
  localStorage.setItem(
    `${STORAGE_PREFIX}${type}`,
    JSON.stringify({
      ...data,
      uploadedAt: new Date().toISOString(),
      source: 'upload',
    }),
  );
}

export function clearStoredTemplate(type) {
  localStorage.removeItem(`${STORAGE_PREFIX}${type}`);
}

export function getEffectiveTemplate(type, overrides = {}) {
  const custom = overrides[type] ?? loadStoredTemplate(type);
  return custom || getDefaultTemplate(type);
}

export function loadAllTemplates(overrides = {}) {
  return {
    client: getEffectiveTemplate('client', overrides),
    freelancer: getEffectiveTemplate('freelancer', overrides),
  };
}
