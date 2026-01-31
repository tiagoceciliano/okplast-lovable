import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface DecorativeDividerProps {
  className?: string;
  iconClassName?: string;
}

export function DecorativeDivider({ className, iconClassName }: DecorativeDividerProps) {
  return (
    <div className={cn("decorative-divider", className)}>
      <Star className={cn("h-6 w-6 fill-accent text-accent", iconClassName)} />
    </div>
  );
}
