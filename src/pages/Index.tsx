import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import BookingForm from "@/components/BookingForm";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import TestimonialsSection from "@/components/TestimonialsSection";
import ApartmentCard, { ApartmentProps } from "@/components/ApartmentCard";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Shield, Heart, Stethoscope, MapPin, Clock, Calendar, User } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { loadPublishedPosts } from "@/lib/supabaseBlogStorage";
import type { BlogPost } from "@/lib/supabase";

// Sample dental services data - Procedimentos Odontológicos
const featuredServices: ApartmentProps[] = [
  {
    id: "1",
    name: "Limpeza e Profilaxia",
    description: "Limpeza profissional completa com aplicação de flúor e orientações personalizadas de higiene bucal.",
    price: 120,
    capacity: 1,
    size: 30,
    image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&h=600&fit=crop",
    location: "Consultório Principal",
    features: ["Limpeza", "Flúor", "Orientação", "Raio-X", "Avaliação", "Polimento"]
  },
  {
    id: "2",
    name: "Implantes Dentários",
    description: "Implantes de alta qualidade com tecnologia avançada e acompanhamento completo durante todo o processo.",
    price: 2500,
    capacity: 1,
    size: 60,
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop",
    location: "Sala Cirúrgica",
    features: ["Implante", "Prótese", "Acompanhamento", "Garantia", "Raio-X 3D", "Pós-operatório"]
  },
  {
    id: "3",
    name: "Ortodontia",
    description: "Tratamento ortodôntico personalizado com aparelhos modernos e eficazes para alinhamento dental.",
    price: 350,
    capacity: 1,
    size: 45,
    image: "https://images.unsplash.com/photo-1623734576084-d1b5b1e3e9b1?w=800&h=600&fit=crop",
    location: "Consultório Ortodôntico",
    features: ["Aparelho", "Manutenção", "Acompanhamento", "Moldagem", "Planejamento"]
  },
  {
    id: "4",
    name: "Clareamento Dental",
    description: "Clareamento profissional para um sorriso mais branco e radiante com técnicas seguras e eficazes.",
    price: 450,
    capacity: 1,
    size: 90,
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&h=600&fit=crop",
    location: "Consultório Estético",
    features: ["Clareamento", "Moldeira", "Gel", "LED", "Manutenção", "Orientação"]
  },
  {
    id: "5",
    name: "Restaurações",
    description: "Restaurações estéticas em resina ou porcelana para recuperar função e beleza dos dentes danificados.",
    price: 180,
    capacity: 1,
    size: 45,
    image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&h=600&fit=crop",
    location: "Consultório Geral",
    features: ["Restauração", "Estética", "Durabilidade", "Naturalidade", "Funcionalidade"]
  },
  {
    id: "6",
    name: "Tratamento de Canal",
    description: "Endodontia especializada para preservar dentes com infecções ou lesões pulpares usando técnicas modernas.",
    price: 380,
    capacity: 1,
    size: 60,
    image: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=800&h=600&fit=crop",
    location: "Consultório Endodôntico",
    features: ["Endodontia", "Microscopia", "Preservação", "Alívio da dor", "Técnica moderna"]
  },
  {
    id: "7",
    name: "Periodontia",
    description: "Tratamento especializado de doenças gengivais e periodontais para manter gengivas saudáveis.",
    price: 280,
    capacity: 1,
    size: 60,
    image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&h=600&fit=crop",
    location: "Consultório Periodontal",
    features: ["Periodontia", "Gengiva", "Prevenção", "Raspagem", "Manutenção"]
  },
  {
    id: "8",
    name: "Próteses Dentárias",
    description: "Próteses fixas e removíveis personalizadas para restaurar função mastigatória e estética do sorriso.",
    price: 1200,
    capacity: 1,
    size: 90,
    image: "https://images.unsplash.com/photo-1643297654398-6a8b4c6b3f7c?w=800&h=600&fit=crop",
    location: "Laboratório Protético",
    features: ["Prótese", "Personalizada", "Funcionalidade", "Estética", "Conforto", "Durabilidade"]
  }
];

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

  // Feature items
  const features = [
    {
      icon: <Star className="h-8 w-8 text-primary" />,
      title: t.home.amenities.features.beachfront.title,
      description: t.home.amenities.features.beachfront.description
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: t.home.amenities.features.pools.title,
      description: t.home.amenities.features.pools.description
    },
    {
      icon: <Heart className="h-8 w-8 text-primary" />,
      title: t.home.amenities.features.restaurant.title,
      description: t.home.amenities.features.restaurant.description
    },
    {
      icon: <Stethoscope className="h-8 w-8 text-primary" />,
      title: t.home.amenities.features.wifi.title,
      description: t.home.amenities.features.wifi.description
    },
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      title: t.home.amenities.features.bar.title,
      description: t.home.amenities.features.bar.description
    },
    {
      icon: <MapPin className="h-8 w-8 text-primary" />,
      title: t.home.amenities.features.location.title,
      description: t.home.amenities.features.location.description
    }
  ];

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
                <Link to="/apartments">
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

        {/* Features Section */}
        <section className="section bg-secondary/5">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in">
              <span className="text-sm text-secondary font-medium uppercase tracking-wider">
                {t.home.amenities.subtitle}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
                {t.home.amenities.title}
              </h2>
              <p className="text-muted-foreground">
                {t.home.amenities.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="feature-card flex flex-col items-center text-center animate-fade-in"
                  style={{ animationDelay: `${(index + 1) * 100}ms` }}
                >
                  <div className="mb-4 p-3 rounded-full bg-secondary/10">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
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
