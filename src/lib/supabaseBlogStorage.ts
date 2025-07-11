/**
 * Sistema de armazenamento de blog usando Supabase
 * Substitui o localStorage por um banco de dados real
 */

import { supabase } from './supabase';
import type { BlogPost, NewBlogPost, UpdateBlogPost } from './supabase';

/**
 * Gera um slug amigável a partir do título
 */
export function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .normalize('NFD') // Remove acentos
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
        .replace(/\s+/g, '-') // Substitui espaços por hífens
        .replace(/-+/g, '-') // Remove hífens duplicados
        .replace(/^-|-$/g, '') // Remove hífens do início e fim
        .slice(0, 60); // Limita o tamanho
}

/**
 * Carrega todos os posts do Supabase
 */
export async function loadPosts(): Promise<BlogPost[]> {
    try {
        const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .order('date', { ascending: false });

        if (error) {
            console.error('Erro ao carregar posts:', error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('Erro ao conectar com o Supabase:', error);
        return [];
    }
}

/**
 * Carrega apenas posts publicados (para o blog público)
 */
export async function loadPublishedPosts(): Promise<BlogPost[]> {
    try {
        const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('published', true)
            .order('date', { ascending: false });

        if (error) {
            console.error('Erro ao carregar posts publicados:', error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('Erro ao conectar com o Supabase:', error);
        return [];
    }
}

/**
 * Adiciona um novo post
 */
export async function addPost(post: Omit<NewBlogPost, 'id' | 'slug' | 'created_at' | 'updated_at'>): Promise<BlogPost | null> {
    try {
        // Gera slug único
        let baseSlug = generateSlug(post.title);
        let slug = baseSlug;
        let counter = 1;

        // Verifica se o slug já existe e adiciona número se necessário
        while (true) {
            const { data: existingPost } = await supabase
                .from('blog_posts')
                .select('id')
                .eq('slug', slug)
                .single();

            if (!existingPost) break;

            slug = `${baseSlug}-${counter}`;
            counter++;
        }

        const newPost: NewBlogPost = {
            ...post,
            slug,
            date: new Date().toISOString().split('T')[0]
        };

        const { data, error } = await supabase
            .from('blog_posts')
            .insert([newPost])
            .select()
            .single();

        if (error) {
            console.error('Erro ao adicionar post:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Erro ao conectar com o Supabase:', error);
        return null;
    }
}

/**
 * Atualiza um post existente
 */
export async function updatePost(id: number, updates: Partial<UpdateBlogPost>): Promise<BlogPost | null> {
    try {
        // Se o título mudou, atualiza o slug
        if (updates.title) {
            const { data: currentPost } = await supabase
                .from('blog_posts')
                .select('title')
                .eq('id', id)
                .single();

            if (currentPost && updates.title !== currentPost.title) {
                let baseSlug = generateSlug(updates.title);
                let slug = baseSlug;
                let counter = 1;

                // Verifica se o slug já existe (exceto o próprio post)
                while (true) {
                    const { data: existingPost } = await supabase
                        .from('blog_posts')
                        .select('id')
                        .eq('slug', slug)
                        .neq('id', id)
                        .single();

                    if (!existingPost) break;

                    slug = `${baseSlug}-${counter}`;
                    counter++;
                }

                updates.slug = slug;
            }
        }

        const { data, error } = await supabase
            .from('blog_posts')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Erro ao atualizar post:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Erro ao conectar com o Supabase:', error);
        return null;
    }
}

/**
 * Remove um post
 */
export async function deletePost(id: number): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('blog_posts')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Erro ao deletar post:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Erro ao conectar com o Supabase:', error);
        return false;
    }
}

/**
 * Busca um post por ID
 */
export async function getPostById(id: number): Promise<BlogPost | null> {
    try {
        const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Erro ao buscar post por ID:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Erro ao conectar com o Supabase:', error);
        return null;
    }
}

/**
 * Busca um post por slug
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
        const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error) {
            console.error('Erro ao buscar post por slug:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Erro ao conectar com o Supabase:', error);
        return null;
    }
}

/**
 * Carrega posts por categoria
 */
export async function loadPostsByCategory(category: string): Promise<BlogPost[]> {
    try {
        const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('category', category)
            .eq('published', true)
            .order('date', { ascending: false });

        if (error) {
            console.error('Erro ao carregar posts por categoria:', error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('Erro ao conectar com o Supabase:', error);
        return [];
    }
}

/**
 * Busca posts por termo
 */
export async function searchPosts(term: string): Promise<BlogPost[]> {
    try {
        const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('published', true)
            .or(`title.ilike.%${term}%, excerpt.ilike.%${term}%, content.ilike.%${term}%`)
            .order('date', { ascending: false });

        if (error) {
            console.error('Erro ao buscar posts:', error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('Erro ao conectar com o Supabase:', error);
        return [];
    }
}

/**
 * Limpa todos os posts (apenas para desenvolvimento)
 */
export async function clearAllPosts(): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('blog_posts')
            .delete()
            .neq('id', 0); // Deleta todos os posts

        if (error) {
            console.error('Erro ao limpar posts:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Erro ao conectar com o Supabase:', error);
        return false;
    }
}

/**
 * Obtém estatísticas dos posts
 */
export async function getPostStats(): Promise<{
    total: number;
    published: number;
    drafts: number;
    categories: { [key: string]: number };
}> {
    try {
        const { data, error } = await supabase
            .from('blog_posts')
            .select('published, category');

        if (error) {
            console.error('Erro ao obter estatísticas:', error);
            return { total: 0, published: 0, drafts: 0, categories: {} };
        }

        const stats = {
            total: data?.length || 0,
            published: data?.filter(p => p.published).length || 0,
            drafts: data?.filter(p => !p.published).length || 0,
            categories: {} as { [key: string]: number }
        };

        data?.forEach(post => {
            stats.categories[post.category] = (stats.categories[post.category] || 0) + 1;
        });

        return stats;
    } catch (error) {
        console.error('Erro ao conectar com o Supabase:', error);
        return { total: 0, published: 0, drafts: 0, categories: {} };
    }
}

/**
 * Exporta posts para backup
 */
export async function exportPosts(): Promise<string> {
    try {
        const posts = await loadPosts();
        return JSON.stringify(posts, null, 2);
    } catch (error) {
        console.error('Erro ao exportar posts:', error);
        return '[]';
    }
}

/**
 * Importa posts de backup
 */
export async function importPosts(jsonData: string): Promise<boolean> {
    try {
        const posts = JSON.parse(jsonData);

        if (!Array.isArray(posts)) {
            console.error('Dados de importação inválidos');
            return false;
        }

        // Valida cada post e adiciona ao Supabase
        for (const post of posts) {
            if (post.title && post.content && post.date) {
                const newPost = {
                    title: post.title,
                    excerpt: post.excerpt || '',
                    content: post.content,
                    image: post.image || '',
                    category: post.category || 'Geral',
                    date: post.date,
                    author: post.author || 'VitallCheck-Up',
                    read_time: post.read_time || post.readTime || '5 min',
                    published: post.published || false
                };

                await addPost(newPost);
            }
        }

        return true;
    } catch (error) {
        console.error('Erro ao importar posts:', error);
        return false;
    }
}

export default {
    loadPosts,
    loadPublishedPosts,
    addPost,
    updatePost,
    deletePost,
    getPostById,
    getPostBySlug,
    loadPostsByCategory,
    searchPosts,
    clearAllPosts,
    getPostStats,
    exportPosts,
    importPosts,
    generateSlug
}; 