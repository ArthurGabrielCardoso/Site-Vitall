
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { X, Play, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

// Interface para itens da galeria (fotos e vídeos)
interface GalleryItem {
  id: number;
  src: string;
  alt: string;
  type: 'image' | 'video';
  thumbnail?: string; // Para vídeos, uma imagem de capa
}

// Galeria do Sorriso - fotos e vídeos reais da clínica
const galleryItems: GalleryItem[] = [
  // Fotos reais da clínica VitallCheck-Up
  {
    id: 1,
    src: "/Galeria/fotos/1.jpeg",
    alt: "Sorriso transformado - Resultado de tratamento completo",
    type: 'image'
  },
  {
    id: 2,
    src: "/Galeria/fotos/2.jpeg",
    alt: "Tratamento ortodôntico - Alinhamento perfeito",
    type: 'image'
  },
  {
    id: 3,
    src: "/Galeria/fotos/3.jpeg",
    alt: "Clareamento dental - Sorriso radiante e natural",
    type: 'image'
  },
  {
    id: 4,
    src: "/Galeria/fotos/4.jpeg",
    alt: "Implante dentário - Recuperação e resultado final",
    type: 'image'
  },
  {
    id: 5,
    src: "/Galeria/fotos/5.jpeg",
    alt: "Facetas de porcelana - Sorriso harmonioso",
    type: 'image'
  },
  {
    id: 6,
    src: "/Galeria/fotos/6.jpeg",
    alt: "Limpeza profissional - Saúde bucal em dia",
    type: 'image'
  },
  {
    id: 7,
    src: "/Galeria/fotos/7.jpeg",
    alt: "Consultório moderno - Ambiente acolhedor da VitallCheck-Up",
    type: 'image'
  },
  {
    id: 8,
    src: "/Galeria/fotos/8.jpeg",
    alt: "Equipamentos de última geração - Tecnologia odontológica",
    type: 'image'
  },
  {
    id: 9,
    src: "/Galeria/fotos/9.jpeg",
    alt: "Paciente satisfeita - Confiança renovada",
    type: 'image'
  },
  {
    id: 10,
    src: "/Galeria/fotos/10.jpeg",
    alt: "Transformação completa - Antes e depois impressionante",
    type: 'image'
  },
  // Vídeos reais da clínica
  {
    id: 11,
    src: "/Galeria/videos/1.mov",
    alt: "Transformação do sorriso - Processo completo em vídeo",
    type: 'video',
    thumbnail: "/Galeria/fotos/1.jpeg" // Usando primeira foto como thumbnail
  },
  {
    id: 12,
    src: "/Galeria/videos/2.mp4",
    alt: "Depoimento de paciente - Experiência real na VitallCheck-Up",
    type: 'video',
    thumbnail: "/Galeria/fotos/9.jpeg" // Usando foto de paciente satisfeita
  }
];

export default function Gallery() {
  const { t } = useLanguage();
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  // Handle lightbox navigation
  const navigateGallery = (direction: "prev" | "next") => {
    if (selectedItem === null) return;

    const currentIndex = galleryItems.findIndex(item => item.id === selectedItem);
    let newIndex;

    if (direction === "prev") {
      newIndex = currentIndex > 0 ? currentIndex - 1 : galleryItems.length - 1;
    } else {
      newIndex = currentIndex < galleryItems.length - 1 ? currentIndex + 1 : 0;
    }

    setSelectedItem(galleryItems[newIndex].id);
  };

  // Handle keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedItem === null) return;

      if (e.key === "Escape") {
        setSelectedItem(null);
      } else if (e.key === "ArrowLeft") {
        navigateGallery("prev");
      } else if (e.key === "ArrowRight") {
        navigateGallery("next");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedItem]);

  const selectedItemData = selectedItem ? galleryItems.find(item => item.id === selectedItem) : null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-20">
        {/* Header Section */}
        <section className="relative py-20 bg-gradient-to-r from-primary/10 to-secondary/10 overflow-hidden">
          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center animate-fade-in">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Heart className="h-8 w-8 text-secondary" />
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                  Galeria do Sorriso
                </h1>
                <Heart className="h-8 w-8 text-secondary" />
              </div>
              <p className="text-muted-foreground text-lg mb-6">
                Transformações reais, sorrisos autênticos. Veja os resultados incríveis dos nossos tratamentos odontológicos.
              </p>
              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <span className="bg-white/70 px-3 py-1 rounded-full font-medium">
                  📸 10 Fotos Reais
                </span>
                <span className="bg-white/70 px-3 py-1 rounded-full font-medium">
                  🎬 2 Vídeos Exclusivos
                </span>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
            <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-secondary/50 blur-3xl" />
            <div className="absolute bottom-10 right-40 w-48 h-48 rounded-full bg-primary/50 blur-3xl" />
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="py-12">
          <div className="container">
            {/* Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {galleryItems.map((item, index) => (
                <div
                  key={item.id}
                  className="relative overflow-hidden rounded-xl aspect-[4/3] cursor-pointer group animate-fade-in hover:scale-[1.02] transition-transform duration-300"
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => setSelectedItem(item.id)}
                >
                  {item.type === 'image' ? (
                    <img
                      src={item.src}
                      alt={item.alt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                      onError={(e) => {
                        // Fallback para placeholder se a imagem não carregar
                        e.currentTarget.src = "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=400&h=300&fit=crop";
                      }}
                    />
                  ) : (
                    <>
                      <img
                        src={item.thumbnail || "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=400&h=300&fit=crop"}
                        alt={item.alt}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                      {/* Play button overlay for videos */}
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-white/90 rounded-full p-4">
                          <Play className="h-8 w-8 text-primary ml-1" />
                        </div>
                      </div>
                      {/* Video indicator */}
                      <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                        🎬 Vídeo
                      </div>
                    </>
                  )}

                  {/* Overlay with zoom effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-white text-sm font-medium">
                        {item.alt}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Lightbox Modal */}
      {selectedItem && selectedItemData && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full h-full flex items-center justify-center">
            {/* Close button */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
            >
              <X className="h-8 w-8" />
            </button>

            {/* Navigation buttons */}
            <button
              onClick={() => navigateGallery("prev")}
              className="absolute left-4 text-white hover:text-gray-300 transition-colors"
            >
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={() => navigateGallery("next")}
              className="absolute right-4 text-white hover:text-gray-300 transition-colors"
            >
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Content */}
            <div className="w-full h-full flex items-center justify-center">
              {selectedItemData.type === 'image' ? (
                <img
                  src={selectedItemData.src}
                  alt={selectedItemData.alt}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=800&h=600&fit=crop";
                  }}
                />
              ) : (
                <video
                  src={selectedItemData.src}
                  controls
                  autoPlay
                  className="max-w-full max-h-full"
                  onError={(e) => {
                    console.error('Erro ao carregar vídeo:', selectedItemData.src);
                  }}
                >
                  Seu navegador não suporta o elemento de vídeo.
                </video>
              )}
            </div>

            {/* Caption */}
            <div className="absolute bottom-4 left-4 right-4 text-center">
              <p className="text-white text-lg font-medium">
                {selectedItemData.alt}
              </p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
