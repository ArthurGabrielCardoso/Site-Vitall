// Configurações da aplicação
// IMPORTANTE: Para produção, use variáveis de ambiente reais

interface AppConfig {
    admin: {
        username: string;
        password: string;
    };
    tinymce: {
        apiKey: string;
    };
    blog: {
        title: string;
        description: string;
        siteUrl: string;
        postsPerPage: number;
    };
    features: {
        enableComments: boolean;
        enableSearch: boolean;
        enableCategories: boolean;
        enableTags: boolean;
    };
    database: {
        useSupabase: boolean;
        fallbackToLocalStorage: boolean;
    };
}

// Função segura para acessar variáveis de ambiente
// Prioriza variáveis sem VITE_ (mais seguras)
function getEnvVar(name: string, fallback?: string): string | undefined {
    // Primeiro tenta da configuração global segura (produção)
    const globalConfig = (window as any).__APP_CONFIG__
    if (globalConfig && globalConfig[name]) {
        return globalConfig[name]
    }

    // Para desenvolvimento e produção: tentar sem VITE_ primeiro
    if (typeof import.meta !== 'undefined') {
        // Prioridade 1: Variáveis sem VITE_ (seguras)
        const value = import.meta.env[name]
        if (value) return value

        // Fallback: Com VITE_ (compatibilidade)
        const viteValue = import.meta.env[`VITE_${name}`]
        if (viteValue) return viteValue
    }

    return fallback
}

// Configuração padrão - MODIFIQUE ESTAS CREDENCIAIS EM PRODUÇÃO
export const config: AppConfig = {
    admin: {
        // ATENÇÃO: Altere estas credenciais em produção!
        username: getEnvVar('ADMIN_USERNAME', 'admin') || 'admin',
        password: getEnvVar('ADMIN_PASSWORD', 'vitall2024') || 'vitall2024',
    },
    tinymce: {
        // API Key do TinyMCE
        apiKey: getEnvVar('TINYMCE_API_KEY', 'jco90xj5bay10sjrgtqnrandcxr8b5vr6cou524frfhnh22g') || 'jco90xj5bay10sjrgtqnrandcxr8b5vr6cou524frfhnh22g',
    },
    blog: {
        title: 'Blog VitallCheck-Up',
        description: 'Dicas, novidades e informações sobre saúde bucal e tratamentos odontológicos',
        siteUrl: getEnvVar('APP_URL', 'https://vitallcheckup.com.br') || 'https://vitallcheckup.com.br',
        postsPerPage: 6,
    },
    features: {
        enableComments: false, // Implementar futuramente
        enableSearch: true,
        enableCategories: true,
        enableTags: false, // Implementar futuramente
    },
    database: {
        useSupabase: !!getEnvVar('SUPABASE_URL'),
        fallbackToLocalStorage: true,
    },
};

/**
 * Função para debug - mostra status da configuração
 */
export function logConfigStatus() {
    if (import.meta.env.DEV) {
        console.group('🔧 Configuração da Aplicação');
        console.log('Admin Username:', config.admin.username);
        console.log('Admin Password:', config.admin.password.replace(/./g, '*'));
        console.log('TinyMCE API Key:', config.tinymce.apiKey ? 'Configurada ✅' : 'Não configurada ❌');
        console.log('Site URL:', config.blog.siteUrl);
        console.log('Posts por página:', config.blog.postsPerPage);

        // Debug das variáveis
        console.log('\n🔍 Debug das Variáveis:');
        console.log('- ADMIN_USERNAME:', !!import.meta.env.ADMIN_USERNAME);
        console.log('- ADMIN_PASSWORD:', !!import.meta.env.ADMIN_PASSWORD);
        console.log('- TINYMCE_API_KEY:', !!import.meta.env.TINYMCE_API_KEY);
        console.log('- APP_URL:', !!import.meta.env.APP_URL);
        console.log('- SUPABASE_URL:', !!import.meta.env.SUPABASE_URL);

        console.groupEnd();

        // Avisos de segurança
        if (config.admin.username === 'admin' && config.admin.password === 'vitall2024') {
            console.warn('⚠️ SEGURANÇA: Usando credenciais padrão! Altere em produção.');
        }

        if (!getEnvVar('TINYMCE_API_KEY') && config.tinymce.apiKey.startsWith('jco90x')) {
            console.info('💡 TinyMCE: Usando API key padrão. Para personalizar, adicione TINYMCE_API_KEY no .env.local');
        }
    }
}

/**
 * Validação da configuração
 */
export function validateConfig(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!config.admin.username) {
        errors.push('Username do admin não configurado');
    }

    if (!config.admin.password) {
        errors.push('Password do admin não configurado');
    }

    if (!config.tinymce.apiKey) {
        errors.push('API Key do TinyMCE não configurada');
    }

    if (!config.blog.siteUrl) {
        errors.push('URL do site não configurada');
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

export default config; 