import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Home, 
  Package, 
  Layers, 
  Building2, 
  ChevronDown, 
  ChevronRight,
  ExternalLink,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import { COMPANY } from "@/lib/constants";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const acrilicoSubPages = [
  { title: "Caixas Sob Medida", path: "/acrilico-sob-medida/caixas-sob-medida" },
  { title: "Cúpulas e Redomas", path: "/acrilico-sob-medida/cupulas-e-redomas" },
  { title: "Potes para Doces", path: "/acrilico-sob-medida/potes-para-doces-e-guloseimas" },
  { title: "Potes para Grãos", path: "/acrilico-sob-medida/potes-para-graos-e-cereais-a-granel" },
  { title: "Urna de Acrílico", path: "/acrilico-sob-medida/urna-de-acrilico" },
  { title: "Caixa de Sugestão", path: "/acrilico-sob-medida/caixa-de-sugestao" },
  { title: "Medalhas Personalizadas", path: "/acrilico-sob-medida/medalhas-personalizadas" },
  { title: "Troféus Personalizados", path: "/acrilico-sob-medida/trofeus-personalizados" },
  { title: "Placa Customizada", path: "/acrilico-sob-medida/placa-de-acrilico-customizada" },
  { title: "Placa Sinalização", path: "/acrilico-sob-medida/placa-de-acrilico-sinalizacao" },
  { title: "Expositores Bijuterias", path: "/acrilico-sob-medida/expositores-para-bijuterias" },
  { title: "Expositores Calçados", path: "/acrilico-sob-medida/expositores-para-calcados" },
  { title: "Expositores Óculos", path: "/acrilico-sob-medida/expositores-para-oculos" },
  { title: "Display de Acrílico", path: "/acrilico-sob-medida/display-de-acrilico" },
  { title: "Porta Folder", path: "/acrilico-sob-medida/porta-folder" },
  { title: "Quadro de Avisos", path: "/acrilico-sob-medida/quadro-de-avisos" },
  { title: "Confeitaria", path: "/acrilico-sob-medida/confeitaria" },
  { title: "Placa Gravada", path: "/acrilico-sob-medida/placa-gravada" },
  { title: "Placa Personalizada", path: "/acrilico-sob-medida/placa-personalizada" },
];

const chapasSubPages = [
  { title: "Acrílico", path: "/chapas/acrilico" },
  { title: "Poliestireno", path: "/chapas/poliestireno" },
  { title: "PETG", path: "/chapas/petg" },
  { title: "Policarbonato Alveolar", path: "/chapas/policarbonato-alveolar" },
  { title: "Policarbonato Compacto", path: "/chapas/policarbonato-compacto" },
  { title: "PVC Expandido", path: "/chapas/pvc-expandido" },
  { title: "ACM", path: "/chapas/acm" },
];

const institucionalSubPages = [
  { title: "Sobre Nós", path: "/home/sobre-nos" },
  { title: "Política de Venda", path: "/home/politica-de-venda" },
  { title: "Termo de Uso", path: "/home/termo-de-uso" },
  { title: "Política de Privacidade", path: "/home/politica-de-privacidade" },
];

interface CollapsibleMenuProps {
  title: string;
  icon: React.ElementType;
  hubPath: string;
  subPages: { title: string; path: string }[];
  collapsed: boolean;
}

const CollapsibleMenu = ({ title, icon: Icon, hubPath, subPages, collapsed }: CollapsibleMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isActive = location.pathname.startsWith(hubPath);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="w-full">
        <div className={cn(
          "flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-muted",
          isActive && "bg-muted text-primary"
        )}>
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4" />
            {!collapsed && <span>{title}</span>}
          </div>
          {!collapsed && (
            isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
          )}
        </div>
      </CollapsibleTrigger>
      {!collapsed && (
        <CollapsibleContent className="pl-6 space-y-1 mt-1">
          <a
            href={COMPANY.domain + hubPath}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md"
          >
            <ExternalLink className="h-3 w-3" />
            <span>Página Principal</span>
          </a>
          {subPages.map((page) => (
            <a
              key={page.path}
              href={COMPANY.domain + page.path}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md"
            >
              <ExternalLink className="h-3 w-3" />
              <span>{page.title}</span>
            </a>
          ))}
        </CollapsibleContent>
      )}
    </Collapsible>
  );
};

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar className={cn(collapsed ? "w-14" : "w-64")} collapsible="icon">
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && <h2 className="font-semibold text-lg">Admin</h2>}
        <SidebarTrigger className={cn(collapsed && "mx-auto")} />
      </div>

      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupLabel className={cn(collapsed && "sr-only")}>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/admin"
                    end
                    className={({ isActive }) => cn(
                      "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-muted",
                      isActive && "bg-primary text-primary-foreground hover:bg-primary/90"
                    )}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    {!collapsed && <span>Dashboard</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/admin/leads"
                    className={({ isActive }) => cn(
                      "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-muted",
                      isActive && "bg-primary text-primary-foreground hover:bg-primary/90"
                    )}
                  >
                    <Users className="h-4 w-4" />
                    {!collapsed && <span>Leads</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className={cn(collapsed && "sr-only")}>Páginas do Site</SidebarGroupLabel>
          <SidebarGroupContent className="space-y-1">
            <a
              href={COMPANY.domain}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-muted"
            >
              <Home className="h-4 w-4" />
              {!collapsed && <span>Home</span>}
              {!collapsed && <ExternalLink className="h-3 w-3 ml-auto" />}
            </a>

            <CollapsibleMenu
              title="Acrílico Sob Medida"
              icon={Package}
              hubPath="/acrilico-sob-medida"
              subPages={acrilicoSubPages}
              collapsed={collapsed}
            />

            <CollapsibleMenu
              title="Chapas"
              icon={Layers}
              hubPath="/chapas"
              subPages={chapasSubPages}
              collapsed={collapsed}
            />

            <CollapsibleMenu
              title="Institucional"
              icon={Building2}
              hubPath="/home"
              subPages={institucionalSubPages}
              collapsed={collapsed}
            />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
