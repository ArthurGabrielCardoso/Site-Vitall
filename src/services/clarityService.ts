// Declaração de tipos para Microsoft Clarity
declare global {
    interface Window {
        clarity: {
            start(): void;
            stop(): void;
            identify(userId: string): void;
            set(key: string, value: string): void;
            event(name: string, data?: Record<string, any>): void;
            getSessionUrl(): string;
        };
    }
}

interface ClarityConfig {
    projectId: string;
    debug?: boolean;
    enableConsent?: boolean;
}

class ClarityService {
    private isInitialized = false;
    private projectId: string | null = null;
    private debug = false;

    // Inicializar Clarity via script tag
    initialize(config: ClarityConfig) {
        if (this.isInitialized) {
            console.warn('Clarity já foi inicializado');
            return;
        }

        this.projectId = config.projectId;
        this.debug = config.debug || false;

        try {
            // Criar script tag para Clarity
            const script = document.createElement('script');
            script.innerHTML = `
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${config.projectId}");
      `;
            document.head.appendChild(script);

            this.isInitialized = true;

            if (this.debug) {
                console.log('Microsoft Clarity inicializado com sucesso', {
                    projectId: config.projectId,
                    timestamp: new Date().toISOString(),
                });
            }
        } catch (error) {
            console.error('Erro ao inicializar Microsoft Clarity:', error);
        }
    }

    // Verificar se Clarity está ativo
    isActive(): boolean {
        return this.isInitialized && this.projectId !== null && typeof window.clarity !== 'undefined';
    }

    // Iniciar tracking baseado no consentimento
    startTracking() {
        if (!this.isInitialized) {
            console.warn('Clarity não foi inicializado. Chame initialize() primeiro.');
            return;
        }

        try {
            if (window.clarity) {
                window.clarity.start();
            } else {
                // Clarity ainda não carregou, tentar novamente em breve
                setTimeout(() => this.startTracking(), 1000);
            }

            if (this.debug) {
                console.log('Clarity tracking iniciado');
            }
        } catch (error) {
            console.error('Erro ao iniciar tracking do Clarity:', error);
        }
    }

    // Parar tracking
    stopTracking() {
        if (!this.isInitialized) {
            return;
        }

        try {
            if (window.clarity) {
                window.clarity.stop();
            }

            if (this.debug) {
                console.log('Clarity tracking pausado');
            }
        } catch (error) {
            console.error('Erro ao parar tracking do Clarity:', error);
        }
    }

    // Definir ID customizado do usuário
    setUserId(userId: string) {
        if (!this.isInitialized) {
            return;
        }

        try {
            if (window.clarity) {
                window.clarity.identify(userId);
            }

            if (this.debug) {
                console.log('Clarity user ID definido:', userId);
            }
        } catch (error) {
            console.error('Erro ao definir user ID no Clarity:', error);
        }
    }

    // Adicionar tags customizadas
    addTag(key: string, value: string) {
        if (!this.isInitialized) {
            return;
        }

        try {
            if (window.clarity) {
                window.clarity.set(key, value);
            }

            if (this.debug) {
                console.log('Clarity tag adicionada:', { key, value });
            }
        } catch (error) {
            console.error('Erro ao adicionar tag no Clarity:', error);
        }
    }

    // Evento customizado para procedimentos visualizados
    trackProcedureView(procedureName: string, timeSpent?: number) {
        if (!this.isInitialized) {
            return;
        }

        try {
            if (window.clarity) {
                window.clarity.event('procedure_view', {
                    procedure_name: procedureName,
                    time_spent: timeSpent,
                    page: window.location.pathname,
                    timestamp: Date.now(),
                });
            }

            if (this.debug) {
                console.log('Clarity procedure view tracked:', {
                    procedureName,
                    timeSpent,
                });
            }
        } catch (error) {
            console.error('Erro ao rastrear visualização de procedimento:', error);
        }
    }

    // Evento customizado para interesse em agendamento
    trackBookingInterest(procedureName?: string, source?: string) {
        if (!this.isInitialized) {
            return;
        }

        try {
            if (window.clarity) {
                window.clarity.event('booking_interest', {
                    procedure_name: procedureName || 'unknown',
                    source: source || 'unknown',
                    page: window.location.pathname,
                    timestamp: Date.now(),
                });
            }

            if (this.debug) {
                console.log('Clarity booking interest tracked:', {
                    procedureName,
                    source,
                });
            }
        } catch (error) {
            console.error('Erro ao rastrear interesse de agendamento:', error);
        }
    }

