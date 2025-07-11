import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Eye, Edit, Trash2, Plus, Save, Image, LogOut, Lock, FileText, Settings, BarChart3, Upload, Database, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { config, logConfigStatus } from "@/lib/config";
import RichTextEditor from "@/components/RichTextEditor";
import BlogPostPreview from "@/components/BlogPostPreview";
import { calculateReadingTime } from "@/lib/readingTime";
import { loadPosts, addPost, updatePost, deletePost, BlogPost } from "@/lib/blogAdapter";
import MigrationManager from "@/components/MigrationManager";
import { AnalyticsDashboard } from "@/components/AnalyticsDashboard";

const categories = ["Prevenção", "Tratamentos", "Estética"];

export default function AdminSystem() {
    const { toast } = useToast();
    const { user, signOut } = useAuth();
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [currentTab, setCurrentTab] = useState("list");
    const [isUploading, setIsUploading] = useState(false);

    const [postForm, setPostForm] = useState({
        title: "",
        excerpt: "",
        content: "",
        image: "",
        category: "",
        author: "",
        published: false
    });

    // Carrega posts do storage ao montar o componente
    useEffect(() => {
        logConfigStatus();
        refreshPosts();
    }, []);

    const refreshPosts = async () => {
        const allPosts = await loadPosts();
        setPosts(allPosts);
    };

    const handleLogout = async () => {
        await signOut();
        toast({
            title: "Logout realizado com sucesso!",
            description: "Até logo!",
        });
    };

    const handleCreatePost = () => {
        setSelectedPost(null);
        setPostForm({
            title: "",
            excerpt: "",
            content: "",
            image: "",
            category: "",
            author: user?.email || "",
            published: false
        });
        setIsEditing(true);
        setCurrentTab("editor");
    };

    const handleEditPost = (post: BlogPost) => {
        setSelectedPost(post);
        setPostForm({
            title: post.title,
            excerpt: post.excerpt,
            content: post.content,
            image: post.image,
            category: post.category,
            author: post.author,
            published: post.published
        });
        setIsEditing(true);
        setCurrentTab("editor");
    };

    const handleSavePost = async () => {
        if (!postForm.title || !postForm.excerpt || !postForm.content) {
            toast({
                title: "Erro",
                description: "Preencha todos os campos obrigatórios.",
                variant: "destructive",
            });
            return;
        }

        // Calcular tempo de leitura automaticamente
        const readingTime = calculateReadingTime(postForm.content);
        const postData = {
            ...postForm,
            readTime: readingTime.text,
            author: postForm.author || user?.email || "Admin",
            date: new Date().toISOString().split('T')[0]
        };

        try {
            if (selectedPost) {
                // Atualizar post existente
                const updatedPost = await updatePost(selectedPost.id, postData);
                if (updatedPost) {
                    toast({
                        title: "Post atualizado!",
                        description: "As alterações foram salvas com sucesso.",
                    });
                }
            } else {
                // Criar novo post
                const newPost = await addPost(postData);
                if (newPost) {
                    toast({
                        title: "Post criado!",
                        description: "O novo post foi adicionado com sucesso.",
                    });
                }
            }

            // Atualizar lista e resetar formulário
            await refreshPosts();
            setIsEditing(false);
            setSelectedPost(null);
            setCurrentTab("list");
        } catch (error) {
            toast({
                title: "Erro",
                description: "Ocorreu um erro ao salvar o post.",
                variant: "destructive",
            });
        }
    };

    const handleDeletePost = async (id: number) => {
        try {
            const success = await deletePost(id);
            if (success) {
                await refreshPosts();
                toast({
                    title: "Post excluído!",
                    description: "O post foi removido com sucesso.",
                });
            } else {
                toast({
                    title: "Erro",
                    description: "Post não encontrado.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Erro",
                description: "Ocorreu um erro ao excluir o post.",
                variant: "destructive",
            });
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validações
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

        if (file.size > maxSize) {
            toast({
                title: "Arquivo muito grande",
                description: "A imagem deve ter no máximo 5MB.",
                variant: "destructive",
            });
            return;
        }

        if (!allowedTypes.includes(file.type)) {
            toast({
                title: "Formato não suportado",
                description: "Use apenas imagens JPG, PNG ou WebP.",
                variant: "destructive",
            });
            return;
        }

        setIsUploading(true);

        try {
            // Converter para base64 para armazenamento local
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64 = event.target?.result as string;
                setPostForm({ ...postForm, image: base64 });
                setIsUploading(false);
                toast({
                    title: "Imagem carregada!",
                    description: "A imagem foi adicionada ao post com sucesso.",
                });
            };
            reader.onerror = () => {
                setIsUploading(false);
                toast({
                    title: "Erro no upload",
                    description: "Não foi possível carregar a imagem.",
                    variant: "destructive",
                });
            };
            reader.readAsDataURL(file);
        } catch (error) {
            setIsUploading(false);
            toast({
                title: "Erro no upload",
                description: "Ocorreu um erro ao processar a imagem.",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-gray-900">
                                Sistema Administrativo - VitallCheck-Up
                            </h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-gray-500" />
                                <span className="text-sm text-gray-600">
                                    {user?.email}
                                </span>
                            </div>
                            <Badge variant="outline" className="text-sm">
                                {posts.length} post{posts.length !== 1 ? 's' : ''} total
                            </Badge>
                            <Button variant="outline" onClick={handleLogout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                Sair
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Tabs value={currentTab} onValueChange={setCurrentTab}>
                    <TabsList className="grid w-full max-w-3xl grid-cols-5">
                        <TabsTrigger value="list">
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Posts
                        </TabsTrigger>
                        <TabsTrigger value="editor">
                            <Edit className="h-4 w-4 mr-2" />
                            Editor
                        </TabsTrigger>
                        <TabsTrigger value="preview" disabled={!isEditing}>
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                        </TabsTrigger>
                        <TabsTrigger value="analytics">
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Analytics
                        </TabsTrigger>
                        <TabsTrigger value="migration">
                            <Database className="h-4 w-4 mr-2" />
                            Migrar
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="list" className="mt-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold">Gerenciar Posts</h2>
                            <Button onClick={handleCreatePost}>
                                <Plus className="mr-2 h-4 w-4" />
                                Novo Post
                            </Button>
                        </div>

                        {posts.length === 0 ? (
                            <Card>
                                <CardContent className="p-12 text-center">
                                    <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        Nenhum post encontrado
                                    </h3>
                                    <p className="text-gray-500 mb-6">
                                        Comece criando seu primeiro post para o blog
                                    </p>
                                    <Button onClick={handleCreatePost}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Criar Primeiro Post
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid gap-4">
                                {posts.map((post) => (
                                    <Card key={post.id}>
                                        <CardContent className="p-6">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <h3 className="text-lg font-semibold">{post.title}</h3>
                                                        <Badge variant={post.published ? "default" : "secondary"}>
                                                            {post.published ? "Publicado" : "Rascunho"}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-gray-600 mb-2">{post.excerpt}</p>
                                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                                        <span>Categoria: {post.category}</span>
                                                        <span>Autor: {post.author}</span>
                                                        <span>Data: {new Date(post.date).toLocaleDateString('pt-BR')}</span>
                                                        <span>URL: /blog/{post.slug}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 ml-4">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleEditPost(post)}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="outline" size="sm">
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Excluir Post</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Tem certeza que deseja excluir o post "{post.title}"?
                                                                    Esta ação não pode ser desfeita.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleDeletePost(post.id)}>
                                                                    Excluir
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="editor" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Edit className="h-5 w-5" />
                                    {selectedPost ? 'Editar Post' : 'Novo Post'}
                                </CardTitle>
                                <CardDescription>
                                    {selectedPost ? 'Faça as alterações desejadas no post' : 'Preencha os campos para criar um novo post'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Título *</Label>
                                        <Input
                                            id="title"
                                            value={postForm.title}
                                            onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                                            placeholder="Título do post"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="category">Categoria *</Label>
                                        <Select value={postForm.category} onValueChange={(value) => setPostForm({ ...postForm, category: value })}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione uma categoria" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map(cat => (
                                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="excerpt">Resumo *</Label>
                                    <Textarea
                                        id="excerpt"
                                        value={postForm.excerpt}
                                        onChange={(e) => setPostForm({ ...postForm, excerpt: e.target.value })}
                                        placeholder="Breve descrição do post que aparecerá na lista"
                                        rows={3}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="author">Autor</Label>
                                    <Input
                                        id="author"
                                        value={postForm.author}
                                        onChange={(e) => setPostForm({ ...postForm, author: e.target.value })}
                                        placeholder="Nome do autor"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="content">Conteúdo *</Label>
                                    <RichTextEditor
                                        value={postForm.content}
                                        onChange={(content) => setPostForm({ ...postForm, content })}
                                        placeholder="Escreva o conteúdo do post aqui..."
                                    />
                                </div>

                                <div className="space-y-4">
                                    <Label>Imagem de Destaque</Label>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1">
                                            <input
                                                type="file"
                                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                                id="image-upload"
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => document.getElementById('image-upload')?.click()}
                                                className="flex-1"
                                                disabled={isUploading}
                                            >
                                                {isUploading ? (
                                                    <>
                                                        <Upload className="mr-2 h-4 w-4 animate-spin" />
                                                        Carregando...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Image className="mr-2 h-4 w-4" />
                                                        Upload de Imagem
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Formatos: JPG, PNG, WebP. Máximo: 5MB
                                        </p>
                                    </div>
                                </div>

                                {/* Info sobre tempo de leitura */}
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <p className="text-sm text-blue-700">
                                        <strong>💡 Tempo de leitura:</strong> Será calculado automaticamente com base no conteúdo do artigo.
                                    </p>
                                </div>

                                {postForm.image && (
                                    <div className="space-y-2">
                                        <Label>Preview da Imagem</Label>
                                        <img
                                            src={postForm.image}
                                            alt="Preview"
                                            className="w-full h-48 object-cover rounded-lg"
                                        />
                                    </div>
                                )}

                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="published"
                                        checked={postForm.published}
                                        onChange={(e) => setPostForm({ ...postForm, published: e.target.checked })}
                                        className="rounded"
                                    />
                                    <Label htmlFor="published">Publicar imediatamente</Label>
                                </div>

                                <div className="flex gap-4">
                                    <Button onClick={handleSavePost}>
                                        <Save className="mr-2 h-4 w-4" />
                                        Salvar
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        onClick={() => setCurrentTab("preview")}
                                        disabled={!postForm.title && !postForm.content}
                                    >
                                        <Eye className="mr-2 h-4 w-4" />
                                        Ver Preview
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setIsEditing(false);
                                            setSelectedPost(null);
                                            setCurrentTab("list");
                                        }}
                                    >
                                        Cancelar
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="preview" className="mt-6">
                        {isEditing && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Editor lado esquerdo */}
                                <div className="space-y-4">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Settings className="h-5 w-5" />
                                                Edição Rápida
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="preview-title">Título</Label>
                                                <Input
                                                    id="preview-title"
                                                    value={postForm.title}
                                                    onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                                                    placeholder="Título do post"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="preview-excerpt">Resumo</Label>
                                                <Textarea
                                                    id="preview-excerpt"
                                                    value={postForm.excerpt}
                                                    onChange={(e) => setPostForm({ ...postForm, excerpt: e.target.value })}
                                                    placeholder="Breve descrição"
                                                    rows={3}
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Categoria</Label>
                                                    <Select value={postForm.category} onValueChange={(value) => setPostForm({ ...postForm, category: value })}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Categoria" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {categories.map(cat => (
                                                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Autor</Label>
                                                    <Input
                                                        value={postForm.author}
                                                        onChange={(e) => setPostForm({ ...postForm, author: e.target.value })}
                                                        placeholder="Nome do autor"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    id="preview-published"
                                                    checked={postForm.published}
                                                    onChange={(e) => setPostForm({ ...postForm, published: e.target.checked })}
                                                    className="rounded"
                                                />
                                                <Label htmlFor="preview-published">Publicar imediatamente</Label>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <div className="flex gap-4">
                                        <Button onClick={handleSavePost} className="flex-1">
                                            <Save className="mr-2 h-4 w-4" />
                                            Salvar Post
                                        </Button>
                                        <Button variant="outline" onClick={() => setCurrentTab("editor")}>
                                            Voltar ao Editor
                                        </Button>
                                    </div>
                                </div>

                                {/* Preview lado direito */}
                                <div className="space-y-4">
                                    <BlogPostPreview
                                        title={postForm.title}
                                        excerpt={postForm.excerpt}
                                        content={postForm.content}
                                        image={postForm.image}
                                        category={postForm.category}
                                        author={postForm.author}
                                        published={postForm.published}
                                    />
                                </div>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="analytics" className="mt-6">
                        <AnalyticsDashboard />
                    </TabsContent>

                    <TabsContent value="migration" className="mt-6">
                        <div className="space-y-6">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold mb-2">Migração para Supabase</h2>
                                <p className="text-muted-foreground">
                                    Migre seus posts do localStorage para o Supabase com um clique.
                                </p>
                            </div>
                            <MigrationManager />
                        </div>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
} 