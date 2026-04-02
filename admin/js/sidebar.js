// admin/js/sidebar.js — Renders sidebar + topbar on every admin page

function renderSidebar(activePage) {
  const navItems = [
    { id: 'dashboard', icon: 'fas fa-gauge-high', label: 'Dashboard', href: 'dashboard.html' },
    { id: 'queries', icon: 'fas fa-inbox', label: 'Enquiries', href: 'queries.html', badge: 'new' },
    { id: 'projects', icon: 'fas fa-hard-hat', label: 'Projects', href: 'projects.html' },
    { id: 'gallery', icon: 'fas fa-images', label: 'Gallery', href: 'gallery.html' },
    { id: 'content', icon: 'fas fa-pen-nib', label: 'CMS Content', href: 'content.html' },
    { id: 'settings', icon: 'fas fa-sliders', label: 'Settings', href: 'settings.html' },
  ];

  const html = `
<div class="sidebar" id="sidebar">
  <div class="sidebar-brand">
    <div class="sidebar-brand-icon">M</div>
    <div class="sidebar-brand-text">
      <div class="brand-name">MBUILD Admin</div>
      <div class="brand-sub">Control Panel</div>
    </div>
  </div>
  <nav class="sidebar-nav">
    <div class="nav-label">Main Menu</div>
    ${navItems.map(item => `
      <a href="${item.href}" class="nav-item ${activePage === item.id ? 'active' : ''}" id="nav-${item.id}">
        <i class="${item.icon}"></i>
        ${item.label}
        ${item.badge ? `<span class="nav-badge" id="badge-${item.badge}" style="display:none">0</span>` : ''}
      </a>`).join('')}
    <div class="nav-label" style="margin-top:12px;">Quick Links</div>
    <a href="../index.html" target="_blank" class="nav-item">
      <i class="fas fa-arrow-up-right-from-square"></i> View Website
    </a>
  </nav>
  <div class="sidebar-footer">
    <a href="#" class="nav-item" id="logoutBtn">
      <i class="fas fa-right-from-bracket"></i> Logout
    </a>
  </div>
</div>`;

  document.body.insertAdjacentHTML('afterbegin', html);

  // Logout
  document.getElementById('logoutBtn').onclick = async (e) => {
    e.preventDefault();
    await Auth.logout();
  };

  // Add mobile overlay
  if (!document.getElementById('sidebarOverlay')) {
    document.body.insertAdjacentHTML('beforeend', '<div id="sidebarOverlay" style="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:999;display:none;backdrop-filter:blur(2px)"></div>');
  }

  // Load new query count for badge
  loadQueryBadge();
}

function initMobileMenu() {
  const toggle = document.getElementById('menuToggle');
  const sb = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');

  if (toggle && sb && overlay) {
    toggle.onclick = (e) => {
      e.stopPropagation();
      sb.classList.toggle('open');
      overlay.style.display = sb.classList.contains('open') ? 'block' : 'none';
    };

    overlay.onclick = () => {
      sb.classList.remove('open');
      overlay.style.display = 'none';
    };

    // Close on link click
    sb.querySelectorAll('.nav-item').forEach(link => {
      link.addEventListener('click', () => {
        sb.classList.remove('open');
        overlay.style.display = 'none';
      });
    });
  }
}

async function loadQueryBadge() {
  try {
    const stats = await Queries.getStats();
    const badge = document.getElementById('badge-new');
    if (badge && stats.new > 0) {
      badge.textContent = stats.new;
      badge.style.display = 'inline-flex';
    }
  } catch (e) { }
}

function renderTopbar(title, subtitle = '') {
  const date = new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' });
  const html = `
<div class="topbar">
  <div class="topbar-left">
    <button class="menu-toggle" id="menuToggle"><i class="fas fa-bars"></i></button>
    <div>
      <div class="topbar-title">${title}</div>
      ${subtitle ? `<div class="topbar-sub">${subtitle}</div>` : ''}
    </div>
  </div>
  <div class="topbar-right">
    <span class="topbar-date">${date}</span>
    <div class="admin-badge">
      <div class="admin-dot"></div>
      <span id="adminEmail">Admin</span>
    </div>
  </div>
</div>`;
  document.querySelector('.main-content').insertAdjacentHTML('afterbegin', html);

  // Load admin email
  Auth.getUser().then(user => {
    if (user) document.getElementById('adminEmail').textContent = user.email;
  });
}

// Init every admin page
async function initAdminPage(pageName, title, subtitle) {
  const user = await Auth.requireAuth();
  if (!user) return;
  renderSidebar(pageName);
  renderTopbar(title, subtitle);
  initMobileMenu();
}
