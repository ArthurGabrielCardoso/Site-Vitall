# 🔧 Resolver Erro 404 na Migração

## ❌ Problema Identificado

Você está enfrentando o erro **404 (Not Found)** ao tentar migrar os posts para o Supabase. Este erro indica que a tabela `blog_posts` não existe no seu banco de dados.

```
❌ Erro: Failed to load resource: the server responded with a status of 404 ()
❌ Falha ao migrar post: [nome do post]
```

## 🔍 Diagnóstico

O erro 404 pode ocorrer por:
1. **Tabela não criada**: A tabela `blog_posts` não existe no Supabase
2. **Script SQL não executado**: O script de configuração não foi executado
3. **Erro na configuração**: URL ou chave de API incorretas

## 🛠️ Solução Rápida

### Passo 1: Verificar Configuração

1. Acesse `/admin` → aba "**Migração**"
2. Clique em "**Executar Diagnóstico**"
3. Verifique se todos os itens estão ✅ verdes

### Passo 2: Executar Script SQL

1. Acesse seu projeto no [Supabase](https://supabase.com)
2. Vá para **SQL Editor** (no menu lateral)
3. Clique em "**New query**"
4. Cole o script completo abaixo:

```sql
-- ===============================================
-- SCRIPT DE CONFIGURAÇÃO DO BLOG VITALLCHECK-UP
-- ===============================================

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

-- 2. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON public.blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON public.blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_date ON public.blog_posts(date);

-- 3. Configurar Row Level Security (RLS)
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- 4. Criar políticas de acesso
DROP POLICY IF EXISTS "Allow public read access to published posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Allow full access for now" ON public.blog_posts;

-- Permitir leitura pública de posts publicados
CREATE POLICY "Allow public read access to published posts" 
ON public.blog_posts FOR SELECT 
USING (published = true);

-- Permitir acesso completo (temporário - para migração)
CREATE POLICY "Allow full access for now" 
ON public.blog_posts FOR ALL 
USING (true);

-- 5. Criar função para updated_at automático
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 6. Criar trigger para updated_at
DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON public.blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON public.blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- 7. Verificar se tudo foi criado corretamente
SELECT 
    'Tabela blog_posts criada com sucesso!' as status,
    COUNT(*) as total_posts
FROM public.blog_posts;
```

5. Clique em "**Run**" para executar o script
6. Você deve ver: `Tabela blog_posts criada com sucesso!`

### Passo 3: Testar Conexão

1. Volte para `/admin` → aba "**Migração**"
2. Clique em "**Executar Diagnóstico**" novamente
3. Todos os itens devem estar ✅ verdes
4. Se ainda houver erros, prossiga para a **Solução Avançada**

## 🔧 Solução Avançada

### Verificar Variáveis de Ambiente

Certifique-se de que o arquivo `.env.local` está correto:

```env
# Suas configurações (substitua pelos valores reais)
VITE_SUPABASE_URL=https://odgixzcgfcrmbtumoguq.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Opcional
VITE_ADMIN_USERNAME=admin
VITE_ADMIN_PASSWORD=sua-senha-forte
```

### Verificar URL do Supabase

Sua URL deve seguir o padrão:
```
https://[seu-projeto].supabase.co
```

**Exemplo correto**: `https://odgixzcgfcrmbtumoguq.supabase.co`

### Verificar Chave de API

1. No Supabase, vá para **Settings** → **API**
2. Copie a chave **anon public** (não a service_role)
3. A chave deve começar com `eyJhbGciOiJIUzI1NiI...`

### Reiniciar Servidor

Após alterar `.env.local`:
```bash
# Parar o servidor (Ctrl+C)
# Reiniciar
npm run dev
```

## 🔒 Problema com RLS (Row Level Security)

Se o erro persistir, pode ser problema com RLS muito restritivo:

### Solução Temporária

No SQL Editor do Supabase, execute:

```sql
-- TEMPORARIAMENTE desabilitar RLS para teste
ALTER TABLE public.blog_posts DISABLE ROW LEVEL SECURITY;

-- Testar migração

-- DEPOIS reabilitar RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
```

### Política Mais Permissiva

```sql
-- Criar política mais permissiva
DROP POLICY IF EXISTS "Allow full access for now" ON public.blog_posts;
CREATE POLICY "Allow full access for now" 
ON public.blog_posts FOR ALL 
USING (true)
WITH CHECK (true);
```

## 🧪 Testar Manualmente

### Teste 1: Verificar Tabela

No SQL Editor:
```sql
SELECT * FROM public.blog_posts LIMIT 5;
```

### Teste 2: Inserir Post de Teste

```sql
INSERT INTO public.blog_posts (
    title, slug, excerpt, content, category, date, author, read_time, published
) VALUES (
    'Teste de Migração', 
    'teste-migracao', 
    'Post de teste para verificar funcionamento', 
    'Conteúdo de teste para verificar se a migração funciona corretamente', 
    'Teste', 
    '2024-01-01', 
    'Sistema', 
    '1 min', 
    true
);
```

### Teste 3: Verificar Inserção

```sql
SELECT * FROM public.blog_posts WHERE slug = 'teste-migracao';
```

## 🎯 Checklist Final

- [ ] ✅ Arquivo `.env.local` configurado
- [ ] ✅ Servidor reiniciado após configurar variáveis
- [ ] ✅ Script SQL executado no Supabase
- [ ] ✅ Tabela `blog_posts` criada
- [ ] ✅ Políticas de RLS configuradas
- [ ] ✅ Diagnóstico executado com sucesso
- [ ] ✅ Teste manual funcionando

## 📞 Ainda com Problemas?

Se o erro persistir:

1. **Verifique logs**: Abra o Console do navegador (F12)
2. **Copie o erro completo**: Para análise detalhada
3. **Teste com dados de exemplo**: Execute os testes manuais acima
4. **Verifique permissões**: No painel do Supabase

## 🚀 Resultado Esperado

Após seguir os passos:
- ✅ Diagnóstico: Todos os itens verdes
- ✅ Migração: "✅ Migração concluída com sucesso!"
- ✅ Posts: Visíveis na página `/blog`
- ✅ Admin: Funciona para criar novos posts

---

**💡 Dica**: Após resolver o problema, a migração deve funcionar perfeitamente e todos os seus 7 posts serão transferidos com sucesso para o Supabase! 