import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { useGoogleReviews, convertGoogleReviewToLocal } from "@/hooks/useGoogleReviews";
import { Button } from "@/components/ui/button";

interface Testimonial {
  id: number;
  name: string;
  location: string;
  avatar: string;
  content: string;
  rating: number;
  date?: string;
  googleUrl?: string;
}

// Depoimentos locais como fallback
const fallbackTestimonials: Testimonial[] = [
  {
    id: 1,
    name: "Ana Silva",
    location: "Mogi das Cruzes, SP",
    avatar: "https://ui-avatars.com/api/?name=Ana+Silva&background=0ea5e9&color=fff",
    content: "Excelente atendimento! A equipe é muito atenciosa e o ambiente é muito acolhedor. Recomendo a todos que buscam cuidados de qualidade.",
    rating: 5
  },
  {
    id: 2,
    name: "Carlos Oliveira",
    location: "Suzano, SP",
    avatar: "https://ui-avatars.com/api/?name=Carlos+Oliveira&background=0ea5e9&color=fff",
    content: "Profissionais muito competentes e dedicados. O atendimento superou minhas expectativas. Ambiente limpo e moderno.",
    rating: 5
  },
  {
    id: 3,
    name: "Maria Santos",
    location: "Poá, SP",
    avatar: "https://ui-avatars.com/api/?name=Maria+Santos&background=0ea5e9&color=fff",
    content: "Estou muito satisfeita com o tratamento. A equipe é muito profissional e o resultado foi excelente. Voltarei em breve!",
    rating: 4
  },
];

export default function TestimonialsSection() {
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const { reviews: googleReviews, loading, error, placeDetails } = useGoogleReviews();

  // Usar reviews do Google se disponível, senão usar fallback
  const testimonials: Testimonial[] = googleReviews.length > 0
    ? googleReviews.map((review, index) => convertGoogleReviewToLocal(review, index))
    : fallbackTestimonials;

  const nextTestimonial = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    setActiveIndex((prev) => (prev + 1) % testimonials.length);

    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  const prevTestimonial = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  useEffect(() => {
    const interval = setInterval(nextTestimonial, 8000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section className="section bg-muted py-20">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t.testimonials.title}
          </h2>
          <p className="text-muted-foreground mb-4">
            {t.testimonials.description}
          </p>

          {/* Informações do Google (se disponível) */}
          {placeDetails && (
            <div className="flex items-center justify-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.floor(placeDetails.rating || 0) ? "fill-primary text-primary" : "text-muted-foreground"}`}
                    />
                  ))}
                </div>
                <span className="font-semibold">{placeDetails.rating?.toFixed(1)}</span>
                <span className="text-muted-foreground">
                  ({placeDetails.user_ratings_total} avaliações no Google)
                </span>
              </div>
            </div>
          )}

          {/* Status de carregamento */}
          {loading && (
            <p className="text-sm text-muted-foreground">
              📡 Carregando avaliações do Google...
            </p>
          )}

          {/* Indicador de fonte dos dados */}
          {!loading && (
            <p className="text-xs text-muted-foreground mt-2">
              {googleReviews.length > 0
                ? "✅ Avaliações reais do Google Maps"
                : "💬 Depoimentos de nossos pacientes"
              }
            </p>
          )}
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="relative h-[450px] md:h-[350px]">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={cn(
                  "absolute inset-0 glass-card p-8 md:p-10 transition-all duration-500",
                  activeIndex === index
                    ? "opacity-100 translate-x-0 z-10"
                    : index < activeIndex
                      ? "opacity-0 -translate-x-full z-0"
                      : "opacity-0 translate-x-full z-0"
                )}
              >
                <div className="flex flex-col md:flex-row gap-6 h-full">
                  <div className="flex flex-col items-center md:items-start">
                    <div className="rounded-full overflow-hidden w-20 h-20 mb-4 border-2 border-primary">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback se a imagem não carregar
                          e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=0ea5e9&color=fff`;
                        }}
                      />
                    </div>
                    <div className="flex mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < testimonial.rating ? "fill-primary text-primary" : "text-muted-foreground"}`}
                        />
                      ))}
                    </div>
                    <h4 className="text-lg font-semibold text-center md:text-left">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground text-center md:text-left">{testimonial.location}</p>
                    {testimonial.date && (
                      <p className="text-xs text-muted-foreground text-center md:text-left mt-1">{testimonial.date}</p>
                    )}

                    {/* Link para ver no Google (se disponível) */}
                    {testimonial.googleUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 text-xs"
                        onClick={() => window.open(testimonial.googleUrl, '_blank')}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Ver no Google
                      </Button>
                    )}
                  </div>

                  <div className="flex-1 flex items-center">
                    <blockquote className="italic text-muted-foreground">
                      "{testimonial.content}"
                    </blockquote>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-8">
            <button
              onClick={prevTestimonial}
              className="p-2 rounded-full bg-card hover:bg-muted border border-border transition-colors"
              disabled={isAnimating}
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Previous testimonial</span>
            </button>

            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (isAnimating) return;
                    setIsAnimating(true);
                    setActiveIndex(index);
                    setTimeout(() => setIsAnimating(false), 500);
                  }}
                  className={`w-3 h-3 rounded-full transition-all ${activeIndex === index
                      ? "bg-primary w-6"
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextTestimonial}
              className="p-2 rounded-full bg-card hover:bg-muted border border-border transition-colors"
              disabled={isAnimating}
            >
              <ChevronRight className="h-5 w-5" />
              <span className="sr-only">Next testimonial</span>
            </button>
          </div>
        </div>

        {/* Link para mais avaliações */}
        {placeDetails && (
          <div className="text-center mt-8">
            <Button
              variant="outline"
              onClick={() => window.open(`https://www.google.com/maps/place/?q=place_id:${placeDetails.place_id}`, '_blank')}
              className="text-sm"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Ver todas as {placeDetails.user_ratings_total} avaliações no Google
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
