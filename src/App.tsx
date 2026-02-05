 import { lazy, Suspense } from "react";
 import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout";
import { ScrollToTop } from "@/components/ScrollToTop";
import { WhatsAppModalProvider } from "@/contexts/WhatsAppModalContext";
import { EmailQuoteModalProvider } from "@/contexts/EmailQuoteModalContext";

 // Lazy loaded pages
 const Index = lazy(() => import("./pages/Index"));
 const NotFound = lazy(() => import("./pages/NotFound"));
 const SobreNos = lazy(() => import("./pages/SobreNos"));
 const Orcamento = lazy(() => import("./pages/Orcamento"));
 const PoliticaRevenda = lazy(() => import("./pages/PoliticaRevenda"));
 const PoliticaVenda = lazy(() => import("./pages/PoliticaVenda"));
 const TermoUso = lazy(() => import("./pages/TermoUso"));
 const PoliticaPrivacidade = lazy(() => import("./pages/PoliticaPrivacidade"));

 // Lazy loaded product hub pages
 const AcrilicoSobMedida = lazy(() => import("./pages/products/AcrilicoSobMedida"));
 const ChapasDeAcrilico = lazy(() => import("./pages/products/ChapasDeAcrilico"));

 // Lazy loaded product detail pages
 const CaixasSobMedida = lazy(() => import("./pages/products/CaixasSobMedida"));
 const CupulasRedomas = lazy(() => import("./pages/products/CupulasRedomas"));
 const PotesDoces = lazy(() => import("./pages/products/PotesDoces"));
 const PotesGraos = lazy(() => import("./pages/products/PotesGraos"));
 const UrnaAcrilico = lazy(() => import("./pages/products/UrnaAcrilico"));
 const CaixaSugestao = lazy(() => import("./pages/products/CaixaSugestao"));
 const MedalhasPersonalizadas = lazy(() => import("./pages/products/MedalhasPersonalizadas"));
 const TrofeusPersonalizados = lazy(() => import("./pages/products/TrofeusPersonalizados"));
 const PlacaCustomizada = lazy(() => import("./pages/products/PlacaCustomizada"));
 const PlacaSinalizacao = lazy(() => import("./pages/products/PlacaSinalizacao"));
 const ExpositoresBijuterias = lazy(() => import("./pages/products/ExpositoresBijuterias"));
 const ExpositoresCalcados = lazy(() => import("./pages/products/ExpositoresCalcados"));
 const ExpositoresOculos = lazy(() => import("./pages/products/ExpositoresOculos"));
 const DisplayAcrilico = lazy(() => import("./pages/products/DisplayAcrilico"));
 const PortaFolder = lazy(() => import("./pages/products/PortaFolder"));

const queryClient = new QueryClient();

 // Page loader component
 const PageLoader = () => (
   <div className="flex items-center justify-center min-h-screen bg-background">
     <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
   </div>
 );
 
 const App = () => (
   <HelmetProvider>
     <QueryClientProvider client={queryClient}>
       <TooltipProvider>
         <Toaster />
         <Sonner />
         <BrowserRouter>
           <ScrollToTop />
           <WhatsAppModalProvider>
             <EmailQuoteModalProvider>
               <Layout>
                 <Suspense fallback={<PageLoader />}>
                   <Routes>
              {/* Home */}
              <Route path="/" element={<Index />} />

              {/* Institutional Pages */}
              <Route path="/home/sobre-nos" element={<SobreNos />} />
              <Route path="/home/orcamento" element={<Orcamento />} />
              <Route path="/home/politica-de-revenda" element={<PoliticaRevenda />} />
              <Route path="/home/politica-de-venda" element={<PoliticaVenda />} />
              <Route path="/home/termo-de-uso" element={<TermoUso />} />
              <Route path="/home/politica-de-privacidade" element={<PoliticaPrivacidade />} />

              {/* Product Hub Pages */}
              <Route path="/acrilico-sob-medida" element={<AcrilicoSobMedida />} />
              <Route path="/chapas-de-acrilico" element={<ChapasDeAcrilico />} />

              {/* Product Detail Pages - Acrílico Sob Medida */}
              <Route path="/acrilico-sob-medida/caixas-sob-medida" element={<CaixasSobMedida />} />
              <Route path="/acrilico-sob-medida/cupulas-e-redomas" element={<CupulasRedomas />} />
              <Route path="/acrilico-sob-medida/potes-para-doces-e-guloseimas" element={<PotesDoces />} />
              <Route path="/acrilico-sob-medida/potes-para-graos-e-cereais-a-granel" element={<PotesGraos />} />
              <Route path="/acrilico-sob-medida/urna-de-acrilico" element={<UrnaAcrilico />} />
              <Route path="/acrilico-sob-medida/caixa-de-sugestao" element={<CaixaSugestao />} />
              <Route path="/acrilico-sob-medida/medalhas-personalizadas" element={<MedalhasPersonalizadas />} />
              <Route path="/acrilico-sob-medida/trofeus-personalizados" element={<TrofeusPersonalizados />} />
              <Route path="/acrilico-sob-medida/placa-de-acrilico-customizada" element={<PlacaCustomizada />} />
              <Route path="/acrilico-sob-medida/placa-de-acrilico-sinalizacao" element={<PlacaSinalizacao />} />
              <Route path="/acrilico-sob-medida/expositores-para-bijuterias" element={<ExpositoresBijuterias />} />
              <Route path="/acrilico-sob-medida/expositores-para-calcados" element={<ExpositoresCalcados />} />
              <Route path="/acrilico-sob-medida/expositores-para-oculos" element={<ExpositoresOculos />} />
              <Route path="/acrilico-sob-medida/display-de-acrilico" element={<DisplayAcrilico />} />
              <Route path="/acrilico-sob-medida/porta-folder" element={<PortaFolder />} />

                     {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                     <Route path="*" element={<NotFound />} />
                   </Routes>
                 </Suspense>
               </Layout>
             </EmailQuoteModalProvider>
           </WhatsAppModalProvider>
         </BrowserRouter>
       </TooltipProvider>
     </QueryClientProvider>
   </HelmetProvider>
 );
 
 export default App;
