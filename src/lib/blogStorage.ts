/**
 * Sistema de armazenamento centralizado para posts do blog
 * Usa localStorage para persistir dados entre sessões
 */

export interface BlogPost {
    id: number;
    title: string;
    slug: string; // URL amigável baseada no título
    excerpt: string;
    content: string;
    image: string;
    category: string;
    date: string;
    author: string;
    readTime: string;
    published: boolean;
}

const STORAGE_KEY = 'vitall_blog_posts';
const STORAGE_VERSION_KEY = 'vitall_blog_version';
const CURRENT_VERSION = '2.1'; // Versão atual do sistema

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
 * Inicializa o sistema de storage, limpando dados antigos se necessário
 */
function initializeStorage(): void {
    const currentVersion = localStorage.getItem(STORAGE_VERSION_KEY);

    if (currentVersion !== CURRENT_VERSION) {
        // Limpa dados antigos de versões anteriores
        localStorage.removeItem(STORAGE_KEY);
        localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_VERSION);
        console.log('🧹 Sistema de blog limpo - versão atualizada para', CURRENT_VERSION);
    }
}

/**
 * Carrega todos os posts do localStorage
 */
export function loadPosts(): BlogPost[] {
    // Inicializa storage na primeira chamada
    initializeStorage();

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const posts = JSON.parse(stored);
            // Ordena por data de publicação (mais recentes primeiro)
            return posts.sort((a: BlogPost, b: BlogPost) => {
                return new Date(b.date).getTime() - new Date(a.date).getTime();
            });
        }
    } catch (error) {
        console.error('Erro ao carregar posts:', error);
    }
    return [];
}

/**
 * Salva todos os posts no localStorage
 */
export function savePosts(posts: BlogPost[]): void {
    try {
        // Ordena por data antes de salvar
        const sortedPosts = posts.sort((a, b) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sortedPosts));
    } catch (error) {
        console.error('Erro ao salvar posts:', error);
    }
}

/**
 * Adiciona um novo post
 */
export function addPost(post: Omit<BlogPost, 'id' | 'slug'>): BlogPost {
    const posts = loadPosts();
    const newId = Math.max(0, ...posts.map(p => p.id)) + 1;

    // Gera slug único
    let baseSlug = generateSlug(post.title);
    let slug = baseSlug;
    let counter = 1;

    // Verifica se o slug já existe e adiciona número se necessário
    while (posts.some(p => p.slug === slug)) {
        slug = `${baseSlug}-${counter}`;
        counter++;
    }

    const newPost: BlogPost = {
        ...post,
        id: newId,
        slug,
        date: new Date().toISOString().split('T')[0]
    };

    posts.unshift(newPost); // Adiciona no início (mais recente)
    savePosts(posts);
    return newPost;
}

/**
 * Atualiza um post existente
 */
export function updatePost(id: number, updates: Partial<BlogPost>): BlogPost | null {
    const posts = loadPosts();
    const index = posts.findIndex(p => p.id === id);

    if (index === -1) {
        return null;
    }

    const currentPost = posts[index];
    let updatedPost = { ...currentPost, ...updates };

    // Se o título mudou, atualiza o slug
    if (updates.title && updates.title !== currentPost.title) {
        let baseSlug = generateSlug(updates.title);
        let slug = baseSlug;
        let counter = 1;

        // Verifica se o slug já existe (exceto o próprio post)
        while (posts.some(p => p.slug === slug && p.id !== id)) {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }

        updatedPost.slug = slug;
    }

    posts[index] = updatedPost;
    savePosts(posts);
    return updatedPost;
}

/**
 * Remove um post
 */
export function deletePost(id: number): boolean {
    const posts = loadPosts();
    const filteredPosts = posts.filter(p => p.id !== id);

    if (filteredPosts.length === posts.length) {
        return false; // Post não encontrado
    }

    savePosts(filteredPosts);
    return true;
}

/**
 * Busca um post por ID
 */
export function getPostById(id: number): BlogPost | null {
    const posts = loadPosts();
    return posts.find(p => p.id === id) || null;
}

/**
 * Busca um post por slug
 */
export function getPostBySlug(slug: string): BlogPost | null {
    const posts = loadPosts();
    return posts.find(p => p.slug === slug) || null;
}

/**
 * Carrega apenas posts publicados (para o blog público)
 */
export function loadPublishedPosts(): BlogPost[] {
    return loadPosts().filter(post => post.published);
}

/**
 * Carrega posts por categoria
 */
export function loadPostsByCategory(category: string): BlogPost[] {
    const posts = loadPublishedPosts();
    if (category === "Todos") {
        return posts;
    }
    return posts.filter(post => post.category === category);
}

/**
 * Busca posts por termo
 */
export function searchPosts(searchTerm: string): BlogPost[] {
    if (!searchTerm.trim()) {
        return loadPublishedPosts();
    }

    const posts = loadPublishedPosts();
    const term = searchTerm.toLowerCase();

    return posts.filter(post =>
        post.title.toLowerCase().includes(term) ||
        post.excerpt.toLowerCase().includes(term) ||
        post.author.toLowerCase().includes(term) ||
        post.content.toLowerCase().includes(term)
    );
}

/**
 * Limpa todos os posts (usar com cuidado)
 */
export function clearAllPosts(): boolean {
    localStorage.removeItem(STORAGE_KEY);
    console.log('🗑️ Todos os posts foram removidos');
    return true;
}

/**
 * Exporta posts para backup
 */
export function exportPosts(): string {
    const posts = loadPosts();
    return JSON.stringify(posts, null, 2);
}

/**
 * Importa posts de backup
 */
export function importPosts(jsonData: string): boolean {
    try {
        const posts = JSON.parse(jsonData);

        // Valida estrutura básica
        if (!Array.isArray(posts)) {
            return false;
        }

        // Valida cada post e adiciona slug se não existir
        const validPosts = posts.filter(post =>
            post.id !== undefined &&
            post.title &&
            post.content &&
            post.date
        ).map(post => ({
            ...post,
            slug: post.slug || generateSlug(post.title)
        }));

        savePosts(validPosts);
        return true;
    } catch (error) {
        console.error('Erro ao importar posts:', error);
        return false;
    }
}

/**
 * Estatísticas dos posts
 */
export function getPostStats() {
    const allPosts = loadPosts();
    const publishedPosts = loadPublishedPosts();

    const categories: { [key: string]: number } = {};
    publishedPosts.forEach(post => {
        categories[post.category] = (categories[post.category] || 0) + 1;
    });

    return {
        total: allPosts.length,
        published: publishedPosts.length,
        drafts: allPosts.length - publishedPosts.length,
        categories
    };
}

export default {
    loadPosts,
    savePosts,
    addPost,
    updatePost,
    deletePost,
    getPostById,
    getPostBySlug,
    loadPublishedPosts,
    loadPostsByCategory,
    searchPosts,
    clearAllPosts,
    exportPosts,
    importPosts,
    getPostStats,
    generateSlug
}; 