import { cn } from "@/lib/utils";
import clientesImg from "@/assets/logos/clientes.png";

interface ClientLogosProps {
  className?: string;
}

export function ClientLogos({ className }: ClientLogosProps) {
  return (
    <div className={cn("w-full", className)}>
      <img 
        src={clientesImg} 
        alt="Nossos Clientes" 
        className="w-full h-auto"
      />
    </div>
  );
}
