import { useEffect } from 'react';
import { useCookieConsent } from './useCookieConsent';
import { useClarityTracking } from '@/services/clarityService';

export const useTrackingIntegration = () => {
    const { hasConsent, preferences } = useCookieConsent();
    const {
        initializeWithConsent,
        trackProcedure,
        trackBooking,
        trackConversion
    } = useClarityTracking();

    // Inicializar Clarity apenas uma vez quando há consentimento
    useEffect(() => {
        if (hasConsent && preferences.analytics) {
            initializeWithConsent(true);
        }
    }, [hasConsent, preferences.analytics, initializeWithConsent]);

    // Auto-tracking de cliques para agendamentos (simplificado)
    useEffect(() => {
        if (!hasConsent || !preferences.analytics) return;

        const handleClick = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target) return;

            // Track apenas clicks importantes: botões de agendamento
            const isBookingButton = target.textContent?.toLowerCase().includes('agendar') ||
                target.textContent?.toLowerCase().includes('whatsapp') ||
                target.closest('[data-booking-button]') ||
                target.closest('a[href*="whatsapp"]');

            if (isBookingButton) {
                // Determinar procedimento baseado na página
                const path = window.location.pathname;
                let procedureName = 'unknown';

                if (path.includes('botox')) procedureName = 'Botox';
                else if (path.includes('harmonizacao')) procedureName = 'Harmonização Facial';
                else if (path.includes('preenchimento')) procedureName = 'Preenchimento';
                else if (path.includes('procedimentos')) procedureName = 'Procedimentos Gerais';

                trackBooking(procedureName, 'website');
            }
        };

        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, [hasConsent, preferences.analytics, trackBooking]);

    // Helper para tracking manual de procedimentos (para uso em componentes específicos)
    const trackProcedureInterest = (procedureName: string, timeSpent?: number) => {
        if (hasConsent && preferences.analytics) {
            trackProcedure(procedureName, timeSpent);
        }
    };

    // Helper para tracking de conversões
    const trackConversionEvent = (type: string, value?: number, procedureName?: string) => {
        if (hasConsent && preferences.analytics) {
            trackConversion(type, value, procedureName);
        }
    };

    // Helper para tracking de formulários
    const trackFormSubmission = (formType: string, procedureName?: string) => {
        if (hasConsent && preferences.analytics) {
            trackConversion('form_submission', undefined, procedureName);
        }
    };

    return {
        // Status simplificado
        hasAnalyticsConsent: hasConsent && preferences.analytics,
        hasPersonalizationConsent: hasConsent && preferences.personalization,

        // Métodos para uso manual
        trackProcedureInterest,
        trackConversionEvent,
        trackFormSubmission,

        // Status de tracking
        trackingStatus: {
            clarityTracking: hasConsent && preferences.analytics,
            cookieConsent: hasConsent,
        }
    };
}; 