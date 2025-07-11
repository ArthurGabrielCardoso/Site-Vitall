import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔒 Executando substituição segura de variáveis...');

// Caminho para o arquivo HTML de produção
const htmlPath = path.join(__dirname, 'dist', 'index.html');

try {
    if (!fs.existsSync(htmlPath)) {
        console.log('❌ Arquivo index.html não encontrado em dist/');
        process.exit(1);
    }

    // Ler o arquivo HTML
    let html = fs.readFileSync(htmlPath, 'utf8');

    // Substituir as variáveis de forma segura
    const replacements = {
        '{{SUPABASE_URL}}': process.env.SUPABASE_URL || '',
        '{{SUPABASE_ANON_KEY}}': process.env.SUPABASE_ANON_KEY || '',
        '{{ADMIN_USERNAME}}': process.env.ADMIN_USERNAME || 'admin',
        '{{ADMIN_PASSWORD}}': process.env.ADMIN_PASSWORD || 'vitall2024',
        '{{TINYMCE_API_KEY}}': process.env.TINYMCE_API_KEY || 'jco90xj5bay10sjrgtqnrandcxr8b5vr6cou524frfhnh22g',
        '{{APP_URL}}': process.env.APP_URL || 'https://vitallcheckup.com.br',
        '{{GOOGLE_PLACE_ID}}': process.env.GOOGLE_PLACE_ID || ''
    };

    // Aplicar as substituições
    for (const [placeholder, value] of Object.entries(replacements)) {
        html = html.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), value);
    }

    // Escrever o arquivo modificado
    fs.writeFileSync(htmlPath, html, 'utf8');

    console.log('✅ Variáveis substituídas com sucesso!');
    console.log('🔒 Configurações aplicadas de forma segura.');

    // Log das variáveis encontradas (sem mostrar valores sensíveis)
    console.log('\n📋 Status das variáveis:');
    Object.keys(replacements).forEach(key => {
        const envKey = key.replace(/[{}]/g, '');
        const hasValue = process.env[envKey] ? '✅' : '⚠️';
        console.log(`${hasValue} ${envKey}`);
    });

} catch (error) {
    console.error('❌ Erro durante a substituição:', error.message);
    process.exit(1);
} 