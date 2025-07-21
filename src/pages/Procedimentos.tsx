
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProcedimentoCard from "@/components/ProcedimentoCard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { PROCEDIMENTOS } from "@/types/procedimento";

export default function Procedimentos() {
  const { t } = useLanguage();
  const [filteredProcedimentos, setFilteredProcedimentos] = useState(PROCEDIMENTOS);
  const [categoriaFilter, setCategoriaFilter] = useState<string>("all");

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  // Apply filters
  useEffect(() => {
    let result = PROCEDIMENTOS;

    // Filter by categoria
    if (categoriaFilter !== "all") {
      result = result.filter(proc => proc.categoria === categoriaFilter);
    }

    setFilteredProcedimentos(result);
  }, [categoriaFilter]);

  // Get unique categories
  const categorias = ["all", ...new Set(PROCEDIMENTOS.map(proc => proc.categoria))];

  // Handle procedure detail view
  const handleSaberMais = (id: string) => {
    window.location.href = `/procedimento/${id}`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-20">
        {/* Header Section */}
        <section className="relative py-20 bg-gradient-to-r from-sea-light to-white dark:from-sea-dark dark:to-background overflow-hidden">
          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center animate-fade-in">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                {t.apartments.title}
              </h1>
              <p className="text-muted-foreground text-lg mb-6">
                {t.apartments.subtitle}
              </p>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute bottom-0 right-0 w-1/2 h-1/2 opacity-10">
            <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-primary/50 blur-3xl" />
            <div className="absolute top-10 right-40 w-48 h-48 rounded-full bg-sea-light blur-3xl" />
          </div>
        </section>

        {/* Filter Section */}
        <section className="py-8 border-b">
          <div className="container">
            <div className="flex justify-center animate-fade-in">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Categoria do Procedimento
                </label>
                <Select value={categoriaFilter} onValueChange={setCategoriaFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as categorias</SelectItem>
                    <SelectItem value="estetica">🌟 Estética</SelectItem>
                    <SelectItem value="terapeutico">🏥 Terapêutico</SelectItem>
                  </SelectContent>
                </Select>
              </div>


            </div>

            <div className="flex justify-between items-center mt-6 animate-fade-in [animation-delay:200ms]">
              <p className="text-muted-foreground">
                Mostrando {filteredProcedimentos.length} de {PROCEDIMENTOS.length} procedimentos
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setCategoriaFilter("all");
                }}
              >
                Limpar Filtros
              </Button>
            </div>
          </div>
        </section>

        {/* Procedimentos Grid */}
        <section className="section">
          <div className="container">
            {filteredProcedimentos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProcedimentos.map((procedimento, index) => (
                  <div key={procedimento.id} className="animate-fade-in" style={{ animationDelay: `${(index + 1) * 100}ms` }}>
                    <ProcedimentoCard
                      procedimento={procedimento}
                      onSaberMais={handleSaberMais}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 animate-fade-in">
                <h3 className="text-xl font-semibold mb-2">Nenhum procedimento encontrado</h3>
                <p className="text-muted-foreground mb-6">Ajuste os filtros para ver mais opções</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setCategoriaFilter("all");
                  }}
                >
                  Mostrar Todos
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
