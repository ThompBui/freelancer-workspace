import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  LayoutDashboard,
  Users,
  KanbanSquare,
  FileSignature,
  Plus,
  Clock,
  CheckCircle2,
  MoreVertical,
  Printer,
  X,
  Briefcase,
  DollarSign,
  CalendarDays,
  Mail,
  Phone,
  Building2,
  Bell,
  AlertCircle,
  Filter,
  Lock,
  ArrowLeft,
  MessageSquare,
  Send,
  Globe,
  HardDrive,
  Server,
  MessageCircle,
  Activity,
  ShieldAlert,
  ChevronRight,
  CheckSquare,
  Inbox,
  List,
  FileText,
  UserCircle,
  ShieldOff,
  Handshake,
  Settings,
  PanelLeftOpen,
  Coffee,
  KeyRound,
  MailOpen,
  MailCheck,
  Eye,
} from 'lucide-react';
import { ROLES, DEMO_PERSONAS, getPersona, getPermissions, canAccessProject, filterProjectsForUser } from './config/roles.js';
import {
  MOCK_CLIENTS,
  MOCK_PROJECTS,
  MOCK_TASKS,
  MOCK_CLIENT_COMMENTS,
  MOCK_INTERNAL_COMMENTS,
  MOCK_ASSETS,
  MOCK_INBOX,
  MOCK_PROJECT_ACTIVITIES,
  MOCK_CHAT_NOTIFICATIONS,
  getMemberLabel,
  MOCK_FREELANCERS,
  MOCK_PURCHASED_ACCOUNTS,
  MOCK_SAMPLE_CONTRACTS,
} from './data/mockData.js';
import { formatVND } from './utils/format.js';
import GanttView from './components/GanttView.jsx';
import UserAvatar from './components/UserAvatar.jsx';
import ContextSidebar from './components/ContextSidebar.jsx';
import Pagination from './components/Pagination.jsx';
import { paginate } from './utils/pagination.js';
import ContractPreviewModal from './components/ContractPreviewModal.jsx';
import ContractCreateModal from './components/ContractCreateModal.jsx';
import CollaboratorModal from './components/CollaboratorModal.jsx';
import AssetModal from './components/AssetModal.jsx';
import AssetDetailModal from './components/AssetDetailModal.jsx';
import FreelancerChatPanel from './components/FreelancerChatPanel.jsx';
import { computeAssetStatus } from './utils/assetStatus.js';
import ContractTemplatePanel from './components/ContractTemplatePanel.jsx';
import AppHeaderActions from './components/AppHeaderActions.jsx';
import WorkspaceAISearch from './components/WorkspaceAISearch.jsx';
import SettingsPanel from './components/SettingsPanel.jsx';
import CoffeeSupportModal from './components/CoffeeSupportModal.jsx';
import { useAppPreferences } from './context/AppPreferencesContext.jsx';
import { OWNER_DISPLAY_NAME } from './constants/brand.js';
import ContractDocument from './components/ContractDocument.jsx';
import {
  loadAllTemplates,
  saveStoredTemplate,
  clearStoredTemplate,
  getDefaultTemplate,
} from './utils/contractTemplateStorage.js';
import { openContractPrint } from './utils/contractPrint.js';
import { getBreadcrumbContextLabel } from './utils/breadcrumbLabels.js';
import { labelDemoStatus, TASK_COLUMN_STATUSES } from './utils/demoStatusLabels.js';

const DEFAULT_CONTEXT = {
  dashboard: 'overview',
  projects: 'all',
  myTasks: 'all',
  inbox: 'all',
  calendar: 'month',
  crm: 'all',
  assets: 'all',
  subscriptions: 'all',
  contracts: 'all',
  collaborators: 'all',
  settings: 'appearance',
};

const RAIL_ITEMS = [
  { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard, perm: 'dashboard' },
  { id: 'projects', label: 'Dự án', icon: Briefcase, perm: 'projects' },
  { id: 'myTasks', label: 'Việc của tôi', icon: CheckSquare, perm: 'myTasks' },
  { id: 'inbox', label: 'Hộp thư', icon: Inbox, perm: 'inbox' },
  { id: 'calendar', label: 'Lịch làm việc', icon: CalendarDays, perm: 'calendar' },
  { id: 'crm', label: 'Khách hàng', icon: Users, perm: 'crm' },
  { id: 'assets', label: 'Hạ tầng khách', icon: Server, perm: 'assets' },
  { id: 'subscriptions', label: 'Tài khoản đã mua', icon: KeyRound, perm: 'subscriptions' },
  { id: 'contracts', label: 'Hợp đồng', icon: FileSignature, perm: 'contracts' },
  { id: 'collaborators', label: 'Cộng tác viên', icon: Handshake, perm: 'collaborators' },
  { id: 'settings', label: 'Cài đặt', icon: Settings, perm: 'settings' },
];

const TAB_PERM_MAP = {
  dashboard: 'dashboard',
  myTasks: 'myTasks',
  inbox: 'inbox',
  calendar: 'calendar',
  crm: 'crm',
  assets: 'assets',
  subscriptions: 'subscriptions',
  contracts: 'contracts',
  collaborators: 'collaborators',
  settings: 'settings',
  projects: 'projects',
};

function AccessDenied({ message }) {
  const { t } = useAppPreferences();
  return (
    <div className="flex flex-col items-center justify-center py-12 sm:py-16 md:py-24 px-4 animate-fade-in no-print">
      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-[var(--app-surface-elevated)] flex items-center justify-center mb-3 sm:mb-4">
        <ShieldOff className="w-6 h-6 sm:w-8 sm:h-8 text-[var(--app-text-muted)]" />
      </div>
      <h2 className="text-lg sm:text-xl font-bold text-[var(--app-text-heading)] mb-2">{t('accessDenied.title')}</h2>
      <p className="text-[var(--app-text-muted)] text-xs sm:text-sm max-w-md text-center">{message ?? t('accessDenied.message')}</p>
    </div>
  );
}

function getFirstAllowedTab(perms) {
  for (const item of RAIL_ITEMS) {
    if (perms[item.perm]) return item.id;
  }
  return 'myTasks';
}

function getPersonaColor(userId) {
  return DEMO_PERSONAS.find((p) => p.id === userId)?.color ?? 'from-slate-500 to-slate-600';
}

