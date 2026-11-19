import { Link } from "@/lib/router-compat";
import { ConfiguracoesLayout } from "./components/ConfiguracoesLayout";
import { ChevronRight, MessageSquareText, QrCode, ShieldCheck } from "lucide-react";

const canais = [
  { to: "/admin/conexoes", icon: QrCode, titulo: "WhatsApp via QR Code", desc: "Números dos vendedores conectados pelo QR Code, sem limite de 24h." },
  { to: "/admin/whatsapp", icon: ShieldCheck, titulo: "WhatsApp API oficial", desc: "Número oficial da Meta e membros de atendimento." },
  { to: "/admin/modelos", icon: MessageSquareText, titulo: "Modelos de mensagem", desc: "Templates aprovados pela Meta para a API oficial." },
];

export default function AdminCanais() {
  return (
    <ConfiguracoesLayout active="canais">
      <h2 className="text-xl font-bold">Canais</h2>
      <p className="mb-5 text-sm text-muted-foreground">Escolha um canal para abrir as configurações.</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {canais.map(({ to, icon: Icon, titulo, desc }) => (
          <Link key={to} to={to} className="group flex items-center gap-4 rounded-xl border bg-card p-4 transition-colors hover:border-accent hover:bg-accent/5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent"><Icon className="h-5 w-5" /></div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{titulo}</p>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-accent" />
          </Link>
        ))}
      </div>
    </ConfiguracoesLayout>
  );
}
