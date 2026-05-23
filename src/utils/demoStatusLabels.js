/** Canonical demo values (Vietnamese) stored in mock data — display via i18n only. */

export const TASK_COLUMN_STATUSES = ['Cần làm', 'Đang làm', 'Chờ duyệt', 'Hoàn thành'];

const STATUS_I18N_KEY = {
  'Đang làm': 'demoStatus.inProgress',
  'Chậm tiến độ': 'demoStatus.delayed',
  'Hoàn thành': 'demoStatus.completed',
  'Cần làm': 'demoStatus.todo',
  'Chờ duyệt': 'demoStatus.review',
  'Sắp hết hạn': 'demoStatus.expiring',
  'Quá hạn': 'demoStatus.overdue',
  'Đang chạy': 'demoStatus.running',
  'Đang dùng': 'demoStatus.inUse',
};

export function labelDemoStatus(status, t) {
  if (!status) return '';
  const key = STATUS_I18N_KEY[status];
  return key ? t(key) : status;
}
