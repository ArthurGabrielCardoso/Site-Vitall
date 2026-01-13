# Configuração do EmailJS para Formulário de Contato

## O que é o EmailJS?

O EmailJS é um serviço que permite enviar emails diretamente do frontend, sem precisar de um servidor backend. É gratuito até 200 emails por mês.

## Como configurar:

### 1. Criar conta no EmailJS

1. Acesse [https://www.emailjs.com/](https://www.emailjs.com/)
2. Crie uma conta gratuita
3. Confirme seu email

### 2. Configurar Serviço de Email

1. No dashboard, vá em **Email Services**
2. Clique em **Add New Service**
3. Escolha seu provedor de email (Gmail, Outlook, etc.)
4. Configure as credenciais do seu email
5. Anote o **Service ID** gerado

### 3. Criar Template de Email

1. Vá em **Email Templates**
2. Clique em **Create New Template**
3. Use este template como base:

```html
Assunto: Nova mensagem do site - {{subject}}

Você recebeu uma nova mensagem através do formulário de contato do site:

Nome: {{from_name}}
Email: {{from_email}}
Telefone: {{phone}}
Assunto: {{subject}}

Mensagem:
{{message}}

---
Esta mensagem foi enviada através do formulário de contato do site VitallCheck-Up.
Para responder, utilize o email: {{reply_to}}
```

4. Anote o **Template ID** gerado

### 4. Obter Public Key

1. Vá em **Account** > **General**
2. Copie sua **Public Key**

### 5. Configurar no Código

1. Abra o arquivo `src/services/emailService.ts`
2. Substitua as configurações:

```typescript
const EMAILJS_CONFIG = {
  serviceId: 'seu_service_id_aqui',
  templateId: 'seu_template_id_aqui', 
  publicKey: 'sua_public_key_aqui'
};
```

3. Descomente o código de produção e comente a simulação:

```typescript
// Descomente este bloco:
const templateParams = {
  from_name: formData.name,
  from_email: formData.email,
  phone: formData.phone,
  subject: formData.subject,
  message: formData.message,
  to_email: 'contato@vitallcheckup.com.br',
  reply_to: formData.email
};

const response = await emailjs.send(
  EMAILJS_CONFIG.serviceId,
  EMAILJS_CONFIG.templateId,
  templateParams,
  EMAILJS_CONFIG.publicKey
);

return response.status === 200;

// E comente o bloco de simulação
```

### 6. Testar

1. Faça o build: `npm run build`
2. Teste o formulário de contato
3. Verifique se o email chegou em contato@vitallcheckup.com.br

## Alternativas ao EmailJS

Se preferir outras soluções:

### 1. Netlify Forms
- Se estiver usando Netlify para hosting
- Adicione `netlify` ao formulário HTML
- Gratuito até 100 submissions/mês

### 2. Vercel API Routes
- Se estiver usando Vercel
- Crie API routes no backend
- Use Nodemailer ou SendGrid

### 3. Formspree
- Serviço similar ao EmailJS
- Gratuito até 50 submissions/mês

## Status Atual

✅ EmailJS instalado  
✅ Formulário implementado  
✅ Validação funcionando  
⏳ Aguardando configuração das credenciais  

O formulário atualmente está em modo de simulação - os dados aparecem no console do navegador. 