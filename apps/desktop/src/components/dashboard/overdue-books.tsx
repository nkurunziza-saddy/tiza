import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getOverdueBooks } from "@/utils/api";
import type { OverdueBook } from "@/types";
import { LoadingCard } from "../skeletons/cards";

export function OverdueBooks() {
  const { data: overdueBooks, isLoading } = useQuery({
    queryKey: ["overdueBooks"],
    queryFn: getOverdueBooks,
  });

  if (isLoading) return <LoadingCard title="Overdue Books" />;

  return (
    <Card>
      <CardHeader className="">
        <CardTitle>Overdue Books</CardTitle>
        <CardDescription>Books requiring immediate attention</CardDescription>
      </CardHeader>
      <CardContent>
        {!overdueBooks?.length ? (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="size-8 mx-auto mb-4 opacity-50" />
            <p>No overdue books!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {overdueBooks.map((book) => (
              <OverdueBookItem key={book.id} book={book} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function OverdueBookItem({ book }: { book: OverdueBook }) {
  const isHighPriority = book.days_overdue > 30;

  return (
    <div
      className={cn(
        "p-4 rounded-lg border transition-colors",
        isHighPriority
          ? "bg-destructive/5 border-destructive/20"
          : "bg-card hover:bg-muted/50"
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="space-y-1">
          <h4 className="font-medium">{book.book_title}</h4>
          <p className="text-sm text-muted-foreground">by {book.author}</p>
        </div>
        <Badge
          variant={isHighPriority ? "destructive" : "secondary"}
          className="shrink-0"
        >
          {book.days_overdue} days overdue
        </Badge>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="text-muted-foreground">
          <span>{book.student_name}</span>
          <span className="mx-2">•</span>
          <span>{book.grade}</span>
          <span className="mx-2">•</span>
          <span>ID: {book.student_id}</span>
        </div>
      </div>

      <div className="mt-2 flex items-center text-xs text-muted-foreground">
        <Clock className="size-3 mr-1" />
        Due: {new Date(book.due_date).toLocaleDateString()}
      </div>
    </div>
  );
}
