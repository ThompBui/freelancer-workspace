/** Demo: cùng một app, đổi persona — sau này backend map userId → role */

export const ROLES = {
  owner: 'owner',
  freelancer: 'freelancer',
  client: 'client',
};

export const DEMO_PERSONAS = [
  { id: 'u-owner', role: ROLES.owner, name: 'Bạn (Owner)', subtitle: 'Chủ workspace', color: 'from-indigo-500 to-purple-500' },
  { id: 'u-f1', role: ROLES.freelancer, name: 'Trần Minh', subtitle: 'Frontend', freelancerId: 'f1', color: 'from-cyan-500 to-blue-500' },
  { id: 'u-f2', role: ROLES.freelancer, name: 'Nguyễn Lan', subtitle: 'Backend', freelancerId: 'f2', color: 'from-emerald-500 to-teal-500' },
  { id: 'u-c1', role: ROLES.client, name: 'Nguyễn Văn A', subtitle: 'Khách TechCorp', clientId: 'c1', color: 'from-amber-500 to-orange-500' },
];

export function getPersona(userId) {
  return DEMO_PERSONAS.find((p) => p.id === userId) ?? DEMO_PERSONAS[0];
}

export function getPermissions(role) {
  const isOwner = role === ROLES.owner;
  const isFreelancer = role === ROLES.freelancer;
  const isClient = role === ROLES.client;

  return {
    dashboard: isOwner,
    projects: isOwner || isFreelancer || isClient,
    crm: isOwner,
    assets: isOwner,
    subscriptions: isOwner,
    contracts: isOwner,
    calendar: isOwner || isFreelancer,
    inbox: isOwner || isFreelancer,
    myTasks: isOwner || isFreelancer,
    collaborators: isOwner || isFreelancer,
    settings: isOwner,
    seeBudget: isOwner,
    lockProject: isOwner,
    clientChat: isOwner || isClient,
    internalChat: isOwner || isFreelancer,
    gantt: !isClient,
    list: !isClient,
    board: !isClient,
    addTask: isOwner || isFreelancer,
    dragTask: isOwner || isFreelancer,
    members: isOwner || isFreelancer,
    notes: isOwner || isFreelancer,
    createProject: isOwner,
  };
}

export function canAccessProject(project, userId, role) {
  if (role === ROLES.owner) return true;
  if (role === ROLES.client) {
    const persona = getPersona(userId);
    return project.clientId === persona.clientId;
  }
  return project.memberIds?.includes(userId) ?? false;
}

export function filterProjectsForUser(projects, userId, role) {
  return projects.filter((p) => canAccessProject(p, userId, role));
}

export function filterTasksForUser(tasks, userId, role, projectIds) {
  const inProjects = tasks.filter((t) => projectIds.includes(t.projectId));
  if (role === ROLES.owner) return inProjects;
  if (role === ROLES.freelancer) return inProjects.filter((t) => t.assigneeId === userId || t.assigneeId === 'u-owner');
  return [];
}
