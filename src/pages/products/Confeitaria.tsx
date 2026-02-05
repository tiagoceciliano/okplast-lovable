 import { ProductPage } from "@/components/products/ProductPage";
 import { SOBMEDIDA_IMAGES } from "@/lib/images";
 
 export default function Confeitaria() {
   return (
     <ProductPage
       title="Produtos para Confeitaria em Acrílico"
       description="Produtos em acrílico especialmente desenvolvidos para confeitarias, festas e eventos. Bolo fake, expositores de doces, suportes para cupcakes e muito mais. Valorize sua produção com peças elegantes, duráveis e fáceis de higienizar."
       imageUrl={SOBMEDIDA_IMAGES.boloFake}
       seoTitle="Produtos para Confeitaria em Acrílico RJ - Bolo Fake e Expositores"
       seoDescription="Bolo fake, suportes e expositores para confeitaria em acrílico. Produtos sob medida no Rio de Janeiro. Perfeitos para festas e eventos. Orçamento grátis."
       canonical="/acrilico-sob-medida/confeitaria"
       benefits={[
         "Acabamento premium para valorizar seus doces",
         "Material atóxico e seguro para contato com alimentos",
         "Fácil limpeza e higienização",
         "Resistente, durável e reutilizável",
         "Diversos tamanhos e alturas disponíveis",
         "Personalização sob medida para seu negócio",
         "Transparência cristalina para destaque visual",
         "Ideal para festas, buffets e vitrines",
       ]}
       variations={[
         "Bolo fake (estrutura para decoração)",
         "Suporte para bolo de andares",
         "Expositor de cupcakes",
         "Bandeja para doces finos",
         "Suporte para brigadeiros",
         "Torre de doces em cascata",
       ]}
     />
   );
 }