# 📊 Sistema de Analytics - Microsoft Clarity

## ✅ O que foi implementado

Este sistema foi **SIMPLIFICADO** para focar apenas no **Microsoft Clarity**, que oferece:

- 🎥 **Session Replays** - Veja como usuários navegam no site
- 🔥 **Heatmaps** - Mapas de calor de cliques e scroll
- 📊 **Analytics Comportamentais** - Dados detalhados automaticamente
- 🎯 **Event Tracking** - Eventos customizados importantes
- 🛡️ **LGPD Compliant** - Respeita consentimento de cookies

## 🚀 Configuração Rápida

### 1. Criar conta no Microsoft Clarity
1. Acesse: https://clarity.microsoft.com
2. Clique em "Get started for free"
3. Crie um novo projeto
4. Copie o **Project ID** (ex: `abc123def`)

### 2. Configurar variáveis de ambiente
Crie o arquivo `.env.local` na raiz do projeto:

```env
# Microsoft Clarity (obtenha em https://clarity.microsoft.com)
VITE_CLARITY_PROJECT_ID=seu-clarity-project-id
```

### 3. Testar funcionamento
1. Reinicie o servidor de desenvolvimento: `npm run dev`
2. Abra o site no navegador
3. Aceite os cookies de "Analytics"
4. Verifique no console: "✅ Microsoft Clarity inicializado..."

## 📈 O que o Clarity rastreia automaticamente

### 🎯 Dados Comportamentais
- **Session Replays**: Gravações completas das sessões
- **Heatmaps**: Mapas de calor de cliques, taps e scrolling
- **User Flows**: Jornadas completas dos usuários
- **Device Analytics**: Desktop vs Mobile
- **Page Analytics**: Tempo, bounces, interações

### 🏥 Eventos Customizados
- **procedure_view**: Quando usuário visualiza procedimento
- **booking_attempt**: Cliques em botões de agendamento
- **conversion**: Formulários enviados e conversões

## 🛡️ Privacidade e GDPR

### ✅ Compliance
- **Consentimento obrigatório**: Clarity só ativa com permissão
- **Banner de cookies**: Interface amigável para escolhas
- **Opt-out**: Usuário pode rejeitar a qualquer momento
- **Data Retention**: Dados armazenados conforme política da Microsoft

### 🍪 Categorias de Cookies
- **Essential**: Funcionamento básico (sempre ativo)
- **Analytics**: Microsoft Clarity (opcional)
- **Personalization**: Preferências do usuário (opcional)
- **Marketing**: Para campanhas futuras (opcional)

## 🔧 Como usar

### Automático
O sistema funciona **automaticamente** quando o usuário aceita cookies de Analytics:
- Clarity inicia sozinho
- Tracking de cliques em botões de agendamento
- Eventos importantes são registrados

### Manual (opcional)
Para tracking customizado em componentes específicos:

```tsx
import { useTrackingIntegration } from '@/hooks/useTrackingIntegration';

const MyComponent = () => {
    const { trackProcedureInterest, trackConversionEvent } = useTrackingIntegration();

    const handleProcedureView = () => {
        trackProcedureInterest('Botox', 120); // procedimento, tempo em segundos
    };

    const handleFormSubmit = () => {
        trackConversionEvent('contact_form', undefined, 'Botox');
    };
};
```

## 🎯 Analytics Dashboard

### Microsoft Clarity Dashboard
Acesse https://clarity.microsoft.com para ver:

- 📊 **Overview**: Sessões, usuários, páginas populares
- 🎥 **Recordings**: Session replays completos
- 🔥 **Heatmaps**: Mapas de calor por página
- 🎯 **Custom Events**: Eventos de procedimentos e conversões

### Dashboard Interno (/admin)
Interface simplificada no painel administrativo:
- Status do tracking
- Consentimento de cookies
- Links para Clarity dashboard

## 🐛 Troubleshooting

### Clarity não aparece no console
1. Verifique se `VITE_CLARITY_PROJECT_ID` está no `.env.local`
2. Reinicie o servidor: `npm run dev`
3. Aceite cookies de "Analytics" no banner
4. Abra DevTools > Console

### Project ID inválido
- Project ID deve ter 8-10 caracteres alfanuméricos
- Copie exatamente como aparece no Clarity dashboard
- Não inclua espaços ou caracteres especiais

### Dados não aparecem no Clarity
- Pode levar 5-10 minutos para dados aparecerem
- Verifique se há tráfego real (não apenas você)
- Clarity não funciona em localhost para alguns recursos

## 🎉 Pronto!

Seu sistema de analytics está **configurado e funcionando**! 

O Microsoft Clarity oferece recursos **profissionais gratuitos** que superam muitas soluções pagas:
- ✅ Session recordings ilimitados
- ✅ Heatmaps detalhados  
- ✅ Analytics comportamentais
- ✅ Performance insights
- ✅ User experience analytics

**Resultado**: Analytics profissionais **100% gratuitos** com compliance total! 