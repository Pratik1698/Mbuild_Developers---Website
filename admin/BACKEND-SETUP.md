# 🔧 MBUILD DEVELOPERS — Backend Setup Guide
## Supabase + Admin Dashboard — Complete Step-by-Step

---

## 📁 New Folder Structure (Add to Your Project)

```
mbuild-website/
├── index.html
├── assets/
├── pages/
│
└── admin/                          ← NEW: Add this entire folder
    ├── login.html                  ← Admin login page
    ├── dashboard.html              ← Main dashboard
    ├── queries.html                ← Enquiry management
    ├── projects.html               ← Project management
    ├── gallery.html                ← Image upload & gallery
    ├── content.html                ← CMS — edit website text
    ├── settings.html               ← SEO, EmailJS, visibility
    ├── css/
    │   └── admin.css               ← Admin shared styles
    └── js/
        ├── supabase-config.js      ← ⚡ YOUR CONFIG GOES HERE
        └── sidebar.js              ← Shared sidebar component
```

---

## STEP 1 — Create Supabase Project

1. Go to **[supabase.com](https://supabase.com)** → Sign up free
2. Click **New Project**
3. Fill in:
   - **Name**: `mbuild-developers`
   - **Database Password**: create a strong password (save it!)
   - **Region**: `South Asia (Mumbai)` — closest to you
4. Click **Create new project** → wait ~2 minutes

---

## STEP 2 — Run Database Schema

1. In Supabase Dashboard → click **SQL Editor** (left sidebar)
2. Click **New Query**
3. Open the file `supabase-schema.sql` from this project
4. **Copy the entire contents** and paste into the SQL editor
5. Click **Run** (or press Ctrl+Enter)
6. You should see: `Success. No rows returned`

This creates all 5 tables + RLS policies + storage bucket.

---

## STEP 3 — Get Your API Keys

1. In Supabase Dashboard → **Settings** (bottom left gear icon) → **API**
2. Copy these two values:

```
Project URL:  https://xxxxxxxxxxx.supabase.co
anon public:  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## STEP 4 — Update supabase-config.js

Open `admin/js/supabase-config.js` and replace lines 8–9:

```javascript
// BEFORE:
const SUPABASE_URL      = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

// AFTER (your real values):
const SUPABASE_URL      = 'https://xxxxxxxxxxx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

---

## STEP 5 — Create Admin User

1. In Supabase Dashboard → **Authentication** → **Users**
2. Click **Add user** → **Create new user**
3. Enter:
   - **Email**: `admin@mbuilddevelopers.com` (or your preferred email)
   - **Password**: choose a strong password
4. Click **Create User**

> ⚠️ This is the only login that can access the admin dashboard.

---

## STEP 6 — Deploy to Vercel

### Option A: Drag & Drop (Fastest)
1. Go to **[vercel.com](https://vercel.com)** → Sign up with GitHub
2. Dashboard → **Add New Project** → **Deploy from File**
3. Drag your entire project folder → Deploy
4. Your site is live at `https://your-project.vercel.app`

### Option B: GitHub + Vercel (Recommended)
1. Push project to GitHub repository
2. Vercel Dashboard → **New Project** → Import from GitHub
3. Select your repo → Deploy
4. Every future `git push` auto-deploys

### Vercel Environment Variables (Optional but recommended)
In Vercel → Project → Settings → Environment Variables:
```
SUPABASE_URL      = https://xxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY = eyJhbGci...
```

---

## STEP 7 — Test Everything

### Test Login:
1. Open `https://your-site.vercel.app/admin/login.html`
2. Enter your admin email + password
3. Should redirect to dashboard

### Test Contact Form:
1. Open your website → Contact Us page
2. Fill and submit the form
3. Check Supabase → **Table Editor** → `queries` table
4. Should see the submission

### Test Image Upload:
1. Admin → Gallery
2. Upload any image
3. Check Supabase → **Storage** → `mbuild-images` bucket

---

## STEP 8 — Connect Contact Form to Supabase

Add this to your `pages/Contact-Us.html` (replace the EmailJS submit with Supabase):

```html
<!-- Add before </head> -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<!-- In <script> section, add at top: -->
<script>
const { createClient } = supabase;
const sb = createClient(
  'https://xxxxxxxxxxx.supabase.co',
  'eyJhbGci...'
);
</script>
```

Then update the form submit handler:

```javascript
document.getElementById('contactForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  // ... existing loading state code ...

  try {
    // Save to Supabase
    const { error } = await sb.from('queries').insert([{
      name:         document.getElementById('from_name').value,
      email:        document.getElementById('from_email').value || null,
      phone:        document.getElementById('phone').value,
      project_type: document.getElementById('project_type').value || null,
      location:     document.getElementById('location').value || null,
      message:      document.getElementById('message').value,
    }]);
    if (error) throw error;

    // Also send email via EmailJS (keep existing EmailJS code)
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);

    // ... success state code ...
  } catch(err) {
    // ... error state code ...
  }
});
```

---

## 🔑 Admin URLs

| Page | URL |
|------|-----|
| Login | `/admin/login.html` |
| Dashboard | `/admin/dashboard.html` |
| Enquiries | `/admin/queries.html` |
| Projects | `/admin/projects.html` |
| Gallery | `/admin/gallery.html` |
| CMS Content | `/admin/content.html` |
| Settings | `/admin/settings.html` |

---

## 📊 Database Tables Summary

| Table | Purpose | Public Read |
|-------|---------|-------------|
| `queries` | Contact form submissions | ❌ Admin only |
| `projects` | Civil & construction projects | ✅ Yes |
| `gallery` | Website images | ✅ Yes |
| `website_content` | CMS — hero, about, contact text | ✅ Yes |
| `settings` | SEO, EmailJS, section visibility | ✅ Yes |

---

## 🔒 Security Summary

- **RLS enabled** on all tables
- **Only authenticated users** (admin) can write/delete
- **Public can read** projects, gallery, content, settings
- **Only admin can read** enquiries/queries
- **Anyone can submit** to queries (contact form)
- **Storage** — public read, authenticated write/delete

---

## 🆘 Troubleshooting

**Login not working:**
- Check Supabase URL and anon key in `supabase-config.js`
- Verify admin user exists in Supabase → Authentication → Users

**Image upload failing:**
- Check storage bucket `mbuild-images` exists
- Verify RLS policies ran successfully
- File must be < 5MB

**Queries not saving:**
- Check the `queries` table exists (run schema SQL again)
- Check browser console for error messages

**Admin dashboard blank:**
- Open browser DevTools → Console → look for errors
- Usually means wrong Supabase URL or key

---

## 📧 EmailJS Still Needed?

Yes! Supabase stores the enquiry in your database (so you see it in admin). EmailJS sends the email notification to your phone/inbox. Use both together for the best experience.

Update `Contact-Us.html` with your EmailJS keys from Admin → Settings → EmailJS Configuration.

---

*Built with Supabase + Pure HTML/CSS/JS — No framework needed.*
*© 2026 MBUILD DEVELOPERS Admin System*
