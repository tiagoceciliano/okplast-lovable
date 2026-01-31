import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface Product {
  nome: string;
  href: string;
  imageUrl?: string;
}

interface ProductCategoryGridProps {
  title: string;
  products: Product[];
  className?: string;
  columns?: 2 | 3 | 4;
}

export function ProductCategoryGrid({ title, products, className, columns = 4 }: ProductCategoryGridProps) {
  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-2 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-4",
  };

  return (
    <div className={cn("space-y-6", className)}>
      <h3 className="text-lg md:text-xl font-bold text-primary uppercase tracking-wide">
        {title}
      </h3>
      <div className={cn("grid gap-4", gridCols[columns])}>
        {products.map((product, index) => (
          <Link
            key={index}
            to={product.href}
            className="group relative aspect-square rounded-lg overflow-hidden bg-muted hover:shadow-lg transition-all"
          >
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.nome}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                <span className="text-muted-foreground text-sm">Imagem</span>
              </div>
            )}
            
            {/* Overlay with title */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent flex items-end p-4">
              <span className="text-primary-foreground font-medium text-sm md:text-base">
                {product.nome}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
