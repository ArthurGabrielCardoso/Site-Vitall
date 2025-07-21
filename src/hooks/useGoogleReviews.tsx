import { useState, useEffect } from 'react';

interface GoogleReview {
    id: string;
    author_name: string;
    author_url?: string;
    profile_photo_url?: string;
    rating: number;
    relative_time_description: string;
    text: string;
    time: number;
}

interface GooglePlaceDetails {
    place_id: string;
    name: string;
    rating?: number;
    user_ratings_total?: number;
    reviews?: GoogleReview[];
}

interface UseGoogleReviewsResult {
    reviews: GoogleReview[];
    loading: boolean;
    error: string | null;
    placeDetails: GooglePlaceDetails | null;
}

// Reviews reais da clínica coletados do Google
const CLINICA_REVIEWS: GoogleReview[] = [
    {
        id: 'review-1',
        author_name: 'Maria Antônia Conti de Melo Santos',
        profile_photo_url: 'https://ui-avatars.com/api/?name=Maria+Antônia&background=0ea5e9&color=fff',
        rating: 5,
        relative_time_description: 'há 3 meses',
        text: 'Amei. As atendentes são super educadas e atenciosas. Faço tratamento com Dr Ana a mais de 20 anos. Nunca me deixou na mão. Atendimento excelente. Calma e atenciosa. Clínica muito confortável. Só agradeço por tudo que foi feito por mim.',
        time: Date.now() - 90 * 24 * 60 * 60 * 1000,
    },
    {
        id: 'review-2',
        author_name: 'Murilo Rodrigues',
        profile_photo_url: 'https://ui-avatars.com/api/?name=Murilo+Rodrigues&background=10b981&color=fff',
        rating: 5,
        relative_time_description: 'há 3 meses',
        text: 'Gostaria de expressar minha satisfação com o check-up odontológico. Fui muito bem atendido pela equipe, desde a recepção até o profissional que realiza o exame. Acho o processo detalhado e as explicações sobre minha saúde bucal claras e informativas. Obrigado pelo profissionalismo e cuidado!',
        time: Date.now() - 90 * 24 * 60 * 60 * 1000,
    },
    {
        id: 'review-3',
        author_name: 'Maria Aparecida Ouros',
        profile_photo_url: 'https://ui-avatars.com/api/?name=Maria+Aparecida&background=f59e0b&color=fff',
        rating: 5,
        relative_time_description: 'há 4 meses',
        text: 'Atendimento de excelência estendendo-se a todos os profissionais da clínica. Profissionais competentes, dedicados e de extrema confiança; passam segurança ao paciente trazendo tranquilidade e conforto em cada atendimento realizado. Super índico 😍',
        time: Date.now() - 120 * 24 * 60 * 60 * 1000,
    },
    {
        id: 'review-4',
        author_name: 'Adriana Morais',
        profile_photo_url: 'https://ui-avatars.com/api/?name=Adriana+Morais&background=8b5cf6&color=fff',
        rating: 5,
        relative_time_description: 'há 5 meses',
        text: 'Parabéns a dra Ana e toda sua Equipe de Profissionais pelo Excelente Atendimento. Tem minha total Recomendação porque são Maravilhosos no Atendimento e gostei muito do tratamento feito com tanto cuidado! E tem Ótima Localização. Eu Recomendo com certeza!',
        time: Date.now() - 150 * 24 * 60 * 60 * 1000,
    },
    {
        id: 'review-5',
        author_name: 'João Pereira',
        profile_photo_url: 'https://ui-avatars.com/api/?name=João+Pereira&background=ef4444&color=fff',
        rating: 5,
        relative_time_description: 'há 1 mês',
        text: 'Atendimento muito bom, assim como os profissionais e recepção muito atenciosos. Indico a clínica com a certeza que estarão bem atendidos.',
        time: Date.now() - 30 * 24 * 60 * 60 * 1000,
    },
    {
        id: 'review-6',
        author_name: 'Amanda Estética',
        profile_photo_url: 'https://ui-avatars.com/api/?name=Amanda&background=06b6d4&color=fff',
        rating: 5,
        relative_time_description: 'há 5 meses',
        text: 'A clínica é excelente, o espaço e todos os colaboradores! Dra Ana e Dr Pedro são uns amores, atendimento excelente além dos tratamentos serem ótimos! Super recomendo de olhos fechados, a equipe é sensacional!',
        time: Date.now() - 150 * 24 * 60 * 60 * 1000,
    },
    {
        id: 'review-7',
        author_name: 'Laura Targat',
        profile_photo_url: 'https://ui-avatars.com/api/?name=Laura+Targat&background=84cc16&color=fff',
        rating: 5,
        relative_time_description: 'há 3 meses',
        text: 'Atendimento maravilhoso, desde a recepção até o atendimento com as Doutoras. As meninas da recepção são muito solícitas. As dentistas muito competentes e atenciosas.',
        time: Date.now() - 90 * 24 * 60 * 60 * 1000,
    },
    {
        id: 'review-8',
        author_name: 'Vivian Santos',
        profile_photo_url: 'https://ui-avatars.com/api/?name=Vivian+Santos&background=ec4899&color=fff',
        rating: 5,
        relative_time_description: 'há 5 meses',
        text: 'O que eu senti foi o amor neste lugar. Desde as recepcionistas às doutoras. E servem um cappuccino delicioso na espera do atendimento. Não só eu vou mas minha mãe, irmãs e cunhados.',
        time: Date.now() - 150 * 24 * 60 * 60 * 1000,
    },
    {
        id: 'review-9',
        author_name: 'Vanessa Ferreira Tavares Souza',
        profile_photo_url: 'https://ui-avatars.com/api/?name=Vanessa+Ferreira&background=a855f7&color=fff',
        rating: 5,
        relative_time_description: 'há 5 meses',
        text: 'Dra Ana e sua equipe são excelentes. Tecnologia de ponta e atendimento humanizado. Atendimento impecável.',
        time: Date.now() - 150 * 24 * 60 * 60 * 1000,
    },
    {
        id: 'review-10',
        author_name: 'Rosana Eloisa Cardoso Oliveira',
        profile_photo_url: 'https://ui-avatars.com/api/?name=Rosana+Eloisa&background=f97316&color=fff',
        rating: 5,
        relative_time_description: 'há 5 meses',
        text: 'De excelência! Equipe que mostra compromisso, respeito, confiança e todos os cuidados necessários. Super recomendo!!',
        time: Date.now() - 150 * 24 * 60 * 60 * 1000,
    },
];

