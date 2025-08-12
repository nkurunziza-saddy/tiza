import { type Table } from "@tanstack/react-table";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";

import { DataTableViewOptions } from "./data-table-view-options";
import { DataTableDashFilter } from "./data-table-faceted-filter";
import { studentStatuses } from "@/utils/columns/students";
import { CreateStudentDialog } from "@/components/forms/create-student";
import { DataTableSearch } from "./data-table-search";
import { DataTableExportPDF } from "./data-table-export-pdf";
import { ColumnMeta, DataTableDateRange } from "./data-table-date-range";
import { GRADES } from "@/utils/constants";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function StudentsDataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center gap-2">
        <DataTableSearch table={table} placeholder="Filter students..." />
        {table.getColumn("status") && (
          <DataTableDashFilter
            column={table.getColumn("status")}
            title="Status"
            options={studentStatuses}
          />
        )}
        {table.getColumn("grade") && (
          <DataTableDashFilter
            column={table.getColumn("grade")}
            title="Grade"
            options={GRADES}
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
          filename="students_export"
          title="Students Report"
        />
        <DataTableViewOptions table={table} />
        <CreateStudentDialog />
      </div>
    </div>
  );
}
