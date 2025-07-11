# 🔧 Configuração das Variáveis de Ambiente - VitallCheck-Up

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# 🗄️ SUPABASE (Obrigatório para blog em nuvem)
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# 📊 GOOGLE PLACES API (Opcional - para reviews automáticos)
# Por padrão, o sistema usa reviews locais da clínica
# VITE_GOOGLE_PLACES_API_KEY=sua_api_key_aqui
# VITE_GOOGLE_PLACE_ID=ChIJs-Jgaz7YzZQRuEFZ0UDx-Pw
```

## 📝 Configuração Detalhada

### 1. **Supabase (Obrigatório)**
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Como obter:**
1. Acesse [supabase.com](https://supabase.com)
2. Crie um projeto
3. Vá em **Settings** → **API**
4. Copie a **URL** e **anon key**

### 2. **Google Places API (Opcional)**
```env
# Descomente apenas se quiser integração automática com Google
# VITE_GOOGLE_PLACES_API_KEY=sua_api_key_aqui
# VITE_GOOGLE_PLACE_ID=ChIJs-Jgaz7YzZQRuEFZ0UDx-Pw
```

**Status atual:** 
- ✅ **Não é necessário** - sistema funciona com reviews locais
- 🔮 **Futuro** - pode ser implementado para automação completa

**Como obter (se necessário):**
1. [Google Cloud Console](https://console.cloud.google.com/)
2. Ative a **Places API**
3. Gere uma **API Key**
4. Use [Place ID Finder](https://developers.google.com/maps/documentation/places/web-service/place-id)

## 🚀 Configuração Rápida

### Mínima (Apenas Blog):
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Completa (Blog + Reviews):
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_GOOGLE_PLACES_API_KEY=sua_api_key_aqui
VITE_GOOGLE_PLACE_ID=ChIJs-Jgaz7YzZQRuEFZ0UDx-Pw
```

## ⚠️ Importante

- 🔐 **Nunca** commite o arquivo `.env` no Git
- 📝 O arquivo `.env` já está no `.gitignore`
- 🔄 Reinicie o servidor após alterar variáveis
- 🛡️ As variáveis com `VITE_` são públicas no frontend

## 📋 Checklist de Configuração

- [ ] Arquivo `.env` criado
- [ ] Variáveis do Supabase configuradas
- [ ] Projeto funcionando (npm run dev)
- [ ] Blog carregando corretamente
- [ ] Reviews aparecendo (locais ou Google)
- [ ] Autenticação funcionando no admin 