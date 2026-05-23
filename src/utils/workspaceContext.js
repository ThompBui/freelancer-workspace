import { formatVND } from './format.js';

const TODAY = '2026-05-23';

function daysUntil(dateStr) {
  if (!dateStr) return null;
  const a = new Date(TODAY);
  const b = new Date(dateStr);
  return Math.ceil((b - a) / (1000 * 60 * 60 * 24));
}

/** Snapshot dữ liệu workspace — đưa vào prompt AI hoặc search local */
export function buildWorkspaceContext({
  projects,
  tasks,
  clients,
  assets,
  purchasedAccounts,
  contracts,
  freelancers,
  inboxMessages,
}) {
  const activeProjects = projects.filter((p) => !p.isCompleted);
  const delayed = projects.filter((p) => p.status === 'Chậm tiến độ');
  const totalBudget = projects.reduce((s, p) => s + (p.budget || 0), 0);
  const activeBudget = activeProjects.reduce((s, p) => s + (p.budget || 0), 0);

  const tasksToday = tasks.filter((t) => t.dueDate === TODAY);
  const tasksOverdue = tasks.filter((t) => daysUntil(t.dueDate) < 0 && t.status !== 'Hoàn thành');

  const projectsDueSoon = projects.filter((p) => {
    const d = daysUntil(p.deadline);
    return d != null && d >= 0 && d <= 14 && !p.isCompleted;
  });

  const assetsExpiring = assets.filter((a) => a.status === 'Sắp hết hạn');
  const assetsOverdue = assets.filter((a) => a.status === 'Quá hạn');
  const subsExpiring = purchasedAccounts.filter((a) => a.status === 'Sắp hết hạn');
  const subsOverdue = purchasedAccounts.filter((a) => a.status === 'Quá hạn');

  const inboxUnread = inboxMessages.filter((m) => !m.read);

  return {
    today: TODAY,
    summary: {
      projectsTotal: projects.length,
      projectsActive: activeProjects.length,
      projectsCompleted: projects.filter((p) => p.isCompleted).length,
      projectsDelayed: delayed.length,
      projectsDueWithin14Days: projectsDueSoon.length,
      totalBudgetFormatted: formatVND(totalBudget),
      activeBudgetFormatted: formatVND(activeBudget),
      tasksTotal: tasks.length,
      tasksDueToday: tasksToday.length,
      tasksOverdue: tasksOverdue.length,
      clientsTotal: clients.length,
      freelancersTotal: freelancers.length,
      contractsTotal: contracts.length,
      assetsExpiring: assetsExpiring.length,
      assetsOverdue: assetsOverdue.length,
      subscriptionsExpiring: subsExpiring.length,
      subscriptionsOverdue: subsOverdue.length,
      inboxUnread: inboxUnread.length,
    },
    projects: projects.map((p) => ({
      id: p.id,
      name: p.name,
      status: p.status,
      budget: p.budget,
      budgetFormatted: formatVND(p.budget),
      deadline: p.deadline,
      daysToDeadline: daysUntil(p.deadline),
      isCompleted: p.isCompleted,
      clientId: p.clientId,
    })),
    tasksDueToday: tasksToday.map((t) => ({
      title: t.title,
      status: t.status,
      projectId: t.projectId,
      dueDate: t.dueDate,
    })),
    projectsDueSoon: projectsDueSoon.map((p) => ({
      name: p.name,
      deadline: p.deadline,
      daysLeft: daysUntil(p.deadline),
      status: p.status,
    })),
    assetsAlerts: [...assetsExpiring, ...assetsOverdue].map((a) => ({
      name: a.name,
      status: a.status,
      expiryDate: a.expiryDate,
    })),
  };
}
