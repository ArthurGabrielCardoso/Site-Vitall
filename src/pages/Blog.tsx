import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, User, Search, Grid, List, ArrowRight, BookOpen, Filter, SortAsc } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { loadPublishedPosts, searchPosts, loadPostsByCategory, BlogPost, getPostStats } from "@/lib/blogAdapter";
import { formatReadingTime } from "@/lib/readingTime";

const categories = ["Todos", "Prevenção", "Tratamentos", "Estética"];
const sortOptions = [
    { value: "date-desc", label: "Mais Recentes" },
    { value: "date-asc", label: "Mais Antigos" },
    { value: "title-asc", label: "A-Z" },
    { value: "title-desc", label: "Z-A" }
];

export default function Blog() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Todos");
    const [sortBy, setSortBy] = useState("date-desc");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [isLoading, setIsLoading] = useState(true);

    const postsPerPage = 6;

    // SEO para a página do blog
    useSEO({
        title: "Blog - Dicas de Saúde Bucal | VitallCheck-Up",
        description: "Descubra dicas valiosas de saúde bucal, tratamentos odontológicos e cuidados preventivos no blog da VitallCheck-Up. Mantenha seu sorriso saudável!",
        keywords: ["blog odontológico", "saúde bucal", "dicas dentais", "prevenção dental", "tratamentos dentários", "estética dental", "cuidados bucais"],
        url: `${window.location.origin}/blog`,
        type: 'website'
    });

    useEffect(() => {
        loadBlogPosts();
    }, []);

    useEffect(() => {
        applyFiltersAndSort();
    }, [posts, searchTerm, selectedCategory, sortBy]);

    const loadBlogPosts = async () => {
        setIsLoading(true);
        try {
            const publishedPosts = await loadPublishedPosts();
            setPosts(publishedPosts);
        } catch (error) {
            console.error('Erro ao carregar posts:', error);
            setPosts([]);
        } finally {
            setIsLoading(false);
        }
    };

    const applyFiltersAndSort = async () => {
        let filtered = posts;

        // Aplicar busca
        if (searchTerm.trim()) {
            filtered = await searchPosts(searchTerm);
        }

        // Aplicar filtro de categoria
        if (selectedCategory !== "Todos") {
            filtered = filtered.filter(post => post.category === selectedCategory);
        }

        // Aplicar ordenação
        filtered = [...filtered].sort((a, b) => {
            switch (sortBy) {
                case "date-desc":
                    return new Date(b.date).getTime() - new Date(a.date).getTime();
                case "date-asc":
                    return new Date(a.date).getTime() - new Date(b.date).getTime();
                case "title-asc":
                    return a.title.localeCompare(b.title);
                case "title-desc":
                    return b.title.localeCompare(a.title);
                default:
                    return 0;
            }
        });

        setFilteredPosts(filtered);
        setCurrentPage(1); // Reset para primeira página quando filtros mudam
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    // Cálculos de paginação
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const currentPosts = filteredPosts.slice(startIndex, endIndex);

    // Estatísticas do blog
    const [stats, setStats] = useState({ total: 0, published: 0, drafts: 0, categories: {} });

    useEffect(() => {
        const loadStats = async () => {
            const blogStats = await getPostStats();
            setStats(blogStats);
        };
        loadStats();
    }, [posts]);

    const BlogCard = ({ post }: { post: BlogPost }) => (
        <Link to={`/blog/${post.slug}`} className="block">
            <article
                className={`glass-card rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group ${viewMode === "list" ? "flex flex-col sm:flex-row gap-4 sm:gap-6" : ""
                    }`}
            >
                <div className={`${viewMode === "list"
                    ? "w-full sm:w-80 sm:flex-shrink-0 aspect-[16/9] sm:aspect-[4/3]"
                    : "aspect-[4/3]"
                    } overflow-hidden`}>
                    <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                </div>
                <div className={`p-4 md:p-6 ${viewMode === "list" ? "flex-1" : ""}`}>
                    <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-3 text-xs md:text-sm text-muted-foreground">
                        <Badge variant="secondary" className="text-xs">
                            {post.category}
                        </Badge>
                        <div className="flex items-center gap-1">
                            <Calendar className="h-3 md:h-4 w-3 md:w-4" />
                            <span className="hidden sm:inline">{formatDate(post.date)}</span>
                            <span className="sm:hidden">{post.date.split('-').reverse().join('/')}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock className="h-3 md:h-4 w-3 md:w-4" />
                            {formatReadingTime(post.content)}
                        </div>
                    </div>
                    <h2 className={`font-bold mb-3 line-clamp-2 hover:text-primary transition-colors ${viewMode === "list" ? "text-lg md:text-xl" : "text-base md:text-lg"
                        }`}>
                        {post.title}
                    </h2>
                    <div
                        className={`text-muted-foreground mb-4 ${viewMode === "list" ? "line-clamp-2 md:line-clamp-3" : "line-clamp-2"
                            } prose prose-sm max-w-none [&>*]:mb-2 [&>strong]:font-bold [&>em]:italic [&>a]:text-primary [&>ul]:list-disc [&>ul]:pl-4 [&>ol]:list-decimal [&>ol]:pl-4 [&>li]:mb-1 text-sm md:text-base`}
                        dangerouslySetInnerHTML={{ __html: post.excerpt }}
                    />
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                            <User className="h-3 md:h-4 w-3 md:w-4" />
                            <span>{post.author}</span>
                        </div>
                        <span className="text-primary hover:text-primary/80 font-medium transition-colors flex items-center gap-1 group text-xs md:text-sm">
                            Ler mais
                            <ArrowRight className="h-3 md:h-4 w-3 md:w-4 transition-transform group-hover:translate-x-1" />
                        </span>
                    </div>
                </div>
            </article>
        </Link>
    );

    const EmptyState = () => (
        <div className="text-center py-16">
            <div className="text-6xl mb-4">📰</div>
            <h3 className="text-xl font-semibold mb-2">
                {searchTerm || selectedCategory !== "Todos"
                    ? "Nenhum post encontrado"
                    : "Nenhum post publicado ainda"}
            </h3>
            <p className="text-muted-foreground mb-6">
                {searchTerm || selectedCategory !== "Todos"
                    ? "Tente ajustar seus filtros ou termo de busca"
                    : "Volte em breve para conferir nossos primeiros artigos"}
            </p>
            {(searchTerm || selectedCategory !== "Todos") && (
                <Button
                    variant="outline"
                    onClick={() => {
                        setSearchTerm("");
                        setSelectedCategory("Todos");
                    }}
                >
                    Limpar Filtros
                </Button>
            )}
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 pt-20">
                {/* Hero Section - Mobile optimized */}
                <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-br from-primary/5 via-white to-blue-50/30">
                    <div className="container text-center px-4">
                        <div className="inline-flex items-center gap-2 bg-primary/10 px-3 md:px-4 py-2 rounded-full text-primary font-medium mb-4 md:mb-6 text-sm md:text-base">
                            <BookOpen className="h-4 w-4" />
                            Blog VitallCheck-Up
                        </div>
                        <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 leading-tight">
                            Cuidados com a <span className="text-primary">Saúde Bucal</span>
                        </h1>
                        <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto mb-6 md:mb-8 leading-relaxed">
                            Descubra dicas, tratamentos e informações essenciais para manter
                            seu sorriso sempre saudável e radiante
                        </p>
                    </div>
                </section>

                {/* Filters and Search */}
                <section className="py-4 md:py-8 border-b bg-white sticky top-20 z-10 shadow-sm">
                    <div className="container">
                        {/* Mobile-first responsive layout */}
                        <div className="space-y-4">
                            {/* Search - Full width on mobile */}
                            <div className="relative w-full">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Buscar artigos..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 w-full"
                                />
                            </div>

                            {/* Filters row - Responsive layout */}
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
                                {/* Category Filter */}
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                    <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                        <SelectTrigger className="w-full sm:w-36 md:w-40">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map(category => (
                                                <SelectItem key={category} value={category}>
                                                    {category}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Sort */}
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                    <SortAsc className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                    <Select value={sortBy} onValueChange={setSortBy}>
                                        <SelectTrigger className="w-full sm:w-36 md:w-40">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {sortOptions.map(option => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* View Toggle - Hidden on small mobile, visible on larger screens */}
                                <div className="hidden sm:flex border rounded-lg overflow-hidden flex-shrink-0">
                                    <Button
                                        variant={viewMode === "grid" ? "default" : "ghost"}
                                        size="sm"
                                        onClick={() => setViewMode("grid")}
                                        className="rounded-none px-3"
                                    >
                                        <Grid className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant={viewMode === "list" ? "default" : "ghost"}
                                        size="sm"
                                        onClick={() => setViewMode("list")}
                                        className="rounded-none px-3"
                                    >
                                        <List className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Active Filters */}
                        {(searchTerm || selectedCategory !== "Todos") && (
                            <div className="flex items-center gap-2 mt-4 text-sm">
                                <span className="text-muted-foreground">Filtros ativos:</span>
                                {searchTerm && (
                                    <Badge variant="secondary" className="gap-1">
                                        Busca: "{searchTerm}"
                                        <button onClick={() => setSearchTerm("")} className="ml-1 hover:text-destructive">
                                            ×
                                        </button>
                                    </Badge>
                                )}
                                {selectedCategory !== "Todos" && (
                                    <Badge variant="secondary" className="gap-1">
                                        {selectedCategory}
                                        <button onClick={() => setSelectedCategory("Todos")} className="ml-1 hover:text-destructive">
                                            ×
                                        </button>
                                    </Badge>
                                )}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        setSearchTerm("");
                                        setSelectedCategory("Todos");
                                    }}
                                    className="h-auto p-1 text-muted-foreground hover:text-foreground"
                                >
                                    Limpar todos
                                </Button>
                            </div>
                        )}
                    </div>
                </section>

                {/* Blog Posts */}
                <section className="py-12">
                    <div className="container">
                        {isLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {[...Array(6)].map((_, i) => (
                                    <Card key={i} className="animate-pulse">
                                        <CardContent className="p-0">
                                            <div className="aspect-[4/3] bg-gray-200"></div>
                                            <div className="p-6 space-y-3">
                                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                                <div className="space-y-2">
                                                    <div className="h-3 bg-gray-200 rounded"></div>
                                                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : filteredPosts.length === 0 ? (
                            <EmptyState />
                        ) : (
                            <>
                                {/* Results count - Mobile responsive */}
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-6 md:mb-8">
                                    <p className="text-muted-foreground text-sm md:text-base">
                                        {filteredPosts.length} artigo{filteredPosts.length !== 1 ? 's' : ''} encontrado{filteredPosts.length !== 1 ? 's' : ''}
                                        {selectedCategory !== "Todos" && ` em ${selectedCategory}`}
                                        {searchTerm && ` para "${searchTerm}"`}
                                    </p>
                                    <p className="text-xs sm:text-sm text-muted-foreground">
                                        Página {currentPage} de {totalPages}
                                    </p>
                                </div>

                                {/* Posts Grid/List - Mobile optimized */}
                                <div className={
                                    viewMode === "grid"
                                        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8"
                                        : "space-y-6 md:space-y-8"
                                }>
                                    {currentPosts.map((post) => (
                                        <BlogCard key={post.id} post={post} />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="mt-12">
                                        <Pagination>
                                            <PaginationContent>
                                                <PaginationItem>
                                                    <PaginationPrevious
                                                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                                    />
                                                </PaginationItem>

                                                {[...Array(totalPages)].map((_, index) => {
                                                    const page = index + 1;
                                                    return (
                                                        <PaginationItem key={page}>
                                                            <PaginationLink
                                                                onClick={() => setCurrentPage(page)}
                                                                isActive={currentPage === page}
                                                                className="cursor-pointer"
                                                            >
                                                                {page}
                                                            </PaginationLink>
                                                        </PaginationItem>
                                                    );
                                                })}

                                                <PaginationItem>
                                                    <PaginationNext
                                                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                                    />
                                                </PaginationItem>
                                            </PaginationContent>
                                        </Pagination>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </section>

                {/* CTA Section - Mobile optimized */}
                <section className="py-12 md:py-16 bg-gradient-to-r from-primary/10 to-blue-50/50">
                    <div className="container text-center px-4">
                        <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 leading-tight">
                            Precisa de Atendimento Personalizado?
                        </h3>
                        <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed">
                            Nossa equipe especializada está pronta para cuidar da sua saúde bucal
                            com excelência e tecnologia de ponta
                        </p>
                        <Button
                            size="lg"
                            className="btn-primary w-full sm:w-auto"
                            onClick={() => window.open("https://api.whatsapp.com/send?phone=5511934550921&text=Ol%C3%A1%21%20Vim%20do%20blog%20e%20gostaria%20de%20agendar%20uma%20consulta%2C%20pode%20me%20ajudar%3F", '_blank')}
                        >
                            Agendar Consulta
                        </Button>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
} 