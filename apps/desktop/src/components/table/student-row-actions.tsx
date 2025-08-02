import React, { type FC, useState } from "react";
import { Edit, MoreHorizontal, Trash, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import ConfirmDialog from "../confirm-dialog";
import CreateStudent from "../forms/create-student";
import UpdateDialog from "../update-dialog";
import { DetailsDialog } from "../details-dialog";
import { format } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Student } from "@/types/models";
import { deleteStudent } from "@/utils/api";

export interface StudentRowActionsProps {
  student: Student;
}

const StudentRowActions: FC<StudentRowActionsProps> = ({ student }) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: deleteStudent,
    onSuccess: () => {
      toast.success(`Student has been deleted`, {
        description: format(new Date(), "EEEE MM yyyy h:mm a"),
      });
      queryClient.invalidateQueries();
    },
    onError: (error) => {
      toast.error("Error deleting student", {
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    },
  });
  const handleDeleteConfirm = () => {
    setIsLoading(true);
    try {
      deleteMutation.mutate(student.id);
    } catch (err) {
      console.error(err);
      return toast.error("Error deleting student", {
        description:
          err instanceof Error ? err.message : "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(student.id)}
          >
            Copy Student ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setIsDetailsDialogOpen(true)}
            className="cursor-pointer"
          >
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setIsUpdateDialogOpen(true)}
            className="cursor-pointer"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
            className="cursor-pointer"
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        isDialogOpen={isDeleteDialogOpen}
        setIsDialogOpen={setIsDeleteDialogOpen}
        handleConfirm={handleDeleteConfirm}
        isLoading={isLoading}
        title="Delete student"
        description={`Are you sure you want to delete this student? This action cannot be undone.`}
      />
      <UpdateDialog
        title="Edit Student"
        description="Update the details of the selected student."
        isDialogOpen={isUpdateDialogOpen}
        setIsDialogOpen={setIsUpdateDialogOpen}
      >
        <CreateStudent student={student} />
      </UpdateDialog>

      <DetailsDialog
        type="student"
        id={student.id}
        title="Student Details"
        description="View detailed information about this student including borrowing history."
        isOpen={isDetailsDialogOpen}
        setIsOpen={setIsDetailsDialogOpen}
      />
    </>
  );
};

export default React.memo(StudentRowActions);
