import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Database, Upload, Download, RefreshCw, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { config } from "@/lib/config";
import { getBackendInfo } from "@/lib/blogAdapter";
import { migrateWithBackup, needsMigration, clearLocalStorageAfterMigration, createLocalStorageBackup } from "@/lib/migration";
import { loadPosts as loadLocalPosts } from "@/lib/blogStorage";
import { loadPosts as loadSupabasePosts } from "@/lib/supabaseBlogStorage";

interface MigrationStatus {
    localPosts: number;
    supabasePosts: number;
    needsMigration: boolean;
    isSupabaseConfigured: boolean;
    backendInfo: any;
}

export default function MigrationManager() {
    const { toast } = useToast();
    const [migrationStatus, setMigrationStatus] = useState<MigrationStatus | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [migrationProgress, setMigrationProgress] = useState(0);
    const [migrationResult, setMigrationResult] = useState<any>(null);

    // Carrega status inicial
    useEffect(() => {
        loadMigrationStatus();
    }, []);

    const loadMigrationStatus = async () => {
        setIsLoading(true);
        try {
            const localPosts = loadLocalPosts();
            const supabasePosts = config.database.useSupabase ? await loadSupabasePosts() : [];
            const needsMig = await needsMigration();
            const backendInfo = getBackendInfo();

            setMigrationStatus({
                localPosts: localPosts.length,
                supabasePosts: supabasePosts.length,
                needsMigration: needsMig,
                isSupabaseConfigured: backendInfo.supabaseConfigured,
                backendInfo
            });
        } catch (error) {
            console.error('Erro ao carregar status de migração:', error);
            setMigrationStatus({
                localPosts: 0,
                supabasePosts: 0,
                needsMigration: false,
                isSupabaseConfigured: false,
                backendInfo: { backend: 'localStorage', supabaseConfigured: false, fallbackEnabled: true }
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleMigration = async () => {
        if (!migrationStatus?.isSupabaseConfigured) {
            toast({
                title: "Erro",
                description: "Supabase não está configurado. Configure as variáveis de ambiente primeiro.",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);
        setMigrationProgress(10);

        try {
            // Simula progresso
            setMigrationProgress(30);

            const result = await migrateWithBackup();

            setMigrationProgress(90);
            setMigrationResult(result);

            if (result.success) {
                toast({
                    title: "Migração concluída!",
                    description: result.message,
                });

                // Atualiza status
                await loadMigrationStatus();

                setMigrationProgress(100);
            } else {
                toast({
                    title: "Erro na migração",
                    description: result.message,
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Erro",
                description: "Erro durante a migração. Verifique o console para mais detalhes.",
                variant: "destructive",
            });
            console.error('Erro na migração:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearLocalStorage = () => {
        clearLocalStorageAfterMigration();
        toast({
            title: "LocalStorage limpo",
            description: "Os dados do localStorage foram removidos com sucesso.",
        });
        loadMigrationStatus();
    };

    const handleDownloadBackup = () => {
        const backup = createLocalStorageBackup();
        if (backup) {
            const blob = new Blob([backup], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `vitall-blog-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            toast({
                title: "Backup baixado!",
                description: "Backup dos dados foi baixado com sucesso.",
            });
        }
    };

    if (isLoading && !migrationStatus) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <RefreshCw className="h-5 w-5 animate-spin" />
                        Carregando status de migração...
                    </CardTitle>
                </CardHeader>
            </Card>
        );
    }

    if (!migrationStatus) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-600">
                        <XCircle className="h-5 w-5" />
                        Erro ao carregar status
                    </CardTitle>
                    <CardDescription>
                        Não foi possível carregar o status da migração.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={loadMigrationStatus}>
                        Tentar novamente
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Status da Configuração */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Database className="h-5 w-5" />
                        Status da Migração
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Posts no localStorage</p>
                            <p className="text-2xl font-bold">{migrationStatus.localPosts}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Posts no Supabase</p>
                            <p className="text-2xl font-bold">{migrationStatus.supabasePosts}</p>
                        </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Backend Atual</p>
                            <Badge variant={migrationStatus.backendInfo.backend === 'supabase' ? 'default' : 'secondary'}>
                                {migrationStatus.backendInfo.backend}
                            </Badge>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Supabase Configurado</p>
                            <Badge variant={migrationStatus.isSupabaseConfigured ? 'default' : 'destructive'}>
                                {migrationStatus.isSupabaseConfigured ? 'Sim' : 'Não'}
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Aviso se Supabase não estiver configurado */}
            {!migrationStatus.isSupabaseConfigured && (
                <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                        <strong>Supabase não configurado!</strong> Configure as variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY para habilitar a migração.
                    </AlertDescription>
                </Alert>
            )}

            {/* Migração */}
            {migrationStatus.needsMigration && migrationStatus.isSupabaseConfigured && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-blue-600">
                            <Upload className="h-5 w-5" />
                            Migração Disponível
                        </CardTitle>
                        <CardDescription>
                            {migrationStatus.localPosts} posts encontrados no localStorage. Clique para migrar para o Supabase.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {migrationProgress > 0 && (
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Progresso da migração</span>
                                    <span>{migrationProgress}%</span>
                                </div>
                                <Progress value={migrationProgress} />
                            </div>
                        )}

                        <div className="flex gap-2">
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button disabled={isLoading} className="flex items-center gap-2">
                                        <Upload className="h-4 w-4" />
                                        {isLoading ? "Migrando..." : "Migrar Posts"}
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Confirmar Migração</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Esta ação irá migrar todos os {migrationStatus.localPosts} posts do localStorage para o Supabase.
                                            <br /><br />
                                            Um backup será criado automaticamente antes da migração.
                                            <br /><br />
                                            Tem certeza que deseja continuar?
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleMigration}>
                                            Confirmar Migração
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>

                            <Button variant="outline" onClick={handleDownloadBackup} className="flex items-center gap-2">
                                <Download className="h-4 w-4" />
                                Baixar Backup
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Resultado da Migração */}
            {migrationResult && (
                <Card>
                    <CardHeader>
                        <CardTitle className={`flex items-center gap-2 ${migrationResult.success ? 'text-green-600' : 'text-red-600'}`}>
                            {migrationResult.success ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                            Resultado da Migração
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p>{migrationResult.message}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Posts no localStorage</p>
                                <p className="text-xl font-bold">{migrationResult.localPosts}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Posts migrados</p>
                                <p className="text-xl font-bold">{migrationResult.migratedPosts}</p>
                            </div>
                        </div>

                        {migrationResult.errors.length > 0 && (
                            <div>
                                <p className="text-sm text-muted-foreground mb-2">Erros:</p>
                                <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                                    {migrationResult.errors.map((error: string, index: number) => (
                                        <p key={index}>• {error}</p>
                                    ))}
                                </div>
                            </div>
                        )}

                        {migrationResult.success && migrationStatus.localPosts > 0 && (
                            <div>
                                <p className="text-sm text-muted-foreground mb-2">
                                    Migração concluída! Você pode limpar o localStorage agora.
                                </p>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" size="sm">
                                            Limpar localStorage
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Limpar localStorage</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Esta ação irá remover todos os dados do blog do localStorage.
                                                <br /><br />
                                                Certifique-se de que a migração foi bem-sucedida antes de continuar.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                            <AlertDialogAction onClick={handleClearLocalStorage}>
                                                Limpar
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Status OK */}
            {!migrationStatus.needsMigration && migrationStatus.isSupabaseConfigured && migrationStatus.localPosts === 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="h-5 w-5" />
                            Sistema Configurado
                        </CardTitle>
                        <CardDescription>
                            O Supabase está configurado e não há posts para migrar.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={loadMigrationStatus} className="flex items-center gap-2">
                                <RefreshCw className="h-4 w-4" />
                                Atualizar Status
                            </Button>
                            <Button variant="outline" onClick={handleDownloadBackup} className="flex items-center gap-2">
                                <Download className="h-4 w-4" />
                                Baixar Backup
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Posts sincronizados */}
            {!migrationStatus.needsMigration && migrationStatus.isSupabaseConfigured && migrationStatus.localPosts > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="h-5 w-5" />
                            Posts Sincronizados
                        </CardTitle>
                        <CardDescription>
                            Todos os seus posts estão sincronizados entre localStorage e Supabase.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={loadMigrationStatus} className="flex items-center gap-2">
                                <RefreshCw className="h-4 w-4" />
                                Atualizar Status
                            </Button>
                            <Button variant="outline" onClick={handleDownloadBackup} className="flex items-center gap-2">
                                <Download className="h-4 w-4" />
                                Baixar Backup
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
} 