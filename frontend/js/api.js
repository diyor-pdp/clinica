/* ─── API Client ─────────────────────────────────────────────────────────── */
const API = {
  base: '/api',
  token() { return localStorage.getItem('ct_token'); },
  headers() {
    const h = { 'Content-Type': 'application/json' };
    const t = this.token();
    if (t) h['Authorization'] = `Bearer ${t}`;
    return h;
  },
  async request(method, path, body) {
    const opts = { method, headers: this.headers() };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(this.base + path, opts);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw { status: res.status, message: data.error || 'So\'rov bajarilmadi' };
    return data;
  },
  get:    (path)       => API.request('GET',    path),
  post:   (path, body) => API.request('POST',   path, body),
  put:    (path, body) => API.request('PUT',    path, body),
  delete: (path)       => API.request('DELETE', path),

  login:  (c)      => API.post('/auth/login', c),
  me:     ()       => API.get('/auth/me'),

  getDoctors:   (q)    => API.get('/doctors' + (q ? '?' + new URLSearchParams(q) : '')),
  getDoctor:    (id)   => API.get(`/doctors/${id}`),
  createDoctor: (d)    => API.post('/doctors', d),
  updateDoctor: (id,d) => API.put(`/doctors/${id}`, d),
  deleteDoctor: (id)   => API.delete(`/doctors/${id}`),

  getPatients:   (q)    => API.get('/patients' + (q ? '?' + new URLSearchParams(q) : '')),
  getPatient:    (id)   => API.get(`/patients/${id}`),
  createPatient: (p)    => API.post('/patients', p),
  updatePatient: (id,p) => API.put(`/patients/${id}`, p),
  deletePatient: (id)   => API.delete(`/patients/${id}`),

  getDiseases:   (q)    => API.get('/diseases' + (q ? '?' + new URLSearchParams(q) : '')),
  getDisease:    (id)   => API.get(`/diseases/${id}`),
  createDisease: (d)    => API.post('/diseases', d),
  updateDisease: (id,d) => API.put(`/diseases/${id}`, d),
  deleteDisease: (id)   => API.delete(`/diseases/${id}`),

  getStats: () => API.get('/stats'),
};

/* ─── Auth ───────────────────────────────────────────────────────────────── */
const Auth = {
  save(token, user) { localStorage.setItem('ct_token', token); localStorage.setItem('ct_user', JSON.stringify(user)); },
  clear()   { localStorage.removeItem('ct_token'); localStorage.removeItem('ct_user'); },
  user()    { try { return JSON.parse(localStorage.getItem('ct_user')); } catch { return null; } },
  isLoggedIn() { return !!localStorage.getItem('ct_token'); },
  role()    { return this.user()?.role; },
  is(...roles) { return roles.includes(this.role()); },
  requireAuth() { if (!this.isLoggedIn()) { window.location.href = '/index.html'; return false; } return true; },
  logout()  { this.clear(); window.location.href = '/index.html'; }
};

/* ─── Toast ──────────────────────────────────────────────────────────────── */
const Toast = {
  _c: null,
  _init() {
    if (!this._c) { this._c = document.createElement('div'); this._c.className = 'toast-container'; document.body.appendChild(this._c); }
  },
  show(msg, type = 'info', ms = 3800) {
    this._init();
    const icons = {
      success: `<svg width="17" height="17" fill="none" stroke="#16a34a" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" d="M5 13l4 4L19 7"/></svg>`,
      error:   `<svg width="17" height="17" fill="none" stroke="#b91c1c" stroke-width="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path stroke-linecap="round" d="M15 9l-6 6M9 9l6 6"/></svg>`,
      info:    `<svg width="17" height="17" fill="none" stroke="#1e40af" stroke-width="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path stroke-linecap="round" d="M12 8v4m0 4h.01"/></svg>`,
    };
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.innerHTML = `${icons[type]}<span style="flex:1;color:var(--text)">${msg}</span>`;
    this._c.appendChild(t);
    setTimeout(() => { t.classList.add('removing'); setTimeout(() => t.remove(), 300); }, ms);
  },
  success: (m) => Toast.show(m, 'success'),
  error:   (m) => Toast.show(m, 'error'),
  info:    (m) => Toast.show(m, 'info'),
};

/* ─── Confirm dialog ─────────────────────────────────────────────────────── */
function confirmDialog(title, message, okLabel = "O'chirish") {
  return new Promise(resolve => {
    const ov = document.createElement('div');
    ov.className = 'confirm-overlay';
    ov.innerHTML = `
      <div class="confirm-box">
        <div class="confirm-icon">
          <svg width="22" height="22" fill="none" stroke="#b91c1c" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
          </svg>
        </div>
        <div class="confirm-title">${title}</div>
        <div class="confirm-message">${message}</div>
        <div class="confirm-buttons">
          <button class="btn btn-secondary" id="cnf-no">Bekor qilish</button>
          <button class="btn btn-danger"    id="cnf-yes">${okLabel}</button>
        </div>
      </div>`;
    document.body.appendChild(ov);
    ov.querySelector('#cnf-no').onclick  = () => { ov.remove(); resolve(false); };
    ov.querySelector('#cnf-yes').onclick = () => { ov.remove(); resolve(true); };
    ov.onclick = e => { if (e.target === ov) { ov.remove(); resolve(false); } };
  });
}

