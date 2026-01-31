import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface TestimonialCardProps {
  nome: string;
  empresa?: string;
  texto: string;
  avatarUrl?: string;
}

export function TestimonialCard({ nome, empresa, texto, avatarUrl }: TestimonialCardProps) {
  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow h-full">
      <CardContent className="pt-6 flex flex-col h-full">
        {/* 5 Stars */}
        <div className="flex gap-1 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className="h-5 w-5 fill-gold text-gold" />
          ))}
        </div>
        
        {/* Testimonial text */}
        <p className="text-muted-foreground mb-4 italic flex-grow">
          "{texto}"
        </p>
        
        {/* Author info */}
        <div className="flex items-center gap-3 mt-auto">
          {avatarUrl && (
            <img 
              src={avatarUrl} 
              alt={nome}
              className="w-12 h-12 rounded-full object-cover"
              loading="lazy"
            />
          )}
          <div>
            <p className="font-semibold text-primary">{nome}</p>
            {empresa && (
              <p className="text-sm text-muted-foreground">{empresa}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
