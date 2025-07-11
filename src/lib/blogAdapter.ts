/**
 * Adaptador para gerenciar a transição entre localStorage e Supabase
 * Permite que o sistema funcione com ambos os backends
 */

import { config } from './config';
import { supabase } from './supabase';
import * as localStorageAPI from './blogStorage';
import * as supabaseAPI from './supabaseBlogStorage';

// Tipo unificado para BlogPost
export interface BlogPost {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    image: string;
    category: string;
    date: string;
    author: string;
    readTime?: string;     // localStorage
    read_time?: string;    // Supabase
    published: boolean;
    created_at?: string;   // Supabase
    updated_at?: string;   // Supabase
}

// Função para normalizar posts entre os formatos
function normalizePost(post: any): BlogPost {
    return {
        ...post,
        readTime: post.readTime || post.read_time,
        read_time: post.read_time || post.readTime,
        image: post.image || ''
    };
}

// Função para normalizar array de posts
function normalizePosts(posts: any[]): BlogPost[] {
    return posts.map(normalizePost);
}

/**
 * Verifica se o usuário está autenticado
 */
async function checkAuthentication(): Promise<boolean> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        return !!user;
    } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        return false;
    }
}

/**
 * Determina qual backend usar baseado na configuração
 */
function getBackend() {
    return config.database.useSupabase ? 'supabase' : 'localStorage';
}

/**
 * Carrega todos os posts
 */
export async function loadPosts(): Promise<BlogPost[]> {
    const backend = getBackend();

    try {
        if (backend === 'supabase') {
            const posts = await supabaseAPI.loadPosts();
            return normalizePosts(posts);
        } else {
            const posts = localStorageAPI.loadPosts();
            return normalizePosts(posts);
        }
    } catch (error) {
        console.error(`Erro ao carregar posts do ${backend}:`, error);

        // Fallback para localStorage se configurado
        if (config.database.fallbackToLocalStorage && backend === 'supabase') {
            console.log('🔄 Fazendo fallback para localStorage...');
            const posts = localStorageAPI.loadPosts();
            return normalizePosts(posts);
        }

        return [];
    }
}

/**
 * Carrega apenas posts publicados
 */
export async function loadPublishedPosts(): Promise<BlogPost[]> {
    const backend = getBackend();

    try {
        if (backend === 'supabase') {
            const posts = await supabaseAPI.loadPublishedPosts();
            return normalizePosts(posts);
        } else {
            const posts = localStorageAPI.loadPublishedPosts();
            return normalizePosts(posts);
        }
    } catch (error) {
        console.error(`Erro ao carregar posts publicados do ${backend}:`, error);

        // Fallback para localStorage se configurado
        if (config.database.fallbackToLocalStorage && backend === 'supabase') {
            console.log('🔄 Fazendo fallback para localStorage...');
            const posts = localStorageAPI.loadPublishedPosts();
            return normalizePosts(posts);
        }

        return [];
    }
}

/**
 * Adiciona um novo post
 * 🔐 Requer autenticação
 */
export async function addPost(post: Omit<BlogPost, 'id' | 'slug' | 'created_at' | 'updated_at'>): Promise<BlogPost | null> {
    // Verificar autenticação
    const isAuthenticated = await checkAuthentication();
    if (!isAuthenticated) {
        console.error('❌ Operação negada: Usuário não autenticado');
        throw new Error('Usuário não autenticado');
    }

    const backend = getBackend();

    try {
        if (backend === 'supabase') {
            const newPost = await supabaseAPI.addPost({
                title: post.title,
                excerpt: post.excerpt,
                content: post.content,
                image: post.image || '',
                category: post.category,
                date: post.date,
                author: post.author,
                read_time: post.readTime || post.read_time || '5 min',
                published: post.published
            });
            return newPost ? normalizePost(newPost) : null;
        } else {
            const newPost = localStorageAPI.addPost({
                title: post.title,
                excerpt: post.excerpt,
                content: post.content,
                image: post.image || '',
                category: post.category,
                date: post.date,
                author: post.author,
                readTime: post.readTime || post.read_time || '5 min',
                published: post.published
            });
            return normalizePost(newPost);
        }
    } catch (error) {
        console.error(`Erro ao adicionar post no ${backend}:`, error);
        return null;
    }
}

/**
 * Atualiza um post existente
 * 🔐 Requer autenticação
 */
export async function updatePost(id: number, updates: Partial<BlogPost>): Promise<BlogPost | null> {
    // Verificar autenticação
    const isAuthenticated = await checkAuthentication();
    if (!isAuthenticated) {
        console.error('❌ Operação negada: Usuário não autenticado');
        throw new Error('Usuário não autenticado');
    }

    const backend = getBackend();

    try {
        if (backend === 'supabase') {
            const updatedPost = await supabaseAPI.updatePost(id, {
                title: updates.title,
                excerpt: updates.excerpt,
                content: updates.content,
                image: updates.image,
                category: updates.category,
                date: updates.date,
                author: updates.author,
                read_time: updates.readTime || updates.read_time,
                published: updates.published
            });
            return updatedPost ? normalizePost(updatedPost) : null;
        } else {
            const updatedPost = localStorageAPI.updatePost(id, {
                title: updates.title,
                excerpt: updates.excerpt,
                content: updates.content,
                image: updates.image,
                category: updates.category,
                date: updates.date,
                author: updates.author,
                readTime: updates.readTime || updates.read_time,
                published: updates.published
            });
            return updatedPost ? normalizePost(updatedPost) : null;
        }
    } catch (error) {
        console.error(`Erro ao atualizar post no ${backend}:`, error);
        return null;
    }
}

