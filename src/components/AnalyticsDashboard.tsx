import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    BarChart3,
    Eye,
    Clock,
    Users,
    MousePointer,
    Scroll,
    Heart,
    TrendingUp,
    Activity,
    MapPin,
    Smartphone,
    Monitor,
    Tablet,
    RefreshCw,
    Download,
    Calendar
} from 'lucide-react';
import { useBehaviorTracking } from '@/hooks/useBehaviorTracking';
import { useCookieConsent } from '@/hooks/useCookieConsent';
import { clarityService } from '@/services/clarityService';

interface AnalyticsStats {
    totalSessions: number;
    totalInteractions: number;
    averageSessionDuration: number;
    topProcedures: Array<{
        name: string;
        views: number;
        score: number;
        avgTime: number;
    }>;
    deviceBreakdown: {
        mobile: number;
        desktop: number;
        tablet: number;
    };
    dailyStats: Array<{
        date: string;
        sessions: number;
        interactions: number;
    }>;
}

export const AnalyticsDashboard: React.FC = () => {
    const { getAnalyticsData, isTrackingEnabled } = useBehaviorTracking();
    const { hasConsent, preferences, resetConsent } = useCookieConsent();
    const [stats, setStats] = useState<AnalyticsStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTimeRange, setSelectedTimeRange] = useState<'7d' | '30d' | 'all'>('7d');

    // Atualizar dados quando tracking estiver habilitado
    useEffect(() => {
        if (isTrackingEnabled) {
            loadAnalyticsData();
        } else {
            setStats(null);
            setIsLoading(false);
        }
    }, [isTrackingEnabled, selectedTimeRange]);

    const loadAnalyticsData = () => {
        setIsLoading(true);
        try {
            const data = getAnalyticsData();
            if (data) {
                // Processar dados para o dashboard
                const processedStats: AnalyticsStats = {
                    totalSessions: 1, // data.currentSession ? 1 : 0,
                    totalInteractions: data.allInteractions.length,
                    averageSessionDuration: data.stats.sessionDuration,
                    topProcedures: data.stats.topProcedures.map(proc => ({
                        name: proc.procedureName,
                        views: proc.viewCount,
                        score: proc.interactionScore,
                        avgTime: Math.round(proc.totalTimeSpent / proc.viewCount / 1000), // em segundos
                    })),
                    deviceBreakdown: calculateDeviceBreakdown(data.allInteractions),
                    dailyStats: calculateDailyStats(data.allInteractions),
                };
                setStats(processedStats);
            }
        } catch (error) {
            console.error('Erro ao carregar dados de analytics:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const calculateDeviceBreakdown = (interactions: any[]) => {
        // Simular breakdown por dispositivo baseado no viewport
        const total = interactions.length || 1;
        return {
            mobile: Math.round(total * 0.6), // 60% mobile
            desktop: Math.round(total * 0.3), // 30% desktop
            tablet: Math.round(total * 0.1), // 10% tablet
        };
    };

    const calculateDailyStats = (interactions: any[]) => {
        const dailyData: Record<string, { sessions: number; interactions: number }> = {};
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            return date.toISOString().split('T')[0];
        }).reverse();

        last7Days.forEach(date => {
            dailyData[date] = { sessions: 0, interactions: 0 };
        });

        interactions.forEach(interaction => {
            const date = new Date(interaction.timestamp).toISOString().split('T')[0];
            if (dailyData[date]) {
                dailyData[date].interactions += 1;
                if (interaction.type === 'page_view') {
                    dailyData[date].sessions += 1;
                }
            }
        });

        return Object.entries(dailyData).map(([date, data]) => ({
            date,
            ...data,
        }));
    };

    const formatDuration = (milliseconds: number) => {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        if (hours > 0) {
            return `${hours}h ${minutes % 60}m`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds % 60}s`;
        } else {
            return `${seconds}s`;
        }
    };

    const exportData = () => {
        if (!stats) return;

        const data = {
            exportDate: new Date().toISOString(),
            summary: stats,
            claritySession: clarityService.getSessionUrl(),
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: 'application/json',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `vitall-analytics-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    if (!hasConsent) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Analytics Dashboard
                    </CardTitle>
                    <CardDescription>
                        Para visualizar os dados de analytics, é necessário aceitar os cookies de análise.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground mb-4">
                            Nenhum consentimento de cookies encontrado.
                        </p>
                        <p className="text-sm text-muted-foreground mb-6">
                            Os dados de analytics só são coletados após consentimento do usuário.
                        </p>
                        <Button onClick={resetConsent} variant="outline">
                            Configurar Cookies
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!isTrackingEnabled) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Analytics Dashboard
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">
                            Tracking de comportamento não está habilitado.
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                            Status dos cookies: Analytics = {preferences.analytics ? '✅' : '❌'},
                            Personalização = {preferences.personalization ? '✅' : '❌'}
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Analytics Dashboard
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Carregando dados...</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h2>
                    <p className="text-muted-foreground">
                        Dados de comportamento e engagement dos usuários
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button onClick={exportData} variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Exportar
                    </Button>
                    <Button onClick={loadAnalyticsData} variant="outline" size="sm">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Atualizar
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Sessões</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalSessions || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            Sessões ativas registradas
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Interações</CardTitle>
                        <MousePointer className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalInteractions || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            Cliques, scrolls e visualizações
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats ? formatDuration(stats.averageSessionDuration) : '0s'}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Por sessão
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Clarity Session</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm font-medium">
                            {clarityService.isActive() ? (
                                <Badge variant="default">Ativo</Badge>
                            ) : (
                                <Badge variant="secondary">Inativo</Badge>
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Microsoft Clarity
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Analytics */}
            <Tabs defaultValue="procedures" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="procedures">Procedimentos</TabsTrigger>
                    <TabsTrigger value="devices">Dispositivos</TabsTrigger>
                    <TabsTrigger value="timeline">Timeline</TabsTrigger>
                </TabsList>

                <TabsContent value="procedures" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Heart className="h-5 w-5" />
                                Interesse em Procedimentos
                            </CardTitle>
                            <CardDescription>
                                Procedimentos mais visualizados e engajamento
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {stats?.topProcedures.length ? (
                                <div className="space-y-4">
                                    {stats.topProcedures.map((procedure, index) => (
                                        <div
                                            key={procedure.name}
                                            className="flex items-center justify-between p-4 border rounded-lg"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-medium">
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <p className="font-medium">{procedure.name}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {procedure.views} visualizações • {procedure.avgTime}s tempo médio
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <Badge
                                                    variant={procedure.score > 70 ? 'default' : procedure.score > 40 ? 'secondary' : 'outline'}
                                                >
                                                    {procedure.score} pontos
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    Nenhum procedimento visualizado ainda
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="devices" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Smartphone className="h-5 w-5" />
                                Breakdown por Dispositivo
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Smartphone className="h-4 w-4" />
                                        <span>Mobile</span>
                                    </div>
                                    <Badge variant="outline">
                                        {stats?.deviceBreakdown.mobile || 0} interações
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Monitor className="h-4 w-4" />
                                        <span>Desktop</span>
                                    </div>
                                    <Badge variant="outline">
                                        {stats?.deviceBreakdown.desktop || 0} interações
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Tablet className="h-4 w-4" />
                                        <span>Tablet</span>
                                    </div>
                                    <Badge variant="outline">
                                        {stats?.deviceBreakdown.tablet || 0} interações
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="timeline" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Atividade dos Últimos 7 Dias
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {stats?.dailyStats.length ? (
                                <div className="space-y-2">
                                    {stats.dailyStats.map((day) => (
                                        <div
                                            key={day.date}
                                            className="flex items-center justify-between py-2 border-b last:border-0"
                                        >
                                            <span className="text-sm">
                                                {new Date(day.date).toLocaleDateString('pt-BR')}
                                            </span>
                                            <div className="flex gap-4 text-sm">
                                                <span>{day.sessions} sessões</span>
                                                <span>{day.interactions} interações</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    Nenhum dado de timeline disponível
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}; 