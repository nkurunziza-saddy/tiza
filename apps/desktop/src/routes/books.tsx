import { DataTable } from "@/components/table/data-table";
import { getAllBooks } from "@/utils/api";
import { BookColumn } from "@/utils/columns";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, CheckCircle, XCircle } from "lucide-react";
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
        available: books.filter((b) => b.status === "Available").length,
        unavailable: books.filter((b) => b.status === "Unavailable").length,
      }
    : null;

  if (isLoading) {
    return <BooksPageSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center space-y-1">
          <h2 className="font-medium">Failed to load dashboard</h2>
          <p className="text-sm not-[]:text-muted-foreground">
            Please try refreshing the page
          </p>
        </div>
      </div>
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

      <DataTable columns={BookColumn} data={books ?? []} tag="books" />
    </PageLayout>
  );
}
