export interface Procedimento {
    id: string;
    nome: string;
    descricao: string;
    imagem: string; // Caminho para a imagem em /procedimentos/
    preco: string;
    categoria: 'estetica' | 'terapeutico';
    beneficios: string[];
}

export const PROCEDIMENTOS: Procedimento[] = [
    // ✅ TODOS OS PROCEDIMENTOS COM FOTOS REAIS
    {
        id: 'limpeza-dental',
        nome: 'Limpeza Dental Profissional',
        descricao: 'Remoção de tártaro e placa bacteriana com equipamentos especializados',
        imagem: '/procedimentos/Limpeza.jpeg',
        preco: 'A partir de R$ 120',
        categoria: 'terapeutico',
        beneficios: ['Remove tártaro', 'Previne doenças', 'Hálito fresco']
    },
    {
        id: 'clareamento-dental',
        nome: 'Clareamento Dental',
        descricao: 'Clareamento profissional para dentes mais brancos e brilhantes',
        imagem: '/procedimentos/Clareamento.jpeg',
        preco: 'A partir de R$ 400',
        categoria: 'estetica',
        beneficios: ['Dentes mais brancos', 'Autoestima elevada', 'Sorriso radiante']
    },
    {
        id: 'implantes-dentarios',
        nome: 'Implantes Dentários',
        descricao: 'Substituição de dentes perdidos com implantes de titânio',
        imagem: '/procedimentos/Implantes.jpeg',
        preco: 'A partir de R$ 1.200',
        categoria: 'terapeutico',
        beneficios: ['Função mastigatória', 'Estética natural', 'Durabilidade']
    },
    {
        id: 'ortodontia',
        nome: 'Ortodontia Tradicional',
        descricao: 'Correção do posicionamento dos dentes e mordida com aparelhos fixos',
        imagem: '/procedimentos/Ortodontia.jpeg',
        preco: 'A partir de R$ 300/mês',
        categoria: 'terapeutico',
        beneficios: ['Dentes alinhados', 'Mordida correta', 'Sorriso perfeito']
    },
    {
        id: 'alinhador-invisivel',
        nome: 'Alinhador Invisível',
        descricao: 'Tratamento ortodôntico discreto com alinhadores transparentes removíveis',
        imagem: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=800&h=600&fit=crop',
        preco: 'A partir de R$ 500/mês',
        categoria: 'estetica',
        beneficios: ['Invisível', 'Removível', 'Confortável', 'Discreto']
    },
    {
        id: 'canal',
        nome: 'Tratamento de Canal',
        descricao: 'Tratamento endodôntico para salvar dentes comprometidos',
        imagem: '/procedimentos/Canal.jpeg',
        preco: 'A partir de R$ 600',
        categoria: 'terapeutico',
        beneficios: ['Salva o dente', 'Remove dor', 'Evita extração']
    },
    {
        id: 'extracao',
        nome: 'Extração Dentária',
        descricao: 'Remoção de dentes comprometidos ou sisos com técnicas modernas',
        imagem: '/procedimentos/Extração.jpeg',
        preco: 'A partir de R$ 150',
        categoria: 'terapeutico',
        beneficios: ['Remove dor', 'Previne infecções', 'Procedimento seguro']
    },
    {
        id: 'facetas',
        nome: 'Facetas de Porcelana',
        descricao: 'Lâminas ultrafinas para transformar o sorriso',
        imagem: '/procedimentos/Faceta.jpeg',
        preco: 'A partir de R$ 800/dente',
        categoria: 'estetica',
        beneficios: ['Sorriso perfeito', 'Cor ideal', 'Formato harmonioso']
    },
    {
        id: 'protese',
        nome: 'Próteses Dentárias',
        descricao: 'Próteses fixas e removíveis para substituir dentes perdidos',
        imagem: '/procedimentos/Protese.jpeg',
        preco: 'A partir de R$ 500',
        categoria: 'terapeutico',
        beneficios: ['Substitui dentes', 'Função mastigatória', 'Estética natural']
    },
    {
        id: 'restauracao',
        nome: 'Restauração Dentária',
        descricao: 'Reparo de dentes com cáries ou fraturas usando materiais modernos',
        imagem: '/procedimentos/Restauração.jpeg',
        preco: 'A partir de R$ 80',
        categoria: 'terapeutico',
        beneficios: ['Repara o dente', 'Remove cárie', 'Cor natural']
    },
    {
        id: 'periodoncia',
        nome: 'Tratamento Periodontal',
        descricao: 'Tratamento especializado de gengivas e tecidos de suporte',
        imagem: '/procedimentos/Periodontal.jpeg',
        preco: 'A partir de R$ 200',
        categoria: 'terapeutico',
        beneficios: ['Gengivas saudáveis', 'Remove tártaro profundo', 'Previne perda óssea']
    }
]; 