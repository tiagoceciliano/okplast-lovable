import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Item { label: string; icon: LucideIcon; onClick?: () => void; disabled?: boolean; hint?: string }

export function DropdownMenuLite({ trigger, items, disabled }: { trigger: ReactNode; items: Item[]; disabled?: boolean }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary" className="mt-3" disabled={disabled}>{trigger}<ChevronDown className="ml-1 h-4 w-4" /></Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72 p-1">
        {items.map(({ label, icon: Icon, onClick, disabled: d, hint }) => (
          <button key={label} disabled={d} onClick={onClick} className={cn("flex w-full items-center gap-2 rounded px-2 py-2 text-left text-sm hover:bg-muted", d && "cursor-not-allowed opacity-50")}>
            <Icon className="h-4 w-4" />{label}{hint && <span className="ml-auto text-[10px] text-muted-foreground">{hint}</span>}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
