import { buildContractBody } from '../utils/contracts.js';
import { formatVND } from '../utils/format.js';

export const MOCK_FREELANCERS = [
  {
    id: 'f1',
    userId: 'u-f1',
    name: 'Trần Minh',
    email: 'minh.dev@mail.vn',
    phone: '0909111222',
    facebook: 'facebook.com/tranminh.dev',
    zalo: '0909111222',
    skills: ['React', 'UI'],
    avatar: 'M',
  },
  {
    id: 'f2',
    userId: 'u-f2',
    name: 'Nguyễn Lan',
    email: 'lan.be@mail.vn',
    phone: '0909333444',
    facebook: 'm.me/nguyenlan.be',
    zalo: '0909333444',
    skills: ['Node', 'API'],
    avatar: 'L',
  },
];

export const MOCK_CLIENTS = [
  {
    id: 'c1',
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@techcorp.vn',
    phone: '0901234567',
    company: 'Công ty TNHH TechCorp',
    facebook: 'facebook.com/nguyenvana.techcorp',
    zalo: '0901234567',
    userId: 'u-c1',
  },
  {
    id: 'c2',
    name: 'Trần Thị B',
    email: 'tranthib@dabilux.com',
    phone: '0987654321',
    company: 'Dabilux Studio',
    facebook: 'm.me/tranthib.dabilux',
    zalo: '0987654321',
  },
  {
    id: 'c3',
    name: 'Lê Hoàng C',
    email: 'hoangc@startup.vn',
    phone: '0911223344',
    company: 'Startup Đổi Mới',
    facebook: 'facebook.com/lehoangc.startup',
    zalo: '0911223344',
  },
];

export const MOCK_PROJECTS = [
  {
    id: 'p1',
    name: 'Thiết kế hệ thống FMS',
    type: 'client',
    clientId: 'c1',
    memberIds: ['u-owner', 'u-f1', 'u-f2'],
    status: 'Đang làm',
    budget: 150000000,
    deadline: '2026-06-30',
    notes: '- Giao diện tối\n- Khách yêu cầu chuẩn hóa kéo thả',
    isCompleted: false,
  },
  {
    id: 'p2',
    name: 'Ứng dụng di động E-commerce',
    type: 'client',
    clientId: 'c2',
    memberIds: ['u-owner', 'u-f2'],
    status: 'Chậm tiến độ',
    budget: 85000000,
    deadline: '2026-05-10',
    notes: 'Đang đợi khách gửi thêm mã kết nối thanh toán',
    isCompleted: false,
  },
  {
    id: 'p3',
    name: 'Website Landing Page Mỹ Phẩm',
    type: 'client',
    clientId: 'c3',
    memberIds: ['u-owner'],
    status: 'Hoàn thành',
    budget: 15000000,
    deadline: '2026-04-20',
    notes: 'Đã bàn giao và nghiệm thu.',
    isCompleted: true,
  },
  {
    id: 'p4',
    name: 'Plugin WP + API (Liên danh)',
    type: 'partnership',
    clientId: null,
    memberIds: ['u-owner', 'u-f1'],
    status: 'Đang làm',
    budget: 32000000,
    deadline: '2026-06-15',
    notes: 'Dự án cộng tác với Minh — không có khách trực tiếp trên app.',
    isCompleted: false,
  },
];

export const MOCK_TASKS = [
  { id: 't1', title: 'Phân tích hệ thống', description: 'Viết tài liệu phân tích luồng dữ liệu.', status: 'Hoàn thành', startDate: '2026-05-10', dueDate: '2026-05-20', priority: 'Cao', projectId: 'p1', assigneeId: 'u-owner' },
  { id: 't2', title: 'Thiết kế UI Dashboard', description: 'Lên cấu trúc màn hình chính.', status: 'Đang làm', startDate: '2026-05-18', dueDate: '2026-05-25', priority: 'Cao', projectId: 'p1', assigneeId: 'u-f1' },
  { id: 't3', title: 'API Core & Auth', description: 'JWT, refresh token, phân quyền.', status: 'Đang làm', startDate: '2026-05-20', dueDate: '2026-05-28', priority: 'Cao', projectId: 'p1', assigneeId: 'u-f2' },
  { id: 't4', title: 'Tích hợp thanh toán', description: 'Nối hệ thống với ví điện tử.', status: 'Cần làm', startDate: '2026-05-22', dueDate: '2026-05-28', priority: 'Vừa', projectId: 'p2', assigneeId: 'u-f2' },
  { id: 't5', title: 'Custom Post Type WP', description: 'CPT + ACF cho plugin.', status: 'Cần làm', startDate: '2026-05-17', dueDate: '2026-05-24', priority: 'Cao', projectId: 'p4', assigneeId: 'u-f1' },
  { id: 't6', title: 'Review code & deploy', description: 'Staging + checklist bàn giao.', status: 'Chờ duyệt', startDate: '2026-05-23', dueDate: '2026-05-30', priority: 'Vừa', projectId: 'p4', assigneeId: 'u-owner' },
];

