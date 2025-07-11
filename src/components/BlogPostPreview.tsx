import { Calendar, Clock, User, Tag, BookOpen, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { calculateReadingTime, getTextStatistics } from "@/lib/readingTime";

interface BlogPostPreviewProps {
    title: string;
    excerpt: string;
    content: string;
    image: string;
    category: string;
    author: string;
    published: boolean;
}

export default function BlogPostPreview({
    title,
    excerpt,
    content,
    image,
    category,
    author,
    published
}: BlogPostPreviewProps) {

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    const readingTime = calculateReadingTime(content);
    const textStats = getTextStatistics(content);

    return (
        <Card className="overflow-hidden">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Preview do Post
                    <Badge variant={published ? "default" : "secondary"} className="ml-2">
                        {published ? "Para Publicação" : "Rascunho"}
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="max-h-[600px] overflow-y-auto">
                    {/* Breadcrumb */}
                    <div className="py-4 px-6 border-b bg-gray-50/50">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>Início</span>
                            <span>/</span>
                            <span>Blog</span>
                            <span>/</span>
                            <span className="text-foreground">{title || "Título do post"}</span>
                        </div>
                    </div>

                    {/* Article Header */}
                    <div className="py-8 px-6">
                        <div className="text-center mb-8">
                            {category && (
                                <Badge variant="secondary" className="mb-4">
                                    <Tag className="h-4 w-4 mr-1" />
                                    {category}
                                </Badge>
                            )}
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                                {title || "Título do post aparecerá aqui"}
                            </h1>
                            <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
                                {excerpt || "O resumo do post aparecerá aqui"}
                            </p>
                            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground mb-6">
                                {author && (
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        <span>{author}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    <span>{formatDate(new Date())}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    <span>{readingTime.text}</span>
                                </div>
                            </div>
                            <Button variant="outline" size="sm">
                                <Share2 className="h-4 w-4 mr-2" />
                                Compartilhar
                            </Button>
                        </div>
                    </div>

                    {/* Featured Image */}
                    {image && (
                        <div className="mb-8 px-6">
                            <div className="aspect-video rounded-2xl overflow-hidden shadow-lg">
                                <img
                                    src={image}
                                    alt={title || "Preview"}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    )}

                    {/* Article Content */}
                    <div className="pb-12 px-6">
                        {content ? (
                            <article className="prose prose-lg max-w-none prose-gray prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground prose-ul:text-muted-foreground prose-ol:text-muted-foreground prose-li:text-muted-foreground prose-blockquote:text-muted-foreground prose-code:text-foreground prose-pre:text-foreground prose-hr:border-border prose-table:text-foreground prose-th:text-foreground prose-td:text-muted-foreground prose-img:rounded-lg">
                                <div
                                    dangerouslySetInnerHTML={{ __html: content }}
                                    className="[&>*]:mb-4 [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:mb-6 [&>h1]:font-sans [&>h2]:text-2xl [&>h2]:font-semibold [&>h2]:mb-4 [&>h2]:font-sans [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:mb-3 [&>h3]:font-sans [&>h4]:text-lg [&>h4]:font-medium [&>h4]:mb-3 [&>h4]:font-sans [&>p]:leading-relaxed [&>p]:mb-4 [&>p]:font-arial [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-4 [&>ul]:font-arial [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-4 [&>ol]:font-arial [&>li]:mb-2 [&>li]:font-arial [&>blockquote]:border-l-4 [&>blockquote]:border-primary [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:my-6 [&>blockquote]:font-arial [&>strong]:font-bold [&>strong]:font-arial [&>em]:italic [&>em]:font-arial [&>a]:text-primary [&>a]:underline [&>a:hover]:text-primary/80 [&>a]:font-arial [&>hr]:my-8 [&>hr]:border-border [&>img]:rounded-lg [&>img]:shadow-md [&>img]:my-6 [&>table]:w-full [&>table]:border-collapse [&>table]:my-6 [&>table]:font-arial [&>th]:border [&>th]:p-3 [&>th]:bg-gray-50 [&>th]:font-semibold [&>th]:font-arial [&>td]:border [&>td]:p-3 [&>td]:font-arial"
                                />
                            </article>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>O conteúdo do post aparecerá aqui conforme você escreve</p>
                            </div>
                        )}

                        {content && (
                            <>
                                <Separator className="my-12" />

                                {/* Article Footer */}
                                <div className="text-center">
                                    <h3 className="text-xl font-semibold mb-4">Gostou do artigo?</h3>
                                    <p className="text-muted-foreground mb-6">
                                        Agende uma consulta e cuide da sua saúde bucal com nossa equipe especializada
                                    </p>
                                    <Button size="lg" className="btn-primary">
                                        Agendar Consulta
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Estatísticas do conteúdo */}
                    {content && (
                        <div className="mt-8 pt-6 border-t border-gray-200 px-6 pb-6">
                            <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                                <div>
                                    <strong>Palavras:</strong> {textStats.words}
                                </div>
                                <div>
                                    <strong>Caracteres:</strong> {textStats.characters}
                                </div>
                                <div>
                                    <strong>Tempo de leitura:</strong> {readingTime.text}
                                </div>
                                <div>
                                    <strong>Status:</strong> {published ? "Publicado" : "Rascunho"}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
} 