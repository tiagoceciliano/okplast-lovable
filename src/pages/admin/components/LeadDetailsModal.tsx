import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Phone, Package, MapPin, Globe, Clock, Hash } from "lucide-react";

interface Lead {
  id: string;
  created_at: string;
  nome: string;
  email: string;
  telefone: string;
  produto_interesse: string;
  mensagem?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_content?: string | null;
  utm_term?: string | null;
  cidade?: string | null;
  estado?: string | null;
  pais?: string | null;
  ip_address?: string | null;
  total_registrations: number;
}

interface LeadDetailsModalProps {
  lead: Lead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LeadDetailsModal({ lead, open, onOpenChange }: LeadDetailsModalProps) {
  if (!lead) return null;

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
      time: date.toLocaleTimeString('pt-BR', { 
        timeZone: 'America/Sao_Paulo',
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  };

  const { date, time } = formatDateTime(lead.created_at);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Detalhes do Lead
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Dados Pessoais */}
          <div>
            <h3 className="font-semibold text-sm text-muted-foreground mb-3">Dados Pessoais</h3>
            <div className="grid gap-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{lead.nome}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{lead.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{lead.telefone}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Produto de Interesse */}
          <div>
            <h3 className="font-semibold text-sm text-muted-foreground mb-3">Produto de Interesse</h3>
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <Badge variant="secondary">{lead.produto_interesse}</Badge>
            </div>
          </div>

          {/* Mensagem */}
          {lead.mensagem && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground mb-3">Mensagem</h3>
                <p className="text-sm bg-muted p-3 rounded-md">{lead.mensagem}</p>
              </div>
            </>
          )}

          <Separator />

          {/* UTM Parameters */}
          <div>
            <h3 className="font-semibold text-sm text-muted-foreground mb-3">Parâmetros UTM</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><span className="text-muted-foreground">Source:</span> {lead.utm_source || '-'}</div>
              <div><span className="text-muted-foreground">Medium:</span> {lead.utm_medium || '-'}</div>
              <div><span className="text-muted-foreground">Campaign:</span> {lead.utm_campaign || '-'}</div>
              <div><span className="text-muted-foreground">Content:</span> {lead.utm_content || '-'}</div>
              <div><span className="text-muted-foreground">Term:</span> {lead.utm_term || '-'}</div>
            </div>
          </div>

          <Separator />

          {/* Localização */}
          <div>
            <h3 className="font-semibold text-sm text-muted-foreground mb-3">Localização</h3>
            <div className="grid gap-2 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>
                  {[lead.cidade, lead.estado, lead.pais].filter(Boolean).join(', ') || '-'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span className="font-mono text-xs">{lead.ip_address || '-'}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Data/Hora e Histórico */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground mb-3">Data/Hora do Cadastro</h3>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{date} às {time}</span>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground mb-3">Histórico de Cadastros</h3>
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <Badge variant={lead.total_registrations > 1 ? "destructive" : "outline"}>
                  {lead.total_registrations} cadastro{lead.total_registrations > 1 ? 's' : ''}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
