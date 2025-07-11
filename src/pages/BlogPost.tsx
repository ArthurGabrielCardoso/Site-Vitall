import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, User, ArrowLeft, ArrowRight, Tag, Share2 } from "lucide-react";
import { formatReadingTime } from "@/lib/readingTime";
import { useSEO } from "@/hooks/useSEO";
import { getPostBySlug, loadPublishedPosts } from "@/lib/blogAdapter";
import type { BlogPost } from "@/lib/blogAdapter";

export default function BlogPost() {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [post, setPost] = useState<BlogPost | null>(null);
    const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPost = async () => {
            if (!slug) return;

            // Buscar post por slug
            const foundPost = await getPostBySlug(slug);

            if (!foundPost || !foundPost.published) {
                // Post não encontrado ou não publicado
                navigate('/blog');
                return;
            }

            setPost(foundPost);

            // Buscar posts relacionados (mesma categoria, máximo 3)
            const allPosts = await loadPublishedPosts();
            const related = allPosts
                .filter(p => p.slug !== slug && p.category === foundPost.category)
                .slice(0, 3);

            setRelatedPosts(related);
            setLoading(false);
        };

        loadPost();
    }, [slug, navigate]);

    // SEO Configuration
    useSEO({
        title: post ? `${post.title} | Blog VitallCheck-Up` : "Post não encontrado",
        description: post ? post.excerpt : "Post não encontrado no blog da VitallCheck-Up",
        keywords: post ? [
            post.category.toLowerCase(),
            "saúde bucal",
            "odontologia",
            "dentes",
            ...post.title.toLowerCase().split(' ').filter(word => word.length > 3)
        ] : ["blog", "saúde bucal"],
        url: `${window.location.origin}/blog/${slug}`,
        type: 'article',
        image: post?.image,
        publishedTime: post?.date,
        author: post?.author
    });

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    const handleShare = async () => {
        if (navigator.share && post) {
            try {
                await navigator.share({
                    title: post.title,
                    text: post.excerpt,
                    url: window.location.href,
                });
            } catch (error) {
                // Fallback para cópia do link
                navigator.clipboard.writeText(window.location.href);
                alert('Link copiado para a área de transferência!');
            }
        } else {
            // Fallback para cópia do link
            navigator.clipboard.writeText(window.location.href);
            alert('Link copiado para a área de transferência!');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1 pt-20">
                    <div className="container py-8">
                        <div className="max-w-4xl mx-auto">
                            <div className="animate-pulse space-y-4">
                                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                <div className="aspect-video bg-gray-200 rounded"></div>
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-200 rounded"></div>
                                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                                    <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1 pt-20">
                    <div className="container py-8">
                        <div className="max-w-4xl mx-auto text-center">
                            <div className="text-6xl mb-4">😢</div>
                            <h1 className="text-3xl font-bold mb-4">Post não encontrado</h1>
                            <p className="text-muted-foreground mb-8">
                                O post que você está procurando não existe ou foi removido.
                            </p>
                            <Button onClick={() => navigate('/blog')}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Voltar ao Blog
                            </Button>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 pt-20">
                {/* Breadcrumb */}
                <section className="py-4 border-b bg-gray-50/50">
                    <div className="container">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Link to="/" className="hover:text-primary transition-colors">Início</Link>
                            <span>/</span>
                            <Link to="/blog" className="hover:text-primary transition-colors">Blog</Link>
                            <span>/</span>
                            <span className="text-foreground">{post.title}</span>
                        </div>
                    </div>
                </section>

                {/* Article Header */}
                <section className="py-8">
                    <div className="container">
                        <div className="max-w-4xl mx-auto">
                            <div className="text-center mb-8">
                                <Badge variant="secondary" className="mb-4">
                                    <Tag className="h-4 w-4 mr-1" />
                                    {post.category}
                                </Badge>
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                                    {post.title}
                                </h1>
                                <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
                                    {post.excerpt}
                                </p>
                                <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground mb-6">
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        <span>{post.author}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        <span>{formatDate(post.date)}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        <span>{formatReadingTime(post.content)}</span>
                                    </div>
                                </div>
                                <Button onClick={handleShare} variant="outline" size="sm">
                                    <Share2 className="h-4 w-4 mr-2" />
                                    Compartilhar
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Featured Image */}
                <section className="mb-8">
                    <div className="container">
                        <div className="max-w-4xl mx-auto">
                            <div className="aspect-video rounded-2xl overflow-hidden shadow-lg">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Article Content */}
                <section className="pb-12">
                    <div className="container">
                        <div className="max-w-4xl mx-auto">
                            <article className="prose prose-lg max-w-none prose-gray prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground prose-ul:text-muted-foreground prose-ol:text-muted-foreground prose-li:text-muted-foreground prose-blockquote:text-muted-foreground prose-code:text-foreground prose-pre:text-foreground prose-hr:border-border prose-table:text-foreground prose-th:text-foreground prose-td:text-muted-foreground prose-img:rounded-lg">
                                <div
                                    dangerouslySetInnerHTML={{ __html: post.content }}
                                    className="[&>*]:mb-4 [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:mb-6 [&>h1]:font-sans [&>h2]:text-2xl [&>h2]:font-semibold [&>h2]:mb-4 [&>h2]:font-sans [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:mb-3 [&>h3]:font-sans [&>h4]:text-lg [&>h4]:font-medium [&>h4]:mb-3 [&>h4]:font-sans [&>p]:leading-relaxed [&>p]:mb-4 [&>p]:font-arial [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-4 [&>ul]:font-arial [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-4 [&>ol]:font-arial [&>li]:mb-2 [&>li]:font-arial [&>blockquote]:border-l-4 [&>blockquote]:border-primary [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:my-6 [&>blockquote]:font-arial [&>strong]:font-bold [&>strong]:font-arial [&>em]:italic [&>em]:font-arial [&>a]:text-primary [&>a]:underline [&>a:hover]:text-primary/80 [&>a]:font-arial [&>hr]:my-8 [&>hr]:border-border [&>img]:rounded-lg [&>img]:shadow-md [&>img]:my-6 [&>table]:w-full [&>table]:border-collapse [&>table]:my-6 [&>table]:font-arial [&>th]:border [&>th]:p-3 [&>th]:bg-gray-50 [&>th]:font-semibold [&>th]:font-arial [&>td]:border [&>td]:p-3 [&>td]:font-arial"
                                />
                            </article>

                            <Separator className="my-12" />

                            {/* Article Footer */}
                            <div className="text-center">
                                <h3 className="text-xl font-semibold mb-4">Gostou do artigo?</h3>
                                <p className="text-muted-foreground mb-6">
                                    Agende uma consulta e cuide da sua saúde bucal com nossa equipe especializada
                                </p>
                                <Button
                                    size="lg"
                                    className="btn-primary"
                                    onClick={() => window.open("https://api.whatsapp.com/send?phone=5511934550921&text=Ol%C3%A1%21%20Li%20o%20artigo%20sobre%20" + encodeURIComponent(post.title) + "%20e%20gostaria%20de%20agendar%20uma%20consulta%2C%20pode%20me%20ajudar%3F", '_blank')}
                                >
                                    Agendar Consulta
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Related Posts */}
                {relatedPosts.length > 0 && (
                    <section className="py-16 bg-gray-50/50">
                        <div className="container">
                            <div className="max-w-4xl mx-auto">
                                <h3 className="text-2xl font-bold text-center mb-12">
                                    Artigos Relacionados
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {relatedPosts.map((relatedPost) => (
                                        <Link
                                            key={relatedPost.id}
                                            to={`/blog/${relatedPost.slug}`}
                                            className="block"
                                        >
                                            <article className="glass-card rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group">
                                                <div className="aspect-[4/3] overflow-hidden">
                                                    <img
                                                        src={relatedPost.image}
                                                        alt={relatedPost.title}
                                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                                    />
                                                </div>
                                                <div className="p-6">
                                                    <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
                                                        <Calendar className="h-4 w-4" />
                                                        {formatDate(relatedPost.date)}
                                                    </div>
                                                    <h4 className="font-semibold mb-2 line-clamp-2 hover:text-primary transition-colors">
                                                        {relatedPost.title}
                                                    </h4>
                                                    <div
                                                        className="text-sm text-muted-foreground mb-4 line-clamp-2 prose prose-sm max-w-none [&>strong]:font-bold [&>em]:italic [&>a]:text-primary"
                                                        dangerouslySetInnerHTML={{ __html: relatedPost.excerpt }}
                                                    />
                                                    <span className="text-primary hover:text-primary/80 font-medium transition-colors flex items-center gap-1 group text-sm">
                                                        Ler mais
                                                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                                    </span>
                                                </div>
                                            </article>
                                        </Link>
                                    ))}
                                </div>
                                <div className="text-center mt-12">
                                    <Button variant="outline" onClick={() => navigate('/blog')}>
                                        Ver Todos os Posts
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Navigation */}
                <section className="py-8 border-t">
                    <div className="container">
                        <div className="max-w-4xl mx-auto">
                            <div className="flex justify-center">
                                <Button
                                    variant="outline"
                                    onClick={() => navigate('/blog')}
                                    className="flex items-center gap-2"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    Voltar ao Blog
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
} 