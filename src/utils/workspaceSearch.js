import { formatVND } from './format.js';
import { getEffectiveAIConfig } from './aiSettingsStorage.js';

const TODAY = '2026-05-23';

function norm(q) {
  return (q || '').toLowerCase().normalize('NFD').replace(/\p{M}/gu, '').trim();
}

function matchAny(text, keywords) {
  const t = norm(text);
  return keywords.some((k) => t.includes(norm(k)));
}

/** Trả lời nhanh từ dữ liệu — không cần API */
export function runLocalWorkspaceSearch(query, ctx) {
  const q = norm(query);
  const s = ctx.summary;
  const bullets = [];
  let action = null;

  if (!q) return { answer: 'Nhập câu hỏi về dự án, tiền, hạn, hợp đồng…', bullets: [], source: 'local' };

  if (matchAny(q, ['doanh thu', 'so tien', 'tong tien', 'ngan sach', 'budget', 'tien'])) {
    if (matchAny(q, ['hom nay', 'today'])) {
      const todayTasks = ctx.tasksDueToday?.length ?? 0;
      return {
        answer: `Hôm nay (${TODAY}): ${todayTasks} công việc đến hạn. Tổng ngân sách toàn bộ dự án: ${s.totalBudgetFormatted}; dự án đang chạy: ${s.activeBudgetFormatted}.`,
        bullets: ctx.tasksDueToday?.slice(0, 5).map((t) => `• ${t.title} (${t.status})`) ?? [],
        source: 'local',
        action: todayTasks ? { tab: 'myTasks', contextKey: 'today' } : { tab: 'dashboard', contextKey: 'overview' },
      };
    }
    return {
      answer: `Tổng ngân sách ${s.projectsTotal} dự án: ${s.totalBudgetFormatted}. Dự án đang hoạt động (${s.projectsActive}): ${s.activeBudgetFormatted}.`,
      bullets: ctx.projects?.slice(0, 4).map((p) => `• ${p.name}: ${p.budgetFormatted}`) ?? [],
      source: 'local',
      action: { tab: 'dashboard', contextKey: 'overview' },
    };
  }

  if (matchAny(q, ['sap het han', 'het han', 'gia han', 'expir', 'deadline', 'han '])) {
    const total = s.projectsDueWithin14Days + s.assetsExpiring + s.assetsOverdue + s.subscriptionsExpiring + s.subscriptionsOverdue;
    bullets.push(
      `• Dự án sắp hết hạn (≤14 ngày): ${s.projectsDueWithin14Days}`,
      `• Hạ tầng khách sắp hết hạn: ${s.assetsExpiring}, quá hạn: ${s.assetsOverdue}`,
      `• Tài khoản đã mua sắp hết hạn: ${s.subscriptionsExpiring}, quá hạn: ${s.subscriptionsOverdue}`,
    );
    ctx.projectsDueSoon?.forEach((p) => bullets.push(`  → ${p.name}: còn ${p.daysLeft} ngày (${p.deadline})`));
    action = s.assetsExpiring + s.assetsOverdue > 0
      ? { tab: 'assets', contextKey: 'expiring' }
      : { tab: 'projects', contextKey: 'all' };
    return {
      answer: `Có ${total} hạng mục cần chú ý về hạn (dự án + hạ tầng + tài khoản). Chi tiết:`,
      bullets,
      source: 'local',
      action,
    };
  }

  if (matchAny(q, ['bao nhieu du an', 'du an', 'project'])) {
    if (matchAny(q, ['cham', 'delay'])) {
      return {
        answer: `Có ${s.projectsDelayed} dự án chậm tiến độ trên tổng ${s.projectsTotal} dự án.`,
        bullets: ctx.projects?.filter((p) => p.status === 'Chậm tiến độ').map((p) => `• ${p.name}`) ?? [],
        source: 'local',
        action: { tab: 'projects', contextKey: 'all' },
      };
    }
    return {
      answer: `Tổng ${s.projectsTotal} dự án: ${s.projectsActive} đang chạy, ${s.projectsCompleted} đã chốt, ${s.projectsDelayed} chậm tiến độ, ${s.projectsDueWithin14Days} sắp đến deadline (14 ngày).`,
      bullets: ctx.projectsDueSoon?.map((p) => `• ${p.name} — còn ${p.daysLeft} ngày`) ?? [],
      source: 'local',
      action: { tab: 'projects', contextKey: 'all' },
    };
  }

  if (matchAny(q, ['viec', 'task', 'cong viec', 'hom nay'])) {
    return {
      answer: `Hôm nay ${s.tasksDueToday} việc đến hạn, ${s.tasksOverdue} việc quá hạn, tổng ${s.tasksTotal} task trong hệ thống.`,
      bullets: ctx.tasksDueToday?.map((t) => `• ${t.title}`) ?? [],
      source: 'local',
      action: { tab: 'myTasks', contextKey: 'today' },
    };
  }

  if (matchAny(q, ['hop dong', 'contract', 'hd '])) {
    return {
      answer: `Đang có ${s.contractsTotal} hợp đồng trong workspace.`,
      bullets: [],
      source: 'local',
      action: { tab: 'contracts', contextKey: 'all' },
    };
  }

  if (matchAny(q, ['khach', 'client', 'crm'])) {
    return {
      answer: `Có ${s.clientsTotal} khách hàng trong CRM.`,
      bullets: [],
      source: 'local',
      action: { tab: 'crm', contextKey: 'all' },
    };
  }

  if (matchAny(q, ['tin', 'inbox', 'thong bao'])) {
    return {
      answer: `Hộp thư: ${s.inboxUnread} tin chưa đọc.`,
      bullets: [],
      source: 'local',
      action: { tab: 'inbox', contextKey: s.inboxUnread ? 'unread' : 'all' },
    };
  }

  if (matchAny(q, ['ha tang', 'hosting', 'ten mien', 'vps'])) {
    return {
      answer: `Hạ tầng khách: ${s.assetsExpiring} sắp hết hạn, ${s.assetsOverdue} quá hạn.`,
      bullets: ctx.assetsAlerts?.map((a) => `• ${a.name} — ${a.status} (${a.expiryDate})`) ?? [],
      source: 'local',
      action: { tab: 'assets', contextKey: 'expiring' },
    };
  }

  return null;
}

