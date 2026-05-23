/** Static UI labels for breadcrumb context keys (dynamic names stay as-is). */
export function getBreadcrumbContextLabel(t, activeTab, contextKey) {
  const maps = {
    dashboard: {
      overview: 'dashboard.overviewTitle',
      activity: 'dashboard.activityTitle',
      alerts: 'dashboard.alertsTitle',
      messages: 'dashboard.messagesTitle',
    },
    inbox: {
      all: 'inbox.allMail',
      unread: 'inbox.unreadMail',
      read: 'inbox.readMail',
      mention: 'context.mention',
      client: 'context.fromClient',
      deadline: 'context.dueSoon',
    },
    projects: {
      all: 'projects.all',
      client: 'projects.client',
      partnership: 'projects.partnership',
    },
    contracts: {
      all: 'contracts.all',
      client: 'contracts.client',
      freelancer: 'contracts.freelancer',
    },
    assets: {
      all: 'context.allServices',
      expiring: 'context.expiring',
      overdue: 'context.overdue',
      domain: 'context.domain',
      hosting: 'assets.colType',
    },
    subscriptions: {
      all: 'subscriptions.allTitle',
      expiring: 'subscriptions.expiringTitle',
      overdue: 'subscriptions.overdueTitle',
      active: 'subscriptions.activeTitle',
    },
    calendar: {
      month: 'common.monthMay2026',
      week: 'context.thisWeek',
      deadlines: 'context.projectDeadlines',
    },
    myTasks: {
      all: 'context.allTasks',
      today: 'context.dueToday',
    },
    settings: {
      appearance: 'settings.appearance',
      ai: 'settings.aiNav',
    },
  };

  const i18nKey = maps[activeTab]?.[contextKey];
  if (i18nKey) return t(i18nKey);

  return contextKey;
}
