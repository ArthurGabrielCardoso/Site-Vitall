import { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { config } from '@/lib/config';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: number;
  disabled?: boolean;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Escreva seu conteúdo aqui...",
  height = 400,
  disabled = false
}: RichTextEditorProps) {
  const editorRef = useRef<any>(null);

  const handleEditorChange = (content: string) => {
    onChange(content);
  };

  const editorConfig = {
    height,
    menubar: false,
    plugins: [
      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
      'insertdatetime', 'media', 'table', 'help', 'wordcount', 'emoticons',
      'autosave', 'save'
    ],
    toolbar: [
      'undo redo | blocks | bold italic underline strikethrough | forecolor backcolor |',
      'alignleft aligncenter alignright alignjustify | bullist numlist outdent indent |',
      'removeformat | link image media table emoticons | code preview fullscreen help'
    ].join(' '),
    toolbar_mode: 'sliding',
    content_style: `
      body { 
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
        font-size: 16px; 
        line-height: 1.6;
        color: #333;
        max-width: none;
        margin: 1rem;
      }
      img {
        max-width: 100%;
        height: auto;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }
      blockquote {
        border-left: 4px solid #3b82f6;
        margin: 1.5em 0;
        padding: 0.5em 1em;
        background-color: #f8fafc;
        font-style: italic;
      }
      code {
        background-color: #f1f5f9;
        padding: 2px 4px;
        border-radius: 4px;
        font-family: 'Monaco', 'Consolas', monospace;
        font-size: 0.9em;
      }
      pre {
        background-color: #1e293b;
        color: #e2e8f0;
        padding: 1rem;
        border-radius: 8px;
        overflow-x: auto;
      }
      h1, h2, h3, h4, h5, h6 {
        color: #1e293b;
        font-weight: 600;
        margin-top: 1.5em;
        margin-bottom: 0.5em;
      }
      h1 { font-size: 2.25em; }
      h2 { font-size: 1.875em; }
      h3 { font-size: 1.5em; }
      h4 { font-size: 1.25em; }
      p {
        margin-bottom: 1em;
      }
      ul, ol {
        margin: 1em 0;
        padding-left: 2em;
      }
      li {
        margin-bottom: 0.5em;
      }
      table {
        border-collapse: collapse;
        width: 100%;
        margin: 1em 0;
      }
      th, td {
        border: 1px solid #e2e8f0;
        padding: 0.75em;
        text-align: left;
      }
      th {
        background-color: #f8fafc;
        font-weight: 600;
      }
    `,
    placeholder,
    branding: false,
    elementpath: false,
    resize: false,
    statusbar: true,
    paste_data_images: true,
    paste_as_text: false,
    paste_webkit_styles: 'none',
    paste_merge_formats: true,
    automatic_uploads: true,
    file_picker_types: 'image',
    file_picker_callback: (callback: any, value: any, meta: any) => {
      if (meta.filetype === 'image') {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');

        input.onchange = function () {
          const file = (this as HTMLInputElement).files?.[0];
          if (file) {
            // Em produção, fazer upload real para servidor
            // Por enquanto, usamos uma URL de exemplo
            const reader = new FileReader();
            reader.onload = function (e) {
              const base64 = e.target?.result as string;
              callback(base64, { alt: file.name });
            };
            reader.readAsDataURL(file);
          }
        };

        input.click();
      }
    },
    images_upload_handler: (blobInfo: any, progress: any) => {
      return new Promise((resolve, reject) => {
        // Em produção, implementar upload real
        // Por enquanto, converter para base64
        const reader = new FileReader();
        reader.onload = function () {
          resolve(reader.result as string);
        };
        reader.onerror = function () {
          reject('Erro ao carregar imagem');
        };
        reader.readAsDataURL(blobInfo.blob());
      });
    },
    autosave_ask_before_unload: true,
    autosave_interval: '30s',
    autosave_retention: '2m',
    setup: (editor: any) => {
      editor.on('init', () => {
        if (disabled) {
          editor.mode.set('readonly');
        }
      });
    },
    // Configurações de idioma
    language: 'pt_BR',
    // Templates customizados para blog odontológico
    templates: [
      {
        title: 'Artigo Básico',
        description: 'Template básico para artigos',
        content: `
          <h2>Introdução</h2>
          <p>Introduza o tópico principal do artigo...</p>
          
          <h3>Tópico 1</h3>
          <p>Desenvolva o primeiro ponto...</p>
          
          <h3>Tópico 2</h3>
          <p>Desenvolva o segundo ponto...</p>
          
          <h2>Conclusão</h2>
          <p>Conclua o artigo e incentive a ação...</p>
        `
      },
      {
        title: 'Dicas de Saúde Bucal',
        description: 'Template para artigos de dicas',
        content: `
          <h2>X Dicas para [Título]</h2>
          <p>Introdução sobre a importância do tema...</p>
          
          <h3>1. Primeira Dica</h3>
          <p>Explique a primeira dica detalhadamente...</p>
          
          <h3>2. Segunda Dica</h3>
          <p>Explique a segunda dica detalhadamente...</p>
          
          <blockquote>
          <p><strong>Dica importante:</strong> Sempre consulte seu dentista antes de iniciar qualquer tratamento.</p>
          </blockquote>
        `
      },
      {
        title: 'Procedimento Odontológico',
        description: 'Template para explicar procedimentos',
        content: `
          <h2>O que é [Nome do Procedimento]?</h2>
          <p>Explicação geral do procedimento...</p>
          
          <h3>Indicações</h3>
          <ul>
          <li>Primeira indicação</li>
          <li>Segunda indicação</li>
          </ul>
          
          <h3>Como funciona o procedimento?</h3>
          <p>Descrição passo a passo...</p>
          
          <h3>Cuidados pós-procedimento</h3>
          <p>Orientações importantes...</p>
          
          <p><em>Agende uma consulta para saber se este procedimento é indicado para você.</em></p>
        `
      }
    ]
  };

  return (
    <div className="rich-text-editor">
      <Editor
        apiKey={config.tinymce.apiKey}
        onInit={(evt, editor) => editorRef.current = editor}
        value={value}
        onEditorChange={handleEditorChange}
        init={editorConfig}
        disabled={disabled}
      />
    </div>
  );
} 