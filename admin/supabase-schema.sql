-- ═══════════════════════════════════════════════════════════
--  MBUILD DEVELOPERS — Supabase Database Schema
--  Run this entire file in Supabase → SQL Editor → New Query
-- ═══════════════════════════════════════════════════════════

-- ── 1. QUERIES TABLE (Contact form submissions) ──────────
CREATE TABLE IF NOT EXISTS queries (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name          TEXT NOT NULL,
  email         TEXT,
  phone         TEXT NOT NULL,
  project_type  TEXT,
  location      TEXT,
  message       TEXT NOT NULL,
  status        TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'resolved')),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── 2. PROJECTS TABLE ────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title            TEXT NOT NULL,
  description      TEXT,
  location         TEXT,
  category         TEXT DEFAULT 'residential' CHECK (category IN ('residential','commercial','institutional','other')),
  status           TEXT DEFAULT 'completed' CHECK (status IN ('completed','ongoing','upcoming')),
  completion_date  DATE,
  area             TEXT,
  cost             TEXT,
  client           TEXT,
  consultant       TEXT,
  image_url        TEXT,
  featured         BOOLEAN DEFAULT false,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ── 3. GALLERY TABLE ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS gallery (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url   TEXT NOT NULL,
  title       TEXT,
  category    TEXT DEFAULT 'general' CHECK (category IN ('home','projects','interior','gallery','about','services','general')),
  sort_order  INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── 4. WEBSITE CONTENT TABLE (CMS) ───────────────────────
CREATE TABLE IF NOT EXISTS website_content (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section     TEXT NOT NULL UNIQUE,
  content     JSONB NOT NULL DEFAULT '{}',
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── 5. SETTINGS TABLE ────────────────────────────────────
CREATE TABLE IF NOT EXISTS settings (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key         TEXT NOT NULL UNIQUE,
  value       TEXT,
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════
--  ROW LEVEL SECURITY (RLS) — Admin only
-- ═══════════════════════════════════════════════════════════

ALTER TABLE queries         ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects        ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery         ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings        ENABLE ROW LEVEL SECURITY;

-- Allow anyone to INSERT into queries (contact form)
CREATE POLICY "Anyone can submit query" ON queries FOR INSERT WITH CHECK (true);

-- Only authenticated admin can SELECT/UPDATE/DELETE queries
CREATE POLICY "Admin reads queries"   ON queries FOR SELECT  USING (auth.role() = 'authenticated');
CREATE POLICY "Admin updates queries" ON queries FOR UPDATE  USING (auth.role() = 'authenticated');
CREATE POLICY "Admin deletes queries" ON queries FOR DELETE  USING (auth.role() = 'authenticated');

-- Projects — read public, write admin
CREATE POLICY "Public reads projects"  ON projects FOR SELECT  USING (true);
CREATE POLICY "Admin writes projects"  ON projects FOR INSERT  WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin updates projects" ON projects FOR UPDATE  USING (auth.role() = 'authenticated');
CREATE POLICY "Admin deletes projects" ON projects FOR DELETE  USING (auth.role() = 'authenticated');

-- Gallery — read public, write admin
CREATE POLICY "Public reads gallery"  ON gallery FOR SELECT  USING (true);
CREATE POLICY "Admin writes gallery"  ON gallery FOR INSERT  WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin updates gallery" ON gallery FOR UPDATE  USING (auth.role() = 'authenticated');
CREATE POLICY "Admin deletes gallery" ON gallery FOR DELETE  USING (auth.role() = 'authenticated');

-- Content — read public, write admin
CREATE POLICY "Public reads content"  ON website_content FOR SELECT  USING (true);
CREATE POLICY "Admin writes content"  ON website_content FOR INSERT  WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin updates content" ON website_content FOR UPDATE  USING (auth.role() = 'authenticated');

-- Settings — read public, write admin
CREATE POLICY "Public reads settings"  ON settings FOR SELECT  USING (true);
CREATE POLICY "Admin writes settings"  ON settings FOR INSERT  WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin updates settings" ON settings FOR UPDATE  USING (auth.role() = 'authenticated');

-- ═══════════════════════════════════════════════════════════
--  STORAGE BUCKET
-- ═══════════════════════════════════════════════════════════

INSERT INTO storage.buckets (id, name, public)
VALUES ('mbuild-images', 'mbuild-images', true)
ON CONFLICT DO NOTHING;

CREATE POLICY "Public can view images" ON storage.objects
  FOR SELECT USING (bucket_id = 'mbuild-images');

CREATE POLICY "Admin can upload images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'mbuild-images' AND auth.role() = 'authenticated');

CREATE POLICY "Admin can delete images" ON storage.objects
  FOR DELETE USING (bucket_id = 'mbuild-images' AND auth.role() = 'authenticated');

-- ═══════════════════════════════════════════════════════════
--  DEFAULT CONTENT SEED DATA
-- ═══════════════════════════════════════════════════════════

INSERT INTO website_content (section, content) VALUES
('hero', '{"title":"Build Your Dream Space With mBuild Experts","subtitle":"Premier Architecture, Engineering & Contracting firm delivering exceptional projects across Maharashtra.","badge":"Est. 2016 · Dream Big Build Right · Maharashtra"}'),
('about', '{"title":"Our Story & Our Mission","body":"mBuild Developers was founded in 2016 by Er. Pramod Balasaheb Jadhav with a singular vision — to bring world-class construction quality to Maharashtra.","established":"2016","projects":"250+","experience":"9+","turnover":"₹1.31Cr"}'),
('contact', '{"phone1":"+91 86009 28493","phone2":"+91 86691 56263","email1":"mbuiltsangli@gmail.com","email2":"mbuilddevelopers@gmail.com","address":"Main Road, Behind AK Mobiles, Kundal, Tal. Palus, Sangli – 416309, Maharashtra, India","gst":"27BAIPJ8787J1ZW"}'),
('footer', '{"tagline":"Dream Big Build Right","description":"Leading the way in construction excellence. We build residential and commercial spaces that stand the test of time.","copyright":"© 2026 All Rights Reserved by MBUILD DEVELOPERS."}'),
('social', '{"facebook":"https://www.facebook.com/your_facebook","instagram":"https://www.instagram.com/mbuilddevelopers2024","whatsapp":"https://wa.me/918600928493"}')
ON CONFLICT (section) DO NOTHING;

INSERT INTO settings (key, value) VALUES
('site_title', 'MBUILD DEVELOPERS – Architecture, Engineer & Contractors'),
('site_tagline', 'Dream Big Build Right'),
('meta_description', 'MBUILD Developers – Premier Architecture, Engineering & Contracting firm in Maharashtra.'),
('whatsapp_number', '918600928493'),
('google_maps_lat', '17.117387844078543'),
('google_maps_lng', '74.41011076351721'),
('emailjs_public_key', ''),
('emailjs_service_id', ''),
('emailjs_template_id', ''),
('maintenance_mode', 'false'),
('show_hero', 'true'),
('show_services', 'true'),
('show_gallery', 'true'),
('show_projects', 'true'),
('show_testimonials', 'true'),
('show_certificates', 'true')
ON CONFLICT (key) DO NOTHING;
