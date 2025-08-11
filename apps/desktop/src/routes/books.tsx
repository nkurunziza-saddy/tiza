import { DataTable } from "@/components/table/data-table";
import { getAllBooks } from "@/utils/api";
import { BookColumn } from "@/utils/columns";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { BookOpen, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { PageHeader, PageLayout } from "@/components/page-layout";
import { StatCard } from "@/components/dashboard/stat";
import { BooksPageSkeleton } from "@/components/skeletons/books-page";

export const Route = createFileRoute("/books")({
  component: BooksPage,
});

function BooksPage() {
  const {
    data: books,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["getAllBooks"],
    queryFn: getAllBooks,
  });

  const stats = books
    ? {
        totalBooks: books.length,
        available: books.filter((b) => b.status === "available").length,
        unavailable: books.filter((b) => b.status === "unavailable").length,
      }
    : null;

  if (isLoading) {
    return <BooksPageSkeleton />;
  }

  if (error) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center py-20">
          <div className="text-center space-y-4">
            <AlertTriangle className="size-12 text-destructive mx-auto" />
            <h2 className="text-xl font-semibold">Failed to load books data</h2>
            <p className="text-muted-foreground">
              Please try refreshing the page
            </p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageHeader
        title="Book Collection"
        description="Manage your library's book inventory and catalog"
      />

      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-6">
          <StatCard
            title="Total Books"
            value={stats.totalBooks}
            icon={BookOpen}
            color="blue"
          />
          <StatCard
            title="Available"
            value={stats.available}
            icon={CheckCircle}
            color="green"
          />
          <StatCard
            title="Unavailable"
            value={stats.unavailable}
            icon={XCircle}
            color="amber"
          />
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <Badge variant="outline" className="text-sm py-2 px-4">
          Fiction: {books?.filter((b) => b.category === "Fiction").length || 0}
        </Badge>
        <Badge variant="outline" className="text-sm py-2 px-4">
          Science: {books?.filter((b) => b.category === "Science").length || 0}
        </Badge>
        <Badge variant="outline" className="text-sm py-2 px-4">
          History: {books?.filter((b) => b.category === "History").length || 0}
        </Badge>
        <Badge variant="outline" className="text-sm py-2 px-4">
          Arts: {books?.filter((b) => b.category === "Arts").length || 0}
        </Badge>
      </div>

      <DataTable columns={BookColumn} data={books ?? []} tag="books" />
    </PageLayout>
  );
}
