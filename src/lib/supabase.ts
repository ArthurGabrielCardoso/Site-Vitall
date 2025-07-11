import { createClient } from '@supabase/supabase-js'

// Configuração segura do Supabase
// Prioriza variáveis sem VITE_ tanto em desenvolvimento quanto produção
function getSupabaseConfig() {
    let supabaseUrl: string | undefined
    let supabaseKey: string | undefined

    // Em produção: usar configuração injetada pelo build (apenas se não estiver em DEV)
    if (!import.meta.env.DEV && typeof window !== 'undefined' && (window as any).__SUPABASE_CONFIG__) {
        const config = (window as any).__SUPABASE_CONFIG__
        // Verificar se não são placeholders
        if (config.url && !config.url.includes('{{')) {
            supabaseUrl = config.url
            supabaseKey = config.key
        }
    }

    // Para desenvolvimento: sempre usar variáveis de ambiente
    if ((!supabaseUrl || !supabaseKey) && typeof import.meta !== 'undefined') {
        // Prioridade 1: Variáveis sem VITE_ (seguras)
        supabaseUrl = import.meta.env.SUPABASE_URL
        supabaseKey = import.meta.env.SUPABASE_ANON_KEY

        // Fallback: Se não encontrar, tentar com VITE_ (compatibilidade)
        if (!supabaseUrl || !supabaseKey) {
            supabaseUrl = supabaseUrl || import.meta.env.VITE_SUPABASE_URL
            supabaseKey = supabaseKey || import.meta.env.VITE_SUPABASE_ANON_KEY
        }
    }

    // Debug em desenvolvimento
    if (import.meta.env.DEV) {
        console.log('🔧 Supabase Config Debug:')
        console.log('- URL configurada:', !!supabaseUrl)
        console.log('- Key configurada:', !!supabaseKey)
        console.log('- Modo DEV:', import.meta.env.DEV)
        console.log('- Usando __SUPABASE_CONFIG__:', !import.meta.env.DEV && !!(window as any).__SUPABASE_CONFIG__)
        console.log('- SUPABASE_URL disponível:', !!import.meta.env.SUPABASE_URL)
        console.log('- VITE_SUPABASE_URL disponível:', !!import.meta.env.VITE_SUPABASE_URL)
        console.log('- URL final (primeiros 20 chars):', supabaseUrl ? supabaseUrl.substring(0, 20) + '...' : 'undefined')
    }

    return { supabaseUrl, supabaseKey }
}

const { supabaseUrl, supabaseKey } = getSupabaseConfig()

if (!supabaseUrl || !supabaseKey) {
    const errorMsg = `
🚨 Configuração do Supabase não encontrada!

📋 Como resolver:

1️⃣ DESENVOLVIMENTO LOCAL:
   - Certifique-se que o arquivo .env.local existe na raiz do projeto
   - Configure as variáveis SEM VITE_:
     SUPABASE_URL=sua-url-do-supabase
     SUPABASE_ANON_KEY=sua-chave-anonima

2️⃣ PRODUÇÃO (Vercel):
   - Configure as variáveis sem VITE_:
     SUPABASE_URL=sua-url-do-supabase
     SUPABASE_ANON_KEY=sua-chave-anonima

🔍 Para obter as configurações do Supabase:
   - Entre em supabase.com
   - Vá no seu projeto
   - Settings → API
   - Copie URL e anon/public key

⚠️ NOTA: Variáveis sem VITE_ são mais seguras!
`
    console.error(errorMsg)
    throw new Error('Configuração do Supabase não encontrada! Verifique as variáveis de ambiente.')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// Tipos para o banco de dados
export interface Database {
    public: {
        Tables: {
            blog_posts: {
                Row: {
                    id: number
                    title: string
                    slug: string
                    excerpt: string
                    content: string
                    image: string | null
                    category: string
                    date: string
                    author: string
                    read_time: string
                    published: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: number
                    title: string
                    slug: string
                    excerpt: string
                    content: string
                    image?: string | null
                    category: string
                    date: string
                    author: string
                    read_time: string
                    published?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: number
                    title?: string
                    slug?: string
                    excerpt?: string
                    content?: string
                    image?: string | null
                    category?: string
                    date?: string
                    author?: string
                    read_time?: string
                    published?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
        }
    }
}

export type BlogPost = Database['public']['Tables']['blog_posts']['Row']
export type NewBlogPost = Database['public']['Tables']['blog_posts']['Insert']
export type UpdateBlogPost = Database['public']['Tables']['blog_posts']['Update'] 