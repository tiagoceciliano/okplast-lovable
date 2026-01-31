import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { cn } from "@/lib/utils";

// Placeholder images - will be replaced with actual product images
const heroImages = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=500&fit=crop",
    alt: "Cubo de acrílico transparente",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=500&fit=crop",
    alt: "Produtos em acrílico",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=500&fit=crop",
    alt: "Chapas de acrílico coloridas",
  },
];

interface HeroSliderProps {
  className?: string;
}

export function HeroSlider({ className }: HeroSliderProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    
    // Auto-play
    const autoplay = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);

    return () => {
      emblaApi.off("select", onSelect);
      clearInterval(autoplay);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className={cn("relative", className)}>
      <div className="overflow-hidden rounded-lg" ref={emblaRef}>
        <div className="flex">
          {heroImages.map((image) => (
            <div key={image.id} className="flex-[0_0_100%] min-w-0">
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-[300px] md:h-[400px] object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Dots navigation */}
      <div className="flex justify-center gap-2 mt-4">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={cn(
              "w-3 h-3 rounded-full transition-all",
              index === selectedIndex
                ? "bg-accent scale-110"
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
            )}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
