import type { ReactNode } from "react";
import { Link } from "@/lib/router-compat";
import { AdminLayout } from "../AdminLayout";
import { cn } from "@/lib/utils";
import { Folder, MessageSquareText, ShieldCheck, Tag, Users } from "lucide-react";

type Section = "membros" | "permissoes" | "tags" | "grupos" | "modelos";

const links = [
  { id: "membros", label: "Membros", to: "/admin/vendedores", icon: Users },
  { id: "permissoes", label: "Permissões", to: "/admin/vendedores?tab=permissoes", icon: ShieldCheck },
  { id: "grupos", label: "Grupos", to: "/admin/grupos", icon: Folder },
  { id: "tags", label: "Tags", to: "/admin/tags", icon: Tag },
  { id: "modelos", label: "Modelos de mensagem", to: "/admin/modelos", icon: MessageSquareText },
] as const;

export function ConfiguracoesLayout({ active, children, wide = false }: { active: Section; children: ReactNode; wide?: boolean }) {
  return (
    <AdminLayout fullBleed>
      <div className="grid h-screen min-h-[560px] overflow-hidden bg-muted/30 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="hidden border-r bg-card px-3 py-5 lg:block">
          <h1 className="mb-5 px-3 text-lg font-bold">Configurações</h1>
          <p className="mb-2 px-3 text-xs font-semibold text-muted-foreground">Ambiente</p>
          <nav className="space-y-1">
            {links.map(({ id, label, to, icon: Icon }) => (
              <Link key={id} to={to} className={cn("flex h-9 items-center gap-2 rounded-md px-3 text-sm transition-colors hover:bg-muted", active === id && "bg-muted font-semibold text-foreground")}>
                <Icon className="h-4 w-4" /> {label}
              </Link>
            ))}
          </nav>
        </aside>
        <section className={cn("min-w-0 overflow-y-auto", wide ? "bg-muted/30" : "bg-background")}>
          <div className={cn("mx-auto w-full px-4 py-5 sm:px-7 lg:px-9", wide ? "max-w-[1400px]" : "max-w-5xl")}>{children}</div>
        </section>
      </div>
    </AdminLayout>
  );
}
