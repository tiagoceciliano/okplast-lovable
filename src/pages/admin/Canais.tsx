import { Link } from "@/lib/router-compat";
import { ConfiguracoesLayout } from "./components/ConfiguracoesLayout";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { ChevronRight, Mail, MessageSquareText, QrCode, ShieldCheck } from "lucide-react";

type Canal = {
  to: string;
  icon: typeof QrCode;
  titulo: string;
  desc: string;
  emBreve?: boolean;
};

const canais: Canal[] = [
  { to: "/admin/conexoes", icon: QrCode, titulo: "WhatsApp via QR Code", desc: "Números dos vendedores conectados pelo QR Code, sem limite de 24h." },
  { to: "/admin/whatsapp", icon: ShieldCheck, titulo: "WhatsApp API oficial", desc: "Número oficial da Meta e membros de atendimento." },
  { to: "/admin/modelos", icon: MessageSquareText, titulo: "Modelos de mensagem", desc: "Templates aprovados pela Meta para a API oficial." },
  { to: "/admin/email", icon: Mail, titulo: "E-mail", desc: "Caixa de entrada e atendimento por e-mail. Em breve.", emBreve: true },
];

export default function AdminCanais() {
  const { user } = useCurrentUser();
  const gestor = !!user?.roles.some((r) => r === "admin" || r === "gestor");
  // Vendedores só veem o canal de QR Code, para conectar o próprio número.
  const visiveis = gestor ? canais : canais.filter((c) => c.to === "/admin/conexoes");
  return (
    <ConfiguracoesLayout active="canais">
      <h2 className="text-xl font-bold">Canais</h2>
      <p className="mb-5 text-sm text-muted-foreground">Escolha um canal para abrir as configurações.</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {visiveis.map(({ to, icon: Icon, titulo, desc, emBreve }) =>
          emBreve ? (
            <div
              key={to}
              aria-disabled="true"
              className="flex cursor-not-allowed items-center gap-4 rounded-xl border border-dashed bg-muted/30 p-4 opacity-70"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 font-semibold">
                  {titulo}
                  <span className="rounded-full border border-gold/40 bg-gold/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gold-foreground">
                    Em breve
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            </div>
          ) : (
            <Link
              key={to}
              to={to}
              className="group flex items-center gap-4 rounded-xl border bg-card p-4 transition-colors hover:border-accent hover:bg-accent/5"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{titulo}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-accent" />
            </Link>
          ),
        )}
      </div>
    </ConfiguracoesLayout>
  );
}
