import React, { useState } from 'react';
import { X, Cookie, Settings, Shield, BarChart3, Target, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useCookieConsent, CookiePreferences } from '@/hooks/useCookieConsent';

export const CookieBanner: React.FC = () => {
    const {
        showBanner,
        preferences,
        acceptAllCookies,
        acceptEssentialOnly,
        saveCustomPreferences,
    } = useCookieConsent();

    const [showSettings, setShowSettings] = useState(false);
    const [customPreferences, setCustomPreferences] = useState<CookiePreferences>(preferences);

    if (!showBanner) return null;

    const handleCustomSave = () => {
        saveCustomPreferences(customPreferences);
        setShowSettings(false);
    };

    const togglePreference = (key: keyof CookiePreferences) => {
        if (key === 'essential') return; // Essenciais sempre habilitados

        setCustomPreferences(prev => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const cookieTypes = [
        {
            key: 'essential' as keyof CookiePreferences,
            icon: Shield,
            title: 'Cookies Essenciais',
            description: 'Necessários para o funcionamento básico do site. Não podem ser desabilitados.',
            required: true,
        },
        {
            key: 'analytics' as keyof CookiePreferences,
            icon: BarChart3,
            title: 'Cookies de Análise',
            description: 'Nos ajudam a entender como você usa o site para melhorar sua experiência.',
            required: false,
        },
        {
            key: 'personalization' as keyof CookiePreferences,
            icon: Heart,
            title: 'Cookies de Personalização',
            description: 'Personalizam o conteúdo baseado nos seus interesses em procedimentos.',
            required: false,
        },
        {
            key: 'marketing' as keyof CookiePreferences,
            icon: Target,
            title: 'Cookies de Marketing',
            description: 'Utilizados para mostrar anúncios relevantes e medir a eficácia das campanhas.',
            required: false,
        },
    ];

    return (
        <>
            {/* Overlay */}
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 pointer-events-none" />

            {/* Cookie Banner */}
            <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
                <Card className="glass-card max-w-6xl mx-auto p-6 md:p-8">
                    {!showSettings ? (
                        // Banner Principal
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                            <div className="flex items-start gap-4 flex-1">
                                <div className="flex-shrink-0 p-3 rounded-full bg-primary/10">
                                    <Cookie className="h-6 w-6 text-primary" />
                                </div>

                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-foreground mb-2">
                                        🍪 Utilizamos cookies para melhorar sua experiência
                                    </h3>
                                    <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                                        Usamos cookies para personalizar conteúdo, analisar o tráfego e melhorar nossos serviços.
                                        Alguns cookies são essenciais para o funcionamento do site. Você pode escolher quais aceitar.
                                    </p>

                                    <div className="mt-4">
                                        <button
                                            onClick={() => setShowSettings(true)}
                                            className="text-primary hover:text-primary/80 text-sm font-medium underline-offset-2 hover:underline transition-all"
                                        >
                                            Ver detalhes dos cookies
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                                <Button
                                    variant="outline"
                                    onClick={acceptEssentialOnly}
                                    className="flex-1 md:flex-none"
                                >
                                    Apenas Essenciais
                                </Button>
                                <Button
                                    onClick={() => setShowSettings(true)}
                                    variant="outline"
                                    className="flex-1 md:flex-none"
                                >
                                    <Settings className="h-4 w-4 mr-2" />
                                    Personalizar
                                </Button>
                                <Button
                                    onClick={acceptAllCookies}
                                    className="btn-primary flex-1 md:flex-none"
                                >
                                    Aceitar Todos
                                </Button>
                            </div>
                        </div>
                    ) : (
                        // Painel de Configurações
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-full bg-primary/10">
                                        <Settings className="h-5 w-5 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-semibold">Configurações de Cookies</h3>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setShowSettings(false)}
                                    className="rounded-full"
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>

                            <div className="space-y-6 mb-8">
                                {cookieTypes.map((type) => {
                                    const IconComponent = type.icon;
                                    const isEnabled = customPreferences[type.key];

                                    return (
                                        <div
                                            key={type.key}
                                            className="flex items-start gap-4 p-4 rounded-lg border border-border/50 hover:border-border transition-colors"
                                        >
                                            <div className="flex-shrink-0 p-2 rounded-lg bg-muted">
                                                <IconComponent className="h-5 w-5 text-muted-foreground" />
                                            </div>

                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="font-medium text-foreground">{type.title}</h4>
                                                    <Switch
                                                        checked={isEnabled}
                                                        onCheckedChange={() => togglePreference(type.key)}
                                                        disabled={type.required}
                                                    />
                                                </div>
                                                <p className="text-sm text-muted-foreground leading-relaxed">
                                                    {type.description}
                                                </p>
                                                {type.required && (
                                                    <span className="inline-block mt-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                                        Obrigatório
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 justify-end">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowSettings(false)}
                                    className="flex-1 sm:flex-none"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    onClick={handleCustomSave}
                                    className="btn-primary flex-1 sm:flex-none"
                                >
                                    Salvar Preferências
                                </Button>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </>
    );
}; 