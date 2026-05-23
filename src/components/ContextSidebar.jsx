import { ChevronLeft, Plus } from 'lucide-react';
import UserAvatar from './UserAvatar.jsx';
import { useAppPreferences } from '../context/AppPreferencesContext.jsx';
import { labelDemoStatus, TASK_COLUMN_STATUSES } from '../utils/demoStatusLabels.js';

function NavItem({ active, onClick, children, badge }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
        active ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
      }`}
    >
      {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-indigo-500 rounded-r" />}
      <span className="flex items-center justify-between gap-2 pl-1">
        <span className="truncate">{children}</span>
        {badge != null && (
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-slate-700 text-slate-300 shrink-0">{badge}</span>
        )}
      </span>
    </button>
  );
}

function Section({ title, children }) {
  return (
    <div>
      {title && <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">{title}</p>}
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

export default function ContextSidebar({
  activeTab,
  contextKey,
  setContextKey,
  moduleTitle,
  onCollapse,
  perms,
  clientProjects,
  partnershipProjects,
  visibleProjects,
  clients,
  freelancers,
  inboxCount,
  inboxUnreadCount,
  onOpenProject,
  activeProjectId,
  onCreateProject,
  onCreateClient,
  onCreateContract,
  onCreateSubscription,
  onCreateCollaborator,
  onCreateAsset,
  getPersonaColor,
}) {
  const { t } = useAppPreferences();

  const filterProjects = () => {
    if (contextKey === 'client') return clientProjects;
    if (contextKey === 'partnership') return partnershipProjects;
    return visibleProjects;
  };

  const renderBody = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            <Section>
              <NavItem active={contextKey === 'overview'} onClick={() => setContextKey('overview')}>{t('context.overview')}</NavItem>
              <NavItem active={contextKey === 'activity'} onClick={() => setContextKey('activity')}>{t('context.activity')}</NavItem>
              <NavItem active={contextKey === 'alerts'} onClick={() => setContextKey('alerts')}>{t('context.alerts')}</NavItem>
              <NavItem active={contextKey === 'messages'} onClick={() => setContextKey('messages')}>{t('context.messages')}</NavItem>
            </Section>
          </>
        );

      case 'projects': {
        const list = filterProjects();
        return (
          <>
            <Section>
              <NavItem active={contextKey === 'all'} onClick={() => setContextKey('all')} badge={visibleProjects.length}>
                {t('projects.all')}
              </NavItem>
              <NavItem active={contextKey === 'client'} onClick={() => setContextKey('client')} badge={clientProjects.length}>
                {t('projects.client')}
              </NavItem>
              {partnershipProjects.length > 0 && (
                <NavItem active={contextKey === 'partnership'} onClick={() => setContextKey('partnership')} badge={partnershipProjects.length}>
                  {t('projects.partnership')}
                </NavItem>
              )}
            </Section>
            <Section title={t('context.list')}>
              {list.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onOpenProject(p.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm truncate transition-colors ${
                    activeProjectId === p.id ? 'bg-indigo-500/15 text-indigo-300 font-medium' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {p.name}
                </button>
              ))}
              {list.length === 0 && <p className="px-3 text-xs text-slate-500">{t('context.noProjects')}</p>}
            </Section>
          </>
        );
      }

      case 'myTasks':
        return (
          <Section>
            <NavItem active={contextKey === 'all'} onClick={() => setContextKey('all')}>{t('context.allTasks')}</NavItem>
            <NavItem active={contextKey === 'today'} onClick={() => setContextKey('today')}>{t('context.dueToday')}</NavItem>
            {TASK_COLUMN_STATUSES.map((s) => (
              <NavItem key={s} active={contextKey === s} onClick={() => setContextKey(s)}>
                {labelDemoStatus(s, t)}
              </NavItem>
            ))}
          </Section>
        );

      case 'inbox':
        return (
          <>
            <Section title={t('context.statusSection')}>
              <NavItem active={contextKey === 'all'} onClick={() => setContextKey('all')} badge={inboxCount}>
                {t('common.all')}
              </NavItem>
              <NavItem active={contextKey === 'unread'} onClick={() => setContextKey('unread')} badge={inboxUnreadCount}>
                {t('context.unreadMailShort')}
              </NavItem>
              <NavItem active={contextKey === 'read'} onClick={() => setContextKey('read')}>
                {t('context.readMailShort')}
              </NavItem>
            </Section>
            <Section title={t('context.categorySection')}>
              <NavItem active={contextKey === 'mention'} onClick={() => setContextKey('mention')}>{t('context.mention')}</NavItem>
              <NavItem active={contextKey === 'client'} onClick={() => setContextKey('client')}>{t('context.fromClient')}</NavItem>
              <NavItem active={contextKey === 'deadline'} onClick={() => setContextKey('deadline')}>{t('context.dueSoon')}</NavItem>
            </Section>
          </>
        );

      case 'subscriptions':
        return (
          <Section>
            <NavItem active={contextKey === 'all'} onClick={() => setContextKey('all')}>{t('context.allAccounts')}</NavItem>
            <NavItem active={contextKey === 'expiring'} onClick={() => setContextKey('expiring')}>{t('context.expiring')}</NavItem>
            <NavItem active={contextKey === 'overdue'} onClick={() => setContextKey('overdue')}>{t('context.overdueRenew')}</NavItem>
            <NavItem active={contextKey === 'active'} onClick={() => setContextKey('active')}>{t('context.activeOk')}</NavItem>
          </Section>
        );

      case 'calendar':
        return (
          <Section>
            <NavItem active={contextKey === 'month'} onClick={() => setContextKey('month')}>{t('common.monthMay2026')}</NavItem>
            <NavItem active={contextKey === 'week'} onClick={() => setContextKey('week')}>{t('context.thisWeek')}</NavItem>
            <NavItem active={contextKey === 'deadlines'} onClick={() => setContextKey('deadlines')}>{t('context.projectDeadlines')}</NavItem>
          </Section>
        );

      case 'crm':
        return (
          <>
            <Section>
              <NavItem active={contextKey === 'all'} onClick={() => setContextKey('all')} badge={clients.length}>
                {t('crm.allClients')}
              </NavItem>
            </Section>
            <Section title={t('context.directory')}>
              {clients.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setContextKey(`client-${c.id}`)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    contextKey === `client-${c.id}` ? 'bg-indigo-500/15 text-indigo-300' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <UserAvatar name={c.name} colorClass="from-slate-600 to-slate-500" size="sm" />
                  <span className="truncate">{c.name}</span>
                </button>
              ))}
            </Section>
          </>
        );

      case 'assets':
        return (
          <Section>
            <NavItem active={contextKey === 'all'} onClick={() => setContextKey('all')}>{t('context.allServices')}</NavItem>
            <NavItem active={contextKey === 'expiring'} onClick={() => setContextKey('expiring')}>{t('context.expiring')}</NavItem>
            <NavItem active={contextKey === 'overdue'} onClick={() => setContextKey('overdue')}>{t('context.overdue')}</NavItem>
            <NavItem active={contextKey === 'domain'} onClick={() => setContextKey('domain')}>{t('context.domain')}</NavItem>
            <NavItem active={contextKey === 'hosting'} onClick={() => setContextKey('hosting')}>{t('context.hosting')}</NavItem>
          </Section>
        );

      case 'contracts':
        return (
          <Section>
            <NavItem active={contextKey === 'all'} onClick={() => setContextKey('all')}>{t('context.allContracts')}</NavItem>
            <NavItem active={contextKey === 'client'} onClick={() => setContextKey('client')}>{t('context.clientContract')}</NavItem>
            <NavItem active={contextKey === 'freelancer'} onClick={() => setContextKey('freelancer')}>{t('context.freelancerContract')}</NavItem>
          </Section>
        );

      case 'collaborators':
        return (
          <>
            <Section>
              <NavItem active={contextKey === 'all'} onClick={() => setContextKey('all')}>{t('context.allPeople')}</NavItem>
            </Section>
            <Section title={t('context.directMessages')}>
              {freelancers.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setContextKey(`dm-${f.id}`)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    contextKey === `dm-${f.id}` ? 'bg-indigo-500/15 text-indigo-300' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <UserAvatar name={f.name} colorClass={getPersonaColor(f.userId)} size="sm" />
                  <span className="truncate">{f.name}</span>
                </button>
              ))}
            </Section>
          </>
        );

      case 'settings':
        return (
          <Section>
            <NavItem active={contextKey === 'appearance'} onClick={() => setContextKey('appearance')}>
              {t('settings.appearance')}
            </NavItem>
            <NavItem active={contextKey === 'ai'} onClick={() => setContextKey('ai')}>
              {t('settings.aiNav')}
            </NavItem>
          </Section>
        );

      default:
        return null;
    }
  };

  const showCreate =
    (activeTab === 'projects' && perms.createProject) ||
    (activeTab === 'crm' && perms.crm) ||
    (activeTab === 'assets' && perms.assets) ||
    (activeTab === 'contracts' && perms.contracts) ||
    (activeTab === 'subscriptions' && perms.subscriptions) ||
    (activeTab === 'collaborators' && perms.collaborators);

  const createLabels = {
    projects: t('create.project'),
    crm: t('create.client'),
    assets: t('create.asset'),
    contracts: t('create.contract'),
    subscriptions: t('create.subscription'),
    collaborators: t('create.collaborator'),
  };

  const handleCreate = () => {
    if (activeTab === 'projects') onCreateProject?.();
    if (activeTab === 'crm') onCreateClient?.();
    if (activeTab === 'assets') onCreateAsset?.();
    if (activeTab === 'contracts') onCreateContract?.();
    if (activeTab === 'subscriptions') onCreateSubscription?.();
    if (activeTab === 'collaborators') onCreateCollaborator?.();
  };

  return (
    <aside className="app-context w-64 shrink-0 flex flex-col no-print overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 shrink-0">
        <h2 className="font-semibold text-white text-sm truncate">{moduleTitle}</h2>
        <button type="button" onClick={onCollapse} className="p-1 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800" title={t('collapse')}>
          <ChevronLeft size={18} />
        </button>
      </div>
      {showCreate && (
        <div className="px-3 py-3 border-b border-slate-800 shrink-0">
          <button
            type="button"
            onClick={handleCreate}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
          >
            <Plus size={16} /> {createLabels[activeTab] ?? t('createNew')}
          </button>
        </div>
      )}
      <div className="flex-1 overflow-y-auto p-3 space-y-5">{renderBody()}</div>
    </aside>
  );
}