/* ─── SVG icons ──────────────────────────────────────────────────────────── */
const SVG = {
  clinic:  () => `<svg width="20" height="20" fill="none" stroke="white" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H5m14 0h2M5 21H3M9 7h1m-1 4h1m4-4h1m-1 4h1M9 21v-4a2 2 0 012-2h2a2 2 0 012 2v4"/></svg>`,
  edit:    () => `<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>`,
  trash:   () => `<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>`,
  eye:     () => `<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>`,
  logout:  () => `<svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>`,
  user:    () => `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  users:   () => `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>`,
  pulse:   () => `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" d="M9 12h6m-3-3v6M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>`,
  grid:    () => `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>`,
  search:  () => `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path stroke-linecap="round" d="M21 21l-4.35-4.35"/></svg>`,
  plus:    () => `<svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" d="M12 4v16m8-8H4"/></svg>`,
  warning: () => `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>`,
};

/* ─── Shared layout setup ────────────────────────────────────────────────── */
function setupLayout(activePage) {
  if (!Auth.requireAuth()) return;
  const user = Auth.user();

  const roleLabels = { admin: 'Administrator', clinician: 'Klinitsist', reception: 'Qabulxona' };
  const navItems = [
    { id: 'dashboard', label: 'Bosh sahifa',  href: '/dashboard.html', roles: ['admin','clinician','reception'], icon: SVG.grid()  },
    { id: 'doctors',   label: 'Shifokorlar',  href: '/doctors.html',   roles: ['admin','reception'],             icon: SVG.user()  },
    { id: 'patients',  label: 'Bemorlar',     href: '/patients.html',  roles: ['admin','clinician','reception'], icon: SVG.users() },
    { id: 'diseases',  label: 'Tashxislar',   href: '/diseases.html',  roles: ['admin','clinician'],             icon: SVG.pulse() },
  ];

  const sidebar = document.getElementById('sidebar');
  const allowed = navItems.filter(n => n.roles.includes(user.role));

  sidebar.innerHTML = `
    <div class="sidebar-brand">
      <div class="brand-icon">${SVG.clinic()}</div>
      <div class="brand-text"><h2>CareTrack</h2><span>Klinika TYBT</span></div>
    </div>
    <nav class="sidebar-nav">
      <div class="nav-label">Menyú</div>
      ${allowed.map(n => `
        <a class="nav-item ${n.id === activePage ? 'active' : ''}" href="${n.href}">
          ${n.icon} ${n.label}
        </a>`).join('')}
    </nav>
    <div class="sidebar-footer">
      <div class="user-card">
        <div class="user-avatar">${user.name.charAt(0).toUpperCase()}</div>
        <div style="min-width:0">
          <div class="user-name" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${user.name}</div>
          <span class="user-role-tag role-${user.role}">${roleLabels[user.role] || user.role}</span>
        </div>
      </div>
      <button class="btn btn-ghost btn-full btn-sm" id="logoutBtn" style="color:var(--sidebar-text);justify-content:flex-start;gap:8px">
        ${SVG.logout()} Tizimdan chiqish
      </button>
    </div>`;

  // Mobile sidebar toggle
  const overlay = document.getElementById('sidebarOverlay');
  document.getElementById('menuToggle')?.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    overlay?.classList.toggle('show');
  });
  overlay?.addEventListener('click', () => { sidebar.classList.remove('open'); overlay.classList.remove('show'); });
  document.getElementById('logoutBtn').addEventListener('click', Auth.logout.bind(Auth));

  // Set page title
  const titleEl = document.querySelector('.page-title');
  if (titleEl) titleEl.textContent = allowed.find(n => n.id === activePage)?.label || '';
}

/* ─── Helpers ────────────────────────────────────────────────────────────── */
const SEVERITY_MAP = { Mild: 'Yengil', Moderate: "O'rtacha", Severe: 'Og\'ir', Critical: 'Kritik' };
const STATUS_MAP   = { Ongoing: 'Davom etmoqda', Chronic: 'Surunkali', Recurrent: 'Qaytuvchi', Resolved: 'Tuzalgan' };
const GENDER_MAP   = { Male: 'Erkak', Female: 'Ayol', Other: 'Boshqa' };

function severityBadge(s) {
  const cls = { Mild:'badge-green', Moderate:'badge-amber', Severe:'badge-red', Critical:'badge-purple' };
  return `<span class="badge ${cls[s]||'badge-gray'}">${SEVERITY_MAP[s]||s}</span>`;
}
function statusBadge(s) {
  const cls = { Ongoing:'badge-amber', Chronic:'badge-sky', Recurrent:'badge-blue', Resolved:'badge-green' };
  return `<span class="badge ${cls[s]||'badge-gray'}">${STATUS_MAP[s]||s}</span>`;
}
function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('uz-UZ', { year:'numeric', month:'short', day:'numeric' });
}
function age(dob) {
  return Math.floor((Date.now() - new Date(dob)) / (1000*60*60*24*365.25));
}
function initials(first, last) {
  return ((first||'').charAt(0) + (last||'').charAt(0)).toUpperCase();
}
