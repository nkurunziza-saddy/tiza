import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Eye, Calendar, BookOpen, CheckCircle, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  getBookById,
  getLendingRecordsByBookId,
  getLendingRecordsByStudentId,
  getStudentById,
} from "@/utils/api";
import type { Lending } from "@/types/models";

interface DetailsDialogProps {
  type: "book" | "student";
  id: string;
  triggerText?: string;
  title?: string;
  description?: string;
}

export function DetailsDialog({
  type,
  id,
  triggerText = "View Details",
  title,
  description,
  isOpen,
  setIsOpen,
}: DetailsDialogProps & {
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
}) {
  const [internalIsOpen, setInternalIsOpen] = React.useState(false);
  const isControlled = isOpen !== undefined && setIsOpen !== undefined;
  const isDialogOpen = isControlled ? isOpen : internalIsOpen;
  const setIsDialogOpen = isControlled ? setIsOpen : setInternalIsOpen;

  const { data: book } = useQuery({
    queryKey: ["getBookById", id],
    queryFn: () => getBookById(id),
    enabled: type === "book" && isDialogOpen,
  });
  const { data: bookLending } = useQuery({
    queryKey: ["getLendingRecordsByBookId", id],
    queryFn: () => getLendingRecordsByBookId(id),
    enabled: type === "book" && isDialogOpen,
  });
  const { data: student } = useQuery({
    queryKey: ["getStudentById", id],
    queryFn: () => getStudentById(id),
    enabled: type === "student" && isDialogOpen,
  });
  const { data: studentLending } = useQuery({
    queryKey: ["getLendingRecordsByStudentId", id],
    queryFn: () => getLendingRecordsByStudentId(id),
    enabled: type === "student" && isDialogOpen,
  });

  const renderLendingHistory = (
    lendings: Lending[] | null | undefined,
    type: "book" | "student"
  ) => {
    if (!lendings || lendings.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No lending history found</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {lendings.map((lending) => (
          <div key={lending.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">
                    {type === "book"
                      ? lending.student_name
                      : lending.book_title}
                  </h4>
                  <Badge
                    variant={
                      lending.status === "Returned" ? "default" : "secondary"
                    }
                    className="text-xs"
                  >
                    {lending.status === "Returned" ? (
                      <CheckCircle className="w-3 h-3 mr-1" />
                    ) : (
                      <Clock className="w-3 h-3 mr-1" />
                    )}
                    {lending.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {type === "book"
                    ? `Borrowed by ${lending.student_name} (${lending.student_number})`
                    : `Book: ${lending.book_title} by ${lending.book_author}`}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Lent On</p>
                  <p className="text-muted-foreground">
                    {format(new Date(lending.lent_at), "PPP")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Due Date</p>
                  <p className="text-muted-foreground">
                    {format(new Date(lending.due_date), "PPP")}
                  </p>
                </div>
              </div>

              {lending.returned_at && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Returned On</p>
                    <p className="text-muted-foreground">
                      {format(new Date(lending.returned_at), "PPP")}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderBookDetails = () => {
    if (!book) return <div>Loading...</div>;

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{book.title}</CardTitle>
                <CardDescription>by {book.author}</CardDescription>
              </div>
              <Badge
                variant={book.status === "Available" ? "default" : "secondary"}
              >
                {book.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold">ISBN</h3>
                <p className="text-sm text-muted-foreground">{book.isbn}</p>
              </div>
              <div>
                <h3 className="font-semibold">Category</h3>
                <p className="text-sm text-muted-foreground">{book.category}</p>
              </div>
              <div>
                <h3 className="font-semibold">Quantity</h3>
                <p className="text-sm text-muted-foreground">{book.quantity}</p>
              </div>
              <div>
                <h3 className="font-semibold">Added On</h3>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(book.created_at), "PPP")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lending History</CardTitle>
            <CardDescription>
              History of all borrows and returns for this book
            </CardDescription>
          </CardHeader>
          <CardContent>{renderLendingHistory(bookLending, "book")}</CardContent>
        </Card>
      </div>
    );
  };

  const renderStudentDetails = () => {
    if (!student) return <div>Loading...</div>;

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{student.name}</CardTitle>
                <CardDescription>
                  Student ID: {student.student_id}
                </CardDescription>
              </div>
              <Badge
                variant={student.status === "Active" ? "default" : "secondary"}
              >
                {student.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold">Grade</h3>
                <p className="text-sm text-muted-foreground">{student.grade}</p>
              </div>
              <div>
                <h3 className="font-semibold">Phone Number</h3>
                <p className="text-sm text-muted-foreground">
                  {student.phone_number || "Not provided"}
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Student ID</h3>
                <p className="text-sm text-muted-foreground">
                  {student.student_id}
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Registered On</h3>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(student.created_at), "PPP")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Borrowing History</CardTitle>
            <CardDescription>
              History of all books borrowed by this student
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderLendingHistory(studentLending, "student")}
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      {!isControlled && (
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            {triggerText}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {title || `View ${type === "book" ? "Book" : "Student"} Details`}
          </DialogTitle>
          <DialogDescription>
            {description || `Detailed information about this ${type}`}
          </DialogDescription>
        </DialogHeader>

        {type === "book" ? renderBookDetails() : renderStudentDetails()}
      </DialogContent>
    </Dialog>
  );
}
