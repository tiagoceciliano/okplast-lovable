 import { cn } from "@/lib/utils";
 import { useState, useEffect, useRef } from "react";

interface GoogleMapEmbedProps {
  className?: string;
  height?: string;
}

 export function GoogleMapEmbed({ className, height = "300px" }: GoogleMapEmbedProps) {
   const [isVisible, setIsVisible] = useState(false);
   const containerRef = useRef<HTMLDivElement>(null);
   
   useEffect(() => {
     const observer = new IntersectionObserver(
       ([entry]) => {
         if (entry.isIntersecting) {
           setIsVisible(true);
           observer.disconnect();
         }
       },
       { rootMargin: "200px" }
     );
     
     if (containerRef.current) {
       observer.observe(containerRef.current);
     }
     
     return () => observer.disconnect();
   }, []);
 
  // OK Plast address: Rua Cordovil 259 - Cordovil - Rio de Janeiro - RJ
  const mapSrc = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3675.2!2d-43.3!3d-22.85!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sRua%20Cordovil%2C%20259%20-%20Cordovil%2C%20Rio%20de%20Janeiro%20-%20RJ!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr";

 
   return (
     <div 
       ref={containerRef}
       className={cn("rounded-lg overflow-hidden bg-muted", className)}
       style={{ minHeight: height }}
     >
       {isVisible ? (
         <iframe
           src={mapSrc}
           width="100%"
           height={height}
           style={{ border: 0 }}
           allowFullScreen
           loading="lazy"
           referrerPolicy="no-referrer-when-downgrade"
           title="Localização Lab Acrílicos"
           aria-label="Mapa mostrando a localização da Lab Acrílicos no Rio de Janeiro"
         />
       ) : (
         <div 
           className="flex items-center justify-center text-muted-foreground text-sm"
           style={{ height }}
         >
           Carregando mapa...
         </div>
       )}
     </div>
   );
}
