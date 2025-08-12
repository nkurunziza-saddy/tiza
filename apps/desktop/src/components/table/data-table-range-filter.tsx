"use client";

import { Column } from "@tanstack/react-table";
import { useId } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DataTableRangeFilterProps<TData> {
  column: Column<TData, number>;
  title: string;
}

export function DataTableRangeFilter<TData>({
  column,
  title,
}: DataTableRangeFilterProps<TData>) {
  const id = useId();
  const columnFilterValue = column.getFilterValue();

  return (
    <div className="*:not-first:mt-2">
      <Label>{title}</Label>
      <div className="flex">
        <Input
          id={`${id}-range-1`}
          className="flex-1 rounded-e-none [-moz-appearance:_textfield] focus:z-10 [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
          value={(columnFilterValue as [number, number])?.[0] ?? ""}
          onChange={(e) =>
            column.setFilterValue((old: [number, number]) => [
              e.target.value ? Number(e.target.value) : undefined,
              old?.[1],
            ])
          }
          placeholder="Min"
          type="number"
          aria-label={`${title} min`}
        />
        <Input
          id={`${id}-range-2`}
          className="-ms-px flex-1 rounded-s-none [-moz-appearance:_textfield] focus:z-10 [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
          value={(columnFilterValue as [number, number])?.[1] ?? ""}
          onChange={(e) =>
            column.setFilterValue((old: [number, number]) => [
              old?.[0],
              e.target.value ? Number(e.target.value) : undefined,
            ])
          }
          placeholder="Max"
          type="number"
          aria-label={`${title} max`}
        />
      </div>
    </div>
  );
}
