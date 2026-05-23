export const formatVND = (amount) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

export const daysBetween = (start, end) => {
  const a = new Date(start);
  const b = new Date(end);
  return Math.max(1, Math.round((b - a) / (1000 * 60 * 60 * 24)) + 1);
};