    // Evento customizado para conversões
    trackConversion(type: string, value?: number, procedureName?: string) {
        if (!this.isInitialized) {
            return;
        }

        try {
            if (window.clarity) {
                window.clarity.event('conversion', {
                    conversion_type: type,
                    value: value,
                    procedure_name: procedureName,
                    page: window.location.pathname,
                    timestamp: Date.now(),
                });
            }

            if (this.debug) {
                console.log('Clarity conversion tracked:', {
                    type,
                    value,
                    procedureName,
                });
            }
        } catch (error) {
            console.error('Erro ao rastrear conversão:', error);
        }
    }

    // Marcar área de interesse na página
    markRegionOfInterest(selector: string, name: string) {
        if (!this.isInitialized) {
            return;
        }

        try {
            const element = document.querySelector(selector);
            if (element && window.clarity) {
                window.clarity.set('region_of_interest', name);

                if (this.debug) {
                    console.log('Clarity region of interest marcada:', {
                        selector,
                        name,
                    });
                }
            }
        } catch (error) {
            console.error('Erro ao marcar região de interesse:', error);
        }
    }

    // Obter URL da sessão (para debug)
    getSessionUrl(): string | null {
        if (!this.isInitialized) {
            return null;
        }

        try {
            return window.clarity ? window.clarity.getSessionUrl() : null;
        } catch (error) {
            console.error('Erro ao obter URL da sessão:', error);
            return null;
        }
    }

    // Resetar (para compliance com GDPR)
    reset() {
        if (this.isInitialized) {
            try {
                if (window.clarity) {
                    window.clarity.stop();
                }
                this.isInitialized = false;
                this.projectId = null;

                if (this.debug) {
                    console.log('Clarity reset realizado');
                }
            } catch (error) {
                console.error('Erro ao fazer reset do Clarity:', error);
            }
        }
    }
}

// Instância singleton
export const clarityService = new ClarityService();

// Hook para usar o Clarity com consentimento
export const useClarityTracking = () => {
    const initializeWithConsent = (hasAnalyticsConsent: boolean) => {
        // Ler a variável de ambiente corretamente no Vite
        const projectId = import.meta.env.VITE_CLARITY_PROJECT_ID;

        if (!projectId) {
            console.warn('VITE_CLARITY_PROJECT_ID não encontrado nas variáveis de ambiente');
            return;
        }

        if (!hasAnalyticsConsent) {
            console.log('Analytics não autorizado - Clarity não será iniciado');
            return;
        }

        // Inicializar diretamente via script se ainda não foi feito
        if (!window.clarity && !document.querySelector('script[src*="clarity.ms"]')) {
            try {
                // Método mais direto de carregar o Clarity
                const script = document.createElement('script');
                script.type = 'text/javascript';
                script.innerHTML = `
                    (function(c,l,a,r,i,t,y){
                        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                    })(window, document, "clarity", "script", "${projectId}");
                `;
                document.head.appendChild(script);

                console.log('✅ Microsoft Clarity inicializado com Project ID:', projectId.substring(0, 8) + '...');
            } catch (error) {
                console.error('❌ Erro ao inicializar Clarity:', error);
            }
        }
    };

    // Métodos simplificados para eventos importantes
    const trackProcedure = (procedureName: string, timeSpent?: number) => {
        try {
            if (window.clarity) {
                window.clarity.event('procedure_view', {
                    procedure: procedureName,
                    time_spent: timeSpent || 0,
                    page: window.location.pathname
                });
            }
        } catch (error) {
            console.error('Erro no tracking de procedimento:', error);
        }
    };

    const trackBooking = (procedureName?: string, source?: string) => {
        try {
            if (window.clarity) {
                window.clarity.event('booking_attempt', {
                    procedure: procedureName || 'unknown',
                    source: source || 'website',
                    page: window.location.pathname
                });
            }
        } catch (error) {
            console.error('Erro no tracking de booking:', error);
        }
    };

    const trackConversion = (type: string, value?: number, procedureName?: string) => {
        try {
            if (window.clarity) {
                window.clarity.event('conversion', {
                    type,
                    value: value || 0,
                    procedure: procedureName || 'unknown',
                    page: window.location.pathname
                });
            }
        } catch (error) {
            console.error('Erro no tracking de conversão:', error);
        }
    };

    return {
        initializeWithConsent,
        trackProcedure,
        trackBooking,
        trackConversion
    };
}; 