export const MOCK_CLIENT_COMMENTS = {
  p1: [
    { id: 1, sender: 'Khách hàng', senderId: 'u-c1', text: 'Tiến độ hệ thống tới đâu rồi em?', time: '10:00' },
    { id: 2, sender: 'Bạn (Owner)', senderId: 'u-owner', text: 'Dạ phần thiết kế màn hình chính xong rồi ạ, em đang làm phần kéo thả.', time: '10:15' },
  ],
};

export const MOCK_INTERNAL_COMMENTS = {
  p1: [
    { id: 1, sender: 'Trần Minh', senderId: 'u-f1', text: 'Anh ơi file Figma em gửi trong Drive nhé.', time: '09:30' },
    { id: 2, sender: 'Bạn (Owner)', senderId: 'u-owner', text: 'OK em, Lan làm API song song nhé.', time: '09:45' },
  ],
  p4: [{ id: 1, sender: 'Trần Minh', senderId: 'u-f1', text: 'Plugin CPT xong 80%, cần endpoint list.', time: '14:00' }],
};

export const MOCK_ASSETS = [
  { id: 'a1', name: 'techcorp.vn', type: 'Tên miền', expiryDate: '2026-05-25', clientId: 'c1', price: 350000, status: 'Sắp hết hạn', note: 'DNS Cloudflare — nhắc khách gia hạn trước 7 ngày' },
  { id: 'a2', name: 'VPS Linux 4GB NVMe', type: 'Máy chủ (VPS)', expiryDate: '2026-06-05', clientId: 'c1', price: 2400000, status: 'Đang chạy', note: 'IP: 103.x.x.x — backup hàng tuần' },
  { id: 'a3', name: 'dabilux.com', type: 'Tên miền', expiryDate: '2027-01-10', clientId: 'c2', price: 350000, status: 'Đang chạy', note: '' },
  { id: 'a4', name: 'Hosting Doanh Nghiệp', type: 'Hosting', expiryDate: '2026-05-22', clientId: 'c2', price: 1200000, status: 'Quá hạn', note: 'Đã gọi khách 20/05 — chờ chuyển khoản' },
];

export const MOCK_INBOX = [
  { id: 1, type: 'mention', title: '@Bạn trong #FMS nội bộ', desc: 'Lan: API auth xong, cần review.', time: '5 phút', projectId: 'p1', forRoles: ['owner', 'freelancer'], read: false },
  { id: 2, type: 'client', title: 'Tin nhắn khách Nguyễn Văn A', desc: 'Tiến độ hệ thống tới đâu rồi em?', time: '1 giờ', projectId: 'p1', forRoles: ['owner', 'client'], read: false },
  { id: 3, type: 'deadline', title: 'Task sắp trễ hạn', desc: 'Tích hợp thanh toán — 28/05', time: 'Hôm nay', projectId: 'p2', forRoles: ['owner', 'freelancer'], read: true },
  { id: 4, type: 'mention', title: 'Minh gửi file Figma', desc: 'Link Drive trong chat nội bộ FMS.', time: 'Hôm qua', projectId: 'p1', forRoles: ['owner'], read: true },
  { id: 5, type: 'client', title: 'Trần Thị B — API key', desc: 'Chị gửi key qua email, em check giúp.', time: '2 giờ', projectId: 'p2', forRoles: ['owner'], read: false },
  ...Array.from({ length: 18 }, (_, i) => ({
    id: 10 + i,
    type: ['mention', 'client', 'deadline'][i % 3],
    title: `Thông báo demo #${i + 6}`,
    desc: 'Dữ liệu mẫu để kiểm tra phân trang 20/trang.',
    time: `${i + 1} giờ`,
    projectId: i % 2 === 0 ? 'p1' : 'p2',
    forRoles: ['owner', 'freelancer'],
    read: i % 4 === 0,
  })),
];

