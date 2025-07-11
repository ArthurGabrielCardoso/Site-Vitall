/**
 * Biblioteca de cálculo de tempo de leitura para frontend
 * Compatível com browser, sem dependências Node.js
 */

interface ReadingTimeResult {
    text: string;
    minutes: number;
    time: number;
    words: number;
}

interface ReadingTimeOptions {
    wordsPerMinute?: number;
    language?: 'pt' | 'en';
}

/**
 * Calcula o tempo estimado de leitura para um texto
 * @param content - Conteúdo do post (pode incluir HTML)
 * @param options - Opções de configuração
 * @returns Objeto com informações de tempo de leitura
 */
export function calculateReadingTime(
    content: string,
    options: ReadingTimeOptions = {}
): ReadingTimeResult {
    const { wordsPerMinute = 250, language = 'pt' } = options;

    // Remove tags HTML e caracteres especiais
    const textContent = content
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/\s+/g, ' ') // Normaliza espaços
        .trim();

    // Conta palavras de forma mais precisa para português
    const words = countWords(textContent);

    // Calcula tempo em minutos
    const minutes = Math.max(1, Math.ceil(words / wordsPerMinute));

    // Tempo em millisegundos
    const time = minutes * 60 * 1000;

    // Formata texto baseado no idioma
    const text = formatReadingTimeText(minutes, language);

    return {
        text,
        minutes,
        time,
        words
    };
}

/**
 * Conta palavras de forma inteligente
 * @param text - Texto limpo
 * @returns Número de palavras
 */
function countWords(text: string): number {
    if (!text || text.trim().length === 0) {
        return 0;
    }

    // Remove pontuação e divide por espaços
    const cleanText = text
        .replace(/[^\w\sÀ-ÿ]/g, ' ') // Mantém acentos português
        .replace(/\s+/g, ' ')
        .trim();

    if (!cleanText) {
        return 0;
    }

    // Divide por espaços e filtra palavras válidas
    const words = cleanText
        .split(' ')
        .filter(word => word.length > 0);

    return words.length;
}

/**
 * Formata o texto de tempo de leitura
 * @param minutes - Minutos de leitura
 * @param language - Idioma
 * @returns Texto formatado
 */
function formatReadingTimeText(minutes: number, language: 'pt' | 'en'): string {
    if (language === 'en') {
        return minutes === 1 ? '1 min read' : `${minutes} min read`;
    }

    // Português
    if (minutes === 1) {
        return '1 min de leitura';
    }

    return `${minutes} min de leitura`;
}

/**
 * Formata o tempo de leitura para exibição
 * @param content - Conteúdo do post
 * @param options - Opções de configuração
 * @returns String formatada com tempo de leitura
 */
export function formatReadingTime(
    content: string,
    options: ReadingTimeOptions = {}
): string {
    if (!content || content.trim().length === 0) {
        return '1 min de leitura';
    }

    const stats = calculateReadingTime(content, options);
    return stats.text;
}

/**
 * Estima tempo de leitura baseado em diferentes tipos de conteúdo
 * @param content - Conteúdo
 * @param contentType - Tipo de conteúdo
 * @returns Resultado detalhado
 */
export function estimateReadingTime(
    content: string,
    contentType: 'article' | 'technical' | 'casual' = 'article'
): ReadingTimeResult {
    // Ajusta velocidade baseado no tipo de conteúdo
    const speedMap = {
        article: 250,    // Artigos normais
        technical: 200,  // Conteúdo técnico (mais lento)
        casual: 300      // Conteúdo casual (mais rápido)
    };

    const wordsPerMinute = speedMap[contentType];

    return calculateReadingTime(content, { wordsPerMinute });
}

/**
 * Calcula estatísticas detalhadas do texto
 * @param content - Conteúdo
 * @returns Estatísticas completas
 */
export function getTextStatistics(content: string) {
    const textContent = content.replace(/<[^>]*>/g, '').trim();
    const words = countWords(textContent);
    const characters = textContent.length;
    const charactersNoSpaces = textContent.replace(/\s/g, '').length;
    const paragraphs = textContent.split(/\n\s*\n/).filter(p => p.trim()).length;
    const sentences = textContent.split(/[.!?]+/).filter(s => s.trim()).length;

    // Diferentes estimativas de tempo
    const readingTimes = {
        fast: calculateReadingTime(content, { wordsPerMinute: 300 }),
        average: calculateReadingTime(content, { wordsPerMinute: 250 }),
        slow: calculateReadingTime(content, { wordsPerMinute: 200 })
    };

    return {
        words,
        characters,
        charactersNoSpaces,
        paragraphs,
        sentences,
        readingTimes,
        averageWordsPerSentence: Math.round(words / Math.max(1, sentences)),
        averageWordsPerParagraph: Math.round(words / Math.max(1, paragraphs))
    };
}

/**
 * Valida se o conteúdo tem tamanho adequado para um post
 * @param content - Conteúdo
 * @returns Validação e sugestões
 */
export function validateContentLength(content: string) {
    const stats = getTextStatistics(content);
    const { words } = stats;

    let status: 'too-short' | 'short' | 'good' | 'long' | 'too-long';
    let message: string;
    let suggestions: string[] = [];

    if (words < 100) {
        status = 'too-short';
        message = 'Conteúdo muito curto para um artigo de blog';
        suggestions = [
            'Adicione mais detalhes e exemplos',
            'Desenvolva melhor os tópicos principais',
            'Inclua uma introdução e conclusão mais elaboradas'
        ];
    } else if (words < 300) {
        status = 'short';
        message = 'Conteúdo um pouco curto, mas aceitável';
        suggestions = [
            'Considere adicionar mais exemplos',
            'Pode incluir mais dicas práticas'
        ];
    } else if (words <= 1500) {
        status = 'good';
        message = 'Tamanho ideal para um artigo de blog';
        suggestions = [];
    } else if (words <= 2500) {
        status = 'long';
        message = 'Artigo longo, mas ainda engajante';
        suggestions = [
            'Considere dividir em subtópicos',
            'Use listas e formatação para facilitar a leitura'
        ];
    } else {
        status = 'too-long';
        message = 'Artigo muito longo, pode perder engagement';
        suggestions = [
            'Considere dividir em múltiplos posts',
            'Remova informações menos relevantes',
            'Foque nos pontos principais'
        ];
    }

    return {
        status,
        message,
        suggestions,
        words,
        readingTime: stats.readingTimes.average
    };
}

export default {
    calculateReadingTime,
    formatReadingTime,
    estimateReadingTime,
    getTextStatistics,
    validateContentLength
}; 