# ThompBui — Phân tích nâng cấp Agency Solo

## 1. So sánh nhanh (ClickUp / Notion / Monday / Basecamp)

| Tiêu chí | ClickUp | Monday | **ThompBui (mục tiêu)** |
|----------|---------|--------|---------------------------|
| Đối tượng | Team lớn | Team | **1 owner + freelancer + khách** |
| CRM + Hợp đồng | Plugin / tách app | Yếu | **Gộp một chỗ** |
| Hosting / tên miền khách | Không có | Không | **Có — doanh thu thụ động** |
| Tool đã mua (Figma, Adobe…) | Không | Không | **Có — tránh quá hạn** |
| Phân trang list | 20–50/trang | 25–50 | **20/trang (chuẩn)** |
| Lưu trữ file | Cloud + link | Cloud | **Link + metadata (Drive/Figma)** |

**Kết luận:** Không cạnh tranh feature team; thắng ở **một workspace rút gọn toàn bộ vòng đời solo agency** (khách → hợp đồng → dự án → cộng tác → gia hạn → dòng tiền).

---

## 2. Kiến trúc dữ liệu (backend sau này)

```
Workspace (1 owner)
├── Clients          → CRM, pagination ?page=&limit=20
├── Projects         → client | partnership, members[]
├── Tasks            → assignee, dates, status
├── Contracts        → template merge, PDF
├── Assets           → khách: domain/host/VPS
├── Subscriptions    → tool đã mua, renew alerts
├── Inbox            → read/unread, type filter
├── Messages         → client channel | internal channel
└── Files (meta)     → url, type, projectId — không lưu file nặng trên server
```

**API chuẩn:**

```http
GET /api/projects?page=1&limit=20&status=active&type=client
```

Response:

```json
{ "data": [], "meta": { "page": 1, "limit": 20, "total": 87, "totalPages": 5 } }
```

---

## 3. Phân trang — quy tắc UI

| Màn hình | Phân trang |
|----------|------------|
| Danh sách dự án | ✅ 20 |
| Việc của tôi | ✅ 20 |
| Hộp thư | ✅ 20 |
| CRM khách | ✅ 20 |
| Hạ tầng khách | ✅ 20 |
| Tài khoản đã mua | ✅ 20 |
| Hợp đồng | ✅ 20 |
| Cộng tác viên | ✅ 20 (khi >20) |
| Kanban / Gantt | Không (theo 1 project) |
| Sidebar danh sách | Scroll, không paginate |

Frontend: `PAGE_SIZE = 20`, hook `usePagination`, component `Pagination`.  
Backend: luôn `limit=20`, không load all.

---

## 4. Lưu trữ tối ưu (solo agency)

| Loại | Cách lưu | Lý do |
|------|----------|--------|
| Hợp đồng | Text merge + in PDF, DB lưu JSON nhỏ | Không cần file server |
| Tài liệu dự án | **Chỉ link** (Drive, Figma, Git) | Rẻ, quen thuộc |
| Chat | DB messages, paginate | Audit trail |
| Ảnh / file lớn | S3/R2 **optional** hoặc link ngoài | Tránh chi phí |
| Backup | Export JSON/CSV định kỳ | Solo không cần phức tạp |

---

## 5. Lộ trình nâng cấp

### Phase A — UX chuẩn (đang làm)
- [x] Layout 3 cột ClickUp
- [x] Role demo owner / freelancer / client
- [x] Hộp thư đọc/chưa đọc
- [x] Tài khoản đã mua vs hạ tầng khách
- [x] Phân trang 20/trang (component + hook)

### Phase B — Dữ liệu thật
- [ ] API + PostgreSQL (hoặc Supabase)
- [ ] Auth JWT, bỏ dropdown demo
- [ ] Upload meta file (không blob trong DB)

### Phase C — Agency “xịn”
- [ ] Dashboard P&L: doanh thu / chi phí tool / lợi nhuận
- [ ] Nhắc gia hạn email/Telegram
- [ ] Portal khách read-only
- [ ] Invoice + thanh toán 2 đợt theo hợp đồng
- [ ] Global search (Ctrl+K)

### Phase D — Tự động hóa
- [ ] Trạng thái dự án auto (chậm tiến độ theo deadline)
- [ ] Template dự án (web app, landing, plugin…)
- [ ] Báo cáo PDF tháng cho khách

---

## 6. Module map — đủ cho solo, không thừa team

```
[Tổng quan]     KPI + cảnh báo
[Dự án]         Board | List | Gantt | Docs | Chat khách | Nội bộ | Members
[Việc của tôi]  Cross-project tasks
[Hộp thư]       Đọc / chưa đọc
[Lịch]          Deadline gộp
[CRM]           Khách → dự án → hợp đồng
[Hạ tầng khách] Gia hạn thuê
[Tài khoản mua] Gia hạn tool
[Hợp đồng]      Soạn + in
[Cộng tác]      Freelancer + DM
```

**Không làm (giai đoạn 1):** Timesheet payroll, OKR công ty, whiteboard, form builder — noise cho solo.

---

## 7. Chỉ số “xịn” cần đạt

- Mở app → biết việc gì **hôm nay** (< 3 giây)
- Không quá hạn tool/hosting **không bị surprise**
- Một khách = một luồng: CRM → hợp đồng → dự án → chat
- List > 20 item **không lag** (pagination)
- Mobile: menu có label, cột giữa thu gọn được
