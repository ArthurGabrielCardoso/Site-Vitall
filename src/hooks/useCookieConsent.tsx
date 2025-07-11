import { useState, useEffect } from 'react';

export interface CookiePreferences {
    essential: boolean;
    analytics: boolean;
    personalization: boolean;
    marketing: boolean;
}

export interface CookieConsentState {
    hasConsent: boolean;
    showBanner: boolean;
    preferences: CookiePreferences;
}

const DEFAULT_PREFERENCES: CookiePreferences = {
    essential: true, // Sempre habilitado
    analytics: false,
    personalization: false,
    marketing: false,
};

const COOKIE_CONSENT_KEY = 'vitall-cookie-consent';
const COOKIE_PREFERENCES_KEY = 'vitall-cookie-preferences';

export const useCookieConsent = () => {
    const [consentState, setConsentState] = useState<CookieConsentState>({
        hasConsent: false,
        showBanner: true,
        preferences: DEFAULT_PREFERENCES,
    });

    // Verificar consentimento existente no localStorage
    useEffect(() => {
        try {
            const savedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
            const savedPreferences = localStorage.getItem(COOKIE_PREFERENCES_KEY);

            if (savedConsent === 'true' && savedPreferences) {
                const preferences = JSON.parse(savedPreferences);
                setConsentState({
                    hasConsent: true,
                    showBanner: false,
                    preferences: { ...DEFAULT_PREFERENCES, ...preferences },
                });
            }
        } catch (error) {
            console.error('Erro ao carregar consentimento de cookies:', error);
        }
    }, []);

    // Aceitar todos os cookies
    const acceptAllCookies = () => {
        const allAcceptedPreferences: CookiePreferences = {
            essential: true,
            analytics: true,
            personalization: true,
            marketing: true,
        };

        saveConsent(allAcceptedPreferences);
    };

    // Aceitar apenas cookies essenciais
    const acceptEssentialOnly = () => {
        saveConsent(DEFAULT_PREFERENCES);
    };

    // Salvar preferências customizadas
    const saveCustomPreferences = (preferences: Partial<CookiePreferences>) => {
        const updatedPreferences = {
            ...DEFAULT_PREFERENCES,
            ...preferences,
        };
        saveConsent(updatedPreferences);
    };

    // Salvar consentimento no localStorage
    const saveConsent = (preferences: CookiePreferences) => {
        try {
            localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
            localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(preferences));

            setConsentState({
                hasConsent: true,
                showBanner: false,
                preferences,
            });

            // Trigger event para outros sistemas
            window.dispatchEvent(new CustomEvent('cookieConsentChanged', {
                detail: preferences
            }));
        } catch (error) {
            console.error('Erro ao salvar consentimento de cookies:', error);
        }
    };

    // Resetar consentimento (para desenvolvimento)
    const resetConsent = () => {
        try {
            localStorage.removeItem(COOKIE_CONSENT_KEY);
            localStorage.removeItem(COOKIE_PREFERENCES_KEY);

            setConsentState({
                hasConsent: false,
                showBanner: true,
                preferences: DEFAULT_PREFERENCES,
            });
        } catch (error) {
            console.error('Erro ao resetar consentimento:', error);
        }
    };

    return {
        ...consentState,
        acceptAllCookies,
        acceptEssentialOnly,
        saveCustomPreferences,
        resetConsent,
    };
}; 