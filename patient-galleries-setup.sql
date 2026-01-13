-- Script SQL para criar tabelas de galeria de pacientes
-- Execute este script no SQL Editor do seu projeto Supabase

-- 1. Tabela principal de galerias de pacientes
CREATE TABLE IF NOT EXISTS patient_galleries (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  patient_name VARCHAR(255) NOT NULL,
  procedure_type VARCHAR(255) NOT NULL,
  description TEXT,
  treatment_date DATE,
  published BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabela de fotos antes/depois
CREATE TABLE IF NOT EXISTS patient_photos (
  id SERIAL PRIMARY KEY,
  patient_gallery_id INTEGER REFERENCES patient_galleries(id) ON DELETE CASCADE,
  before_image_url TEXT NOT NULL,
  after_image_url TEXT NOT NULL,
  photo_title VARCHAR(255),
  photo_description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Índices para performance
CREATE INDEX IF NOT EXISTS idx_patient_galleries_slug ON patient_galleries(slug);
CREATE INDEX IF NOT EXISTS idx_patient_galleries_published ON patient_galleries(published);
CREATE INDEX IF NOT EXISTS idx_patient_galleries_featured ON patient_galleries(featured);
CREATE INDEX IF NOT EXISTS idx_patient_photos_gallery_id ON patient_photos(patient_gallery_id);
CREATE INDEX IF NOT EXISTS idx_patient_photos_display_order ON patient_photos(display_order);

-- 4. Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE TRIGGER update_patient_galleries_updated_at 
    BEFORE UPDATE ON patient_galleries 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5. RLS (Row Level Security) - opcional, caso você use autenticação
-- ALTER TABLE patient_galleries ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE patient_photos ENABLE ROW LEVEL SECURITY;

-- 6. Policies para acesso público de leitura (apenas posts publicados)
-- CREATE POLICY "Allow public read for published galleries" ON patient_galleries
--   FOR SELECT USING (published = true);

-- CREATE POLICY "Allow public read for photos of published galleries" ON patient_photos
--   FOR SELECT USING (
--     patient_gallery_id IN (
--       SELECT id FROM patient_galleries WHERE published = true
--     )
--   );

-- 7. Dados de exemplo (opcional - remova se não quiser)
-- INSERT INTO patient_galleries (slug, patient_name, procedure_type, description, treatment_date, published, featured) VALUES
-- ('joao-silva-implante', 'João Silva', 'Implante Dentário', 'Transformação completa com implante unitário na região anterior, devolvendo função e estética ao sorriso.', '2024-08-15', true, true),
-- ('maria-santos-clareamento', 'Maria Santos', 'Clareamento + Facetas', 'Clareamento dental seguido de facetas em porcelana para harmonia total do sorriso.', '2024-07-20', true, false);

-- INSERT INTO patient_photos (patient_gallery_id, before_image_url, after_image_url, photo_title, display_order) VALUES
-- (1, '/Galeria/pacientes/joao/antes1.jpg', '/Galeria/pacientes/joao/depois1.jpg', 'Vista frontal', 1),
-- (1, '/Galeria/pacientes/joao/antes2.jpg', '/Galeria/pacientes/joao/depois2.jpg', 'Vista lateral', 2),
-- (2, '/Galeria/pacientes/maria/antes1.jpg', '/Galeria/pacientes/maria/depois1.jpg', 'Sorriso completo', 1);

-- ✅ Script concluído! 
-- Execute este código no SQL Editor do Supabase para criar todas as tabelas necessárias.