// Configurações da API
const GOOGLE_PLACES_CONFIG = {
    apiKey: import.meta.env.VITE_GOOGLE_PLACES_API_KEY,
    placeId: import.meta.env.VITE_GOOGLE_PLACE_ID || 'ChIJa5cFGIbZzZQRcmhWy6aOVQk',
};

export function useGoogleReviews(): UseGoogleReviewsResult {
    const [reviews, setReviews] = useState<GoogleReview[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [placeDetails, setPlaceDetails] = useState<GooglePlaceDetails | null>(null);

    useEffect(() => {
        initializeReviews();
    }, []);

    const initializeReviews = async () => {
        try {
            setLoading(true);
            setError(null);

            console.log('📍 Carregando reviews da clínica odontológica...');

            // Tentar buscar reviews reais do Google se API key estiver disponível
            if (GOOGLE_PLACES_CONFIG.apiKey && GOOGLE_PLACES_CONFIG.placeId) {
                console.log('🔑 API Key detectada, tentando buscar reviews reais...');

                try {
                    // NOTA: Google Places API tem CORS restrictions
                    // Para produção, você precisa de um backend proxy ou usar Google Places Service do Maps JS API
                    const proxyUrl = `/api/google-places/details?place_id=${GOOGLE_PLACES_CONFIG.placeId}&fields=name,rating,user_ratings_total,reviews&key=${GOOGLE_PLACES_CONFIG.apiKey}`;

                    const response = await fetch(proxyUrl);

                    if (response.ok) {
                        const data = await response.json();
                        if (data.result) {
                            console.log('✅ Reviews reais carregados do Google!');
                            setPlaceDetails(data.result);
                            setReviews(data.result.reviews || []);
                            return;
                        }
                    }
                } catch (apiError) {
                    console.log('⚠️ Não foi possível conectar à API do Google, usando reviews locais');
                }
            }

            // Fallback para reviews reais coletados do Google
            console.log('📋 Usando reviews reais coletados do Google');
            const localPlaceDetails: GooglePlaceDetails = {
                place_id: GOOGLE_PLACES_CONFIG.placeId,
                name: 'VitallCheck-Up - Clínica Odontológica',
                rating: 5.0,
                user_ratings_total: 52,
                reviews: CLINICA_REVIEWS,
            };

            setPlaceDetails(localPlaceDetails);
            setReviews(CLINICA_REVIEWS);

            console.log('✅ Reviews reais carregados:', CLINICA_REVIEWS.length);
        } catch (err) {
            console.error('❌ Erro ao carregar reviews:', err);
            setError('Erro ao carregar depoimentos');
        } finally {
            setLoading(false);
        }
    };

    return {
        reviews,
        loading,
        error,
        placeDetails,
    };
}

// Função para converter Google Review para formato local
export function convertGoogleReviewToLocal(googleReview: GoogleReview, index: number) {
    return {
        id: index + 1,
        name: googleReview.author_name,
        location: 'Paciente VitallCheck-Up',
        avatar: googleReview.profile_photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(googleReview.author_name)}&background=0ea5e9&color=fff`,
        content: googleReview.text,
        rating: googleReview.rating,
        date: googleReview.relative_time_description,
        googleUrl: googleReview.author_url,
    };
}

export default useGoogleReviews; 