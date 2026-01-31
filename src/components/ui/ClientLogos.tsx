import { cn } from "@/lib/utils";

interface ClientLogosProps {
  className?: string;
}

// Placeholder logos - will be replaced with actual client logos
const placeholderLogos = [
  { id: 1, name: "Cliente 1" },
  { id: 2, name: "Cliente 2" },
  { id: 3, name: "Cliente 3" },
  { id: 4, name: "Cliente 4" },
  { id: 5, name: "Cliente 5" },
  { id: 6, name: "Cliente 6" },
];

export function ClientLogos({ className }: ClientLogosProps) {
  return (
    <div className={cn("grid grid-cols-3 md:grid-cols-6 gap-6 items-center", className)}>
      {placeholderLogos.map((logo) => (
        <div 
          key={logo.id}
          className="h-16 bg-muted rounded-lg flex items-center justify-center text-muted-foreground text-xs"
        >
          Logo
        </div>
      ))}
    </div>
  );
}