/** Tài khoản / dịch vụ bạn đã mua — theo dõi gia hạn (không quá hạn) */
export const MOCK_PURCHASED_ACCOUNTS = [
  { id: 'pa1', name: 'Adobe Creative Cloud', vendor: 'Adobe', category: 'Phần mềm', expiryDate: '2026-06-01', renewPrice: 1680000, billingCycle: 'Năm', status: 'Sắp hết hạn', note: 'Gia hạn trước 01/06' },
  { id: 'pa2', name: 'GitHub Team', vendor: 'GitHub', category: 'Dev tools', expiryDate: '2026-08-15', renewPrice: 950000, billingCycle: 'Tháng', status: 'Đang dùng', note: 'Auto-renew bật' },
  { id: 'pa3', name: 'Figma Professional', vendor: 'Figma', category: 'Design', expiryDate: '2026-05-20', renewPrice: 450000, billingCycle: 'Tháng', status: 'Quá hạn', note: 'Cần gia hạn gấp — đã quá 3 ngày' },
  { id: 'pa4', name: 'Cloudflare Pro', vendor: 'Cloudflare', category: 'Hạ tầng', expiryDate: '2026-05-28', renewPrice: 520000, billingCycle: 'Tháng', status: 'Sắp hết hạn', note: 'DNS + WAF' },
  { id: 'pa5', name: 'Google Workspace', vendor: 'Google', category: 'Email', expiryDate: '2027-02-01', renewPrice: 2100000, billingCycle: 'Năm', status: 'Đang dùng', note: '5 user' },
  { id: 'pa6', name: 'Cursor Pro', vendor: 'Cursor', category: 'Dev tools', expiryDate: '2026-05-25', renewPrice: 480000, billingCycle: 'Tháng', status: 'Sắp hết hạn', note: '' },
];

export const MOCK_PROJECT_ACTIVITIES = [
  { id: 1, title: 'Dự án "Thiết kế hệ thống FMS"', desc: 'Minh chuyển "Thiết kế UI Dashboard" sang Đang làm.', time: '15 phút trước', type: 'success' },
  { id: 2, title: 'Dự án "App Mobile E-commerce"', desc: 'Hệ thống cảnh báo: Chậm tiến độ so với hạn chót 10/05.', time: '2 giờ trước', type: 'danger' },
];

export const MOCK_CHAT_NOTIFICATIONS = [
  { id: 1, client: 'Trần Thị B', project: 'App Mobile E-commerce', desc: 'Em ơi, API key chị gửi qua email rồi nhé.', time: '1 giờ trước' },
  { id: 2, client: 'Nguyễn Văn A', project: 'Thiết kế hệ thống FMS', desc: 'Tiến độ hệ thống tới đâu rồi em?', time: 'Hôm qua' },
];

export const CONTRACT_TEMPLATE = `CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
----------------------

HỢP ĐỒNG DỊCH VỤ PHÁT TRIỂN PHẦN MỀM
Số: {{contract_id}}/HĐDV/2026

Hôm nay, ngày {{current_date}}. Chúng tôi gồm có:

BÊN A (KHÁCH HÀNG): {{client_company}}
Đại diện: Ông/Bà {{client_name}}
Email: {{client_email}}
Điện thoại: {{client_phone}}

BÊN B (ĐƠN VỊ PHÁT TRIỂN): THOMPBUI
Đại diện: Freelancer Cao Cấp

HAI BÊN THỎA THUẬN KÝ KẾT HỢP ĐỒNG VỚI CÁC ĐIỀU KHOẢN SAU:

Điều 1: Nội dung công việc
Bên B nhận thực hiện dự án "{{project_name}}" cho Bên A theo đúng yêu cầu đã thống nhất.

Điều 2: Giá trị hợp đồng & Thanh toán
Tổng giá trị hợp đồng: {{project_value}}.
Thanh toán làm 2 đợt: 50% sau khi ký hợp đồng và 50% trước khi bàn giao source code.

Điều 3: Cam kết chung
Hai bên cam kết thực hiện đúng các điều khoản quy định trong hợp đồng. Mọi thay đổi phải được thống nhất bằng văn bản.

ĐẠI DIỆN BÊN A                                     ĐẠI DIỆN BÊN B
(Ký, ghi rõ họ tên)                                (Ký, ghi rõ họ tên)`;

