/**
 * Script de migração para transferir dados do blog do localStorage para o Supabase
 */

import { loadPosts as loadLocalPosts, BlogPost as LocalBlogPost } from './blogStorage';
import { addPost, loadPosts as loadSupabasePosts, clearAllPosts } from './supabaseBlogStorage';
import { calculateReadingTime } from './readingTime';

interface MigrationResult {
    success: boolean;
    message: string;
    localPosts: number;
    migratedPosts: number;
    errors: string[];
}

/**
 * Migra posts do localStorage para o Supabase
 */
export async function migratePostsToSupabase(): Promise<MigrationResult> {
    const result: MigrationResult = {
        success: false,
        message: '',
        localPosts: 0,
        migratedPosts: 0,
        errors: []
    };

    try {
        // 1. Carregar posts do localStorage
        console.log('🔄 Carregando posts do localStorage...');
        const localPosts = loadLocalPosts();
        result.localPosts = localPosts.length;

        if (localPosts.length === 0) {
            result.success = true;
            result.message = 'Nenhum post encontrado no localStorage para migrar.';
            return result;
        }

        console.log(`📄 Encontrados ${localPosts.length} posts no localStorage`);

        // 2. Verificar se já existem posts no Supabase
        const existingPosts = await loadSupabasePosts();
        const existingTitles = existingPosts.map(post => post.title.toLowerCase());

        if (existingPosts.length > 0) {
            console.log(`⚠️ Já existem ${existingPosts.length} posts no Supabase. Verificando duplicatas...`);
        }

        // 3. Migrar cada post (apenas os que não existem)
        console.log('🚀 Iniciando migração...');
        let skippedPosts = 0;

        for (let i = 0; i < localPosts.length; i++) {
            const localPost = localPosts[i];

            // Verifica se o post já existe no Supabase (por título)
            if (existingTitles.includes(localPost.title.toLowerCase())) {
                console.log(`⏭️ Post já existe no Supabase, pulando: "${localPost.title}"`);
                skippedPosts++;
                continue;
            }

            console.log(`📝 Migrando post ${i + 1}/${localPosts.length}: "${localPost.title}"`);

            try {
                // Converte o post do formato antigo para o novo
                const newPost = {
                    title: localPost.title,
                    excerpt: localPost.excerpt,
                    content: localPost.content,
                    image: localPost.image || '',
                    category: localPost.category,
                    date: localPost.date,
                    author: localPost.author,
                    read_time: localPost.readTime || calculateReadingTime(localPost.content).text,
                    published: localPost.published
                };

                // Adiciona o post no Supabase
                const migratedPost = await addPost(newPost);

                if (migratedPost) {
                    result.migratedPosts++;
                    console.log(`✅ Post migrado com sucesso: ${migratedPost.slug}`);
                } else {
                    result.errors.push(`Falha ao migrar post: ${localPost.title}`);
                    console.error(`❌ Falha ao migrar post: ${localPost.title}`);
                }
            } catch (error) {
                const errorMessage = `Erro ao migrar post "${localPost.title}": ${error}`;
                result.errors.push(errorMessage);
                console.error('❌', errorMessage);
            }
        }

        // Adiciona informação sobre posts pulados
        if (skippedPosts > 0) {
            console.log(`⏭️ ${skippedPosts} posts pulados (já existem no Supabase)`);
        }

        // 4. Resultado final
        const totalToMigrate = localPosts.length - skippedPosts;

        if (result.migratedPosts === totalToMigrate) {
            result.success = true;
            if (skippedPosts > 0) {
                result.message = `✅ Migração concluída! ${result.migratedPosts} posts migrados, ${skippedPosts} já existiam.`;
            } else {
                result.message = `✅ Migração concluída com sucesso! ${result.migratedPosts} posts migrados.`;
            }
        } else {
            result.success = false;
            result.message = `⚠️ Migração parcial: ${result.migratedPosts}/${totalToMigrate} posts migrados. Verifique os erros.`;
        }

        console.log('📊 Resultado da migração:');
        console.log(`   • Posts no localStorage: ${result.localPosts}`);
        console.log(`   • Posts migrados: ${result.migratedPosts}`);
        console.log(`   • Erros: ${result.errors.length}`);

        return result;

    } catch (error) {
        result.success = false;
        result.message = `Erro durante a migração: ${error}`;
        result.errors.push(`Erro geral: ${error}`);
        console.error('💥 Erro durante a migração:', error);
        return result;
    }
}

/**
 * Cria backup dos dados do localStorage antes da migração
 */
export function createLocalStorageBackup(): string {
    try {
        const posts = loadLocalPosts();
        const backup = {
            timestamp: new Date().toISOString(),
            version: '2.1',
            posts: posts
        };

        const backupString = JSON.stringify(backup, null, 2);

        // Salva o backup no localStorage também
        localStorage.setItem('vitall_blog_backup', backupString);

        console.log('💾 Backup criado com sucesso!');
        return backupString;
    } catch (error) {
        console.error('❌ Erro ao criar backup:', error);
        return '';
    }
}

/**
 * Restaura dados do backup
 */
export function restoreFromBackup(backupString: string): boolean {
    try {
        const backup = JSON.parse(backupString);

        if (!backup.posts || !Array.isArray(backup.posts)) {
            console.error('❌ Backup inválido: não contém posts');
            return false;
        }

        // Restaura os posts no localStorage
        localStorage.setItem('vitall_blog_posts', JSON.stringify(backup.posts));

        console.log(`💾 Backup restaurado com sucesso! ${backup.posts.length} posts restaurados.`);
        return true;
    } catch (error) {
        console.error('❌ Erro ao restaurar backup:', error);
        return false;
    }
}

/**
 * Função principal de migração com backup automático
 */
export async function migrateWithBackup(): Promise<MigrationResult> {
    console.log('🔄 Iniciando migração com backup automático...');

    // 1. Criar backup antes da migração
    const backup = createLocalStorageBackup();
    if (!backup) {
        return {
            success: false,
            message: 'Falha ao criar backup. Migração cancelada por segurança.',
            localPosts: 0,
            migratedPosts: 0,
            errors: ['Falha ao criar backup']
        };
    }

    // 2. Executar migração
    const result = await migratePostsToSupabase();

    // 3. Salvar backup como arquivo (para download)
    if (result.success) {
        downloadBackup(backup);
    }

    return result;
}

/**
 * Baixa o backup como arquivo
 */
function downloadBackup(backupString: string): void {
    try {
        const blob = new Blob([backupString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `vitall-blog-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        console.log('💾 Backup baixado automaticamente!');
    } catch (error) {
        console.error('❌ Erro ao baixar backup:', error);
    }
}

/**
 * Verifica se a migração é necessária
 */
export async function needsMigration(): Promise<boolean> {
    const localPosts = loadLocalPosts();
    const supabasePosts = await loadSupabasePosts();

    // Se há mais posts no localStorage do que no Supabase, precisa migrar
    return localPosts.length > supabasePosts.length;
}

/**
 * Limpa o localStorage após migração bem-sucedida
 */
export function clearLocalStorageAfterMigration(): void {
    try {
        // Remove apenas os posts, mantém o backup
        localStorage.removeItem('vitall_blog_posts');
        localStorage.removeItem('vitall_blog_version');
        console.log('🧹 localStorage limpo após migração');
    } catch (error) {
        console.error('❌ Erro ao limpar localStorage:', error);
    }
}

export default {
    migratePostsToSupabase,
    migrateWithBackup,
    createLocalStorageBackup,
    restoreFromBackup,
    needsMigration,
    clearLocalStorageAfterMigration
}; 