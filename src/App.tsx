import { lazy, Suspense } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ScrollToTop } from "@/components/ScrollToTop";
import { WhatsAppModalProvider } from "@/contexts/WhatsAppModalContext";

// RequireAdmin importa o cliente do Supabase — mantemos lazy para que ele
// não entre no bundle inicial (só carrega ao acessar /admin/*).
const RequireAdmin = lazy(() =>
  import("@/components/admin/RequireAdmin").then((m) => ({ default: m.RequireAdmin })),
);
const RequireAuth = lazy(() =>
  import("@/components/admin/RequireAdmin").then((m) => ({ default: m.RequireAuth })),
);

// Home carregada eager para acelerar o LCP da rota "/"
import Index from "./pages/Index";

// Toasters carregados de forma preguiçosa — não são necessários na dobra inicial
const Toaster = lazy(() => import("@/components/ui/toaster").then((m) => ({ default: m.Toaster })));
const Sonner = lazy(() => import("@/components/ui/sonner").then((m) => ({ default: m.Toaster })));

// Lazy loaded pages
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminLeads = lazy(() => import("./pages/admin/Leads"));
const AdminUTMTerms = lazy(() => import("./pages/admin/UTMTerms"));
const AdminWhatsAppConfig = lazy(() => import("./pages/admin/WhatsAppConfig"));
const AdminVendedores = lazy(() => import("./pages/admin/Vendedores"));
const AdminNegociacoes = lazy(() => import("./pages/admin/Negociacoes"));
const SobreNos = lazy(() => import("./pages/SobreNos"));
const PoliticaVenda = lazy(() => import("./pages/PoliticaVenda"));
const TermoUso = lazy(() => import("./pages/TermoUso"));
const PoliticaPrivacidade = lazy(() => import("./pages/PoliticaPrivacidade"));

// Lazy loaded chapas pages
const ChapasDeAcrilico = lazy(() => import("./pages/products/ChapasDeAcrilico"));
const Acrilico = lazy(() => import("./pages/chapas/Acrilico"));
const Poliestireno = lazy(() => import("./pages/chapas/Poliestireno"));
const Petg = lazy(() => import("./pages/chapas/Petg"));
const PolicarbonatoAlveolar = lazy(() => import("./pages/chapas/PolicarbonatoAlveolar"));
const PolicarbonatoCompacto = lazy(() => import("./pages/chapas/PolicarbonatoCompacto"));
const PvcExpandido = lazy(() => import("./pages/chapas/PvcExpandido"));
const Acm = lazy(() => import("./pages/chapas/Acm"));

const queryClient = new QueryClient();

// Page loader component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
  </div>
);

// Main site content wrapped in Layout
const MainSite = () => (
  <WhatsAppModalProvider>
    
      <Layout>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Home */}
            <Route path="/" element={<Index />} />

            {/* Institutional Pages */}
            <Route path="/home/sobre-nos" element={<SobreNos />} />
            <Route path="/home/politica-de-venda" element={<PoliticaVenda />} />
            <Route path="/home/termo-de-uso" element={<TermoUso />} />
            <Route path="/home/politica-de-privacidade" element={<PoliticaPrivacidade />} />

            {/* Chapas Hub */}
            <Route path="/chapas" element={<ChapasDeAcrilico />} />
            <Route path="/chapas-de-acrilico" element={<Navigate to="/chapas" replace />} />

            {/* Chapas Detail Pages */}
            <Route path="/chapas/acrilico" element={<Acrilico />} />
            <Route path="/chapas/poliestireno" element={<Poliestireno />} />
            <Route path="/chapas/petg" element={<Petg />} />
            <Route path="/chapas/policarbonato-alveolar" element={<PolicarbonatoAlveolar />} />
            <Route path="/chapas/policarbonato-compacto" element={<PolicarbonatoCompacto />} />
            <Route path="/chapas/pvc-expandido" element={<PvcExpandido />} />
            <Route path="/chapas/acm" element={<Acm />} />

            {/* Redirect old product routes to home */}
            

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Layout>
    
  </WhatsAppModalProvider>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Suspense fallback={null}>
          <Toaster />
          <Sonner />
        </Suspense>
        <BrowserRouter>
          <ScrollToTop />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Admin Login - Public */}
              <Route path="/admin/login" element={<AdminLogin />} />
              
              {/* Admin Dashboard - Protected */}
              <Route path="/admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
              <Route path="/admin/leads" element={<RequireAdmin><AdminLeads /></RequireAdmin>} />
              <Route path="/admin/utm-terms" element={<RequireAdmin><AdminUTMTerms /></RequireAdmin>} />
              <Route path="/admin/whatsapp" element={<RequireAdmin><AdminVendedores /></RequireAdmin>} />
              <Route path="/admin/vendedores" element={<RequireAdmin><AdminVendedores /></RequireAdmin>} />
              <Route path="/admin/negociacoes" element={<RequireAuth roles={["admin","gestor","vendedor"]}><AdminNegociacoes /></RequireAuth>} />
              
              {/* Main site routes */}
              <Route path="/*" element={<MainSite />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
  </QueryClientProvider>
);

export default App;
