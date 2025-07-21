import { useState, useEffect } from "react";
import { Star, ExternalLink } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useGoogleReviews, convertGoogleReviewToLocal } from "@/hooks/useGoogleReviews";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

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
  const { reviews: googleReviews, loading, error, placeDetails } = useGoogleReviews();

  // Usar reviews do Google se disponível, senão usar fallback
  const testimonials: Testimonial[] = googleReviews.length > 0
    ? googleReviews.map((review, index) => convertGoogleReviewToLocal(review, index))
    : fallbackTestimonials;

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
                      className={`h-4 w-4 ${i < Math.floor(placeDetails.rating || 0) ? "fill-secondary text-secondary" : "text-muted-foreground"}`}
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
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={testimonial.id} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                  <div className="animate-fade-in" style={{ animationDelay: `${(index + 1) * 100}ms` }}>
                    <div className="glass-card p-6 h-full flex flex-col">
                      {/* Header com avatar e info */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="rounded-full overflow-hidden w-12 h-12 border-2 border-primary flex-shrink-0">
                          <img
                            src={testimonial.avatar}
                            alt={testimonial.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=0ea5e9&color=fff`;
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm truncate">{testimonial.name}</h4>
                          <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                          {testimonial.date && (
                            <p className="text-xs text-muted-foreground">{testimonial.date}</p>
                          )}
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < testimonial.rating ? "fill-secondary text-secondary" : "text-muted-foreground"}`}
                          />
                        ))}
                      </div>

                      {/* Content */}
                      <blockquote className="italic text-muted-foreground text-sm leading-relaxed flex-1">
                        "{testimonial.content}"
                      </blockquote>

                      {/* Link para Google (se disponível) */}
                      {testimonial.googleUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-4 text-xs self-start"
                          onClick={() => window.open(testimonial.googleUrl, '_blank')}
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Ver no Google
                        </Button>
                      )}
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-4 text-secondary border-secondary/20 hover:bg-secondary hover:text-secondary-foreground" />
            <CarouselNext className="-right-4 text-secondary border-secondary/20 hover:bg-secondary hover:text-secondary-foreground" />
          </Carousel>
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
