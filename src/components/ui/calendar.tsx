import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "relative flex flex-col gap-4 sm:flex-row",
        month: "w-[252px] space-y-3",
        month_caption: "flex h-9 items-center justify-center px-9",
        caption_label: "text-sm font-medium",
        nav: "absolute inset-x-0 top-0 flex h-9 items-center justify-between",
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 disabled:opacity-30",
        ),
        button_next: cn(buttonVariants({ variant: "outline" }), "h-7 w-7 bg-transparent p-0 disabled:opacity-30"),
        month_grid: "w-full table-fixed border-collapse",
        weekdays: "h-8",
        weekday: "w-9 text-center text-xs font-normal text-muted-foreground",
        week: "h-9",
        day: "relative h-9 w-9 p-0 text-center text-sm [&.rdp-selected>button]:bg-primary [&.rdp-selected>button]:text-primary-foreground",
        day_button: cn(buttonVariants({ variant: "ghost" }), "h-9 w-9 p-0 font-normal rounded-md"),
        range_end: "rounded-r-md bg-accent",
        range_start: "rounded-l-md bg-accent",
        selected: "rdp-selected",
        today: "[&:not(.rdp-selected)>button]:bg-secondary [&:not(.rdp-selected)>button]:font-semibold",
        outside: "text-muted-foreground opacity-40",
        disabled: "text-muted-foreground opacity-30 [&>button]:cursor-not-allowed",
        range_middle: "bg-accent text-accent-foreground",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === "left" ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          ),
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