/** Gọi API OpenAI-compatible (khi có VITE_AI_API_KEY) */
export async function runAIWorkspaceSearch(query, ctx) {
  const { apiKey, apiBase, model } = getEffectiveAIConfig();
  const baseUrl = apiBase.replace(/\/$/, '');

  const system = `Bạn là trợ lý workspace ThompBui (quản lý dự án freelance/agency).
Chỉ trả lời dựa trên JSON "workspace_data" — không bịa số liệu.
Trả lời tiếng Việt, ngắn gọn (2-4 câu), có số cụ thể khi có trong data.
Nếu không đủ dữ liệu, nói rõ phần nào thiếu.`;

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      messages: [
        { role: 'system', content: system },
        {
          role: 'user',
          content: `workspace_data:\n${JSON.stringify(ctx, null, 0)}\n\nCâu hỏi: ${query}`,
        },
      ],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || `AI API ${res.status}`);
  }

  const data = await res.json();
  const answer = data.choices?.[0]?.message?.content?.trim() || 'Không nhận được phản hồi từ AI.';
  return { answer, bullets: [], source: 'ai' };
}

export async function runWorkspaceSearch(query, ctx) {
  const { apiKey } = getEffectiveAIConfig();

  if (apiKey) {
    try {
      return await runAIWorkspaceSearch(query, ctx);
    } catch (e) {
      const local = runLocalWorkspaceSearch(query, ctx);
      if (local) return { ...local, source: 'local' };
      return {
        answer: `Lỗi AI: ${e.message}. Kiểm tra API Key / Base URL trong menu Cài đặt.`,
        bullets: [],
        source: 'error',
      };
    }
  }

  const local = runLocalWorkspaceSearch(query, ctx);
  if (local) return local;

  return {
    answer: 'Chưa nhận diện câu hỏi. Vào Cài đặt → API AI để bật trợ lý thông minh, hoặc thử gợi ý bên dưới.',
    bullets: SEARCH_EXAMPLES.map((ex) => `• ${ex}`),
    source: 'hint',
  };
}

export const SEARCH_EXAMPLES = [
  'Tổng ngân sách các dự án',
  'Bao nhiêu dự án sắp hết hạn',
  'Việc đến hạn hôm nay',
  'Dự án chậm tiến độ',
  'Hạ tầng sắp hết hạn',
];
