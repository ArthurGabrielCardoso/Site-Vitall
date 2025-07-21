import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Procedimento } from "../types/procedimento";

interface ProcedimentoCardProps {
    procedimento: Procedimento;
    onSaberMais?: (id: string) => void;
}

export default function ProcedimentoCard({ procedimento, onSaberMais }: ProcedimentoCardProps) {
    return (
        <Card
            className="group hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
            onClick={() => onSaberMais?.(procedimento.id)}
        >
            {/* Imagem com lazy loading e otimização */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={procedimento.imagem}
                    alt={procedimento.nome}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                        // Fallback para imagem padrão se não carregar
                        e.currentTarget.src = '/placeholder.svg';
                    }}
                />
                <Badge
                    variant="secondary"
                    className="absolute top-2 right-2 bg-white/90 text-gray-800"
                >
                    {procedimento.categoria}
                </Badge>
            </div>

            <CardHeader className="pb-2">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-dental transition-colors">
                    {procedimento.nome}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                    {procedimento.descricao}
                </p>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Benefícios */}
                <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-700">Benefícios:</p>
                    <div className="flex flex-wrap gap-1">
                        {procedimento.beneficios.slice(0, 3).map((beneficio, index) => (
                            <Badge
                                key={index}
                                variant="outline"
                                className="text-xs px-2 py-1"
                            >
                                {beneficio}
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* Indicador visual de clique */}
                <div className="text-center pt-2">
                    <span className="text-xs text-gray-500 group-hover:text-dental transition-colors">
                        Clique para ver detalhes →
                    </span>
                </div>
            </CardContent>
        </Card>
    );
} 