/**
 * Remove um post
 * 🔐 Requer autenticação
 */
export async function deletePost(id: number): Promise<boolean> {
    // Verificar autenticação
    const isAuthenticated = await checkAuthentication();
    if (!isAuthenticated) {
        console.error('❌ Operação negada: Usuário não autenticado');
        throw new Error('Usuário não autenticado');
    }

    const backend = getBackend();

    try {
        if (backend === 'supabase') {
            return await supabaseAPI.deletePost(id);
        } else {
            return localStorageAPI.deletePost(id);
        }
    } catch (error) {
        console.error(`Erro ao deletar post no ${backend}:`, error);
        return false;
    }
}

/**
 * Busca um post por ID
 */
export async function getPostById(id: number): Promise<BlogPost | null> {
    const backend = getBackend();

    try {
        if (backend === 'supabase') {
            const post = await supabaseAPI.getPostById(id);
            return post ? normalizePost(post) : null;
        } else {
            const post = localStorageAPI.getPostById(id);
            return post ? normalizePost(post) : null;
        }
    } catch (error) {
        console.error(`Erro ao buscar post por ID no ${backend}:`, error);
        return null;
    }
}

/**
 * Busca um post por slug
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
    const backend = getBackend();

    try {
        if (backend === 'supabase') {
            const post = await supabaseAPI.getPostBySlug(slug);
            return post ? normalizePost(post) : null;
        } else {
            const post = localStorageAPI.getPostBySlug(slug);
            return post ? normalizePost(post) : null;
        }
    } catch (error) {
        console.error(`Erro ao buscar post por slug no ${backend}:`, error);
        return null;
    }
}

/**
 * Carrega posts por categoria
 */
export async function loadPostsByCategory(category: string): Promise<BlogPost[]> {
    const backend = getBackend();

    try {
        if (backend === 'supabase') {
            const posts = await supabaseAPI.loadPostsByCategory(category);
            return normalizePosts(posts);
        } else {
            const posts = localStorageAPI.loadPostsByCategory(category);
            return normalizePosts(posts);
        }
    } catch (error) {
        console.error(`Erro ao carregar posts por categoria no ${backend}:`, error);
        return [];
    }
}

/**
 * Busca posts por termo
 */
export async function searchPosts(term: string): Promise<BlogPost[]> {
    const backend = getBackend();

    try {
        if (backend === 'supabase') {
            const posts = await supabaseAPI.searchPosts(term);
            return normalizePosts(posts);
        } else {
            const posts = localStorageAPI.searchPosts(term);
            return normalizePosts(posts);
        }
    } catch (error) {
        console.error(`Erro ao buscar posts no ${backend}:`, error);
        return [];
    }
}

/**
 * Limpa todos os posts
 */
export async function clearAllPosts(): Promise<boolean> {
    const backend = getBackend();

    try {
        if (backend === 'supabase') {
            return await supabaseAPI.clearAllPosts();
        } else {
            return localStorageAPI.clearAllPosts();
        }
    } catch (error) {
        console.error(`Erro ao limpar posts no ${backend}:`, error);
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
    const backend = getBackend();

    try {
        if (backend === 'supabase') {
            return await supabaseAPI.getPostStats();
        } else {
            return localStorageAPI.getPostStats();
        }
    } catch (error) {
        console.error(`Erro ao obter estatísticas no ${backend}:`, error);
        return { total: 0, published: 0, drafts: 0, categories: {} };
    }
}

/**
 * Exporta posts para backup
 */
export async function exportPosts(): Promise<string> {
    const backend = getBackend();

    try {
        if (backend === 'supabase') {
            return await supabaseAPI.exportPosts();
        } else {
            return localStorageAPI.exportPosts();
        }
    } catch (error) {
        console.error(`Erro ao exportar posts no ${backend}:`, error);
        return '[]';
    }
}

/**
 * Importa posts de backup
 */
export async function importPosts(jsonData: string): Promise<boolean> {
    const backend = getBackend();

    try {
        if (backend === 'supabase') {
            return await supabaseAPI.importPosts(jsonData);
        } else {
            return localStorageAPI.importPosts(jsonData);
        }
    } catch (error) {
        console.error(`Erro ao importar posts no ${backend}:`, error);
        return false;
    }
}

/**
 * Função para geração de slug
 */
export function generateSlug(title: string): string {
    return supabaseAPI.generateSlug(title);
}

/**
 * Obtém informações sobre o backend atual
 */
export function getBackendInfo(): {
    backend: string;
    supabaseConfigured: boolean;
    fallbackEnabled: boolean;
} {
    return {
        backend: getBackend(),
        supabaseConfigured: config.database.useSupabase,
        fallbackEnabled: config.database.fallbackToLocalStorage
    };
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
    generateSlug,
    getBackendInfo
}; 