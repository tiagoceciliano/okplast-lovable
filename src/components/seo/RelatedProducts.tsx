import { Link } from "@/lib/router-compat";

import imgAcrilicoTransparente from "@/assets/chapas-hero/acrilico-transparente.webp";
import imgPetg from "@/assets/chapas-hero/petg.webp";
import imgPoliestireno from "@/assets/chapas-hero/poliestireno.webp";
import imgPolicarbonatoAlveolar from "@/assets/chapas-hero/policarbonato-alveolar.webp";
import imgPolicarbonatoCompacto from "@/assets/chapas-hero/policarbonato-compacto.webp";
import imgPvcExpandido from "@/assets/chapas-hero/pvc-expandido.webp";
import imgAcm from "@/assets/chapas-hero/acm.webp";

const allChapas = [
  { slug: "acrilico", nome: "Acrílico", image: imgAcrilicoTransparente },
  { slug: "policarbonato-alveolar", nome: "Policarbonato Alveolar", image: imgPolicarbonatoAlveolar },
  { slug: "policarbonato-compacto", nome: "Policarbonato Compacto", image: imgPolicarbonatoCompacto },
  { slug: "petg", nome: "PETG", image: imgPetg },
  { slug: "poliestireno", nome: "Poliestireno (PS)", image: imgPoliestireno },
  { slug: "pvc-expandido", nome: "PVC Expandido", image: imgPvcExpandido },
  { slug: "acm", nome: "ACM", image: imgAcm },
];

interface RelatedProductsProps {
  currentSlug: string;
}

export function RelatedProducts({ currentSlug }: RelatedProductsProps) {
  const related = allChapas.filter((c) => c.slug !== currentSlug);

  return (
    <section className="section-padding bg-secondary">
      <div className="container-custom">
        <div className="text-center mb-8">
          <h2 className="font-bold text-2xl md:text-3xl text-foreground mb-2">
            Veja Também Outras Chapas
          </h2>
          <p className="text-muted-foreground">
            Distribuidora de chapas plásticas no Rio de Janeiro — confira todos os materiais disponíveis
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {related.map((chapa) => (
            <Link
              key={chapa.slug}
              to={`/chapas/${chapa.slug}`}
              className="group"
            >
              <div className="bg-background rounded-lg overflow-hidden shadow-xs border hover:shadow-md transition-shadow">
                <div className="aspect-square bg-muted overflow-hidden">
                  <img
                    src={chapa.image}
                    alt={`Chapa de ${chapa.nome} no RJ - OK Plast distribuidora`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    width={200}
                    height={200}
                  />
                </div>
                <div className="p-2 text-center">
                  <span className="text-xs font-medium text-foreground">{chapa.nome}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
