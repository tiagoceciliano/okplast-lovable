import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface BlueBannerProps {
  children: ReactNode;
  className?: string;
}

export function BlueBanner({ children, className }: BlueBannerProps) {
  return (
    <section className={cn("bg-primary text-primary-foreground py-10 md:py-14", className)}>
      <div className="container-custom">
        <p className="text-center text-lg md:text-xl lg:text-2xl font-medium max-w-4xl mx-auto">
          {children}
        </p>
      </div>
    </section>
  );
}
