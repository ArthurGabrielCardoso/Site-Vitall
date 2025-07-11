
import { useState } from "react";
import { CalendarIcon, User, Phone, Stethoscope } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";

export default function BookingForm() {
  const { t } = useLanguage();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [procedimento, setProcedimento] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Create WhatsApp message with form data
    const data = selectedDate ? format(selectedDate, "dd/MM/yyyy") : "";
    const mensagem = `Olá! Vim pelo site e gostaria de agendar uma consulta.%0A%0ANome: ${nome}%0ATelefone: ${telefone}%0AProcedimento: ${procedimento}%0AData preferida: ${data}%0A%0APode me ajudar?`;
    const whatsappUrl = `https://api.whatsapp.com/send?phone=5511934550921&text=${mensagem}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-card p-6 space-y-6 animate-fade-in [animation-delay:200ms]"
    >
      <h3 className="text-2xl font-bold text-center mb-6">Agendar Consulta</h3>

      <div className="space-y-4">
        {/* Nome */}
        <div className="space-y-2">
          <label htmlFor="nome" className="block text-sm font-medium">
            Nome Completo
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="nome"
              type="text"
              placeholder="Seu nome completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        {/* Telefone */}
        <div className="space-y-2">
          <label htmlFor="telefone" className="block text-sm font-medium">
            Telefone
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="telefone"
              type="tel"
              placeholder="(11) 99999-9999"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Procedimento */}
          <div className="space-y-2">
            <label htmlFor="procedimento" className="block text-sm font-medium">
              Procedimento Desejado
            </label>
            <Select value={procedimento} onValueChange={setProcedimento} required>
              <SelectTrigger id="procedimento" className="w-full">
                <SelectValue placeholder="Selecione o procedimento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="limpeza">Limpeza e Profilaxia</SelectItem>
                <SelectItem value="consulta">Consulta de Avaliação</SelectItem>
                <SelectItem value="clareamento">Clareamento Dental</SelectItem>
                <SelectItem value="restauracao">Restauração</SelectItem>
                <SelectItem value="canal">Tratamento de Canal</SelectItem>
                <SelectItem value="implante">Implante Dentário</SelectItem>
                <SelectItem value="ortodontia">Ortodontia</SelectItem>
                <SelectItem value="protese">Prótese Dentária</SelectItem>
                <SelectItem value="urgencia">Urgência</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Data Preferida */}
          <div className="space-y-2">
            <label htmlFor="data" className="block text-sm font-medium">
              Data Preferida
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="data"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "dd/MM/yyyy") : <span>Selecionar data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                  disabled={(date) => date < new Date()}
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full btn-primary relative">
        <Stethoscope className="mr-2 h-4 w-4" />
        Agendar Consulta
      </Button>
    </form>
  );
}
