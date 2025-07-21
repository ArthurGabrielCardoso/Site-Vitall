import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import BookingForm from "@/components/BookingForm";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import TestimonialsSection from "@/components/TestimonialsSection";
import StatsSection from "@/components/StatsSection";
import ApartmentCard, { ApartmentProps } from "@/components/ApartmentCard";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, User } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { loadPublishedPosts } from "@/lib/supabaseBlogStorage";
import type { BlogPost } from "@/lib/supabase";
import { PROCEDIMENTOS } from "@/types/procedimento";

// Converter procedimentos para formato compatível com ApartmentCard
const featuredServices: ApartmentProps[] = PROCEDIMENTOS
  .filter(proc => !proc.imagem.includes('placeholder')) // Só procedimentos com fotos
  .slice(0, 6) // Limitar a 6 procedimentos no carrossel
  .map(proc => ({
    id: proc.id,
    name: proc.nome,
    description: proc.descricao,
    price: parseInt(proc.preco.replace(/[^\d]/g, '')) || 150, // Extrair número do preço
    capacity: 1,
    size: 45,
    image: proc.imagem,
    location: "VitallCheck-Up",
    features: proc.beneficios
  }));

export default function Index() {
  const { t } = useLanguage();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoadingBlog, setIsLoadingBlog] = useState(true);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);

    // Carrega os 3 posts mais recentes do blog do Supabase
    const loadBlogPosts = async () => {
      setIsLoadingBlog(true);
      try {
        const publishedPosts = await loadPublishedPosts();
        setBlogPosts(publishedPosts.slice(0, 6)); // Mostra até 6 posts no carrossel
      } catch (error) {
        console.error('Erro ao carregar posts do blog:', error);
        setBlogPosts([]);
      } finally {
        setIsLoadingBlog(false);
      }
    };

    loadBlogPosts();
  }, []);

  // Formatar data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };



  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection />

        {/* Welcome Section */}
        <section id="welcome" className="section">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="animate-fade-in [animation-delay:100ms]">
                <span className="text-sm text-primary font-medium uppercase tracking-wider">
                  {t.home.welcome.subtitle}
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6">
                  {t.home.welcome.title}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {t.home.welcome.description1}
                </p>
                <p className="text-muted-foreground mb-8">
                  {t.home.welcome.description2}
                </p>
                <Button asChild className="btn-primary">
                  <Link to="/about">
                    {t.home.welcome.learnMore} <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="relative animate-fade-in [animation-delay:300ms]">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=800&h=600&fit=crop"
                    alt="Consultório moderno"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 w-2/3 rounded-2xl overflow-hidden shadow-xl">
                  <img
                    src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400&h=300&fit=crop"
                    alt="Equipamentos odontológicos"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-6 -right-6 w-1/2 rounded-2xl overflow-hidden shadow-xl">
                  <img
                    src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=400&h=300&fit=crop"
                    alt="Atendimento personalizado"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Booking Section */}
        <section className="relative section bg-gradient-to-br from-primary via-primary/90 to-secondary text-white overflow-hidden">
          <div className="container relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="animate-fade-in [animation-delay:100ms]">
                <span className="text-sm text-primary-foreground/80 font-medium uppercase tracking-wider">
                  Transformação Completa
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6">
                  Veja a Diferença do Nosso Tratamento
                </h2>
                <p className="text-primary-foreground/90 mb-8">
                  Nossos tratamentos odontológicos transformam sorrisos e devolvem a confiança aos nossos pacientes.
                  Com tecnologia de ponta e profissionais especializados, oferecemos resultados excepcionais.
                </p>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-white" />
                    <span className="text-primary-foreground/90">Resultados visíveis em poucos dias</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-white" />
                    <span className="text-primary-foreground/90">Tecnologia de última geração</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-white" />
                    <span className="text-primary-foreground/90">Profissionais altamente qualificados</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-white" />
                    <span className="text-primary-foreground/90">Garantia de satisfação</span>
                  </li>
                </ul>

                <Button
                  size="lg"
                  variant="secondary"
                  className="rounded-full"
                  onClick={() => window.open("https://api.whatsapp.com/send?phone=5511934550921&text=Ol%C3%A1%21%20Vim%20pelo%20site%20e%20gostaria%20de%20agendar%20um%20hor%C3%A1rio%20o%20mais%20breve%20poss%C3%ADvel%2C%20pode%20me%20ajudar%3F", '_blank')}
                >
                  Agendar Consulta
                </Button>
              </div>

              <div className="animate-fade-in [animation-delay:300ms]">
                <BeforeAfterSlider
                  beforeImage="/antes.jpeg"
                  afterImage="/depois.jpeg"
                  className="shadow-2xl"
                />
                <p className="text-center text-primary-foreground/80 text-sm mt-4">
                  Arraste a barra para ver a transformação
                </p>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Top right decorative elements */}
            <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
              <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-white/20 blur-3xl" />
              <div className="absolute bottom-10 right-40 w-48 h-48 rounded-full bg-white/30 blur-3xl" />
            </div>

            {/* Bottom left decorative elements */}
            <div className="absolute bottom-0 left-0 w-1/4 h-full opacity-15">
              <div className="absolute bottom-20 left-10 w-32 h-32 rounded-full bg-secondary/40 blur-2xl" />
              <div className="absolute bottom-40 left-32 w-24 h-24 rounded-full bg-white/20 blur-xl" />
            </div>

            {/* Additional gradient overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
          </div>
        </section>

        {/* Stats Section */}
        <StatsSection />

        {/* Featured Apartments */}
        <section className="section">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in">
              <span className="text-sm text-primary font-medium uppercase tracking-wider">
                {t.home.featuredApartments.subtitle}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
                {t.home.featuredApartments.title}
              </h2>
              <p className="text-muted-foreground">
                {t.home.featuredApartments.description}
              </p>
            </div>

            <div className="relative">
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                plugins={[Autoplay({ delay: 3000 })]}
                className="w-full"
              >
                <CarouselContent className="-ml-2 md:-ml-4">
                  {featuredServices.map((service, index) => (
                    <CarouselItem key={service.id} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                      <div className="animate-fade-in" style={{ animationDelay: `${(index + 1) * 100}ms` }}>
                        <ApartmentCard apartment={service} />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="-left-4 text-secondary border-secondary/20 hover:bg-secondary hover:text-secondary-foreground" />
                <CarouselNext className="-right-4 text-secondary border-secondary/20 hover:bg-secondary hover:text-secondary-foreground" />
              </Carousel>
            </div>

            <div className="text-center mt-12">
              <Button asChild className="btn-secondary">
                <Link to="/procedimentos">
                  {t.home.featuredApartments.viewAll} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Blog Section */}
        <section className="section">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in">
              <span className="text-sm text-primary font-medium uppercase tracking-wider">
                Nosso Blog
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
                Dicas e Novidades em Saúde Bucal
              </h2>
              <p className="text-muted-foreground">
                Mantenha-se informado com nossas dicas de saúde bucal, novidades em tratamentos e cuidados preventivos.
              </p>
            </div>

            {isLoadingBlog ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">⚙️</div>
                <h3 className="text-xl font-semibold mb-4">
                  Carregando conteúdos...
                </h3>
                <p className="text-muted-foreground mb-6">
                  Estamos preparando artigos incríveis sobre saúde bucal para você.
                </p>
              </div>
            ) : blogPosts.length > 0 ? (
              <>
                <div className="relative">
                  <Carousel
                    opts={{
                      align: "start",
                      loop: true,
                    }}
                    plugins={[Autoplay({ delay: 4000 })]}
                    className="w-full"
                  >
                    <CarouselContent className="-ml-2 md:-ml-4">
                      {blogPosts.map((post, index) => (
                        <CarouselItem key={post.id} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                          <div className="animate-fade-in" style={{ animationDelay: `${(index + 1) * 100}ms` }}>
                            <Link to={`/blog/${post.slug}`} className="block">
                              <article className="glass-card rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group h-full">
                                <div className="aspect-[4/3] overflow-hidden">
                                  <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                  />
                                </div>
                                <div className="p-6 flex flex-col h-full">
                                  <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                      <Calendar className="h-4 w-4" />
                                      {formatDate(post.date)}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <User className="h-4 w-4" />
                                      {post.author}
                                    </div>
                                  </div>
                                  <h3 className="text-xl font-semibold mt-2 mb-3 line-clamp-2 flex-grow">{post.title}</h3>
                                  <div
                                    className="text-muted-foreground mb-4 line-clamp-2 prose prose-sm max-w-none [&>strong]:font-bold [&>em]:italic [&>a]:text-primary"
                                    dangerouslySetInnerHTML={{ __html: post.excerpt }}
                                  />
                                  <div className="flex items-center justify-between mt-auto">
                                    <span className="text-sm text-primary bg-primary/10 px-3 py-1 rounded-full">
                                      {post.category}
                                    </span>
                                    <span className="text-primary hover:text-primary/80 font-medium transition-colors flex items-center gap-1">
                                      Ler mais
                                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </span>
                                  </div>
                                </div>
                              </article>
                            </Link>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="-left-4 text-primary border-primary/20 hover:bg-primary hover:text-primary-foreground" />
                    <CarouselNext className="-right-4 text-primary border-primary/20 hover:bg-primary hover:text-primary-foreground" />
                  </Carousel>
                </div>

                <div className="text-center mt-12">
                  <Button asChild className="btn-primary">
                    <Link to="/blog">
                      Ver Todos os Posts <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold mb-4">
                  Em breve, novos conteúdos!
                </h3>
                <p className="text-muted-foreground mb-6">
                  Estamos preparando artigos incríveis sobre saúde bucal para você.
                </p>
              </div>
            )}
          </div>
        </section>



        {/* Testimonials Section */}
        <TestimonialsSection />

        {/* CTA Section */}
        <section className="relative py-24 bg-primary/5">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                {t.home.cta.title}
              </h2>
              <p className="text-muted-foreground mb-8">
                {t.home.cta.description}
              </p>
              <Button
                size="lg"
                className="btn-secondary"
                onClick={() => window.open("https://api.whatsapp.com/send?phone=5511934550921&text=Ol%C3%A1%21%20Vim%20pelo%20site%20e%20gostaria%20de%20agendar%20um%20hor%C3%A1rio%20o%20mais%20breve%20poss%C3%ADvel%2C%20pode%20me%20ajudar%3F", '_blank')}
              >
                {t.home.cta.bookNow}
              </Button>
            </div>
          </div>


        </section>
      </main>

      <Footer />
    </div>
  );
}
