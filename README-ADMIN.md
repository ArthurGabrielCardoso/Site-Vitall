# Sistema Administrativo - VitallCheck-Up

## Instruções de Uso

### 1. Favicon Personalizado
- Adicione o arquivo `ICONE-LOGO.png` na pasta `public/`
- O arquivo será automaticamente usado como favicon do site

### 2. Acesso ao Sistema Administrativo
- **URL**: `/sistema`
- **Usuário**: `admin`
- **Senha**: `vitall2024`

### 3. Funcionalidades do Sistema

#### Gerenciamento de Posts do Blog
- **Criar Posts**: Adicione novos artigos com título, conteúdo, categoria e imagem
- **Editar Posts**: Modifique posts existentes
- **Excluir Posts**: Remova posts desnecessários
- **Publicar/Despublicar**: Controle a visibilidade dos posts
- **Upload de Imagens**: Adicione imagens aos posts (simulado por enquanto)

#### Categorias Disponíveis
- Prevenção
- Tratamentos  
- Estética

### 4. Como Usar o Editor
1. Acesse `/sistema` e faça login
2. Clique em "Novo Post" para criar um artigo
3. Preencha todos os campos obrigatórios (*)
4. Use HTML no campo "Conteúdo" para formatação avançada
5. Marque "Publicar imediatamente" para tornar o post visível
6. Clique em "Salvar"

### 5. Segurança
- O sistema usa autenticação básica com localStorage
- Para produção, implemente autenticação mais robusta
- O acesso é restrito apenas via URL `/sistema`

### 6. Melhorias Implementadas
✅ Newsletter removida do footer
✅ Google Maps adicionado ao footer
✅ Modo dark removido completamente
✅ Animações de ondas removidas
✅ Título alterado para "Sorrir com confiança é Vitall"
✅ Formulário de agendamento reformulado para clínica odontológica
✅ Seção de blog adicionada à página principal
✅ Navegação atualizada (Serviços → Blog)
✅ Seções reorganizadas (Blog, Por que nos escolher, Testimonials)
✅ Página completa do blog criada
✅ Sistema administrativo completo implementado
✅ Favicon personalizado configurado
✅ Título da aba atualizado

### 7. Estrutura do Site
```
/ - Página principal
/apartments - Procedimentos odontológicos
/blog - Listagem de posts do blog
/blog/:id - Post individual
/gallery - Galeria de fotos
/contact - Página de contato
/booking - Agendamento de consultas
/sistema - Sistema administrativo (restrito)
```

### 8. Dados do Google Maps
- **Endereço**: R. Cel. Souza Franco, 904, Centro, Mogi das Cruzes - SP, 08710-025
- O mapa está integrado automaticamente no footer

### 9. WhatsApp Integration
- Todos os formulários redirecionam para WhatsApp com mensagens personalizadas
- Número: (11) 93455-0921

---

**Nota**: Este sistema foi desenvolvido para facilitar o gerenciamento de conteúdo do blog. Para funcionalidades avançadas como upload real de imagens e persistência de dados, considere integrar com um backend robusto. 