import { useEffect, useRef, useState } from 'react';
import { useCookieConsent } from './useCookieConsent';

export interface UserInteraction {
    id: string;
    timestamp: number;
    type: 'click' | 'scroll' | 'hover' | 'form_interaction' | 'page_view' | 'procedure_view';
    elementId?: string;
    elementType?: string;
    elementText?: string;
    scrollDepth?: number;
    timeSpent?: number;
    page: string;
    procedureName?: string;
    coordinates?: { x: number; y: number };
}

export interface UserSession {
    sessionId: string;
    startTime: number;
    endTime?: number;
    interactions: UserInteraction[];
    userId?: string;
    deviceInfo: {
        userAgent: string;
        screenWidth: number;
        screenHeight: number;
        viewport: { width: number; height: number };
    };
}

export interface ProcedureInterest {
    procedureName: string;
    viewCount: number;
    totalTimeSpent: number;
    maxScrollDepth: number;
    lastViewed: number;
    interactionScore: number;
}

const STORAGE_KEYS = {
    SESSION: 'vitall-user-session',
    INTERACTIONS: 'vitall-user-interactions',
    PROCEDURE_INTERESTS: 'vitall-procedure-interests',
    SESSION_START: 'vitall-session-start',
};

export const useBehaviorTracking = () => {
    const { preferences, hasConsent } = useCookieConsent();
    const [currentSession, setCurrentSession] = useState<UserSession | null>(null);
    const [procedureInterests, setProcedureInterests] = useState<Record<string, ProcedureInterest>>({});
    const pageStartTime = useRef<number>(Date.now());
    const scrollDepthRef = useRef<number>(0);
    const isTrackingEnabled = hasConsent && preferences.personalization;

    // Gerar ID único para sessão
    const generateSessionId = () => {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    };

    // Gerar ID único para interação
    const generateInteractionId = () => {
        return `interaction_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    };

    // Obter informações do dispositivo
    const getDeviceInfo = () => ({
        userAgent: navigator.userAgent,
        screenWidth: screen.width,
        screenHeight: screen.height,
        viewport: {
            width: window.innerWidth,
            height: window.innerHeight,
        },
    });

    // Inicializar sessão
    useEffect(() => {
        if (!isTrackingEnabled) return;

        const sessionId = generateSessionId();
        const newSession: UserSession = {
            sessionId,
            startTime: Date.now(),
            interactions: [],
            deviceInfo: getDeviceInfo(),
        };

        setCurrentSession(newSession);
        localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(newSession));
        localStorage.setItem(STORAGE_KEYS.SESSION_START, Date.now().toString());

        // Carregar interesses de procedimentos existentes
        try {
            const savedInterests = localStorage.getItem(STORAGE_KEYS.PROCEDURE_INTERESTS);
            if (savedInterests) {
                setProcedureInterests(JSON.parse(savedInterests));
            }
        } catch (error) {
            console.error('Erro ao carregar interesses de procedimentos:', error);
        }

        return () => {
            // Finalizar sessão
            if (newSession) {
                const endTime = Date.now();
                const updatedSession = { ...newSession, endTime };
                localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(updatedSession));
            }
        };
    }, [isTrackingEnabled]);

    // Adicionar interação
    const addInteraction = (interaction: Omit<UserInteraction, 'id' | 'timestamp' | 'page'>) => {
        if (!isTrackingEnabled || !currentSession) return;

        const newInteraction: UserInteraction = {
            ...interaction,
            id: generateInteractionId(),
            timestamp: Date.now(),
            page: window.location.pathname,
        };

        const updatedSession = {
            ...currentSession,
            interactions: [...currentSession.interactions, newInteraction],
        };

        setCurrentSession(updatedSession);
        localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(updatedSession));

        // Salvar também no array separado para análise
        try {
            const existingInteractions = JSON.parse(
                localStorage.getItem(STORAGE_KEYS.INTERACTIONS) || '[]'
            );
            existingInteractions.push(newInteraction);

            // Manter apenas as últimas 1000 interações
            if (existingInteractions.length > 1000) {
                existingInteractions.splice(0, existingInteractions.length - 1000);
            }

            localStorage.setItem(STORAGE_KEYS.INTERACTIONS, JSON.stringify(existingInteractions));
        } catch (error) {
            console.error('Erro ao salvar interações:', error);
        }
    };

    // Tracking de visualização de página
    const trackPageView = (pagePath?: string) => {
        pageStartTime.current = Date.now();
        scrollDepthRef.current = 0;

        addInteraction({
            type: 'page_view',
            elementId: pagePath || window.location.pathname,
        });
    };

    // Tracking de cliques
    const trackClick = (element: HTMLElement, coordinates?: { x: number; y: number }) => {
        addInteraction({
            type: 'click',
            elementId: element.id || undefined,
            elementType: element.tagName.toLowerCase(),
            elementText: element.textContent?.substring(0, 100) || undefined,
            coordinates,
        });
    };

    // Tracking de visualização de procedimento
    const trackProcedureView = (procedureName: string) => {
        const currentTime = Date.now();
        const timeSpent = currentTime - pageStartTime.current;

        addInteraction({
            type: 'procedure_view',
            procedureName,
            timeSpent,
            scrollDepth: scrollDepthRef.current,
        });

        // Atualizar interesses em procedimentos
        const updatedInterests = { ...procedureInterests };

        if (!updatedInterests[procedureName]) {
            updatedInterests[procedureName] = {
                procedureName,
                viewCount: 0,
                totalTimeSpent: 0,
                maxScrollDepth: 0,
                lastViewed: 0,
                interactionScore: 0,
            };
        }

        const interest = updatedInterests[procedureName];
        interest.viewCount += 1;
        interest.totalTimeSpent += timeSpent;
        interest.maxScrollDepth = Math.max(interest.maxScrollDepth, scrollDepthRef.current);
        interest.lastViewed = currentTime;

        // Calcular score de interesse (0-100)
        const timeScore = Math.min(timeSpent / 60000, 1) * 30; // Até 30 pontos para 1 minuto
        const scrollScore = scrollDepthRef.current * 0.4; // Até 40 pontos para scroll completo
        const viewScore = Math.min(interest.viewCount * 5, 30); // Até 30 pontos para visualizações

        interest.interactionScore = Math.round(timeScore + scrollScore + viewScore);

        setProcedureInterests(updatedInterests);
        localStorage.setItem(STORAGE_KEYS.PROCEDURE_INTERESTS, JSON.stringify(updatedInterests));
    };

    // Tracking de scroll
    const trackScroll = (scrollDepth: number) => {
        scrollDepthRef.current = Math.max(scrollDepthRef.current, scrollDepth);

        // Tracking apenas em marcos importantes (25%, 50%, 75%, 100%)
        const milestones = [25, 50, 75, 100];
        const currentMilestone = milestones.find(
            milestone => scrollDepth >= milestone && scrollDepthRef.current < milestone
        );

        if (currentMilestone) {
            addInteraction({
                type: 'scroll',
                scrollDepth: currentMilestone,
            });
        }
    };

    // Tracking de hover (para elementos importantes)
    const trackHover = (element: HTMLElement, duration: number) => {
        if (duration > 1000) { // Apenas hovers longos (>1s)
            addInteraction({
                type: 'hover',
                elementId: element.id || undefined,
                elementType: element.tagName.toLowerCase(),
                elementText: element.textContent?.substring(0, 50) || undefined,
                timeSpent: duration,
            });
        }
    };

    // Tracking de interação com formulários
    const trackFormInteraction = (formId: string, fieldName: string, action: string) => {
        addInteraction({
            type: 'form_interaction',
            elementId: formId,
            elementType: 'form',
            elementText: `${fieldName}: ${action}`,
        });
    };

    // Obter dados de análise
    const getAnalyticsData = () => {
        try {
            const allInteractions = JSON.parse(
                localStorage.getItem(STORAGE_KEYS.INTERACTIONS) || '[]'
            );

            return {
                currentSession,
                allInteractions,
                procedureInterests,
                stats: {
                    totalInteractions: allInteractions.length,
                    sessionDuration: currentSession ? Date.now() - currentSession.startTime : 0,
                    topProcedures: Object.values(procedureInterests)
                        .sort((a, b) => b.interactionScore - a.interactionScore)
                        .slice(0, 5),
                },
            };
        } catch (error) {
            console.error('Erro ao obter dados de análise:', error);
            return null;
        }
    };

    // Limpar dados (GDPR compliance)
    const clearTrackingData = () => {
        Object.values(STORAGE_KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
        setCurrentSession(null);
        setProcedureInterests({});
    };

    return {
        isTrackingEnabled,
        currentSession,
        procedureInterests,
        trackPageView,
        trackClick,
        trackProcedureView,
        trackScroll,
        trackHover,
        trackFormInteraction,
        getAnalyticsData,
        clearTrackingData,
    };
}; 