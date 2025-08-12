"use client";

import { Column } from "@tanstack/react-table";
import { CalendarIcon } from "lucide-react";
import { useId, useState } from "react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DataTableDateRangeProps<TData> {
  column: Column<TData, unknown>;
}
export interface ColumnMeta {
  filterVariant?: string;
}
export function DataTableDateRange<TData>({
  column,
}: DataTableDateRangeProps<TData>) {
  const id = useId();
  const [date, setDate] = useState<{
    from?: Date;
    to?: Date;
  }>({});

  const columnFilterValue = column.getFilterValue() as [Date, Date];

  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal border-dashed",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            selected={{
              from: columnFilterValue?.[0] || date?.from,
              to: columnFilterValue?.[1] || date?.to,
            }}
            onSelect={(selectedDate) => {
              setDate(selectedDate || {});
              column.setFilterValue([selectedDate?.from, selectedDate?.to]);
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
