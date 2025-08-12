import { type ColumnDef } from "@tanstack/react-table";
import { Circle, CircleOff } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import StudentRowActions from "@/components/table/student-row-actions";
import type { Student } from "@/types/models";

export const StudentColumn: ColumnDef<Student>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = studentStatuses.find(
        (status) => status.value === row.getValue("status")
      );

      if (!status) {
        return null;
      }
      return (
        <Badge variant={status.variant} className="capitalize">
          {status.icon && (
            <status.icon className="text-muted-foreground size-4" />
          )}
          <span>{status.label}</span>
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: "grade",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Grade" />
    ),
  },
  {
    accessorKey: "student_id",
    header: "Student ID",
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      const date = row.original.created_at
        ? new Date(row.original.created_at)
        : null;
      return date ? format(date, "MMM dd, yyyy") : "N/A";
    },
    meta: {
      filterVariant: "date-range",
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <StudentRowActions student={row.original} />,
  },
];

export const studentStatuses = [
  {
    value: "Active",
    label: "Active",
    variant: "outline" as "secondary" | "destructive" | "outline",
    icon: Circle,
  },
  {
    value: "Inactive",
    label: "Inactive",
    variant: "secondary" as "secondary" | "destructive" | "outline",
    icon: CircleOff,
  },
];
