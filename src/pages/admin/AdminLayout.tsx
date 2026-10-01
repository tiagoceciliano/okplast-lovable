import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "./components/AdminSidebar";
import { BackendHealthBanner } from "@/components/admin/BackendHealthBanner";

interface AdminLayoutProps {
  children: React.ReactNode;
  fullBleed?: boolean;
}

export function AdminLayout({ children, fullBleed = false }: AdminLayoutProps) {
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />
        <main className={fullBleed ? "min-w-0 flex-1 overflow-hidden" : "flex-1 overflow-auto p-6"}>
          <BackendHealthBanner />
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
