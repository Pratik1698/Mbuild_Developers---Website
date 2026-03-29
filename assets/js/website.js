/* ═══════════════════════════════════════════════════════════
   MBUILD DEVELOPERS — website.js
   Drop this in: assets/js/website.js
   Include on EVERY page: <script src="../assets/js/website.js"></script>
   (use "assets/js/website.js" on index.html — no ../)

   This file:
   1. Connects to Supabase
   2. Fetches all live content (hero, about, contact, settings, projects, gallery)
   3. Injects it into the page automatically
   4. Every admin save → page refreshes automatically show new data
═══════════════════════════════════════════════════════════ */

/* ── YOUR SUPABASE CREDENTIALS ── */
const SB_URL = 'https://draslpunaydcrjmpasoj.supabase.co';       // e.g. https://xyzabc.supabase.co
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyYXNscHVuYXlkY3JqbXBhc29qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1MzgwNDQsImV4cCI6MjA5MDExNDA0NH0.h-UJ34MzdpUdBSON92OvfEa2JlyO7Di42E_GTHqfBIA';  // long JWT key

/* ══════════════════════════════════
   SUPABASE FETCH HELPER
   (No SDK needed — plain fetch)
══════════════════════════════════ */
async function sbFetch(table, params = '') {
  const res = await fetch(`${SB_URL}/rest/v1/${table}?${params}`, {
    headers: {
      apikey: SB_KEY,
      Authorization: `Bearer ${SB_KEY}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) throw new Error(`Supabase error: ${res.status}`);
  return res.json();
}

/* ══════════════════════════════════
   LOAD SETTINGS (SEO, WhatsApp, etc.)
══════════════════════════════════ */
async function loadSettings() {
  try {
    const rows = await sbFetch('settings', 'select=key,value');
    const s = {};
    rows.forEach(r => { s[r.key] = r.value; });
    window.MBUILD_SETTINGS = s;

    // Page title
    if (s.site_title && document.title.includes('MBUILD')) {
      // Keep page-specific prefix, update brand
      const parts = document.title.split('–');
      if (parts.length > 1) document.title = `${parts[0].trim()} – ${s.site_title}`;
      else document.title = s.site_title;
    }

    // Meta description
    if (s.meta_description) {
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.content = s.meta_description;
    }

    // WhatsApp float button
    const waFloat = document.querySelector('.wa-float');
    if (waFloat && s.whatsapp_number) {
      waFloat.href = `https://wa.me/${s.whatsapp_number}`;
    }

    // All WhatsApp links in page
    document.querySelectorAll('[href*="wa.me"]').forEach(el => {
      if (s.whatsapp_number) el.href = `https://wa.me/${s.whatsapp_number}`;
    });

    // Google Maps embed
    const mapIframe = document.querySelector('.map-wrap iframe');
    if (mapIframe && s.google_maps_lat && s.google_maps_lng) {
      mapIframe.src = `https://www.google.com/maps?q=${s.google_maps_lat},${s.google_maps_lng}&z=15&output=embed`;
    }

    // Get Directions link
    const dirBtn = document.querySelector('[href*="google.com/maps/dir"]');
    if (dirBtn && s.google_maps_lat && s.google_maps_lng) {
      dirBtn.href = `https://www.google.com/maps/dir/?api=1&destination=${s.google_maps_lat},${s.google_maps_lng}`;
    }

    // Section visibility
    const sections = {
      show_hero:         '[data-section="hero"], .hero',
      show_services:     '[data-section="services"], .services-section',
      show_gallery:      '[data-section="gallery"], .gallery-preview',
      show_projects:     '[data-section="projects"], .civil-preview, .civil-section',
      show_testimonials: '[data-section="testimonials"], .testimonials-section, .test-section',
      show_certificates: '[data-section="certificates"], .certs-section',
    };
    Object.entries(sections).forEach(([key, selector]) => {
      if (s[key] === 'false') {
        document.querySelectorAll(selector).forEach(el => el.style.display = 'none');
      }
    });

    // EmailJS keys (update Contact form if present)
    if (s.emailjs_public_key && typeof emailjs !== 'undefined') {
      emailjs.init(s.emailjs_public_key);
    }
    window.EMAILJS_SERVICE_ID  = s.emailjs_service_id  || '';
    window.EMAILJS_TEMPLATE_ID = s.emailjs_template_id || '';

  } catch(e) {
    console.warn('[mBuild] Settings load failed:', e.message);
  }
}

/* ══════════════════════════════════
   LOAD WEBSITE CONTENT (CMS)
══════════════════════════════════ */
async function loadContent() {
  try {
    const rows = await sbFetch('website_content', 'select=section,content');
    const c = {};
    rows.forEach(r => { c[r.section] = r.content; });
    window.MBUILD_CONTENT = c;

    /* ── HERO SECTION ── */
    const hero = c.hero || {};
    setText('[data-cms="hero-title"]',    hero.title);
    setText('[data-cms="hero-subtitle"]', hero.subtitle);
    setText('[data-cms="hero-badge"]',    hero.badge);
    // Also target common hero class patterns
    const h1Hero = document.querySelector('.hero h1, .hero-h1');
    if (h1Hero && hero.title) injectHTML(h1Hero, hero.title);

    /* ── ABOUT / STORY SECTION ── */
    const about = c.about || {};
    setText('[data-cms="about-title"]',       about.title);
    setText('[data-cms="about-body"]',         about.body);
    setText('[data-cms="about-established"]',  about.established);
    setText('[data-cms="about-projects"]',     about.projects);
    setText('[data-cms="about-experience"]',   about.experience);
    setText('[data-cms="about-turnover"]',     about.turnover);
    // Stats bar (trust-bar on homepage)
    setStatByIndex(0, about.projects  || '250+');
    setStatByIndex(1, about.experience || '9+');

    /* ── CONTACT SECTION ── */
    const contact = c.contact || {};
    setText('[data-cms="contact-phone1"]', contact.phone1);
    setText('[data-cms="contact-phone2"]', contact.phone2);
    setText('[data-cms="contact-email1"]', contact.email1);
    setText('[data-cms="contact-email2"]', contact.email2);
    setText('[data-cms="contact-address"]', contact.address);
    setText('[data-cms="contact-gst"]',    contact.gst);
    // Update all phone links
    if (contact.phone1) {
      document.querySelectorAll(`[href="tel:${contact.phone1}"], [href^="tel:+91860"]`).forEach(el => {
        el.href = `tel:${contact.phone1.replace(/\s/g,'')}`;
      });
    }
    // Update email links
    if (contact.email1) {
      document.querySelectorAll(`[href^="mailto:mbuiltsangli"]`).forEach(el => {
        el.href = `mailto:${contact.email1}`;
      });
    }
    // Footer contact list
    updateFooterContact(contact);

    /* ── FOOTER SECTION ── */
    const footer = c.footer || {};
    setText('[data-cms="footer-tagline"]',     footer.tagline);
    setText('[data-cms="footer-description"]', footer.description);
    setText('[data-cms="footer-copyright"]',   footer.copyright);
    // .footer-bottom copyright
    const fb = document.querySelector('.footer-bottom');
    if (fb && footer.copyright) fb.textContent = footer.copyright;

    /* ── SOCIAL LINKS ── */
    const social = c.social || {};
    updateSocialLinks(social);

  } catch(e) {
    console.warn('[mBuild] Content load failed:', e.message);
  }
}

/* ══════════════════════════════════
   LOAD PROJECTS (Civil Projects page)
══════════════════════════════════ */
async function loadProjects() {
  const grid = document.getElementById('galleryGrid') || document.querySelector('.proj-grid') || document.querySelector('.projects-scroll');
  if (!grid) return;

  try {
    const projects = await sbFetch('projects', 'select=*&order=created_at.desc&status=eq.completed');
    if (!projects.length) return;

    // Only update if grid has [data-dynamic="true"] attribute
    // This prevents overwriting hand-coded grids on pages that don't want it
    if (!grid.dataset.dynamic) return;

    grid.innerHTML = projects.map((p, i) => `
      <div class="proj-card" data-cat="${p.category || 'residential'}">
        <div class="proj-card-inner">
          <div class="card-photo">
            ${p.image_url
              ? `<img src="${p.image_url}" alt="${p.title}" loading="lazy"/>`
              : `<div style="width:100%;height:100%;background:linear-gradient(135deg,#1a3558,#254a78);display:flex;align-items:center;justify-content:center;font-size:3rem">🏗️</div>`
            }
            <div class="card-overlay">
              <div class="overlay-label">${p.title}</div>
              ${p.cost ? `<div class="overlay-cost">₹${p.cost}</div>` : ''}
              <a class="overlay-btn" href="Civil-Project-Detail.html?id=${p.id}">View Project →</a>
            </div>
            <span class="card-badge">${capitalize(p.category || 'Project')}</span>
            <div class="card-info">
              <div>
                <div class="card-cat">${p.client || capitalize(p.category)}</div>
                <div class="card-title">${p.title}</div>
                ${p.location ? `<div class="card-loc">${p.location}</div>` : ''}
              </div>
              <div class="card-num">${String(i+1).padStart(2,'0')}</div>
            </div>
          </div>
        </div>
      </div>`).join('');

  } catch(e) {
    console.warn('[mBuild] Projects load failed:', e.message);
  }
}

/* ══════════════════════════════════
   LOAD GALLERY (Photo Gallery page)
══════════════════════════════════ */
async function loadGallery() {
  const grid = document.getElementById('masonryGrid');
  if (!grid) return;

  try {
    const images = await sbFetch('gallery', 'select=*&order=sort_order.asc,created_at.desc');
    if (!images.length) return;

    grid.insertAdjacentHTML("beforeend", images.map(img => `
      <div class="gallery-item" data-cat="${img.category || 'general'}"
           data-title="${img.title || ''}" 
           data-loc="Maharashtra"
           data-cat-label="${capitalize(img.category || 'General')}">
        <img src="${img.image_url}" alt="${img.title || 'Gallery'}" loading="lazy"/>
        <span class="g-badge">${capitalize(img.category || 'General')}</span>
        <div class="g-overlay">
          <div class="g-cat">${capitalize(img.category || 'General')}</div>
          <div class="g-title">${img.title || 'Project'}</div>
          <div class="g-loc">📍 Maharashtra</div>
        </div>
        <div class="g-zoom"><i class="fas fa-expand-alt"></i></div>
      </div>
    `).join(''));

    // 🔥 FIX: rebuild everything after dynamic load
    if (typeof buildIndex === "function") buildIndex();

    // trigger "All Work" filter automatically
    const activeBtn = document.querySelector('.pill.active');
    if (activeBtn) {
      activeBtn.click();
    }

    // update count
    const total = document.querySelectorAll('.gallery-item:not([style*="display: none"])').length;
    const cnt = document.getElementById('cnt');
    if (cnt) cnt.textContent = total;

    // IMPORTANT: rebuild gallery
    if (typeof buildIndex === "function") buildIndex();

    document.querySelectorAll('.gallery-item').forEach((el, i) => {
      el.onclick = () => {
        buildIndex();
        const vIdx = visibleItems.indexOf(el);
        if (vIdx !== -1) openLb(vIdx);
      };
    });

  } catch(e) {
    console.warn('[mBuild] Gallery load failed:', e.message);
  }
}

/* ══════════════════════════════════
   LOAD HOMEPAGE GALLERY PREVIEW
══════════════════════════════════ */
async function loadHomeGallery() {
  const grid = document.getElementById('galleryGrid');
  if (!grid || !grid.dataset.dynamic) return;

  try {
    const images = await sbFetch('gallery', "select=*&category=eq.home&order=sort_order.asc&limit=5");
    if (!images.length) return;

    grid.innerHTML = images.map((img, i) => `
      <div class="g-tile ${i===0?'g-tile-large':''} reveal" data-cat="${img.category}">
        <img src="${img.image_url}" alt="${img.title || 'mBuild'}" loading="lazy"/>
        <span class="g-badge">${capitalize(img.category)}</span>
        <div class="g-tile-overlay">
          <div>
            <div class="g-tile-cat">${capitalize(img.category)}</div>
            <div class="g-tile-title">${img.title || 'mBuild Project'}</div>
          </div>
        </div>
      </div>`).join('');

  } catch(e) {
    console.warn('[mBuild] Home gallery load failed:', e.message);
  }
}

/* ══════════════════════════════════
   LOAD PROJECT DETAIL PAGE
   (Civil-Project-Detail.html)
══════════════════════════════════ */
async function loadProjectDetail() {
  const heroTitle = document.getElementById('heroTitle');
  if (!heroTitle) return;

  const id = new URLSearchParams(window.location.search).get('id');
  if (!id) return;

  // Check if it's a UUID (Supabase ID) vs a slug (asha-school)
  const isUUID = /^[0-9a-f-]{36}$/.test(id);
  if (!isUUID) return; // Using static data for slug-based IDs

  try {
    const rows = await sbFetch('projects', `select=*&id=eq.${id}&limit=1`);
    if (!rows.length) return;
    const p = rows[0];

    // Inject into detail page
    if (document.getElementById('heroTitle'))   document.getElementById('heroTitle').textContent   = p.title;
    if (document.getElementById('heroCat'))     document.getElementById('heroCat').textContent     = capitalize(p.category);
    if (document.getElementById('heroLoc'))     document.getElementById('heroLoc').textContent     = p.location || '—';
    if (document.getElementById('heroArea'))    document.getElementById('heroArea').textContent    = p.area || '—';
    if (document.getElementById('heroCost'))    document.getElementById('heroCost').textContent    = p.cost || '—';
    if (document.getElementById('breadTitle'))  document.getElementById('breadTitle').textContent  = p.title;
    if (document.getElementById('infoClient'))  document.getElementById('infoClient').textContent  = p.client || '—';
    if (document.getElementById('infoLocation'))document.getElementById('infoLocation').textContent= p.location || '—';
    if (document.getElementById('infoType'))    document.getElementById('infoType').textContent    = capitalize(p.category);
    if (document.getElementById('infoArea'))    document.getElementById('infoArea').textContent    = p.area || '—';
    if (document.getElementById('infoCost'))    document.getElementById('infoCost').textContent    = p.cost || '—';
    if (document.getElementById('infoConsultant'))document.getElementById('infoConsultant').textContent = p.consultant || '—';
    if (document.getElementById('descText'))    document.getElementById('descText').textContent    = p.description || '';
    if (document.getElementById('sidebarCost')) document.getElementById('sidebarCost').textContent = p.cost || '—';
    if (document.getElementById('sidebarArea')) document.getElementById('sidebarArea').textContent = p.area || '—';
    if (document.getElementById('heroImg') && p.image_url) document.getElementById('heroImg').src = p.image_url;
    if (document.getElementById('heroCat')) document.getElementById('heroCat').textContent = capitalize(p.category || '');

    // Photo grid — single image
    const pg = document.getElementById('photosGrid');
    if (pg && p.image_url) {
      pg.innerHTML = `
        <div class="photo-item" onclick="openLightbox(0)">
          <img src="${p.image_url}" alt="${p.title}" loading="lazy"/>
          <div class="photo-overlay"><div class="photo-zoom"><i class="fas fa-expand"></i></div></div>
        </div>`;
    }

    document.title = `${p.title} – MBUILD DEVELOPERS`;

  } catch(e) {
    console.warn('[mBuild] Project detail load failed:', e.message);
  }
}

/* ══════════════════════════════════
   CONTACT FORM — SAVE TO SUPABASE
══════════════════════════════════ */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const btn     = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    const successMsg = document.getElementById('successMsg');
    const errorMsg   = document.getElementById('errorMsg');
    if (successMsg) successMsg.style.display = 'none';
    if (errorMsg)   errorMsg.style.display   = 'none';

    if (btn) {
      btn.disabled = true;
      const icon = btn.querySelector('i');
      if (icon) icon.className = 'fas fa-spinner fa-spin';
      if (btnText) btnText.textContent = 'Sending...';
    }

    const payload = {
      name:         (document.getElementById('from_name')    || {}).value || '',
      email:        (document.getElementById('from_email')   || {}).value || null,
      phone:        (document.getElementById('phone')        || {}).value || '',
      project_type: (document.getElementById('project_type') || {}).value || null,
      location:     (document.getElementById('location')     || {}).value || null,
      message:      (document.getElementById('message')      || {}).value || '',
    };

    try {
      // 1 — Save to Supabase
      const res = await fetch(`${SB_URL}/rest/v1/queries`, {
        method: 'POST',
        headers: {
          apikey: SB_KEY,
          Authorization: `Bearer ${SB_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Database save failed');

      // 2 — Also send via EmailJS if configured
      const pubKey = window.EMAILJS_PUBLIC_KEY || (window.MBUILD_SETTINGS || {}).emailjs_public_key;
      const svcId  = window.EMAILJS_SERVICE_ID  || (window.MBUILD_SETTINGS || {}).emailjs_service_id;
      const tplId  = window.EMAILJS_TEMPLATE_ID || (window.MBUILD_SETTINGS || {}).emailjs_template_id;

      if (pubKey && svcId && tplId && typeof emailjs !== 'undefined') {
        emailjs.init(pubKey);
        await emailjs.send(svcId, tplId, {
          from_name:    payload.name,
          from_email:   payload.email || 'Not provided',
          phone:        payload.phone,
          project_type: payload.project_type || 'Not specified',
          location:     payload.location || 'Not specified',
          message:      payload.message,
          to_email:     'mbuiltsangli@gmail.com',
          reply_to:     payload.email || 'mbuiltsangli@gmail.com',
        });
      }

      // SUCCESS
      if (btn) {
        btn.classList.add('success');
        const icon = btn.querySelector('i');
        if (icon) icon.className = 'fas fa-circle-check';
        if (btnText) btnText.textContent = 'Enquiry Sent!';
        setTimeout(() => {
          btn.disabled = false;
          btn.classList.remove('success');
          if (icon) icon.className = 'fas fa-paper-plane';
          if (btnText) btnText.textContent = 'Submit Enquiry →';
        }, 4000);
      }
      if (successMsg) successMsg.style.display = 'block';
      form.reset();

    } catch(err) {
      console.error('[mBuild] Form submit error:', err);
      if (btn) {
        btn.disabled = false;
        const icon = btn.querySelector('i');
        if (icon) icon.className = 'fas fa-paper-plane';
        if (btnText) btnText.textContent = 'Submit Enquiry →';
      }
      if (errorMsg) errorMsg.style.display = 'block';
    }
  });
}

/* ══════════════════════════════════
   HELPER FUNCTIONS
══════════════════════════════════ */
function setText(selector, value) {
  if (!value) return;
  document.querySelectorAll(selector).forEach(el => { el.textContent = value; });
}

function injectHTML(el, html) {
  if (!el || !html) return;
  el.innerHTML = html;
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function setStatByIndex(index, value) {
  if (!value) return;
  const statNums = document.querySelectorAll('.ts-num, .stat-num, .sn');
  if (statNums[index]) statNums[index].textContent = value;
}

function updateFooterContact(contact) {
  const lists = document.querySelectorAll('.contact-list');
  lists.forEach(list => {
    const items = list.querySelectorAll('li');
    items.forEach(li => {
      const icon = li.querySelector('i');
      if (!icon) return;
      if (icon.classList.contains('fa-phone') && contact.phone1) {
        const span = li.querySelector('span');
        if (span) span.innerHTML = `${contact.phone1}${contact.phone2 ? '<br/>'+contact.phone2 : ''}`;
      }
      if (icon.classList.contains('fa-envelope') && contact.email1) {
        const span = li.querySelector('span');
        if (span) span.innerHTML = `${contact.email1}${contact.email2 ? '<br/>'+contact.email2 : ''}`;
      }
      if (icon.classList.contains('fa-location-dot') && contact.address) {
        const span = li.querySelector('span');
        if (span) span.innerHTML = contact.address.replace(/,/g, ',<br/>');
      }
    });
  });
}

function updateSocialLinks(social) {
  if (!social) return;
  if (social.facebook) {
    document.querySelectorAll('[href*="facebook.com"]').forEach(el => { el.href = social.facebook; });
  }
  if (social.instagram) {
    document.querySelectorAll('[href*="instagram.com"]').forEach(el => { el.href = social.instagram; });
  }
  if (social.whatsapp) {
    document.querySelectorAll('[href*="wa.me"]').forEach(el => { el.href = social.whatsapp; });
  }
}

/* ══════════════════════════════════
   AUTO-DETECT CURRENT PAGE
   & LOAD RELEVANT DATA
══════════════════════════════════ */
const PAGE = window.location.pathname;

async function init() {
  try {
    // Always load settings + content on every page
    await Promise.all([loadSettings(), loadContent()]);

    // Page-specific loaders
    if (PAGE.includes('Civil-Projects')) {
      await loadProjects();
    }
    if (PAGE.includes('Photo-Gallary')) {
      await loadGallery();
    }
    if (PAGE.includes('index') || PAGE === '/' || PAGE.endsWith('/')) {
      await loadHomeGallery();
    }
    if (PAGE.includes('Civil-Project-Detail')) {
      await loadProjectDetail();
    }
    if (PAGE.includes('Contact-Us')) {
      initContactForm();
    }
  } catch(e) {
    console.warn('[mBuild] Init error:', e.message);
  }
}

// Run on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
