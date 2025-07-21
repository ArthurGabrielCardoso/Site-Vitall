import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProcedimentoCard from "@/components/ProcedimentoCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Share2, Calendar, Clock, Star, Heart, CheckCircle2, Phone, MessageCircle } from "lucide-react";
import { PROCEDIMENTOS, Procedimento } from "@/types/procedimento";
import { useSEO } from "@/hooks/useSEO";

export default function ProcedureDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [procedimento, setProcedimento] = useState<Procedimento | null>(null);
    const [relatedProcedimentos, setRelatedProcedimentos] = useState<Procedimento[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProcedimento = () => {
            if (!id) return;

            // Buscar procedimento por ID
            const foundProcedimento = PROCEDIMENTOS.find(p => p.id === id);

            if (!foundProcedimento) {
                // Procedimento não encontrado
                navigate('/procedimentos');
                return;
            }

            setProcedimento(foundProcedimento);

            // Buscar procedimentos relacionados (mesma categoria, máximo 3)
            const related = PROCEDIMENTOS
                .filter(p => p.id !== id && p.categoria === foundProcedimento.categoria)
                .slice(0, 3);

            setRelatedProcedimentos(related);
            setLoading(false);
        };

        loadProcedimento();
    }, [id, navigate]);

    // SEO Configuration
    useSEO({
        title: procedimento ? `${procedimento.nome} | VitallCheck-Up` : "Procedimento não encontrado",
        description: procedimento ? procedimento.descricao : "Procedimento não encontrado na VitallCheck-Up",
        keywords: procedimento ? [
            procedimento.categoria,
            "saúde bucal",
            "odontologia",
            "dentes",
            ...procedimento.nome.toLowerCase().split(' ').filter(word => word.length > 3)
        ] : ["procedimentos", "saúde bucal"],
        url: `${window.location.origin}/procedimento/${id}`,
        type: 'article',
        image: procedimento?.imagem
    });

    const handleShare = async () => {
        if (navigator.share && procedimento) {
            try {
                await navigator.share({
                    title: procedimento.nome,
                    text: procedimento.descricao,
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

    const handleAgendarConsulta = () => {
        const mensagem = `Olá! Vi o procedimento "${procedimento?.nome}" no site e gostaria de agendar uma consulta para saber mais. Pode me ajudar?`;
        const urlWhatsApp = `https://api.whatsapp.com/send?phone=5511934550921&text=${encodeURIComponent(mensagem)}`;
        window.open(urlWhatsApp, '_blank');
    };

    const handleSaberMais = (id: string) => {
        navigate(`/procedimento/${id}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1 pt-20">
                    <div className="container py-20">
                        <div className="text-center">
                            <div className="text-6xl mb-4">⚙️</div>
                            <h3 className="text-xl font-semibold mb-4">Carregando procedimento...</h3>
                            <p className="text-muted-foreground">Aguarde um momento.</p>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (!procedimento) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1 pt-20">
                    <div className="container py-20">
                        <div className="text-center">
                            <div className="text-6xl mb-4">❌</div>
                            <h3 className="text-xl font-semibold mb-4">Procedimento não encontrado</h3>
                            <p className="text-muted-foreground mb-6">O procedimento que você está procurando não existe ou foi removido.</p>
                            <Button asChild>
                                <Link to="/procedimentos">Ver Todos os Procedimentos</Link>
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
                {/* Back Button */}
                <section className="py-4 border-b bg-gray-50/50">
                    <div className="container">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate('/procedimentos')}
                                className="gap-2"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Voltar aos Procedimentos
                            </Button>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Link to="/" className="hover:text-primary transition-colors">Início</Link>
                                <span>/</span>
                                <Link to="/procedimentos" className="hover:text-primary transition-colors">Procedimentos</Link>
                                <span>/</span>
                                <span className="text-foreground">{procedimento.nome}</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Procedure Header */}
                <section className="py-8">
                    <div className="container">
                        <div className="max-w-4xl mx-auto">
                            <div className="text-center mb-8">
                                <Badge variant={procedimento.categoria === 'estetica' ? 'default' : 'secondary'} className="mb-4">
                                    {procedimento.categoria === 'estetica' ? '✨ Estética' : '🏥 Terapêutico'}
                                </Badge>
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                                    {procedimento.nome}
                                </h1>
                                <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
                                    {procedimento.descricao}
                                </p>
                                <div className="flex gap-3 justify-center">
                                    <Button onClick={handleAgendarConsulta} size="lg" className="gap-2">
                                        <MessageCircle className="h-5 w-5" />
                                        Agendar Consulta
                                    </Button>
                                    <Button onClick={handleShare} variant="outline" size="lg" className="gap-2">
                                        <Share2 className="h-4 w-4" />
                                        Compartilhar
                                    </Button>
                                </div>
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
                                    src={procedimento.imagem}
                                    alt={procedimento.nome}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src = '/placeholder.svg';
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Procedure Content */}
                <section className="pb-12">
                    <div className="container">
                        <div className="max-w-4xl mx-auto">
                            {/* Benefícios */}
                            <div className="mb-12">
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                    <Heart className="h-6 w-6 text-red-500" />
                                    Benefícios do Tratamento
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {procedimento.beneficios.map((beneficio, index) => (
                                        <div key={index} className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                                            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                                            <span className="text-green-800 font-medium">{beneficio}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Detalhes do Procedimento */}
                            <div className="mb-12">
                                <h2 className="text-2xl font-bold mb-6">Sobre o Procedimento</h2>
                                <div className="prose prose-lg max-w-none">
                                    <p className="text-muted-foreground leading-relaxed mb-4">
                                        {procedimento.descricao}
                                    </p>
                                    <p className="text-muted-foreground leading-relaxed mb-4">
                                        Na VitallCheck-Up, utilizamos as mais modernas técnicas e equipamentos para garantir
                                        que você receba o melhor tratamento possível. Nossa equipe de especialistas está
                                        preparada para oferecer um atendimento personalizado e de alta qualidade.
                                    </p>
                                    <p className="text-muted-foreground leading-relaxed">
                                        Todos os nossos procedimentos seguem rigorosos protocolos de segurança e higiene,
                                        garantindo sua tranquilidade e os melhores resultados para sua saúde bucal.
                                    </p>
                                </div>
                            </div>

                            <Separator className="my-12" />

                            {/* Call to Action */}
                            <div className="text-center bg-gradient-to-r from-blue-50 to-cyan-50 p-8 rounded-2xl">
                                <h3 className="text-2xl font-bold mb-4">Interessado neste procedimento?</h3>
                                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                                    Agende uma consulta de avaliação e saiba como podemos ajudar você a conquistar
                                    o sorriso dos seus sonhos. Nossa equipe especializada está pronta para atendê-lo!
                                </p>
                                <div className="flex gap-4 justify-center flex-wrap">
                                    <Button
                                        size="lg"
                                        onClick={handleAgendarConsulta}
                                        className="gap-2"
                                    >
                                        <MessageCircle className="h-5 w-5" />
                                        Agendar pelo WhatsApp
                                    </Button>
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        onClick={() => window.open("tel:+5511934550921", '_self')}
                                        className="gap-2"
                                    >
                                        <Phone className="h-5 w-5" />
                                        Ligar Agora
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Related Procedures */}
                {relatedProcedimentos.length > 0 && (
                    <section className="py-16 bg-gray-50/50">
                        <div className="container">
                            <div className="max-w-6xl mx-auto">
                                <div className="text-center mb-12">
                                    <h2 className="text-3xl font-bold mb-4">Procedimentos Relacionados</h2>
                                    <p className="text-muted-foreground">
                                        Outros tratamentos na categoria {procedimento.categoria === 'estetica' ? 'Estética' : 'Terapêutico'}
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {relatedProcedimentos.map((related, index) => (
                                        <div key={related.id} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                                            <ProcedimentoCard
                                                procedimento={related}
                                                onSaberMais={handleSaberMais}
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div className="text-center mt-12">
                                    <Button asChild variant="outline" size="lg">
                                        <Link to="/procedimentos">Ver Todos os Procedimentos</Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </section>
                )}
            </main>

            <Footer />
        </div>
    );
} 