import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "@/utils/api";
import Stat from "@/components/dashboard/stat";
import { OverdueBooks } from "@/components/dashboard/overdue-books";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { PopularBooks } from "@/components/dashboard/popular-books";
import { LibraryStats } from "@/components/dashboard/library-stats";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const dashboardStats = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: getDashboardStats,
  });

  if (dashboardStats.isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        {Array.from({ length: 24 }).map((_, index) => (
          <div
            key={index}
            className="bg-muted/50 aspect-video h-12 w-full rounded-lg"
          />
        ))}
      </div>
    );
  }

  if (!dashboardStats.data) {
    return (
      <p className="py-4 text-center">No dashboard stats yet. Add one above!</p>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 w-full">
          <Stat
            name="Total Books"
            stat={dashboardStats.data?.total_books ?? 0}
          />
          <Stat
            name="Available"
            stat={dashboardStats.data?.available_books ?? 0}
          />
          <Stat name="On Loan" stat={dashboardStats.data?.books_on_loan ?? 0} />
          <Stat name="Overdue" stat={dashboardStats.data?.overdue_books ?? 0} />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 mt-8">
          <div className="xl:col-span-8 space-y-8">
            <RecentActivity />
            <OverdueBooks />
          </div>

          <div className="xl:col-span-4 space-y-8">
            <QuickActions />
            <PopularBooks />
            <LibraryStats />
          </div>
        </div>
      </div>
    </div>
  );
}
