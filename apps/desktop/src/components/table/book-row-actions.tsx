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
import UpdateDialog from "../update-dialog";
import CreateBook from "../forms/create-book";
import { DetailsDialog } from "../details-dialog";
import { format } from "date-fns";
import type { Book } from "@/types/models";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBook } from "@/utils/api";

export interface BookRowActionsProps {
  book: Book;
}

const BookRowActions: FC<BookRowActionsProps> = ({ book }) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: deleteBook,
    onSuccess: () => {
      toast.success(`Book has been deleted`, {
        description: format(new Date(), "EEEE MM yyyy h:mm a"),
      });
      queryClient.invalidateQueries({
        queryKey: ["getAllBooks"],
      });
      queryClient.invalidateQueries({
        queryKey: ["dashboardStats"],
      });
      queryClient.invalidateQueries({
        queryKey: ["popularBooks"],
      });
      queryClient.invalidateQueries({
        queryKey: ["recentActivity"],
      });
    },
    onError: (error: Error) => {
      toast.error("Failed to delete book");
      console.error(error);
    },
  });
  const handleDeleteConfirm = () => {
    setIsLoading(true);
    try {
      deleteMutation.mutate(book.id);
    } catch (err) {
      console.error(err);
      return toast.error("Error deleting book", {
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
            onClick={() => navigator.clipboard.writeText(book.id)}
          >
            Copy Book ID
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
        title="Delete book"
        description={`Are you sure you want to delete this book? This action cannot be undone.`}
      />
      <UpdateDialog
        title="Edit Book"
        description="Update the details of the selected book."
        isDialogOpen={isUpdateDialogOpen}
        setIsDialogOpen={setIsUpdateDialogOpen}
      >
        <CreateBook
          book={{
            id: book.id,
            title: book.title,
            author: book.author,
            quantity: book.quantity,
            isbn: book.isbn,
            category: book.category,
            status: book.status,
            created_at: book.created_at,
          }}
        />
      </UpdateDialog>

      <DetailsDialog
        type="book"
        id={book.id}
        title="Book Details"
        description="View detailed information about this book including lending history."
        isOpen={isDetailsDialogOpen}
        setIsOpen={setIsDetailsDialogOpen}
      />
    </>
  );
};

export default React.memo(BookRowActions);
