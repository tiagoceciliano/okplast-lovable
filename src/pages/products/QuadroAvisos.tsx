 import { ProductPage } from "@/components/products/ProductPage";
 import { SOBMEDIDA_IMAGES } from "@/lib/images";
 
 export default function QuadroAvisos() {
   return (
     <ProductPage
       title="Quadro de Avisos em Acrílico"
       description="Quadros de avisos em acrílico para empresas, escolas, condomínios e estabelecimentos comerciais. Ideais para comunicação interna, murais de recados e organização visual. Fabricação sob medida com acabamento profissional."
       imageUrl={SOBMEDIDA_IMAGES.quadroAvisos}
       seoTitle="Quadro de Avisos em Acrílico RJ - Murais Personalizados"
       seoDescription="Quadros de avisos em acrílico sob medida no Rio de Janeiro. Murais para empresas, escolas e condomínios. Com ou sem porta. Orçamento grátis em 24h."
       benefits={[
         "Estrutura em acrílico cristal de alta durabilidade",
         "Fácil fixação na parede com kit incluso",
         "Design moderno e profissional",
         "Proteção do conteúdo contra poeira e danos",
         "Opções com ou sem porta de proteção",
         "Personalização com logotipo da empresa",
         "Ideal para comunicação interna e avisos",
         "Fácil manutenção e limpeza",
       ]}
       variations={[
         "Quadro de avisos com porta",
         "Quadro de avisos aberto",
         "Quadro com divisórias internas",
         "Quadro com suporte para caneta",
         "Mural de recados magnético",
         "Quadro para cardápio",
       ]}
     />
   );
 }