/** Hợp đồng cộng tác — Bạn (agency) thuê freelancer cho dự án */
export const FREELANCER_CONTRACT_TEMPLATE = `CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
----------------------

HỢP ĐỒNG CỘNG TÁC / GIAO VIỆC FREELANCE
Số: {{contract_id}}/HĐCT/2026

Hôm nay, ngày {{current_date}}. Chúng tôi gồm có:

BÊN A (BÊN THUÊ — AGENCY): THOMPBUI
Đại diện: {{owner_name}}
Email: contact@thompbui.com

BÊN B (CỘNG TÁC VIÊN): {{freelancer_name}}
Email: {{freelancer_email}}
Điện thoại: {{freelancer_phone}}

HAI BÊN THỎA THUẬN KÝ KẾT HỢP ĐỒNG VỚI CÁC ĐIỀU KHOẢN SAU:

Điều 1: Phạm vi công việc
Bên B nhận thực hiện các hạng mục sau trong dự án "{{project_name}}":
{{work_scope}}

Điều 2: Thời hạn & bàn giao
Hoàn thành trước ngày: {{deadline}}.
Bàn giao: source code / file thiết kế / tài liệu theo checklist Bên A gửi.

Điều 3: Thù lao & thanh toán
Tổng thù lao: {{payment_amount}}.
Hình thức: {{payment_terms}}.

Điều 4: Bảo mật & quyền sở hữu
Bên B cam kết bảo mật thông tin dự án và khách hàng của Bên A. Quyền sở hữu sản phẩm thuộc Bên A sau khi Bên A thanh toán đủ.

Điều 5: Chấm dứt
Một trong hai bên có quyền chấm dứt nếu bên kia vi phạm nghiêm trọng, thông báo bằng văn bản (email).

ĐẠI DIỆN BÊN A (AGENCY)                           ĐẠI DIỆN BÊN B (CỘNG TÁC)
(Ký, ghi rõ họ tên)                                (Ký, ghi rõ họ tên)`;

const DEMO_DATE = '23/5/2026';

export const MOCK_SAMPLE_CONTRACTS = [
  {
    id: 'HD-240501',
    type: 'client',
    clientId: 'c1',
    freelancerId: null,
    projectId: 'p1',
    createdAt: DEMO_DATE,
    title: 'HĐ khách — Nguyễn Văn A',
    partyName: 'Nguyễn Văn A',
    projectName: 'Thiết kế hệ thống FMS',
    rawValue: 150000000,
    bodyFormat: 'text',
    body: buildContractBody(CONTRACT_TEMPLATE, {
      contract_id: '240501',
      current_date: DEMO_DATE,
      client_company: 'Công ty TNHH TechCorp',
      client_name: 'Nguyễn Văn A',
      client_email: 'nguyenvana@techcorp.vn',
      client_phone: '0901234567',
      project_name: 'Thiết kế hệ thống FMS',
      project_value: formatVND(150000000),
    }),
  },
  {
    id: 'HĐCT-240502',
    type: 'freelancer',
    clientId: null,
    freelancerId: 'f1',
    projectId: 'p1',
    createdAt: DEMO_DATE,
    title: 'HĐ cộng tác — Trần Minh',
    partyName: 'Trần Minh',
    projectName: 'Thiết kế hệ thống FMS',
    rawValue: 25000000,
    bodyFormat: 'text',
    body: buildContractBody(FREELANCER_CONTRACT_TEMPLATE, {
      contract_id: '240502',
      current_date: DEMO_DATE,
      owner_name: 'ThompBui',
      freelancer_name: 'Trần Minh',
      freelancer_email: 'minh.dev@mail.vn',
      freelancer_phone: '0909111222',
      project_name: 'Thiết kế hệ thống FMS',
      work_scope: '- Phát triển giao diện React theo Figma\n- Code review 2 lần/tuần',
      payment_amount: formatVND(25000000),
      payment_terms: '50% khi ký, 50% khi nghiệm thu',
      deadline: '2026-06-30',
    }),
  },
];

export const ASSIGNEE_COLORS = {
  'u-owner': 'bg-indigo-500',
  'u-f1': 'bg-cyan-500',
  'u-f2': 'bg-emerald-500',
};

export function getMemberLabel(userId, freelancers) {
  if (userId === 'u-owner') return 'Bạn (Owner)';
  const f = freelancers.find((x) => x.userId === userId);
  return f?.name ?? userId;
}
