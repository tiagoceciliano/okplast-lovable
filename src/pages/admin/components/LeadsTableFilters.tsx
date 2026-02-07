import { useState, useMemo } from "react";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface ColumnFilterProps {
  column: string;
  options: string[];
  selectedValues: string[];
  onFilterChange: (column: string, values: string[]) => void;
}

export function ColumnFilter({ column, options, selectedValues, onFilterChange }: ColumnFilterProps) {
  const [open, setOpen] = useState(false);

  const handleToggle = (value: string) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];
    onFilterChange(column, newValues);
  };

  const handleClear = () => {
    onFilterChange(column, []);
  };

  const handleSelectAll = () => {
    onFilterChange(column, options);
  };

  const hasFilters = selectedValues.length > 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`h-6 w-6 p-0 ${hasFilters ? 'text-primary' : 'text-muted-foreground'}`}
        >
          <Filter className="h-3 w-3" />
          {hasFilters && (
            <Badge variant="secondary" className="absolute -top-1 -right-1 h-4 w-4 p-0 text-[10px] flex items-center justify-center">
              {selectedValues.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2" align="start">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium">Filtrar</span>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" className="h-6 text-xs px-2" onClick={handleSelectAll}>
              Todos
            </Button>
            <Button variant="ghost" size="sm" className="h-6 text-xs px-2" onClick={handleClear}>
              Limpar
            </Button>
          </div>
        </div>
        <ScrollArea className="h-[200px]">
          <div className="space-y-1">
            {options.map((option) => (
              <label
                key={option}
                className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted cursor-pointer text-sm"
              >
                <Checkbox
                  checked={selectedValues.includes(option)}
                  onCheckedChange={() => handleToggle(option)}
                />
                <span className="truncate">{option || '(vazio)'}</span>
              </label>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

interface ActiveFiltersProps {
  filters: Record<string, string[]>;
  onClearFilter: (column: string) => void;
  onClearAll: () => void;
}

export function ActiveFilters({ filters, onClearFilter, onClearAll }: ActiveFiltersProps) {
  const activeFilters = Object.entries(filters).filter(([_, values]) => values.length > 0);
  
  if (activeFilters.length === 0) return null;

  const columnLabels: Record<string, string> = {
    utm_campaign: 'Campaign',
    utm_source: 'Source',
    utm_medium: 'Medium',
    utm_content: 'Content',
    utm_term: 'Term',
  };

  return (
    <div className="flex flex-wrap items-center gap-2 py-2">
      <span className="text-xs text-muted-foreground">Filtros ativos:</span>
      {activeFilters.map(([column, values]) => (
        <Badge key={column} variant="secondary" className="gap-1">
          {columnLabels[column] || column}: {values.length}
          <button onClick={() => onClearFilter(column)} className="ml-1 hover:text-destructive">
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={onClearAll}>
        Limpar todos
      </Button>
    </div>
  );
}
