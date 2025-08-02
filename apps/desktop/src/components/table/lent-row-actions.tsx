import React, { type FC, useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import ConfirmDialog from "../confirm-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Lending as lentRecordsInterface } from "@/types/models";
import { toast } from "sonner";
import { returnBook } from "@/utils/api";
import { format } from "date-fns";

export interface LentRowActionsProps {
  lent: lentRecordsInterface;
}

const LentRowActions: FC<LentRowActionsProps> = ({ lent }) => {
  const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const returnMutation = useMutation({
    mutationFn: returnBook,
    onSuccess: () => {
      toast.success(`Book has been created`, {
        description: format(new Date(), "EEEE MM yyyy h:mm a"),
      });
      queryClient.invalidateQueries();
    },
    onError: (error) => {
      toast.error("Error returning book", {
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    },
  });

  const handleReturnConfirm = () => {
    setIsLoading(true);
    try {
      returnMutation.mutate(lent.id);
    } catch (err) {
      console.error(err);
      return toast.error("Error returning book", {
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
            onClick={() => navigator.clipboard.writeText(lent.student_id ?? "")}
          >
            Copy Student ID
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(lent.book_id ?? "")}
          >
            Copy Book ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setIsReturnDialogOpen(true)}
            className="cursor-pointer"
          >
            Mark as Returned
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        isDialogOpen={isReturnDialogOpen}
        setIsDialogOpen={setIsReturnDialogOpen}
        handleConfirm={handleReturnConfirm}
        isLoading={isLoading}
        title="Mark as Returned"
        description={`Are you sure you want to mark "${
          lent.book_title ?? "this item"
        }" as returned? This action cannot be undone.`}
      />
    </>
  );
};

export default React.memo(LentRowActions);
