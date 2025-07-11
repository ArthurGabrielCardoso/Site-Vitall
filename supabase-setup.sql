-- Script SQL para configurar o banco de dados do blog VitallCheck-Up no Supabase
-- Execute este script no SQL Editor do Supabase

-- 1. Criar tabela blog_posts
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    image TEXT,
    category TEXT NOT NULL,
    date DATE NOT NULL,
    author TEXT NOT NULL,
    read_time TEXT NOT NULL,
    published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON public.blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON public.blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_date ON public.blog_posts(date);

-- 3. Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 4. Criar trigger para atualizar updated_at
DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON public.blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON public.blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- 5. Configurar Row Level Security (RLS)
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- 6. Criar políticas de segurança
-- Permitir leitura pública de posts publicados
CREATE POLICY "Allow public read access to published posts" 
ON public.blog_posts FOR SELECT 
USING (published = true);

-- Permitir acesso completo para administradores (você pode configurar isso depois)
-- Por enquanto, vamos permitir todas as operações (será restringido depois)
CREATE POLICY "Allow full access for now" 
ON public.blog_posts FOR ALL 
USING (true);

-- 7. Comentários na tabela e colunas
COMMENT ON TABLE public.blog_posts IS 'Tabela para armazenar posts do blog VitallCheck-Up';
COMMENT ON COLUMN public.blog_posts.id IS 'Identificador único do post';
COMMENT ON COLUMN public.blog_posts.title IS 'Título do post';
COMMENT ON COLUMN public.blog_posts.slug IS 'URL amigável do post';
COMMENT ON COLUMN public.blog_posts.excerpt IS 'Resumo do post';
COMMENT ON COLUMN public.blog_posts.content IS 'Conteúdo completo do post';
COMMENT ON COLUMN public.blog_posts.image IS 'URL da imagem principal do post';
COMMENT ON COLUMN public.blog_posts.category IS 'Categoria do post';
COMMENT ON COLUMN public.blog_posts.date IS 'Data de publicação do post';
COMMENT ON COLUMN public.blog_posts.author IS 'Autor do post';
COMMENT ON COLUMN public.blog_posts.read_time IS 'Tempo de leitura estimado';
COMMENT ON COLUMN public.blog_posts.published IS 'Se o post está publicado';
COMMENT ON COLUMN public.blog_posts.created_at IS 'Data de criação do registro';
COMMENT ON COLUMN public.blog_posts.updated_at IS 'Data da última atualização';

-- 8. Inserir dados de exemplo (opcional)
-- Descomente as linhas abaixo para inserir posts de exemplo
/*
INSERT INTO public.blog_posts (title, slug, excerpt, content, image, category, date, author, read_time, published) VALUES
('Importância da Prevenção Dental', 'importancia-da-prevencao-dental', 'Descubra como a prevenção pode salvar seu sorriso e sua saúde.', '<p>A prevenção dental é fundamental para manter a saúde bucal em dia...</p>', '/placeholder.svg', 'Prevenção', '2024-01-15', 'Dr. VitallCheck-Up', '3 min', true),
('Tratamentos Estéticos Modernos', 'tratamentos-esteticos-modernos', 'Conheça os tratamentos mais modernos para um sorriso perfeito.', '<p>Os tratamentos estéticos dentários evoluíram muito nos últimos anos...</p>', '/placeholder.svg', 'Estética', '2024-01-20', 'Dr. VitallCheck-Up', '5 min', true),
('Implantes Dentários: O que você precisa saber', 'implantes-dentarios-o-que-voce-precisa-saber', 'Tudo sobre implantes dentários em um guia completo.', '<p>Os implantes dentários são uma solução definitiva para substituir dentes perdidos...</p>', '/placeholder.svg', 'Tratamentos', '2024-01-25', 'Dr. VitallCheck-Up', '7 min', true);
*/

-- Confirmar que a tabela foi criada
SELECT 'Tabela blog_posts criada com sucesso!' AS status; 