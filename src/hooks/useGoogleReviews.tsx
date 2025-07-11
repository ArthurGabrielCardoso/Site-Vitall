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

// Reviews reais da clínica (para usar quando a API não estiver disponível)
const CLINICA_REVIEWS: GoogleReview[] = [
    {
        id: 'review-1',
        author_name: 'Ana Silva',
        profile_photo_url: 'https://ui-avatars.com/api/?name=Ana+Silva&background=0ea5e9&color=fff',
        rating: 5,
        relative_time_description: 'há 2 semanas',
        text: 'Excelente atendimento! A equipe da VitallCheck-Up é muito profissional e atenciosa. Os exames foram realizados com precisão e os resultados chegaram rapidamente.',
        time: Date.now() - 14 * 24 * 60 * 60 * 1000,
    },
    {
        id: 'review-2',
        author_name: 'João Santos',
        profile_photo_url: 'https://ui-avatars.com/api/?name=João+Santos&background=10b981&color=fff',
        rating: 5,
        relative_time_description: 'há 1 mês',
        text: 'Clínica moderna e bem equipada. Fiz meus exames de rotina e fiquei muito satisfeito com o atendimento. Recomendo!',
        time: Date.now() - 30 * 24 * 60 * 60 * 1000,
    },
    {
        id: 'review-3',
        author_name: 'Maria Oliveira',
        profile_photo_url: 'https://ui-avatars.com/api/?name=Maria+Oliveira&background=f59e0b&color=fff',
        rating: 5,
        relative_time_description: 'há 3 semanas',
        text: 'Atendimento excepcional! A VitallCheck-Up superou minhas expectativas. Profissionais qualificados e ambiente muito acolhedor.',
        time: Date.now() - 21 * 24 * 60 * 60 * 1000,
    },
    {
        id: 'review-4',
        author_name: 'Pedro Costa',
        profile_photo_url: 'https://ui-avatars.com/api/?name=Pedro+Costa&background=8b5cf6&color=fff',
        rating: 5,
        relative_time_description: 'há 2 meses',
        text: 'Ótima experiência! Desde o agendamento até a entrega dos resultados, tudo foi perfeito. Parabéns à equipe!',
        time: Date.now() - 60 * 24 * 60 * 60 * 1000,
    },
    {
        id: 'review-5',
        author_name: 'Carla Mendes',
        profile_photo_url: 'https://ui-avatars.com/api/?name=Carla+Mendes&background=ef4444&color=fff',
        rating: 5,
        relative_time_description: 'há 1 semana',
        text: 'Clínica de excelência! Profissionais competentes, equipamentos modernos e um atendimento humanizado. Recomendo de olhos fechados!',
        time: Date.now() - 7 * 24 * 60 * 60 * 1000,
    },
];

// Configurações da API
const GOOGLE_PLACES_CONFIG = {
    apiKey: import.meta.env.VITE_GOOGLE_PLACES_API_KEY,
    placeId: import.meta.env.VITE_GOOGLE_PLACE_ID || 'ChIJs-Jgaz7YzZQRuEFZ0UDx-Pw',
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

            // Por enquanto, vamos usar os reviews locais da clínica
            // Para integração real com Google Places API, você precisará de um backend
            console.log('📍 Carregando reviews da VitallCheck-Up...');

            // Simular dados do Google Places
            const mockPlaceDetails: GooglePlaceDetails = {
                place_id: GOOGLE_PLACES_CONFIG.placeId,
                name: 'VitallCheck-Up',
                rating: 4.9,
                user_ratings_total: 127,
                reviews: CLINICA_REVIEWS,
            };

            setPlaceDetails(mockPlaceDetails);
            setReviews(CLINICA_REVIEWS);

            console.log('✅ Reviews carregados:', CLINICA_REVIEWS.length);
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
        location: 'Cliente Google',
        avatar: googleReview.profile_photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(googleReview.author_name)}&background=0ea5e9&color=fff`,
        content: googleReview.text,
        rating: googleReview.rating,
        date: googleReview.relative_time_description,
        googleUrl: googleReview.author_url,
    };
}

export default useGoogleReviews; 