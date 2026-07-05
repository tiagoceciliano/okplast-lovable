import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Home, 
  Package, 
  Layers, 
  Building2, 
  ChevronRight,
  ChevronDown,
  ExternalLink,
  Users,
  Tag,
  LogOut,
  MessageCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { COMPANY } from "@/lib/constants";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

interface ExternalLinkItemProps {
  icon: React.ElementType;
  title: string;
  href: string;
  collapsed: boolean;
}

const ExternalLinkItem = ({ icon: Icon, title, href, collapsed }: ExternalLinkItemProps) => {
  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center h-8 w-8 rounded-md text-sm font-medium transition-colors hover:bg-muted mx-auto"
          >
            <Icon className="h-4 w-4" />
          </a>
        </TooltipTrigger>
        <TooltipContent side="right">{title}</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-muted"
    >
      <Icon className="h-4 w-4" />
      <span>{title}</span>
      <ExternalLink className="h-3 w-3 ml-auto" />
    </a>
  );
};

interface SubPagesSectionProps {
  title: string;
  icon: React.ElementType;
  hubPath: string;
  subPages: { title: string; path: string }[];
  collapsed: boolean;
}

const SubPagesSection = ({ title, icon: Icon, hubPath, subPages, collapsed }: SubPagesSectionProps) => {
  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <a
            href={COMPANY.domain + hubPath}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center h-8 w-8 rounded-md text-sm font-medium transition-colors hover:bg-muted mx-auto"
          >
            <Icon className="h-4 w-4" />
          </a>
        </TooltipTrigger>
        <TooltipContent side="right">{title}</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <div className="space-y-1">
      <a
        href={COMPANY.domain + hubPath}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-muted"
      >
        <Icon className="h-4 w-4" />
        <span>{title}</span>
        <ExternalLink className="h-3 w-3 ml-auto" />
      </a>
      <div className="pl-6 space-y-1">
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
      </div>
    </div>
  );
};

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b">
        <div className="flex items-center justify-between p-2">
          {!collapsed && <h2 className="font-semibold text-lg">Admin</h2>}
          <SidebarTrigger className={cn(collapsed && "mx-auto")}>
            <ChevronRight className={cn(
              "h-4 w-4 transition-transform",
              !collapsed && "rotate-180"
            )} />
          </SidebarTrigger>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupLabel className={cn(collapsed && "sr-only")}>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Dashboard">
                  <NavLink
                    to="/admin"
                    end
                    className={({ isActive }) => cn(
                      "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-muted",
                      isActive && "bg-primary text-primary-foreground hover:bg-primary/90",
                      collapsed && "justify-center px-0"
                    )}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    {!collapsed && <span>Dashboard</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Leads">
                  <NavLink
                    to="/admin/leads"
                    className={({ isActive }) => cn(
                      "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-muted",
                      isActive && "bg-primary text-primary-foreground hover:bg-primary/90",
                      collapsed && "justify-center px-0"
                    )}
                  >
                    <Users className="h-4 w-4" />
                    {!collapsed && <span>Leads</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="UTM Termos">
                  <NavLink
                    to="/admin/utm-terms"
                    className={({ isActive }) => cn(
                      "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-muted",
                      isActive && "bg-primary text-primary-foreground hover:bg-primary/90",
                      collapsed && "justify-center px-0"
                    )}
                  >
                    <Tag className="h-4 w-4" />
                    {!collapsed && <span>UTM Termos</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="WhatsApp">
                  <NavLink
                    to="/admin/whatsapp"
                    className={({ isActive }) => cn(
                      "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-muted",
                      isActive && "bg-primary text-primary-foreground hover:bg-primary/90",
                      collapsed && "justify-center px-0"
                    )}
                  >
                    <MessageCircle className="h-4 w-4" />
                    {!collapsed && <span>WhatsApp</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className={cn(collapsed && "sr-only")}>Páginas do Site</SidebarGroupLabel>
          <SidebarGroupContent className="space-y-1">
            <ExternalLinkItem
              icon={Home}
              title="Home"
              href={COMPANY.domain}
              collapsed={collapsed}
            />

            <SubPagesSection
              title="Acrílico Sob Medida"
              icon={Package}
              hubPath="/acrilico-sob-medida"
              subPages={acrilicoSubPages}
              collapsed={collapsed}
            />

            <SubPagesSection
              title="Chapas"
              icon={Layers}
              hubPath="/chapas"
              subPages={chapasSubPages}
              collapsed={collapsed}
            />

            <SubPagesSection
              title="Institucional"
              icon={Building2}
              hubPath="/home"
              subPages={institucionalSubPages}
              collapsed={collapsed}
            />
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Logout */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Sair">
                  <button
                    onClick={handleLogout}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-destructive/10 text-destructive w-full",
                      collapsed && "justify-center px-0"
                    )}
                  >
                    <LogOut className="h-4 w-4" />
                    {!collapsed && <span>Sair</span>}
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
