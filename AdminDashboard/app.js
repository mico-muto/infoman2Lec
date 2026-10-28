const API = {
  me:     '/api/me',               
  stats:  '/api/dashboard/stats',  
  logout: '/api/logout'            
};
const LOGIN_PAGE = 'index.html';


const MODULES = [
  { id: 'customers', label: 'Customers',       icon: '👥',       href: 'customers.html', quick: 'View Customers' },
  { id: 'products',  label: 'Products',        icon: '📦',       href: 'products.html',  quick: 'Manage Products' },
  { id: 'hr',        label: 'Human Resources', icon: '🧑‍💼', href: 'hr.html',        quick: 'Human Resources' },
  { id: 'sales',     label: 'Sales',           icon: '📈',       href: 'sales.html',     quick: 'Sales Pipeline' },
  { id: 'reports',   label: 'Reports',         icon: '📊',       href: 'reports.html',   quick: 'Reports' }
];

const ADMIN_ITEMS = [
  { id: 'users',    label: 'User Management', icon: '🔐', href: 'users.html',    quick: 'Manage Users', roles: ['superadmin', 'admin'] },
  { id: 'settings', label: 'System Settings', icon: '⚙️', href: 'settings.html', quick: null,           roles: ['superadmin'] }
];

const ROLE_MESSAGES = {
  superadmin: 'You have full system access. You can manage all modules and assign roles to any user.',
  admin:      'You can manage most modules and user rights (except Superadmin accounts).',
  user:       'You have access to the modules assigned to you. Contact an Admin for more rights.'
};


const ALL_MODULE_IDS = MODULES.map(m => m.id);
const DEMO_USERS = {
  superadmin: { firstName: 'Sarah', lastName: 'Chen',   role: 'superadmin', modules: ALL_MODULE_IDS },
  admin:      { firstName: 'Lisa',  lastName: 'Park',   role: 'admin',      modules: ALL_MODULE_IDS },
  user:       { firstName: 'Alex',  lastName: 'Rivera', role: 'user',       modules: ['customers', 'products', 'sales', 'reports'] }
};
const DEMO_STATS = {
  customers: 1248, products: 386, openOrders: 94, revenueMtd: 84200,
  changes: {
    customers:  '↑ 12% this month',
    products:   '↑ 5 new this week',
    openOrders: '↑ 8% vs last week',
    revenueMtd: '↑ 18% vs last month'
  }
};


const $ = id => document.getElementById(id);

async function getJson(url) {
  const res = await fetch(url, { credentials: 'same-origin', headers: { Accept: 'application/json' } });
  if (res.status === 401) {                 // not logged in -> back to the login page
    window.location.href = LOGIN_PAGE;
    throw new Error('Not logged in');
  }
  if (!res.ok) throw new Error(url + ' returned ' + res.status);
  return res.json();
}

function makeNavItem(item, isActive) {
  const a = document.createElement('a');
  a.className = 'nav-item' + (isActive ? ' active' : '');
  a.href = item.href;
  const icon = document.createElement('span');
  icon.className = 'icon';
  icon.textContent = item.icon;
  a.append(icon, document.createTextNode(item.label));
  return a;
}

function makeSection(title, items) {
  const section = document.createElement('div');
  section.className = 'nav-section';
  if (title) {
    const t = document.createElement('div');
    t.className = 'nav-section-title';
    t.textContent = title;
    section.appendChild(t);
  }
  items.forEach(el => section.appendChild(el));
  return section;
}

function makeQuickBtn(item, locked) {
  const a = document.createElement('a');
  a.className = 'quick-btn' + (locked ? ' locked' : '');
  a.href = locked ? '#' : item.href;
  if (locked) {
    a.setAttribute('aria-disabled', 'true');
    a.title = 'You do not have rights to this module. Ask an Admin.';
  }
  a.textContent = item.icon + ' ' + item.quick;
  return a;
}