export default function ThompBui() {
  const { t } = useAppPreferences();
  const [currentUserId, setCurrentUserId] = useState('u-owner');
  const [isCoffeeOpen, setIsCoffeeOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [projectTab, setProjectTab] = useState('board');

  const [clients, setClients] = useState(MOCK_CLIENTS);
  const [projects, setProjects] = useState(MOCK_PROJECTS);
  const [tasks, setTasks] = useState(MOCK_TASKS);
  const [clientComments, setClientComments] = useState(MOCK_CLIENT_COMMENTS);
  const [internalComments, setInternalComments] = useState(MOCK_INTERNAL_COMMENTS);
  const [assets, setAssets] = useState(MOCK_ASSETS);
  const [purchasedAccounts] = useState(MOCK_PURCHASED_ACCOUNTS);
  const [inboxMessages, setInboxMessages] = useState(MOCK_INBOX);
  const [contracts, setContracts] = useState(MOCK_SAMPLE_CONTRACTS);
  const [toastMessage, setToastMessage] = useState('');

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [contractModalType, setContractModalType] = useState('client');
  const [contractModalFreelancerId, setContractModalFreelancerId] = useState('');
  const [isCollaboratorModalOpen, setIsCollaboratorModalOpen] = useState(false);
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [viewingAsset, setViewingAsset] = useState(null);
  const [freelancers, setFreelancers] = useState(MOCK_FREELANCERS);
  const [viewingContract, setViewingContract] = useState(null);
  const [contractTemplates, setContractTemplates] = useState(() => loadAllTemplates());
  const [clientChatInput, setClientChatInput] = useState('');
  const [internalChatInput, setInternalChatInput] = useState('');
  const [contextKey, setContextKey] = useState('overview');
  const [isContextCollapsed, setIsContextCollapsed] = useState(false);
  const [listPage, setListPage] = useState(1);

  const persona = getPersona(currentUserId);
  const perms = getPermissions(persona.role);
  const visibleProjects = filterProjectsForUser(projects, currentUserId, persona.role);
  const clientProjects = visibleProjects.filter((p) => p.type === 'client');
  const partnershipProjects = visibleProjects.filter((p) => p.type === 'partnership');

  const showToast = useCallback((message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  }, []);

  useEffect(() => {
    setContextKey(DEFAULT_CONTEXT[activeTab] ?? 'all');
  }, [activeTab]);

  useEffect(() => {
    setListPage(1);
  }, [activeTab, contextKey, activeProjectId]);

  const paged = (items) => paginate(items, listPage);

  const activeModule = RAIL_ITEMS.find((i) => i.id === activeTab);
  const inboxForRole = inboxMessages.filter((item) => item.forRoles.includes(persona.role));
  const inboxFilteredCount = inboxForRole.length;
  const inboxUnreadCount = inboxForRole.filter((i) => !i.read).length;
  const notificationCount = inboxUnreadCount + MOCK_CHAT_NOTIFICATIONS.length;
  const expiryAlertCount =
    assets.filter((a) => a.status === 'Sắp hết hạn' || a.status === 'Quá hạn').length +
    purchasedAccounts.filter((a) => a.status === 'Sắp hết hạn' || a.status === 'Quá hạn').length;

  const openModule = (tab, key = 'all') => {
    setActiveTab(tab);
    setContextKey(key);
    setActiveProjectId(null);
    setIsContextCollapsed(false);
  };

  const openExpiryAlerts = () => {
    const hasAssetAlerts = assets.some((a) => a.status === 'Sắp hết hạn' || a.status === 'Quá hạn');
    const hasSubAlerts = purchasedAccounts.some((a) => a.status === 'Sắp hết hạn' || a.status === 'Quá hạn');
    if (hasAssetAlerts && perms.assets) openModule('assets', 'expiring');
    else if (hasSubAlerts && perms.subscriptions) openModule('subscriptions', 'expiring');
    else if (perms.dashboard) openModule('dashboard', 'alerts');
    else if (perms.assets) openModule('assets', 'expiring');
  };

  const markInboxRead = (id) => {
    setInboxMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m)));
  };

  const openProject = (projectId) => {
    setActiveProjectId(projectId);
    setActiveTab('projects');
    if (persona.role === ROLES.client) {
      setProjectTab('client');
    } else {
      setProjectTab('board');
    }
  };

  const headerInboxItems = useMemo(
    () =>
      [...inboxForRole]
        .sort((a, b) => Number(a.read) - Number(b.read))
        .slice(0, 8)
        .map((m) => ({
          id: m.id,
          title: m.title,
          time: m.time,
          unread: !m.read,
          onClick: () => {
            markInboxRead(m.id);
            openModule('inbox', 'all');
            if (m.projectId) openProject(m.projectId);
          },
        })),
    [inboxForRole],
  );

  const headerNotificationItems = useMemo(
    () =>
      MOCK_CHAT_NOTIFICATIONS.map((n) => ({
        id: `chat-${n.id}`,
        title: `${n.client} — ${n.project}`,
        time: n.time,
        onClick: () => openModule('dashboard', 'messages'),
      })),
    [],
  );

  const headerExpiryItems = useMemo(() => {
    const assetAlerts = assets
      .filter((a) => a.status === 'Sắp hết hạn' || a.status === 'Quá hạn')
      .map((a) => ({
        id: `asset-${a.id}`,
        title: `${a.name} · ${a.status}`,
        onClick: () => {
          if (perms.assets) {
            openModule('assets', a.status === 'Quá hạn' ? 'overdue' : 'expiring');
            setViewingAsset(a);
          }
        },
      }));
    const subAlerts = purchasedAccounts
      .filter((a) => a.status === 'Sắp hết hạn' || a.status === 'Quá hạn')
      .map((a) => ({
        id: `sub-${a.id}`,
        title: `${a.name} · ${a.status}`,
        onClick: () => {
          if (perms.subscriptions) openModule('subscriptions', 'expiring');
        },
      }));
    return [...assetAlerts, ...subAlerts].slice(0, 8);
  }, [assets, purchasedAccounts, perms.assets, perms.subscriptions]);

  const onDragStart = (e, id) => {
    if (!perms.dragTask) return;
    e.dataTransfer.setData('taskId', id);
  };

  const onDragOver = (e) => {
    if (!perms.dragTask) return;
    e.preventDefault();
  };

  const onDrop = (e, newStatus) => {
    if (!perms.dragTask) return;
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    const project = projects.find((p) => p.id === task.projectId);
    if (project?.isCompleted) {
      showToast(t('toast.projectLocked'));
      return;
    }
    setTasks(tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)));
    showToast(t('toast.taskStatusChanged', { status: labelDemoStatus(newStatus, t) }));
  };

  const getProjectTabs = () => {
    if (persona.role === ROLES.client) {
      return [
        { id: 'list', label: t('projects.tabList'), icon: List },
        { id: 'client', label: t('projects.tabClientChat'), icon: MessageSquare },
      ];
    }
    const tabs = [];
    if (perms.board) tabs.push({ id: 'board', label: 'Board', icon: KanbanSquare });
    if (perms.list) tabs.push({ id: 'list', label: 'List', icon: List });
    if (perms.gantt) tabs.push({ id: 'gantt', label: 'Gantt', icon: Activity });
    tabs.push({ id: 'calendar', label: 'Calendar', icon: CalendarDays });
    if (perms.notes) tabs.push({ id: 'docs', label: 'Docs', icon: FileText });
    if (perms.internalChat) tabs.push({ id: 'internal', label: t('projects.tabInternal'), icon: MessageCircle });
    if (perms.clientChat) tabs.push({ id: 'client', label: t('projects.tabClient'), icon: MessageSquare });
    if (perms.members) tabs.push({ id: 'members', label: 'Members', icon: UserCircle });
    return tabs;
  };

  const renderDashboard = () => {
    if (!perms.dashboard) return <AccessDenied />;
    const totalProjects = projects.length;
    const delayedProjects = projects.filter((p) => p.status === 'Chậm tiến độ').length;
    const totalRevenue = projects.reduce((sum, p) => sum + p.budget, 0);
    const expiringAssets = assets.filter((a) => a.status === 'Sắp hết hạn' || a.status === 'Quá hạn').length;

    const viewTitles = {
      overview: t('dashboard.overviewTitle'),
      activity: t('dashboard.activityTitle'),
      alerts: t('dashboard.alertsTitle'),
      messages: t('dashboard.messagesTitle'),
    };

    return (
      <div className="page-shell animate-fade-in no-print">
        <div className="page-header page-header-block">
          <div>
            <h2 className="page-title">{viewTitles[contextKey] ?? viewTitles.overview}</h2>
            <p className="page-desc">{t('dashboard.desc')}</p>
          </div>
          <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 p-1.5 rounded-xl shadow-lg">
            <div className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-300">
              <CalendarDays size={16} className="text-indigo-400" />
              <span>{t('common.monthMay2026')}</span>
            </div>
            <div className="w-px h-5 bg-slate-700" />
            <button type="button" className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors" title={t('common.filterPeriod')}>
              <Filter size={16} />
            </button>
          </div>
        </div>

        {(contextKey === 'overview' || contextKey === 'alerts') && (
        <div className="page-grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <div className="page-card-lg relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-slate-400 text-xs sm:text-sm font-medium">{t('dashboard.projectsTasks')}</p>
                <div className="flex items-end gap-1.5 sm:gap-2 mt-1 sm:mt-2">
                  <p className="stat-value text-white">{totalProjects}</p>
                  <p className="text-xs sm:text-sm text-indigo-400 font-medium mb-0.5 sm:mb-1">{t('common.running')}</p>
                </div>
              </div>
              <div className="stat-icon-wrap bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
              </div>
            </div>
          </div>
          <div className="page-card-lg relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-slate-400 text-xs sm:text-sm font-medium">{t('dashboard.expectedRevenue')}</p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-emerald-400 mt-1 sm:mt-2 tracking-tight">{formatVND(totalRevenue)}</p>
              </div>
              <div className="stat-icon-wrap bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
              </div>
            </div>
          </div>
          <div className="page-card-lg border-rose-900/50 relative overflow-hidden group">
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-rose-400/80 text-xs sm:text-sm font-medium">{t('dashboard.delayAlert')}</p>
                <div className="flex items-end gap-1.5 sm:gap-2 mt-1 sm:mt-2">
                  <p className="stat-value text-rose-500">{delayedProjects}</p>
                  <p className="text-xs sm:text-sm text-rose-400 font-medium mb-0.5 sm:mb-1">{t('common.projectsUnit')}</p>
                </div>
              </div>
              <div className="stat-icon-wrap bg-rose-500/10 text-rose-500 border border-rose-500/20">
                <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
              </div>
            </div>
          </div>
          <div className="page-card-lg border-amber-900/50 relative overflow-hidden group">
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-amber-400/80 text-xs sm:text-sm font-medium">{t('dashboard.domainRenewal')}</p>
                <div className="flex items-end gap-1.5 sm:gap-2 mt-1 sm:mt-2">
                  <p className="stat-value text-amber-500">{expiringAssets}</p>
                  <p className="text-xs sm:text-sm text-amber-400 font-medium mb-0.5 sm:mb-1">{t('common.needAction')}</p>
                </div>
              </div>
              <div className="stat-icon-wrap bg-amber-500/10 text-amber-500 border border-amber-500/20">
                <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
              </div>
            </div>
          </div>
        </div>
        )}

        <div className={`page-grid ${contextKey === 'overview' ? 'mt-4 sm:mt-6 md:mt-8 grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {(contextKey === 'overview' || contextKey === 'activity') && (
          <div className="page-card-lg flex flex-col">
            <h3 className="section-title flex items-center gap-2 mb-3 sm:mb-4 md:mb-6">
              <Activity size={18} className="text-indigo-400" /> {t('dashboard.systemStatus')}
            </h3>
            <div className="space-y-5 flex-1">
              {MOCK_PROJECT_ACTIVITIES.map((act) => (
                <div key={act.id} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${act.type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                  <div>
                    <p className="text-sm text-slate-200 font-medium">{act.title}</p>
                    <p className="text-sm text-slate-400 mt-0.5">{act.desc}</p>
                    <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1">
                      <Clock size={12} /> {act.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button type="button" onClick={() => { setActiveTab('projects'); setActiveProjectId(null); }} className="mt-4 w-full py-2.5 text-sm font-medium text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-xl transition-colors">
              {t('common.goToProjects')}
            </button>
          </div>
          )}
          {(contextKey === 'overview' || contextKey === 'messages') && (
          <div className="page-card-lg flex flex-col">
            <div className="flex justify-between items-center mb-3 sm:mb-4 md:mb-6">
              <h3 className="section-title flex items-center gap-2">
                <MessageCircle size={18} className="text-blue-400" /> {t('dashboard.clientMessages')}
              </h3>
              <span className="bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{t('common.new')}</span>
            </div>
            <div className="space-y-4 flex-1">
              {MOCK_CHAT_NOTIFICATIONS.map((chat) => (
                <div key={chat.id} className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-sm font-bold text-white">{chat.client}</p>
                    <span className="text-[11px] text-slate-500">{chat.time}</span>
                  </div>
                  <p className="text-xs text-indigo-400 mb-2 truncate">{t('common.belongsTo')}: {chat.project}</p>
                  <p className="text-sm text-slate-300 line-clamp-2 italic">&quot;{chat.desc}&quot;</p>
                </div>
              ))}
            </div>
          </div>
          )}
          {(contextKey === 'overview' || contextKey === 'alerts') && (
          <div className="page-card-lg flex flex-col">
            <h3 className="section-title flex items-center gap-2 mb-3 sm:mb-4 md:mb-6">
              <Server size={18} className="text-amber-400" /> {t('dashboard.upcomingRenewal')}
            </h3>
            <div className="space-y-4 flex-1">
              {assets.filter((a) => a.status !== 'Đang chạy').map((asset) => (
                <div key={asset.id} className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                  <div className="flex justify-between items-start mb-1.5">
                    <div className="flex items-center gap-2">
                      {asset.type === 'Tên miền' ? <Globe size={14} className="text-slate-400" /> : <HardDrive size={14} className="text-slate-400" />}
                      <p className="text-sm font-bold text-white">{asset.name}</p>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-medium border ${asset.status === 'Quá hạn' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                      {labelDemoStatus(asset.status, t)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{t('common.due')}: <span className="text-slate-200">{asset.expiryDate}</span></p>
                  <p className="text-xs text-slate-400 mt-0.5">{t('common.fee')}: <span className="text-emerald-400 font-medium">{formatVND(asset.price)}</span></p>
                </div>
              ))}
            </div>
            <button type="button" onClick={() => setActiveTab('assets')} className="mt-4 w-full py-2.5 text-sm font-medium text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 rounded-xl transition-colors">
              {t('common.manageInfra')}
            </button>
          </div>
          )}
        </div>
      </div>
    );
  };

  const renderMyTasks = () => {
    if (!perms.myTasks) return <AccessDenied />;
    const projectIds = visibleProjects.map((p) => p.id);
    let myTasks =
      persona.role === ROLES.owner
        ? tasks.filter((t) => projectIds.includes(t.projectId))
        : tasks.filter((t) => projectIds.includes(t.projectId) && t.assigneeId === currentUserId);

    if (contextKey !== 'all' && contextKey !== 'today') {
      myTasks = myTasks.filter((t) => t.status === contextKey);
    } else if (contextKey === 'today') {
      myTasks = myTasks.filter((t) => t.dueDate === '2026-05-23');
    }

    const tasksPage = paged(myTasks);

    return (
      <div className="page-shell animate-fade-in no-print">
        <div>
          <h2 className="page-title">{t('myTasks.title')}</h2>
          <p className="page-desc">
            {persona.role === ROLES.owner ? t('myTasks.descOwner') : t('myTasks.descMember')}
          </p>
        </div>
        <div className="page-card overflow-x-auto !p-0">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="tbl-head">
                <th className="tbl-th">{t('myTasks.colTask')}</th>
                <th className="tbl-th">{t('myTasks.colProject')}</th>
                <th className="tbl-th">{t('myTasks.colStatus')}</th>
                <th className="tbl-th">{t('myTasks.colPriority')}</th>
                <th className="tbl-th">{t('myTasks.colDue')}</th>
              </tr>
            </thead>
            <tbody>
              {tasksPage.items.map((task) => {
                const project = projects.find((p) => p.id === task.projectId);
                return (
                  <tr
                    key={task.id}
                    onClick={() => openProject(task.projectId)}
                    className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors cursor-pointer"
                  >
                    <td className="tbl-td text-white font-medium">{task.title}</td>
                    <td className="tbl-td text-slate-300 text-sm">{project?.name}</td>
                    <td className="tbl-td">
                      <span className="text-xs px-2 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">{labelDemoStatus(task.status, t)}</span>
                    </td>
                    <td className="tbl-td text-sm text-slate-300">{task.priority}</td>
                    <td className="tbl-td text-sm text-slate-400 font-mono">{task.dueDate}</td>
                  </tr>
                );
              })}
              {tasksPage.total === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-500">{t('myTasks.empty')}</td>
                </tr>
              )}
            </tbody>
          </table>
          <Pagination {...tasksPage} onPageChange={setListPage} />
        </div>
      </div>
    );
  };

  const renderInbox = () => {
    if (!perms.inbox) return <AccessDenied />;
    let inboxItems = [...inboxForRole];
    if (contextKey === 'unread') inboxItems = inboxItems.filter((i) => !i.read);
    else if (contextKey === 'read') inboxItems = inboxItems.filter((i) => i.read);
    else if (contextKey === 'mention') inboxItems = inboxItems.filter((i) => i.type === 'mention');
    else if (contextKey === 'client') inboxItems = inboxItems.filter((i) => i.type === 'client');
    else if (contextKey === 'deadline') inboxItems = inboxItems.filter((i) => i.type === 'deadline');

    const inboxTitles = {
      all: t('inbox.allMail'),
      unread: t('inbox.unreadMail'),
      read: t('inbox.readMail'),
      mention: t('context.mention'),
      client: t('context.fromClient'),
      deadline: t('context.dueSoon'),
    };

    const inboxPage = paged(inboxItems);

    return (
      <div className="page-shell animate-fade-in no-print">
        <div className="page-header">
          <div>
            <h2 className="page-title">{inboxTitles[contextKey] ?? t('nav.inbox')}</h2>
            <p className="page-desc">
              {inboxUnreadCount > 0 ? t('inbox.unreadCount', { n: inboxUnreadCount }) : t('inbox.allRead')}
            </p>
          </div>
          {inboxUnreadCount > 0 && (
            <button
              type="button"
              onClick={() => setInboxMessages((prev) => prev.map((m) => (m.forRoles.includes(persona.role) ? { ...m, read: true } : m)))}
              className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20"
            >
              <MailCheck size={16} /> Đánh dấu tất cả đã đọc
            </button>
          )}
        </div>
        <div className="space-y-3">
          {inboxPage.items.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                markInboxRead(item.id);
                if (item.projectId) openProject(item.projectId);
              }}
              className={`page-card !p-3 sm:!p-4 hover:border-indigo-500/30 transition-colors cursor-pointer flex items-start gap-3 sm:gap-4 ${
                !item.read ? 'border-indigo-500/40 bg-indigo-500/5' : 'border-slate-800'
              }`}
            >
              <div className={`p-2 rounded-lg shrink-0 ${item.type === 'client' ? 'bg-blue-500/10 text-blue-400' : item.type === 'deadline' ? 'bg-rose-500/10 text-rose-400' : 'bg-indigo-500/10 text-indigo-400'}`}>
                {!item.read ? <MailOpen size={18} /> : item.type === 'client' ? <MessageSquare size={18} /> : item.type === 'deadline' ? <AlertCircle size={18} /> : <Bell size={18} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <p className={`text-sm font-semibold ${!item.read ? 'text-white' : 'text-slate-300'}`}>{item.title}</p>
                  <div className="flex items-center gap-2 shrink-0">
                    {!item.read && <span className="w-2 h-2 rounded-full bg-indigo-500" />}
                    <span className="text-[11px] text-slate-500">{item.time}</span>
                  </div>
                </div>
                <p className="page-desc">{item.desc}</p>
              </div>
            </div>
          ))}
          {inboxPage.total === 0 && <p className="text-slate-500 text-center py-12">{t('inbox.empty')}</p>}
        </div>
        <Pagination {...inboxPage} onPageChange={setListPage} />
      </div>
    );
  };

  const renderSubscriptions = () => {
    if (!perms.subscriptions) return <AccessDenied />;
    let list = [...purchasedAccounts];
    if (contextKey === 'expiring') list = list.filter((a) => a.status === 'Sắp hết hạn');
    else if (contextKey === 'overdue') list = list.filter((a) => a.status === 'Quá hạn');
    else if (contextKey === 'active') list = list.filter((a) => a.status === 'Đang dùng');

    const overdueCount = purchasedAccounts.filter((a) => a.status === 'Quá hạn').length;
    const expiringCount = purchasedAccounts.filter((a) => a.status === 'Sắp hết hạn').length;

    const subTitles = {
      all: t('subscriptions.allTitle'),
      expiring: t('subscriptions.expiringTitle'),
      overdue: t('subscriptions.overdueTitle'),
      active: t('subscriptions.activeTitle'),
    };

    const subsPage = paged(list);

    return (
      <div className="page-shell animate-fade-in no-print">
        {(overdueCount > 0 || expiringCount > 0) && contextKey === 'all' && (
          <div className={`rounded-2xl border p-4 flex items-start gap-3 ${overdueCount > 0 ? 'bg-rose-500/10 border-rose-500/30' : 'bg-amber-500/10 border-amber-500/30'}`}>
            <AlertCircle size={22} className={overdueCount > 0 ? 'text-rose-400 shrink-0' : 'text-amber-400 shrink-0'} />
            <div>
              <p className="font-semibold text-white">
                {overdueCount > 0 ? t('subscriptions.alertOverdueLine', { n: overdueCount }) : t('subscriptions.alertExpiringLine', { n: expiringCount })}
              </p>
              <p className="page-desc">{t('subscriptions.descRenew')}</p>
            </div>
          </div>
        )}
        <div className="page-header">
          <div>
            <h2 className="page-title">{subTitles[contextKey] ?? subTitles.all}</h2>
            <p className="page-desc">{t('subscriptions.descTrack')}</p>
          </div>
          <button type="button" onClick={() => showToast(t('toast.addSubscription'))} className="btn-page-primary">
            <Plus size={18} /> {t('subscriptions.addAccountBtn')}
          </button>
        </div>
        <div className="page-grid grid-cols-1 lg:grid-cols-2">
          {subsPage.items.map((acc) => (
            <div
              key={acc.id}
              className={`page-card ${
                acc.status === 'Quá hạn' ? 'border-rose-500/40' : acc.status === 'Sắp hết hạn' ? 'border-amber-500/40' : 'border-slate-800'
              }`}
            >
              <div className="flex justify-between items-start gap-3 mb-3">
                <div className="min-w-0">
                  <p className="text-white font-semibold truncate">{acc.name}</p>
                  <p className="text-sm text-slate-400">{acc.vendor} · {acc.category}</p>
                </div>
                <span
                  className={`text-xs px-2.5 py-1 rounded-lg border shrink-0 ${
                    acc.status === 'Quá hạn'
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      : acc.status === 'Sắp hết hạn'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  }`}
                >
                  {labelDemoStatus(acc.status, t)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                <div>
                  <p className="text-slate-500 text-xs">{t('common.expiry')}</p>
                  <p className="text-slate-200 font-mono">{acc.expiryDate}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs">{t('common.renewalFee')}</p>
                  <p className="text-emerald-400 font-medium">{formatVND(acc.renewPrice)}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs">{t('common.cycle')}</p>
                  <p className="text-slate-300">{acc.billingCycle}</p>
                </div>
              </div>
              {acc.note && <p className="text-xs text-slate-500 border-t border-slate-800 pt-3">{acc.note}</p>}
              {(acc.status === 'Quá hạn' || acc.status === 'Sắp hết hạn') && (
                <button type="button" className="mt-3 w-full py-2 text-sm font-medium rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 border border-indigo-500/30 transition-colors">
                  {t('subscriptions.remindRenew')}
                </button>
              )}
            </div>
          ))}
        </div>
        {subsPage.total === 0 && <p className="text-slate-500 text-center py-12">{t('subscriptions.empty')}</p>}
        <Pagination {...subsPage} onPageChange={setListPage} />
      </div>
    );
  };

  const renderCollaborators = () => {
    if (!perms.collaborators) return <AccessDenied />;
    const dmId = contextKey.startsWith('dm-') ? contextKey.replace('dm-', '') : null;
    const dmFreelancer = dmId ? freelancers.find((f) => f.id === dmId) : null;

    if (dmFreelancer) {
      return (
        <FreelancerChatPanel
          freelancer={dmFreelancer}
          colorClass={getPersonaColor(dmFreelancer.userId)}
          onBack={() => setContextKey('all')}
        />
      );
    }

    return (
      <div className="page-shell animate-fade-in no-print">
        <div className="page-header">
          <div>
            <h2 className="page-title">{t('collaborators.title')}</h2>
            <p className="page-desc">{t('collaborators.desc')}</p>
          </div>
          {perms.collaborators && (
            <button
              type="button"
              onClick={() => setIsCollaboratorModalOpen(true)}
              className="btn-page-primary"
            >
              <Plus size={18} /> Thêm cộng tác viên
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {freelancers.map((f) => (
            <div key={f.id} className="page-card hover:border-slate-700 transition-colors">
              <div className="flex items-start gap-4">
                <UserAvatar name={f.name} colorClass={getPersonaColor(f.userId)} size="lg" />
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold">{f.name}</p>
                  <p className="text-sm text-slate-400">{f.email}</p>
                  {f.phone && <p className="text-xs text-slate-500 mt-0.5">{f.phone}</p>}
                  <div className="flex flex-wrap gap-2 mt-1.5 text-[10px] text-slate-500">
                    {f.facebook && <span className="text-blue-400/80">FB ✓</span>}
                    {f.zalo && <span className="text-sky-400/80">Zalo ✓</span>}
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {f.skills.map((s) => (
                      <span key={s} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setContextKey(`dm-${f.id}`)}
                  className="flex-1 min-w-[100px] py-2 text-xs font-medium rounded-lg bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/25 flex items-center justify-center gap-1.5"
                >
                  <MessageCircle size={14} /> Nhắn tin
                </button>
                {perms.contracts && (
                  <button
                    type="button"
                    onClick={() => openContractCreate('freelancer', f.id)}
                    className="flex-1 min-w-[100px] py-2 text-xs font-medium rounded-lg bg-purple-500/15 text-purple-300 border border-purple-500/30 hover:bg-purple-500/25 flex items-center justify-center gap-1.5"
                  >
                    <FileSignature size={14} /> Hợp đồng CT
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderAssets = () => {
    if (!perms.assets) return <AccessDenied />;
    let filteredAssets = [...assets];
    if (contextKey === 'expiring') filteredAssets = filteredAssets.filter((a) => a.status === 'Sắp hết hạn');
    else if (contextKey === 'overdue') filteredAssets = filteredAssets.filter((a) => a.status === 'Quá hạn');
    else if (contextKey === 'domain') filteredAssets = filteredAssets.filter((a) => a.type === 'Tên miền');
    else if (contextKey === 'hosting') filteredAssets = filteredAssets.filter((a) => a.type !== 'Tên miền');

    const assetsPage = paged(filteredAssets);

    return (
      <div className="page-shell animate-fade-in no-print">
        <div className="page-header">
          <div>
            <h2 className="page-title">{t('assets.title')}</h2>
            <p className="page-desc">{t('assets.desc')}</p>
          </div>
          <button
            type="button"
            onClick={() => setIsAssetModalOpen(true)}
            className="btn-page-primary"
          >
            <Plus size={18} /> Thêm dịch vụ
          </button>
        </div>
        <div className="page-card overflow-x-auto !p-0">
          <table className="w-full text-left border-collapse min-w-[640px] sm:min-w-[800px] md:min-w-[960px]">
            <thead>
              <tr className="tbl-head">
                <th className="tbl-th">{t('assets.colName')}</th>
                <th className="tbl-th">{t('assets.colType')}</th>
                <th className="tbl-th">{t('assets.colClient')}</th>
                <th className="tbl-th">{t('assets.colExpiry')}</th>
                <th className="tbl-th">{t('assets.colFee')}</th>
                <th className="tbl-th min-w-[180px]">{t('assets.colNote')}</th>
                <th className="tbl-th text-right">{t('assets.colStatus')}</th>
              </tr>
            </thead>
            <tbody>
              {assetsPage.items.map((asset) => {
                const client = clients.find((c) => c.id === asset.clientId);
                return (
                  <tr
                    key={asset.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setViewingAsset(asset)}
                    onKeyDown={(e) => e.key === 'Enter' && setViewingAsset(asset)}
                    className="border-b border-slate-800/50 hover:bg-slate-800/40 transition-colors cursor-pointer"
                  >
                    <td className="tbl-td text-white font-medium">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-800 rounded-lg text-slate-300">
                          {asset.type === 'Tên miền' ? <Globe size={16} /> : <HardDrive size={16} />}
                        </div>
                        <span>{asset.name}</span>
                      </div>
                    </td>
                    <td className="tbl-td text-slate-300 text-sm">{asset.type}</td>
                    <td className="tbl-td text-slate-300 text-sm">
                      <span className="block text-white/90">{client?.company || '—'}</span>
                      <span className="text-xs text-slate-500">{client?.name}</span>
                    </td>
                    <td className="tbl-td text-sm font-mono text-slate-300">{asset.expiryDate}</td>
                    <td className="tbl-td text-emerald-400 font-medium text-sm">{formatVND(asset.price)}</td>
                    <td className="tbl-td text-slate-400 text-sm max-w-[220px]">
                      {asset.note ? (
                        <span className="line-clamp-2" title={asset.note}>
                          {asset.note}
                        </span>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>
                    <td className="tbl-td text-right">
                      <span className={`inline-block px-3 py-1 text-xs font-medium rounded-lg border ${asset.status === 'Sắp hết hạn' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : asset.status === 'Quá hạn' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                        {labelDemoStatus(asset.status, t)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <Pagination {...assetsPage} onPageChange={setListPage} />
        </div>
      </div>
    );
  };

  const sendInternalMessage = () => {
    if (!internalChatInput.trim() || !activeProjectId) return;
    const newMsg = {
      id: Date.now(),
      sender: persona.name,
      senderId: currentUserId,
      text: internalChatInput.trim(),
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };
    setInternalComments((prev) => ({
      ...prev,
      [activeProjectId]: [...(prev[activeProjectId] || []), newMsg],
    }));
    setInternalChatInput('');
  };

  const sendClientMessage = () => {
    if (!clientChatInput.trim() || !activeProjectId) return;
    const newMsg = {
      id: Date.now(),
      sender: persona.name,
      senderId: currentUserId,
      text: clientChatInput.trim(),
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };
    setClientComments((prev) => ({
      ...prev,
      [activeProjectId]: [...(prev[activeProjectId] || []), newMsg],
    }));
    setClientChatInput('');
  };

  const handleLockProject = () => {
    if (!perms.lockProject || !activeProjectId) return;
    setProjects(projects.map((p) => (p.id === activeProjectId ? { ...p, isCompleted: true, status: 'Hoàn thành' } : p)));
    showToast(t('toast.projectCompleted'));
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const projectId = fd.get('projectId') || activeProjectId;
    if (!projectId) return;
    const newTask = {
      id: `t${Date.now()}`,
      title: fd.get('title'),
      description: fd.get('description') || '',
      status: fd.get('status') || 'Cần làm',
      startDate: fd.get('startDate') || '2026-05-23',
      dueDate: fd.get('dueDate') || '2026-05-30',
      priority: fd.get('priority') || 'Vừa',
      projectId,
      assigneeId: fd.get('assigneeId') || currentUserId,
    };
    setTasks([...tasks, newTask]);
    setIsTaskModalOpen(false);
    showToast(t('toast.taskAdded'));
    e.target.reset();
  };

  const handleAddClient = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const newClient = {
      id: `c${Date.now()}`,
      name: fd.get('name'),
      email: fd.get('email'),
      phone: fd.get('phone'),
      company: fd.get('company'),
      facebook: (fd.get('facebook') || '').trim(),
      zalo: (fd.get('zalo') || '').trim() || (fd.get('phone') || '').trim(),
    };
    setClients([...clients, newClient]);
    setIsClientModalOpen(false);
    showToast(t('toast.clientAdded'));
    e.target.reset();
  };

  const openContractCreate = (type = 'client', freelancerId = '') => {
    setContractModalType(type);
    setContractModalFreelancerId(freelancerId);
    setIsContractModalOpen(true);
  };

  const handleSaveContract = (contract) => {
    setContracts((prev) => [...prev, contract]);
    showToast(t('toast.contractSaved', { type: contract.type === 'client' ? t('toast.contractClient') : t('toast.contractFreelancer') }));
  };

  const handleTemplateUpload = (type, parsed) => {
    const data = { ...parsed, source: 'upload' };
    saveStoredTemplate(type, data);
    setContractTemplates((prev) => ({ ...prev, [type]: data }));
    showToast(t('toast.templateFromDocs', { type: type === 'client' ? t('toast.templateClient') : t('toast.templateFreelancer') }));
  };

  const handleTemplateReset = (type) => {
    clearStoredTemplate(type);
    const def = getDefaultTemplate(type);
    setContractTemplates((prev) => ({ ...prev, [type]: def }));
    showToast(t('toast.templateReset'));
  };

  const handleAddCollaborator = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const name = fd.get('name');
    const skillsRaw = fd.get('skills') || '';
    const newF = {
      id: `f${Date.now()}`,
      userId: `u-f${Date.now()}`,
      name,
      email: fd.get('email'),
      phone: fd.get('phone') || '',
      facebook: (fd.get('facebook') || '').trim(),
      zalo: (fd.get('zalo') || '').trim(),
      skills: skillsRaw
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      avatar: name.charAt(0).toUpperCase(),
    };
    setFreelancers((prev) => [...prev, newF]);
    setIsCollaboratorModalOpen(false);
    showToast(t('toast.collaboratorAdded'));
    e.target.reset();
  };

  const handleAddAsset = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const expiryDate = fd.get('expiryDate');
    const newAsset = {
      id: `a${Date.now()}`,
      name: fd.get('name'),
      type: fd.get('type'),
      clientId: fd.get('clientId'),
      expiryDate,
      price: Number(fd.get('price')) || 0,
      note: (fd.get('note') || '').trim(),
      status: computeAssetStatus(expiryDate),
    };
    setAssets((prev) => [...prev, newAsset]);
    setIsAssetModalOpen(false);
    showToast(t('toast.assetAdded'));
    e.target.reset();
  };

  const renderMiniCalendar = (taskList) => {
    const year = 2026;
    const month = 4;
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < firstDay; i += 1) cells.push(null);
    for (let d = 1; d <= daysInMonth; d += 1) cells.push(d);

    return (
      <div className="page-card">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <CalendarDays size={18} className="text-indigo-400" /> {t('common.monthMay2026')}
        </h3>
        <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-slate-500 mb-2">
          {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, idx) => {
            if (!day) return <div key={`e-${idx}`} className="h-16" />;
            const dateStr = `2026-05-${String(day).padStart(2, '0')}`;
            const dayTasks = taskList.filter((t) => t.dueDate === dateStr);
            return (
              <div key={dateStr} className={`h-16 p-1 rounded-lg border text-left ${day === 23 ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-slate-800 bg-slate-950/30'}`}>
                <span className={`text-xs font-medium ${day === 23 ? 'text-indigo-400' : 'text-slate-400'}`}>{day}</span>
                <div className="mt-0.5 space-y-0.5">
                  {dayTasks.slice(0, 2).map((t) => (
                    <div key={t.id} className="text-[9px] truncate px-1 py-0.5 rounded bg-indigo-500/20 text-indigo-300">{t.title}</div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderCRM = () => {
    if (!perms.crm) return <AccessDenied />;
    const selectedId = contextKey.startsWith('client-') ? contextKey.replace('client-', '') : null;
    const crmList = selectedId ? clients.filter((c) => c.id === selectedId) : clients;
    const crmPage = paged(crmList);

    return (
      <div className="page-shell animate-fade-in no-print">
        <div className="page-header">
          <div>
            <h2 className="page-title">
              {selectedId ? crmList[0]?.name : t('crm.title')}
            </h2>
            <p className="page-desc">{t('crm.desc')}</p>
          </div>
          <button type="button" onClick={() => setIsClientModalOpen(true)} className="btn-page-primary">
            <Plus size={18} /> {t('crm.addClient')}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {crmPage.items.map((client) => (
            <div key={client.id} className="page-card hover:border-slate-700 transition-colors">
              <div className="flex items-start gap-4">
                <UserAvatar name={client.name} colorClass="from-amber-500 to-orange-500" size="lg" />
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold truncate">{client.name}</p>
                  <p className="text-sm text-slate-400 truncate">{client.company}</p>
                </div>
                <button type="button" className="text-slate-500 hover:text-white p-1">
                  <MoreVertical size={16} />
                </button>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <p className="flex items-center gap-2 text-slate-300">
                  <Mail size={14} className="text-slate-500 shrink-0" /> {client.email}
                </p>
                <p className="flex items-center gap-2 text-slate-300">
                  <Phone size={14} className="text-slate-500 shrink-0" /> {client.phone}
                </p>
                <p className="flex items-center gap-2 text-slate-300">
                  <Building2 size={14} className="text-slate-500 shrink-0" /> {client.company}
                </p>
              </div>
            </div>
          ))}
        </div>
        <Pagination {...crmPage} onPageChange={setListPage} />
      </div>
    );
  };

  const renderProjects = () => {
    let list = visibleProjects;
    if (contextKey === 'client') list = clientProjects;
    else if (contextKey === 'partnership') list = partnershipProjects;

    const listTitle = { all: t('projects.all'), client: t('projects.client'), partnership: t('projects.partnership') }[contextKey] ?? t('nav.projects');
    const projectsPage = paged(list);

    return (
    <div className="page-shell animate-fade-in no-print">
      <div className="page-header">
        <div>
          <h2 className="page-title">{listTitle}</h2>
          <p className="page-desc">{t('projects.listDesc', { n: projectsPage.total })}</p>
        </div>
        {perms.createProject && (
          <button type="button" className="btn-page-primary">
            <Plus size={18} /> {t('projects.createProject')}
          </button>
        )}
      </div>
      <div className="page-grid-cards">
        {projectsPage.items.map((project) => {
          const client = clients.find((c) => c.id === project.clientId);
          const memberCount = project.memberIds?.length ?? 0;
          const projectTasks = tasks.filter((t) => t.projectId === project.id);
          return (
            <div
              key={project.id}
              onClick={() => openProject(project.id)}
              className="page-card hover:border-indigo-500/30 transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-start gap-2 mb-3">
                <div className="flex items-center gap-2 min-w-0">
                  {project.type === 'partnership' ? (
                    <Handshake size={16} className="text-purple-400 shrink-0" />
                  ) : (
                    <Briefcase size={16} className="text-indigo-400 shrink-0" />
                  )}
                  <h3 className="text-white font-semibold truncate group-hover:text-indigo-300 transition-colors">{project.name}</h3>
                </div>
                {project.isCompleted && <Lock size={14} className="text-amber-400 shrink-0" />}
              </div>
              {client && <p className="text-xs text-slate-500 mb-3">{client.company}</p>}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`text-xs px-2 py-1 rounded-md border ${project.status === 'Chậm tiến độ' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : project.status === 'Hoàn thành' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-800 text-slate-300 border-slate-700'}`}>
                  {labelDemoStatus(project.status, t)}
                </span>
                <span className="text-xs px-2 py-1 rounded-md bg-slate-800 text-slate-400 border border-slate-700">{projectTasks.length} {t('common.tasksUnit')}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center -space-x-2">
                  {(project.memberIds || []).slice(0, 3).map((uid) => (
                    <UserAvatar key={uid} name={getMemberLabel(uid, MOCK_FREELANCERS)} colorClass={getPersonaColor(uid)} size="sm" />
                  ))}
                  {memberCount > 3 && (
                    <span className="w-7 h-7 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-[10px] text-slate-400 font-medium">
                      +{memberCount - 3}
                    </span>
                  )}
                </div>
                <div className="text-right">
                  {perms.seeBudget && <p className="text-sm font-medium text-emerald-400">{formatVND(project.budget)}</p>}
                  <p className="text-[11px] text-slate-500 font-mono">{project.deadline}</p>
                </div>
              </div>
            </div>
          );
        })}
        {projectsPage.total === 0 && (
          <p className="text-slate-500 col-span-full text-center py-12">{t('projects.empty')}</p>
        )}
      </div>
      <Pagination {...projectsPage} onPageChange={setListPage} />
    </div>
  );
  };

  const renderProjectDetail = () => {
    const project = projects.find((p) => p.id === activeProjectId);
    if (!project) return renderProjects();

    const tabs = getProjectTabs();
    const projectTasks = tasks.filter((t) => t.projectId === project.id);
    const client = clients.find((c) => c.id === project.clientId);
    const internalMsgs = internalComments[project.id] || [];
    const clientMsgs = clientComments[project.id] || [];
    const isReadOnly = persona.role === ROLES.client || project.isCompleted;

    return (
      <div className="page-shell animate-fade-in no-print">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <button type="button" onClick={() => setActiveProjectId(null)} className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white mb-2 transition-colors">
              <ArrowLeft size={16} /> Dự án
            </button>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="page-title">{project.name}</h2>
              {project.isCompleted && (
                <span className="text-xs px-2 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                  <Lock size={12} /> Đã chốt
                </span>
              )}
            </div>
            {client && <p className="page-desc">{client.company}</p>}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {perms.addTask && !project.isCompleted && (
              <button type="button" onClick={() => setIsTaskModalOpen(true)} className="btn-page-primary">
                <Plus size={16} /> Thêm việc
              </button>
            )}
            {perms.lockProject && !project.isCompleted && (
              <button type="button" onClick={handleLockProject} className="btn-page bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 border border-amber-500/30">
                <Lock size={16} /> {t('projects.completeProject')}
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-1 overflow-x-auto no-scrollbar border-b border-slate-800 pb-px">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setProjectTab(tab.id)}
                className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-t-lg whitespace-nowrap transition-colors ${projectTab === tab.id ? 'bg-slate-800 text-white border-b-2 border-indigo-500' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
              >
                <Icon size={16} /> {tab.label}
              </button>
            );
          })}
        </div>

        {projectTab === 'board' && perms.board && (
          <div className="flex gap-2 sm:gap-3 md:gap-4 overflow-x-auto pb-3 sm:pb-4 no-scrollbar -mx-1 px-1">
            {TASK_COLUMN_STATUSES.map((col) => (
              <div key={col} className="kanban-col">
                <div className="p-2.5 sm:p-3 md:p-4 border-b border-slate-800 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white">{labelDemoStatus(col, t)}</h3>
                  <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-md">{projectTasks.filter((t) => t.status === col).length}</span>
                </div>
                <div className="p-2 sm:p-3 space-y-2 sm:space-y-3 overflow-y-auto flex-1" onDragOver={onDragOver} onDrop={(e) => onDrop(e, col)}>
                  {projectTasks.filter((t) => t.status === col).map((task) => (
                    <div
                      key={task.id}
                      draggable={perms.dragTask && !project.isCompleted}
                      onDragStart={(e) => onDragStart(e, task.id)}
                      className={`bg-slate-800 border border-slate-700 p-2.5 sm:p-3 md:p-4 rounded-lg sm:rounded-xl ${perms.dragTask && !project.isCompleted ? 'cursor-grab active:cursor-grabbing hover:border-indigo-500/30' : ''} transition-colors`}
                    >
                      <p className="text-sm font-medium text-white mb-2">{task.title}</p>
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] px-2 py-0.5 rounded-md ${task.priority === 'Cao' ? 'bg-rose-500/10 text-rose-400' : 'bg-slate-700 text-slate-400'}`}>{task.priority}</span>
                        <UserAvatar name={getMemberLabel(task.assigneeId, MOCK_FREELANCERS)} colorClass={getPersonaColor(task.assigneeId)} size="sm" />
                      </div>
                      <p className="text-[11px] text-slate-500 mt-2 font-mono">{task.dueDate}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {projectTab === 'list' && (
          <div className="page-card overflow-x-auto !p-0">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-950/50 border-b border-slate-800 text-slate-400 text-sm">
                  <th className="tbl-th">{t('projects.colTask')}</th>
                  <th className="tbl-th">{t('projects.colStatus')}</th>
                  <th className="tbl-th">{t('projects.colPriority')}</th>
                  <th className="tbl-th">{t('projects.colAssignee')}</th>
                  <th className="tbl-th">{t('projects.colDue')}</th>
                </tr>
              </thead>
              <tbody>
                {projectTasks.map((task) => (
                  <tr key={task.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <td className="tbl-td text-white font-medium">{task.title}</td>
                    <td className="tbl-td">
                      <span className="text-xs px-2 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">{labelDemoStatus(task.status, t)}</span>
                    </td>
                    <td className="tbl-td text-sm text-slate-300">{task.priority}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <UserAvatar name={getMemberLabel(task.assigneeId, MOCK_FREELANCERS)} colorClass={getPersonaColor(task.assigneeId)} size="sm" />
                        <span className="text-sm text-slate-300">{getMemberLabel(task.assigneeId, MOCK_FREELANCERS)}</span>
                      </div>
                    </td>
                    <td className="tbl-td text-sm text-slate-400 font-mono">{task.dueDate}</td>
                  </tr>
                ))}
                {projectTasks.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-slate-500">{t('projects.noTasks')}</td>
                  </tr>
                )}
              </tbody>
            </table>
            {isReadOnly && persona.role === ROLES.client && (
              <p className="text-xs text-slate-500 p-3 border-t border-slate-800">{t('common.viewOnly')}</p>
            )}
          </div>
        )}

        {projectTab === 'gantt' && perms.gantt && (
          <GanttView tasks={projectTasks} freelancers={MOCK_FREELANCERS} />
        )}

        {projectTab === 'calendar' && renderMiniCalendar(projectTasks)}

        {projectTab === 'docs' && perms.notes && (
          <div className="page-card">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <FileText size={18} className="text-indigo-400" /> {t('projects.notes')}
            </h3>
            <textarea
              value={project.notes || ''}
              onChange={(e) => setProjects(projects.map((p) => (p.id === project.id ? { ...p, notes: e.target.value } : p)))}
              disabled={project.isCompleted}
              rows={10}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-y disabled:opacity-60"
              placeholder={t('projects.notesPlaceholder')}
            />
          </div>
        )}

        {projectTab === 'internal' && perms.internalChat && (
          <div className="page-card flex flex-col h-[min(70dvh,28rem)] sm:h-[480px] !p-0 overflow-hidden">
            <div className="p-4 border-b border-slate-800">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <MessageCircle size={18} className="text-purple-400" /> {t('projects.internalChat')}
              </h3>
              <p className="text-xs text-slate-500 mt-1">{t('projects.internalChatDesc')}</p>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {internalMsgs.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.senderId === currentUserId ? 'flex-row-reverse' : ''}`}>
                  <UserAvatar name={msg.sender} colorClass={getPersonaColor(msg.senderId)} size="sm" />
                  <div className={`max-w-[75%] ${msg.senderId === currentUserId ? 'text-right' : ''}`}>
                    <p className="text-xs text-slate-500 mb-1">{msg.sender} · {msg.time}</p>
                    <p className={`text-sm px-4 py-2.5 rounded-2xl inline-block ${msg.senderId === currentUserId ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-200'}`}>{msg.text}</p>
                  </div>
                </div>
              ))}
              {internalMsgs.length === 0 && <p className="text-slate-500 text-center py-8">{t('projects.noInternalMsg')}</p>}
            </div>
            <div className="p-4 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                value={internalChatInput}
                onChange={(e) => setInternalChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendInternalMessage()}
                placeholder={t('projects.internalPlaceholder')}
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
              <button type="button" onClick={sendInternalMessage} className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors">
                <Send size={18} />
              </button>
            </div>
          </div>
        )}

        {projectTab === 'client' && perms.clientChat && (
          <div className="page-card flex flex-col h-[min(70dvh,28rem)] sm:h-[480px] !p-0 overflow-hidden">
            <div className="p-4 border-b border-slate-800">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <MessageSquare size={18} className="text-blue-400" /> {t('projects.clientChat')}
              </h3>
              <p className="text-xs text-slate-500 mt-1">{t('projects.clientChatDesc', { name: client?.name ?? 'Khách' })}</p>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {clientMsgs.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.senderId === currentUserId ? 'flex-row-reverse' : ''}`}>
                  <UserAvatar name={msg.sender} colorClass={getPersonaColor(msg.senderId)} size="sm" />
                  <div className={`max-w-[75%] ${msg.senderId === currentUserId ? 'text-right' : ''}`}>
                    <p className="text-xs text-slate-500 mb-1">{msg.sender} · {msg.time}</p>
                    <p className={`text-sm px-4 py-2.5 rounded-2xl inline-block ${msg.senderId === currentUserId ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-200'}`}>{msg.text}</p>
                  </div>
                </div>
              ))}
              {clientMsgs.length === 0 && <p className="text-slate-500 text-center py-8">{t('projects.noClientMsg')}</p>}
            </div>
            <div className="p-4 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                value={clientChatInput}
                onChange={(e) => setClientChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendClientMessage()}
                placeholder={t('projects.clientPlaceholder')}
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              />
              <button type="button" onClick={sendClientMessage} className="p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors">
                <Send size={18} />
              </button>
            </div>
          </div>
        )}

        {projectTab === 'members' && perms.members && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <UserCircle size={18} className="text-indigo-400" /> {t('projects.members')}
            </h3>
            {(project.memberIds || []).map((uid) => (
              <div key={uid} className="flex items-center gap-4 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <UserAvatar name={getMemberLabel(uid, MOCK_FREELANCERS)} colorClass={getPersonaColor(uid)} size="md" />
                <div>
                  <p className="text-white font-medium">{getMemberLabel(uid, MOCK_FREELANCERS)}</p>
                  <p className="text-xs text-slate-500">{uid === 'u-owner' ? t('common.owner') : t('common.freelancer')}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderContracts = () => {
    if (!perms.contracts) return <AccessDenied />;
    let filtered = [...contracts];
    if (contextKey === 'client') filtered = filtered.filter((c) => c.type === 'client');
    else if (contextKey === 'freelancer') filtered = filtered.filter((c) => c.type === 'freelancer');

    const contractsPage = paged(filtered);
    const filterTitle = { all: t('contracts.all'), client: t('contracts.client'), freelancer: t('contracts.freelancer') }[contextKey] ?? t('nav.contracts');

    return (
      <div className="page-shell animate-fade-in no-print">
        <div className="page-grid grid-cols-1 lg:grid-cols-2">
          <ContractTemplatePanel
            type="client"
            template={contractTemplates.client}
            onUpload={handleTemplateUpload}
            onReset={handleTemplateReset}
          />
          <ContractTemplatePanel
            type="freelancer"
            template={contractTemplates.freelancer}
            onUpload={handleTemplateUpload}
            onReset={handleTemplateReset}
          />
        </div>
        <div className="page-header">
          <div>
            <h2 className="page-title">{filterTitle}</h2>
            <p className="page-desc">{t('contracts.desc')}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => openContractCreate('client')} className="btn-page-primary">
              <Plus size={16} /> {t('contracts.hdClient')}
            </button>
            <button type="button" onClick={() => openContractCreate('freelancer')} className="btn-page bg-purple-600 hover:bg-purple-500 text-white">
              <Plus size={16} /> {t('contracts.hdFreelancer')}
            </button>
          </div>
        </div>
        <div className="space-y-3">
          {contractsPage.items.map((contract) => {
            const isClient = contract.type === 'client';
            return (
              <div key={contract.id} className="page-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-700 transition-colors">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-white font-semibold">{t('contracts.number')} {contract.id}</p>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border ${
                        isClient ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30' : 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                      }`}
                    >
                      {isClient ? t('contracts.partyClient') : t('contracts.partyFreelancer')}
                    </span>
                  </div>
                  <p className="text-sm text-slate-300 mt-1">{contract.partyName || contract.title}</p>
                  <p className="text-sm text-slate-400">{contract.projectName}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {t('contracts.createdAt')}: {contract.createdAt}
                    {contract.rawValue > 0 && ` · ${formatVND(contract.rawValue)}`}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setViewingContract(contract)}
                    className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-colors"
                    title={t('common.preview')}
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => openContractPrint(contract.body, contract.bodyFormat ?? 'text')}
                    className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                    title={t('common.print')}
                  >
                    <Printer size={18} />
                  </button>
                </div>
              </div>
            );
          })}
          {contractsPage.total === 0 && (
            <div className="text-center py-10 sm:py-16 page-card">
              <FileSignature size={40} className="mx-auto text-slate-600 mb-3" />
              <p className="text-slate-500">{t('contracts.empty')}</p>
            </div>
          )}
        </div>
        {contractsPage.total > 0 && <Pagination {...contractsPage} onPageChange={setListPage} />}
      </div>
    );
  };

  const renderCalendar = () => {
    if (!perms.calendar) return <AccessDenied />;
    const calendarTasks = tasks.filter((t) => visibleProjects.some((p) => p.id === t.projectId));
    return (
      <div className="page-shell animate-fade-in no-print">
        <div>
          <h2 className="page-title">{t('calendar.title')}</h2>
          <p className="page-desc">{t('calendar.desc')}</p>
        </div>
        {renderMiniCalendar(calendarTasks)}
        <div className="page-card">
          <h3 className="text-white font-semibold mb-4">{t('calendar.upcoming')}</h3>
          <div className="space-y-2">
            {calendarTasks.slice(0, 8).map((task) => {
              const project = projects.find((p) => p.id === task.projectId);
              return (
                <div key={task.id} onClick={() => openProject(task.projectId)} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 cursor-pointer transition-colors">
                  <div>
                    <p className="text-sm text-white font-medium">{task.title}</p>
                    <p className="text-xs text-slate-500">{project?.name}</p>
                  </div>
                  <span className="text-xs font-mono text-slate-400">{task.dueDate}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const TaskModal = () => {
    if (!isTaskModalOpen) return null;
    const project = projects.find((p) => p.id === activeProjectId);
    const memberIds = project?.memberIds ?? ['u-owner'];
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm no-print">
        <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg mx-4 shadow-2xl">
          <div className="flex items-center justify-between p-5 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white">{t('taskModal.title')}</h3>
            <button type="button" onClick={() => setIsTaskModalOpen(false)} className="text-slate-400 hover:text-white">
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleAddTask} className="p-5 space-y-4">
            <input type="hidden" name="projectId" value={activeProjectId || ''} />
            <div>
              <label className="text-sm text-slate-400 block mb-1.5">{t('taskModal.labelTitle')}</label>
              <input name="title" required className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="text-sm text-slate-400 block mb-1.5">{t('taskModal.labelDesc')}</label>
              <textarea name="description" rows={2} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-400 block mb-1.5">{t('taskModal.labelStatus')}</label>
                <select name="status" defaultValue="Cần làm" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500">
                  {TASK_COLUMN_STATUSES.map((c) => (
                    <option key={c} value={c}>{labelDemoStatus(c, t)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-slate-400 block mb-1.5">{t('taskModal.labelPriority')}</label>
                <select name="priority" defaultValue="Vừa" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500">
                  <option value="Cao">Cao</option>
                  <option value="Vừa">Vừa</option>
                  <option value="Thấp">Thấp</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-400 block mb-1.5">{t('taskModal.labelStart')}</label>
                <input name="startDate" type="date" defaultValue="2026-05-23" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="text-sm text-slate-400 block mb-1.5">{t('taskModal.labelDue')}</label>
                <input name="dueDate" type="date" defaultValue="2026-05-30" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500" />
              </div>
            </div>
            <div>
              <label className="text-sm text-slate-400 block mb-1.5">{t('taskModal.labelAssignee')}</label>
              <select name="assigneeId" defaultValue={currentUserId} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500">
                {memberIds.map((uid) => (
                  <option key={uid} value={uid}>{getMemberLabel(uid, MOCK_FREELANCERS)}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setIsTaskModalOpen(false)} className="px-4 py-2.5 text-sm text-slate-400 hover:text-white">{t('common.cancel')}</button>
              <button type="submit" className="px-5 py-2.5 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl">{t('common.add')}</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const ClientModal = () => {
    if (!isClientModalOpen) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm no-print">
        <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg mx-4 shadow-2xl">
          <div className="flex items-center justify-between p-5 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white">Thêm khách hàng</h3>
            <button type="button" onClick={() => setIsClientModalOpen(false)} className="text-slate-400 hover:text-white">
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleAddClient} className="p-5 space-y-4">
            <div>
              <label className="text-sm text-slate-400 block mb-1.5">Họ tên</label>
              <input name="name" required className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="text-sm text-slate-400 block mb-1.5">Email</label>
              <input name="email" type="email" required className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="text-sm text-slate-400 block mb-1.5">Điện thoại</label>
              <input name="phone" required className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="text-sm text-slate-400 block mb-1.5">Công ty</label>
              <input name="company" required className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="text-sm text-slate-400 block mb-1.5">Link Facebook (Messenger)</label>
              <input name="facebook" placeholder="facebook.com/..." className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="text-sm text-slate-400 block mb-1.5">Số Zalo</label>
              <input name="zalo" type="tel" placeholder="090xxxxxxx" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500" />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setIsClientModalOpen(false)} className="px-4 py-2.5 text-sm text-slate-400 hover:text-white">Hủy</button>
              <button type="submit" className="px-5 py-2.5 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl">Thêm</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const renderMainContent = () => {
    if (activeTab === 'projects') {
      return activeProjectId ? renderProjectDetail() : renderProjects();
    }
    switch (activeTab) {
      case 'dashboard': return renderDashboard();
      case 'myTasks': return renderMyTasks();
      case 'inbox': return renderInbox();
      case 'calendar': return renderCalendar();
      case 'crm': return renderCRM();
      case 'assets': return renderAssets();
      case 'subscriptions': return renderSubscriptions();
      case 'contracts': return renderContracts();
      case 'collaborators': return renderCollaborators();
      case 'settings': return <SettingsPanel contextKey={contextKey} onSaved={showToast} />;
      default: return renderDashboard();
    }
  };

  const allowedRailItems = RAIL_ITEMS.filter((item) => perms[item.perm]);

  return (
    <div className="app-shell font-sans">
      <CoffeeSupportModal open={isCoffeeOpen} onClose={() => setIsCoffeeOpen(false)} />
      {toastMessage && (
        <div className="fixed top-16 right-4 z-[100] bg-[var(--app-surface)] border border-[var(--app-border)] text-[var(--app-text-heading)] px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-fade-in no-print">
          <CheckCircle2 size={18} className="text-emerald-400" />
          {toastMessage}
        </div>
      )}

      <header className="app-header relative z-[70] h-14 flex items-center gap-2 sm:gap-3 px-2 sm:px-4 no-print">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white text-sm">
            T
          </div>
          <span className="font-bold text-[var(--app-text-heading)] text-sm hidden md:inline">{OWNER_DISPLAY_NAME}</span>
        </div>
        <div className="flex-1 min-w-0 flex items-center justify-start max-w-xl lg:max-w-2xl">
        <WorkspaceAISearch
          workspaceData={{
            projects,
            tasks,
            clients,
            assets,
            purchasedAccounts,
            contracts,
            freelancers,
            inboxMessages,
          }}
          onNavigate={(tab, key) => openModule(tab, key)}
        />
        </div>
        <div className="ml-auto shrink-0">
        <AppHeaderActions
          inboxUnreadCount={inboxUnreadCount}
          notificationCount={notificationCount}
          expiryAlertCount={expiryAlertCount}
          inboxItems={headerInboxItems}
          notificationItems={headerNotificationItems}
          expiryItems={headerExpiryItems}
          onViewAllInbox={() => openModule('inbox', inboxUnreadCount > 0 ? 'unread' : 'all')}
          onViewAllNotifications={() => openModule('dashboard', 'messages')}
          onViewAllExpiryAlerts={openExpiryAlerts}
        />
        </div>
      </header>

      <div className="flex h-[calc(100vh-3.5rem)]">
        <nav className="app-rail w-[4.75rem] sm:w-36 shrink-0 flex flex-col h-full py-3 no-print">
          <div className="flex-1 overflow-y-auto flex flex-col gap-0.5 min-h-0">
          {allowedRailItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const showBadge = item.id === 'inbox' && inboxUnreadCount > 0;
            const label = t(`nav.${item.id}`);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveTab(item.id);
                  setActiveProjectId(null);
                  setIsContextCollapsed(false);
                }}
                title={label}
                className={`relative mx-1.5 sm:mx-2 flex flex-col sm:flex-row items-center sm:items-center gap-1 sm:gap-2.5 px-2 py-2 sm:py-2.5 rounded-xl transition-colors ${
                  isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'text-[var(--app-text-muted)] hover:bg-[var(--app-hover)] hover:text-[var(--app-text)]'
                }`}
              >
                <Icon size={18} className="shrink-0" />
                <span className="text-[9px] sm:text-xs font-medium leading-tight text-center sm:text-left line-clamp-2 sm:line-clamp-1 max-w-full">
                  {label}
                </span>
                {showBadge && (
                  <span className="absolute top-1 right-1 sm:top-2 sm:right-2 min-w-[14px] h-3.5 px-1 rounded-full bg-rose-500 text-[9px] font-bold text-white flex items-center justify-center">
                    {inboxUnreadCount}
                  </span>
                )}
              </button>
            );
          })}
          </div>
          <button
            type="button"
            onClick={() => setIsCoffeeOpen(true)}
            title={t('coffee.title')}
            className="mx-1.5 sm:mx-2 mt-2 flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-2 py-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-300 hover:bg-amber-500/20 transition-colors shrink-0"
          >
            <Coffee size={18} className="shrink-0" />
            <span className="text-[9px] sm:text-xs font-medium leading-tight text-center sm:text-left line-clamp-2">
              {t('coffee.title')}
            </span>
          </button>
        </nav>

        {!isContextCollapsed && activeModule && (
          <ContextSidebar
            activeTab={activeTab}
            contextKey={contextKey}
            setContextKey={setContextKey}
            moduleTitle={t(`nav.${activeModule.id}`)}
            onCollapse={() => setIsContextCollapsed(true)}
            perms={perms}
            clientProjects={clientProjects}
            partnershipProjects={partnershipProjects}
            visibleProjects={visibleProjects}
            clients={clients}
            freelancers={freelancers}
            inboxCount={inboxFilteredCount}
            inboxUnreadCount={inboxUnreadCount}
            onOpenProject={openProject}
            activeProjectId={activeProjectId}
            onCreateProject={() => showToast(t('toast.createProject'))}
            onCreateClient={() => setIsClientModalOpen(true)}
            onCreateContract={() => openContractCreate('client')}
            onCreateSubscription={() => showToast(t('toast.createSubscription'))}
            onCreateCollaborator={() => setIsCollaboratorModalOpen(true)}
            onCreateAsset={() => setIsAssetModalOpen(true)}
            getPersonaColor={getPersonaColor}
          />
        )}

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <div className="main-breadcrumb no-print">
            {isContextCollapsed && activeModule && (
              <button
                type="button"
                onClick={() => setIsContextCollapsed(false)}
                className="shrink-0 p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                title={t('openSubmenu')}
              >
                <PanelLeftOpen size={18} />
              </button>
            )}
            <span className="text-[var(--app-text-muted)]">{activeModule ? t(`nav.${activeModule.id}`) : 'Workspace'}</span>
            <ChevronRight size={14} className="text-slate-600" />
            <span className="text-slate-300 font-medium truncate">
              {activeTab === 'projects' && activeProjectId
                ? projects.find((p) => p.id === activeProjectId)?.name
                : contextKey.startsWith('client-')
                  ? clients.find((c) => contextKey === `client-${c.id}`)?.name
                  : contextKey.startsWith('dm-')
                    ? freelancers.find((f) => contextKey === `dm-${f.id}`)?.name
                    : getBreadcrumbContextLabel(t, activeTab, contextKey)}
            </span>
          </div>
          <main className="main-scroll">
            {renderMainContent()}
          </main>
        </div>
      </div>

      <TaskModal />
      <ClientModal />
      <CollaboratorModal open={isCollaboratorModalOpen} onClose={() => setIsCollaboratorModalOpen(false)} onSubmit={handleAddCollaborator} />
      <AssetModal open={isAssetModalOpen} onClose={() => setIsAssetModalOpen(false)} onSubmit={handleAddAsset} clients={clients} />
      <AssetDetailModal
        open={!!viewingAsset}
        asset={viewingAsset}
        client={viewingAsset ? clients.find((c) => c.id === viewingAsset.clientId) : null}
        onClose={() => setViewingAsset(null)}
      />
      <ContractCreateModal
        key={`${isContractModalOpen}-${contractModalType}-${contractModalFreelancerId}`}
        open={isContractModalOpen}
        onClose={() => setIsContractModalOpen(false)}
        clients={clients}
        projects={projects}
        freelancers={freelancers}
        templates={contractTemplates}
        ownerName={persona.name}
        initialType={contractModalType}
        prefillFreelancerId={contractModalFreelancerId}
        onSave={handleSaveContract}
      />
      <ContractPreviewModal
        open={!!viewingContract}
        title={viewingContract?.title || 'Hợp đồng'}
        subtitle={viewingContract ? `${viewingContract.projectName} · ${viewingContract.id}` : ''}
        body={viewingContract?.body || ''}
        bodyFormat={viewingContract?.bodyFormat ?? 'text'}
        typeLabel={viewingContract?.type === 'client' ? 'Khách hàng' : 'Cộng tác viên'}
        onClose={() => setViewingContract(null)}
        onPrint={() => {
          if (viewingContract) openContractPrint(viewingContract.body, viewingContract.bodyFormat ?? 'text');
        }}
      />

    </div>
  );
}
