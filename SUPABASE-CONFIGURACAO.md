# 🗄️ Configuração do Supabase - Guia Completo

## ❌ Problema Atual

O erro "Configuração do Supabase não encontrada!" acontece porque:

1. **Arquivo `.env.local` não existe** na raiz do projeto
2. **Variáveis VITE_** são obrigatórias no Vite para exposição no cliente
3. **Configuração incorreta** das variáveis de ambiente

## ✅ Solução Passo a Passo

### 1. Obter Configurações do Supabase

1. **Acesse:** [https://supabase.com](https://supabase.com)
2. **Faça login** na sua conta
3. **Selecione seu projeto** (ou crie um novo)
4. **Vá em:** Settings → API
5. **Copie os dados:**
   - **URL do Projeto** (algo como: `https://abc123.supabase.co`)
   - **anon/public key** (chave longa que começa com `eyJ...`)

### 2. Criar Arquivo .env.local

Crie o arquivo `.env.local` na **raiz do projeto** com:

```env
# Configurações do Supabase (OBRIGATÓRIO usar VITE_ no Vite)
VITE_SUPABASE_URL=https://seu-projeto-aqui.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Outras configurações (opcionais)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=senha123
VITE_APP_URL=http://localhost:5173
```

⚠️ **IMPORTANTE:** Substitua pelos seus dados reais do Supabase!

### 3. Verificar Configuração

1. **Reinicie o servidor** de desenvolvimento:
   ```bash
   npm run dev
   ```

2. **Abra o console** do navegador (F12)

3. **Procure por:** "🔧 Supabase Config Debug"

4. **Deve mostrar:**
   ```
   ✅ URL configurada: true
   ✅ Key configurada: true
   ✅ VITE_SUPABASE_URL: ✅
   ✅ VITE_SUPABASE_ANON_KEY: ✅
   ```

## 🚀 Configuração para Produção (Vercel)

### No Dashboard da Vercel:

1. **Vá em:** Settings → Environment Variables
2. **Adicione:**
   - `VITE_SUPABASE_URL` = `https://seu-projeto.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `sua-chave-anonima`

### Deploy:

```bash
npm run build
```

## 🔧 Estrutura do Banco de Dados

O projeto usa estas tabelas no Supabase:

### blog_posts
```sql
CREATE TABLE blog_posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    image VARCHAR(500),
    category VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    author VARCHAR(100) NOT NULL,
    read_time VARCHAR(20) NOT NULL,
    published BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🛠️ Solução para Problemas Comuns

### ❌ "URL configurada: false"
- **Causa:** Arquivo `.env.local` não existe ou variável incorreta
- **Solução:** Crie o arquivo com `VITE_SUPABASE_URL`

### ❌ "Key configurada: false"  
- **Causa:** Chave anônima não configurada
- **Solução:** Adicione `VITE_SUPABASE_ANON_KEY`

### ❌ "VITE_SUPABASE_URL: ❌"
- **Causa:** Variável sem `VITE_` ou arquivo inexistente
- **Solução:** Use `VITE_SUPABASE_URL` (com VITE_)

### ❌ Erro de conexão em produção
- **Causa:** Variáveis não configuradas na Vercel
- **Solução:** Configure no dashboard da Vercel

## 📁 Estrutura de Arquivos

```
projeto/
├── .env.local              ← Criar este arquivo!
├── .env.local.example      ← Exemplo (não usar)
├── src/
│   └── lib/
│       └── supabase.ts     ← Configuração atualizada
└── ...
```

## 🎯 Checklist de Verificação

- [ ] ✅ Arquivo `.env.local` existe na raiz
- [ ] ✅ `VITE_SUPABASE_URL` configurada
- [ ] ✅ `VITE_SUPABASE_ANON_KEY` configurada  
- [ ] ✅ Valores reais do Supabase (não placeholders)
- [ ] ✅ Servidor reiniciado após mudanças
- [ ] ✅ Console não mostra erros do Supabase
- [ ] ✅ Variáveis configuradas na Vercel (produção)

## 🆘 Ainda com Problemas?

1. **Verifique** se o arquivo `.env.local` está na raiz (não em subpastas)
2. **Confirme** que usou `VITE_` nas variáveis
3. **Reinicie** completamente o servidor
4. **Verifique** no console se as variáveis aparecem como ✅

---

**Após seguir este guia, o Supabase deve funcionar perfeitamente! 🎉** 