const isNum = n => typeof n === 'number' && isFinite(n);
const formatCount = n => isNum(n) ? n.toLocaleString('en-US') : '–';
const formatMoney = n => isNum(n) ? new Intl.NumberFormat('en-US', {
  style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1
}).format(n) : '–';


function renderUser(user) {
  const fullName = (user.firstName + ' ' + (user.lastName || '')).trim();
  $('userName').textContent = fullName;
  $('userRoleLabel').textContent = user.role;
  $('userAvatar').textContent = (user.firstName || '?').charAt(0).toUpperCase();

  $('roleBadge').textContent = user.role;
  $('roleBadge').className = 'role-badge role-' + user.role;

  $('welcomeTitle').textContent = 'Welcome back, ' + user.firstName + '!';
  $('welcomeText').textContent = ROLE_MESSAGES[user.role] || '';
}

function renderSidebar(user) {
  const nav = $('sidebarNav');
  nav.innerHTML = '';

  nav.appendChild(makeSection(null, [
    makeNavItem({ label: 'Dashboard', icon: '🏠', href: 'dashboard.html' }, true)
  ]));

 
  const allowed = MODULES.filter(m => user.modules.includes(m.id));
  if (allowed.length) nav.appendChild(makeSection('Modules', allowed.map(m => makeNavItem(m))));

  const adminItems = ADMIN_ITEMS.filter(i => i.roles.includes(user.role));
  if (adminItems.length) nav.appendChild(makeSection('Administration', adminItems.map(i => makeNavItem(i))));
}

function renderQuickActions(user) {
  const box = $('quickActions');
  box.innerHTML = '';

 
  MODULES.forEach(m => box.appendChild(makeQuickBtn(m, !user.modules.includes(m.id))));

  ADMIN_ITEMS
    .filter(i => i.quick && i.roles.includes(user.role))
    .forEach(i => box.appendChild(makeQuickBtn(i, false)));
}

function renderStats(stats) {
  const c = stats.changes || {};
  $('statCustomers').textContent = formatCount(stats.customers);
  $('statProducts').textContent  = formatCount(stats.products);
  $('statOrders').textContent    = formatCount(stats.openOrders);
  $('statRevenue').textContent   = formatMoney(stats.revenueMtd);
  $('chgCustomers').textContent  = c.customers  || '';
  $('chgProducts').textContent   = c.products   || '';
  $('chgOrders').textContent     = c.openOrders || '';
  $('chgRevenue').textContent    = c.revenueMtd || '';
}


async function loadUser() {
  try {
    const user = await getJson(API.me);
    // Admins and superadmins use every module even if the server leaves "modules" out.
    if (!Array.isArray(user.modules)) {
      user.modules = user.role === 'user' ? [] : ALL_MODULE_IDS;
    }
    return { user, demo: false };
  } catch (err) {
    if (err.message === 'Not logged in') throw err;
    const pick = new URLSearchParams(window.location.search).get('demo');
    return { user: DEMO_USERS[pick] || DEMO_USERS.admin, demo: true };
  }
}

async function loadStats(demo) {
  if (demo) return DEMO_STATS;
  try {
    return await getJson(API.stats);
  } catch (err) {
    return { changes: {} };   // cards show "–" if the numbers could not be loaded
  }
}

async function init() {
  const { user, demo } = await loadUser();
  $('sampleNote').hidden = !demo;

  renderUser(user);
  renderSidebar(user);
  renderQuickActions(user);
  renderStats(await loadStats(demo));
}


$('logoutBtn').addEventListener('click', async () => {
  try { await fetch(API.logout, { method: 'POST', credentials: 'same-origin' }); } catch (e) { /* no server yet */ }
  window.location.href = LOGIN_PAGE;
});


$('menuBtn').addEventListener('click', () => document.body.classList.toggle('menu-open'));
$('backdrop').addEventListener('click', () => document.body.classList.remove('menu-open'));

init().catch(() => { /* redirected to the login page */ });
