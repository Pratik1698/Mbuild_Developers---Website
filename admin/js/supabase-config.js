// ═══════════════════════════════════════════════════════════
//  admin/js/supabase-config.js
//  Replace SUPABASE_URL and SUPABASE_ANON_KEY with your values
//  from: Supabase Dashboard → Settings → API
// ═══════════════════════════════════════════════════════════

const SUPABASE_URL      = 'https://draslpunaydcrjmpasoj.supabase.co';       // e.g. https://xyzabc.supabase.co
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyYXNscHVuYXlkY3JqbXBhc29qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1MzgwNDQsImV4cCI6MjA5MDExNDA0NH0.h-UJ34MzdpUdBSON92OvfEa2JlyO7Di42E_GTHqfBIA';  // long JWT string

const { createClient } = supabase;
const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── AUTH ─────────────────────────────────────────────────

const Auth = {
  async login(email, password) {
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  async logout() {
    const { error } = await sb.auth.signOut();
    if (error) throw error;
    window.location.href = '/admin/login.html';
  },

  async getUser() {
    const { data: { user } } = await sb.auth.getUser();
    return user;
  },

  async requireAuth() {
    const user = await this.getUser();
    if (!user) {
      window.location.href = '/admin/login.html';
      return null;
    }
    return user;
  }
};

// ── QUERIES ──────────────────────────────────────────────

const Queries = {
  async getAll(search = '', status = '') {
    let q = sb.from('queries').select('*').order('created_at', { ascending: false });
    if (status) q = q.eq('status', status);
    if (search) q = q.or(`name.ilike.%${search}%,phone.ilike.%${search}%,email.ilike.%${search}%`);
    const { data, error } = await q;
    if (error) throw error;
    return data;
  },

  async updateStatus(id, status) {
    const { error } = await sb.from('queries').update({ status }).eq('id', id);
    if (error) throw error;
  },

  async delete(id) {
    const { error } = await sb.from('queries').delete().eq('id', id);
    if (error) throw error;
  },

  async submit(payload) {
    const { error } = await sb.from('queries').insert([payload]);
    if (error) throw error;
  },

  async getStats() {
    const { data, error } = await sb.from('queries').select('status');
    if (error) throw error;
    return {
      total:    data.length,
      new:      data.filter(q => q.status === 'new').length,
      read:     data.filter(q => q.status === 'read').length,
      resolved: data.filter(q => q.status === 'resolved').length,
    };
  }
};

// ── PROJECTS ─────────────────────────────────────────────

const Projects = {
  async getAll(category = '') {
    let q = sb.from('projects').select('*').order('created_at', { ascending: false });
    if (category) q = q.eq('category', category);
    const { data, error } = await q;
    if (error) throw error;
    return data;
  },

  async getById(id) {
    const { data, error } = await sb.from('projects').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },

  async add(payload) {
    const { data, error } = await sb.from('projects').insert([payload]).select().single();
    if (error) throw error;
    return data;
  },

  async update(id, payload) {
    const { error } = await sb.from('projects').update(payload).eq('id', id);
    if (error) throw error;
  },

  async delete(id) {
    const { error } = await sb.from('projects').delete().eq('id', id);
    if (error) throw error;
  }
};

// ── GALLERY ──────────────────────────────────────────────

const Gallery = {
  async getAll(category = '') {
    let q = sb.from('gallery').select('*').order('sort_order').order('created_at', { ascending: false });
    if (category) q = q.eq('category', category);
    const { data, error } = await q;
    if (error) throw error;
    return data;
  },

  async uploadImage(file, category) {
    const ext      = file.name.split('.').pop();
    const filename = `${category}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await sb.storage
      .from('mbuild-images')
      .upload(filename, file, { cacheControl: '3600', upsert: false });
    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = sb.storage.from('mbuild-images').getPublicUrl(filename);

    // Save to gallery table
    const { data, error } = await sb.from('gallery').insert([{
      image_url: publicUrl,
      category,
      title: file.name.replace(/\.[^/.]+$/, '')
    }]).select().single();
    if (error) throw error;
    return data;
  },

  async delete(id, imageUrl) {
    // Extract storage path from URL
    const path = imageUrl.split('/mbuild-images/')[1];
    if (path) await sb.storage.from('mbuild-images').remove([path]);
    const { error } = await sb.from('gallery').delete().eq('id', id);
    if (error) throw error;
  },

  async updateTitle(id, title) {
    const { error } = await sb.from('gallery').update({ title }).eq('id', id);
    if (error) throw error;
  }
};

// ── WEBSITE CONTENT ──────────────────────────────────────

const Content = {
  async getAll() {
    const { data, error } = await sb.from('website_content').select('*');
    if (error) throw error;
    const result = {};
    data.forEach(row => { result[row.section] = row.content; });
    return result;
  },

  async getSection(section) {
    const { data, error } = await sb.from('website_content').select('content').eq('section', section).single();
    if (error) return null;
    return data.content;
  },

  async update(section, content) {
    const { error } = await sb.from('website_content')
      .upsert({ section, content, updated_at: new Date().toISOString() }, { onConflict: 'section' });
    if (error) throw error;
  }
};

// ── SETTINGS ─────────────────────────────────────────────

const Settings = {
  async getAll() {
    const { data, error } = await sb.from('settings').select('*');
    if (error) throw error;
    const result = {};
    data.forEach(row => { result[row.key] = row.value; });
    return result;
  },

  async get(key) {
    const { data, error } = await sb.from('settings').select('value').eq('key', key).single();
    if (error) return null;
    return data.value;
  },

  async update(key, value) {
    const { error } = await sb.from('settings')
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
    if (error) throw error;
  },

  async updateMany(obj) {
    const rows = Object.entries(obj).map(([key, value]) => ({
      key, value, updated_at: new Date().toISOString()
    }));
    const { error } = await sb.from('settings').upsert(rows, { onConflict: 'key' });
    if (error) throw error;
  }
};

// ── DASHBOARD STATS ──────────────────────────────────────

const Dashboard = {
  async getStats() {
    const [qRes, pRes, gRes] = await Promise.all([
      sb.from('queries').select('status'),
      sb.from('projects').select('id'),
      sb.from('gallery').select('id'),
    ]);
    return {
      totalQueries:  qRes.data?.length || 0,
      newQueries:    qRes.data?.filter(q => q.status === 'new').length || 0,
      totalProjects: pRes.data?.length || 0,
      totalImages:   gRes.data?.length || 0,
    };
  }
};

// ── TOAST NOTIFICATIONS ──────────────────────────────────

function toast(msg, type = 'success') {
  const el = document.createElement('div');
  el.className = `toast toast-${type}`;
  el.innerHTML = `<i class="fas fa-${type === 'success' ? 'circle-check' : type === 'error' ? 'circle-exclamation' : 'info-circle'}"></i> ${msg}`;
  document.body.appendChild(el);
  setTimeout(() => el.classList.add('show'), 10);
  setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 300); }, 3500);
}

// ── CONFIRM DIALOG ───────────────────────────────────────

function confirmAction(msg) {
  return new Promise(resolve => {
    const overlay = document.createElement('div');
    overlay.className = 'confirm-overlay';
    overlay.innerHTML = `
      <div class="confirm-box">
        <div class="confirm-icon"><i class="fas fa-triangle-exclamation"></i></div>
        <h3>Are you sure?</h3>
        <p>${msg}</p>
        <div class="confirm-btns">
          <button class="btn-cancel">Cancel</button>
          <button class="btn-confirm">Yes, Delete</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    overlay.querySelector('.btn-cancel').onclick  = () => { overlay.remove(); resolve(false); };
    overlay.querySelector('.btn-confirm').onclick = () => { overlay.remove(); resolve(true); };
  });
}
