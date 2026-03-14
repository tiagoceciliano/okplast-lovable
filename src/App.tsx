import { lazy, Suspense } from "react";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/layout";
import { ScrollToTop } from "@/components/ScrollToTop";
import { WhatsAppModalProvider } from "@/contexts/WhatsAppModalContext";
import { RequireAdmin } from "@/components/admin/RequireAdmin";

// Lazy loaded pages
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminLeads = lazy(() => import("./pages/admin/Leads"));
const AdminUTMTerms = lazy(() => import("./pages/admin/UTMTerms"));
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
            <Route path="/acrilico-sob-medida/*" element={<Navigate to="/" replace />} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Layout>
    
  </WhatsAppModalProvider>
);

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
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
              
              {/* Main site routes */}
              <Route path="/*" element={<MainSite />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
