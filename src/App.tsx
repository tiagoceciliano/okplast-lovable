import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout";
import { WhatsAppModalProvider } from "@/contexts/WhatsAppModalContext";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SobreNos from "./pages/SobreNos";
import Orcamento from "./pages/Orcamento";
import PoliticaRevenda from "./pages/PoliticaRevenda";
import PoliticaVenda from "./pages/PoliticaVenda";
import TermoUso from "./pages/TermoUso";

// Product Hub Pages
import AcrilicoSobMedida from "./pages/products/AcrilicoSobMedida";
import ChapasDeAcrilico from "./pages/products/ChapasDeAcrilico";

// Product Detail Pages
import CaixasSobMedida from "./pages/products/CaixasSobMedida";
import CupulasRedomas from "./pages/products/CupulasRedomas";
import PotesDoces from "./pages/products/PotesDoces";
import PotesGraos from "./pages/products/PotesGraos";
import UrnaAcrilico from "./pages/products/UrnaAcrilico";
import CaixaSugestao from "./pages/products/CaixaSugestao";
import MedalhasPersonalizadas from "./pages/products/MedalhasPersonalizadas";
import TrofeusPersonalizados from "./pages/products/TrofeusPersonalizados";
import PlacaCustomizada from "./pages/products/PlacaCustomizada";
import PlacaSinalizacao from "./pages/products/PlacaSinalizacao";
import ExpositoresBijuterias from "./pages/products/ExpositoresBijuterias";
import ExpositoresCalcados from "./pages/products/ExpositoresCalcados";
import ExpositoresOculos from "./pages/products/ExpositoresOculos";
import DisplayAcrilico from "./pages/products/DisplayAcrilico";
import PortaFolder from "./pages/products/PortaFolder";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <WhatsAppModalProvider>
          <Layout>
            <Routes>
              {/* Home */}
              <Route path="/" element={<Index />} />

              {/* Institutional Pages */}
              <Route path="/home/sobre-nos" element={<SobreNos />} />
              <Route path="/home/orcamento" element={<Orcamento />} />
              <Route path="/home/politica-de-revenda" element={<PoliticaRevenda />} />
              <Route path="/home/politica-de-venda" element={<PoliticaVenda />} />
              <Route path="/home/termo-de-uso" element={<TermoUso />} />

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
          </Layout>
        </WhatsAppModalProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
