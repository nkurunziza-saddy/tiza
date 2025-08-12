import { DataTable } from "@/components/table/data-table";
import { getAllLendings, getOverdueBooks } from "@/utils/api";
import { LendingColumn } from "@/utils/columns";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, Clock, RotateCcw, AlertTriangle } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat";
import { PageHeader, PageLayout } from "@/components/page-layout";
import { LendingPageSkeleton } from "@/components/skeletons/lending-page";

export const Route = createFileRoute("/lending-returns")({
  component: LendingsPage,
});

function LendingsPage() {
  const {
    data: lendings,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["getAllLendings"],
    queryFn: getAllLendings,
  });
  const { data: overdueBooks } = useQuery({
    queryKey: ["overdueBooks"],
    queryFn: getOverdueBooks,
  });

  const stats = lendings
    ? {
        totalLendings: lendings.length,
        activeLendings: lendings.filter((l) => l.status === "Lent").length,
        returned: lendings.filter((l) => l.status === "Returned").length,
        overdue: overdueBooks?.length ?? 0,
      }
    : null;

  if (isLoading) {
    return <LendingPageSkeleton />;
  }

  if (error) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center py-20">
          <div className="text-center space-y-4">
            <AlertTriangle className="size-12 text-destructive mx-auto" />
            <h2 className="text-xl font-semibold">
              Failed to load lending data
            </h2>
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
        title="Lending & Returns"
        description="Track book loans, returns, and manage lending records"
      />

      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Lendings"
            value={stats.totalLendings}
            icon={BookOpen}
            color="blue"
          />
          <StatCard
            title="Active Loans"
            value={stats.activeLendings}
            icon={Clock}
            color="green"
          />
          <StatCard
            title="Returned"
            value={stats.returned}
            icon={RotateCcw}
            color="gray"
          />
          <StatCard
            title="Overdue"
            value={stats.overdue}
            icon={AlertTriangle}
            color="red"
          />
        </div>
      )}

      <div className="mt-8">
        <DataTable
          columns={LendingColumn}
          data={lendings ?? []}
          tag="lending"
        />
      </div>
    </PageLayout>
  );
}
