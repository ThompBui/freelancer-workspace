export const ASSET_TYPES = ['Tên miền', 'Hosting', 'Máy chủ (VPS)'];

export function computeAssetStatus(expiryDate) {
  if (!expiryDate) return 'Đang chạy';
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const exp = new Date(expiryDate);
  if (Number.isNaN(exp.getTime())) return 'Đang chạy';
  exp.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return 'Quá hạn';
  if (diffDays <= 14) return 'Sắp hết hạn';
  return 'Đang chạy';
}
