import * as React from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DataTablePagination } from "./data-table-pagination";
import { DefaultDataTableToolbar } from "@/components/table/data-table-toolbar";
import { BooksDataTableToolbar } from "./books-data-table-toolbar";
import { StudentsDataTableToolbar } from "./students-data-table-toolbar";
import { LendingsDataTableToolbar } from "@/components/table/lent-data-table-toolbar";
import { Separator } from "../ui/separator";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  tag?: "books" | "students" | "lending";
}

export function DataTable<TData, TValue>({
  columns,
  data,
  tag,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    initialState: {
      pagination: {
        pageSize: 25,
      },
    },
    filterFns: {
      dateRange: (row, columnId, value: [Date, Date]) => {
        const cellValue = row.getValue(columnId) as string;
        const date = cellValue ? new Date(cellValue) : null;

        if (!date || !value?.[0]) return true;

        const [start, end] = value;
        if (start && end) {
          return date >= start && date <= end;
        }

        return date >= start;
      },
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  function renderToolbar() {
    switch (tag) {
      case "books":
        return <BooksDataTableToolbar table={table} />;
      case "students":
        return <StudentsDataTableToolbar table={table} />;
      case "lending":
        return <LendingsDataTableToolbar table={table} />;
      default:
        return <DefaultDataTableToolbar table={table} />;
    }
  }
  return (
    <div className="flex flex-col rounded">
      {renderToolbar()}
      <Separator className="my-4" />
      <div className="rounded overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
      <div className="text-center text-sm text-muted-foreground">
        Showing {table.getRowModel().rows.length} of {data.length} items
      </div>
    </div>
  );
}
