# 🔒 Configuração Segura no Vercel

## ✅ Problema Resolvido!

Removemos o prefixo `VITE_` de todas as variáveis para maior segurança. Agora as variáveis não são expostas no navegador.

## 📋 Variáveis para Configurar no Vercel

### 1. **OBRIGATÓRIAS** (Supabase):
```
SUPABASE_URL = sua-url-do-supabase
SUPABASE_ANON_KEY = sua-chave-anonima-do-supabase
```

### 2. **RECOMENDADAS** (Segurança):
```
ADMIN_USERNAME = seu-usuario-admin
ADMIN_PASSWORD = sua-senha-admin-segura
```

### 3. **OPCIONAIS**:
```
TINYMCE_API_KEY = sua-chave-tinymce
APP_URL = https://seu-dominio.vercel.app
GOOGLE_PLACE_ID = seu-place-id-google
```

## 🚀 Como Configurar no Vercel

### Passo 1: Acessar Configurações
1. Entre no [Vercel Dashboard](https://vercel.com)
2. Selecione seu projeto
3. Vá em **Settings** → **Environment Variables**

### Passo 2: Adicionar Variáveis
Para cada variável, clique em **Add New**:

- **Name**: `SUPABASE_URL`
- **Value**: Cole sua URL do Supabase
- **Environments**: ✅ Production, ✅ Preview, ✅ Development
- Clique **Save**

Repita para todas as variáveis necessárias.

### Passo 3: Redeploy
Após adicionar todas as variáveis:
1. Vá na aba **Deployments**
2. Clique nos 3 pontos do último deploy
3. Selecione **Redeploy**
4. ✅ **Use existing Build Cache** (desmarcado)

## 🔍 Como Obter os Valores

### Supabase:
1. Acesse [supabase.com](https://supabase.com)
2. Entre no seu projeto
3. Vá em **Settings** → **API**
4. Copie:
   - **URL** → `SUPABASE_URL`
   - **anon/public** → `SUPABASE_ANON_KEY`

### Admin (Recomendado):
- `ADMIN_USERNAME`: Escolha um usuário seguro
- `ADMIN_PASSWORD`: Use uma senha forte (min. 12 caracteres)

## ⚠️ IMPORTANTE: Não Use Mais VITE_

❌ **ANTES (Inseguro)**:
```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

✅ **AGORA (Seguro)**:
```
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
```

## 🧪 Testar Localmente

1. Crie `.env.local` com as variáveis sem `VITE_`:
```bash
SUPABASE_URL=sua-url
SUPABASE_ANON_KEY=sua-chave
ADMIN_USERNAME=admin
ADMIN_PASSWORD=vitall2024
```

2. Execute:
```bash
npm run build
npm run preview
```

## ✅ Benefícios da Nova Configuração

- 🔒 **Mais Seguro**: Variáveis não expostas no navegador
- 🚀 **Performance**: Menor tamanho do bundle
- 🛡️ **Proteção**: Chaves de API protegidas
- 📦 **Compatibilidade**: Funciona em qualquer ambiente

## 🆘 Solução de Problemas

### Erro: "Configuração do Supabase não encontrada"
- ✅ Verifique se `SUPABASE_URL` e `SUPABASE_ANON_KEY` estão configuradas
- ✅ Faça um redeploy após adicionar as variáveis
- ✅ Verifique se não há espaços extras nos valores

### Build falha:
- ✅ Certifique-se que `replace-env.js` existe
- ✅ Verifique se o comando de build está correto no `package.json`

## 📞 Precisa de Ajuda?

Se encontrar problemas:
1. Verifique os logs do Vercel
2. Teste localmente primeiro
3. Confirme que todas as variáveis estão corretas

---

**🎉 Parabéns! Seu site agora está mais seguro!** 