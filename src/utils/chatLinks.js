/** Chuẩn hóa link Facebook → m.me để mở Messenger */
export function buildMessengerUrl(facebookLink) {
  const raw = (facebookLink || '').trim();
  if (!raw) return null;

  if (/^m\.me\//i.test(raw)) return `https://${raw.replace(/^https?:\/\//i, '')}`;

  try {
    const url = raw.startsWith('http') ? new URL(raw) : new URL(`https://${raw}`);
    const host = url.hostname.replace('www.', '');
    if (host === 'm.me') return url.href;
    if (host === 'facebook.com' || host === 'fb.com') {
      const path = url.pathname.replace(/^\//, '').split('/')[0];
      if (path && !['profile.php', 'people', 'pages', 'groups'].includes(path)) {
        return `https://m.me/${path}`;
      }
      if (path === 'profile.php' && url.searchParams.get('id')) {
        return `https://m.me/${url.searchParams.get('id')}`;
      }
    }
  } catch {
    /* fall through */
  }

  const username = raw.replace(/^@/, '').replace(/^https?:\/\//i, '').split('/')[0];
  if (username) return `https://m.me/${username}`;
  return null;
}

/** Số Zalo → zalo.me (chat trực tiếp) */
export function buildZaloUrl(zaloPhone) {
  const digits = (zaloPhone || '').replace(/\D/g, '');
  if (!digits) return null;
  let phone = digits;
  if (phone.startsWith('0')) phone = `84${phone.slice(1)}`;
  else if (!phone.startsWith('84')) phone = `84${phone}`;
  return `https://zalo.me/${phone}`;
}

export function buildGmailUrl(email) {
  const trimmed = (email || '').trim();
  if (!trimmed || !trimmed.includes('@')) return null;
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(trimmed)}`;
}

export function buildTelUrl(phone) {
  const digits = (phone || '').replace(/\s/g, '');
  if (!digits) return null;
  return `tel:${digits}`;
}

export function openExternalChat(url) {
  if (!url) return false;
  window.open(url, '_blank', 'noopener,noreferrer');
  return true;
}
