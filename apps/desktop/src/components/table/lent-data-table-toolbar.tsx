"use client";

import { type Table } from "@tanstack/react-table";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";

import { DataTableViewOptions } from "./data-table-view-options";
import { DataTableDashFilter } from "./data-table-faceted-filter";
import { lendingStatuses } from "@/utils/columns/lending";
import { CreateLendingDialog } from "@/components/forms/create-lending";
import { CreateReturnDialog } from "@/components/forms/return-book";
import { DataTableSearch } from "@/components/table/data-table-search";
import { DataTableExportPDF } from "@/components/table/data-table-export-pdf";
import { ColumnMeta, DataTableDateRange } from "./data-table-date-range";

interface LendingsDataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function LendingsDataTableToolbar<TData>({
  table,
}: LendingsDataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center gap-2">
          <DataTableSearch table={table} placeholder="Filter lendings..." />
          {table.getColumn("status") && (
            <DataTableDashFilter
              column={table.getColumn("status")}
              title="Status"
              options={lendingStatuses}
            />
          )}
          <div className="flex flex-wrap gap-4">
            {table.getHeaderGroups().map((headerGroup) =>
              headerGroup.headers.map((header) => {
                const column = header.column;
                const filterVariant = (column.columnDef.meta as ColumnMeta)
                  ?.filterVariant;
                if (filterVariant === "date-range") {
                  return (
                    <div key={header.id} className="w-[250px]">
                      <DataTableDateRange column={column} />
                    </div>
                  );
                }
                return null;
              })
            )}
          </div>
          {isFiltered && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => table.resetColumnFilters()}
            >
              Reset
              <X />
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <DataTableExportPDF
            table={table}
            filename="lendings_export"
            title="Lendings Report"
          />
          <DataTableViewOptions table={table} />
          <CreateReturnDialog />
          <CreateLendingDialog />
        </div>
      </div>
    </div>
  );
}
