import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "@/utils/api";
import { cn } from "@/lib/utils";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { OverdueBooks } from "@/components/dashboard/overdue-books";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { PopularBooks } from "@/components/dashboard/popular-books";
import { LibraryStats } from "@/components/dashboard/library-stats";
import { StatsOverview } from "@/components/dashboard/stat";
import { PageHeader, PageLayout } from "@/components/page-layout";
import { LoadingDashboard } from "@/components/skeletons/dashboard";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const {
    data: dashboardStats,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: getDashboardStats,
  });

  if (isLoading) {
    return <LoadingDashboard />;
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
        title=" Library Dashboard"
        description="Monitor your library's activity and performance"
      />

      <StatsOverview stats={dashboardStats} />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <MainContent className="xl:col-span-8" />
        <Sidebar className="xl:col-span-4" />
      </div>
    </PageLayout>
  );
}

interface MainContentProps {
  className?: string;
}

function MainContent({ className }: MainContentProps) {
  return (
    <div className={cn("space-y-8", className)}>
      <RecentActivity />
      <OverdueBooks />
    </div>
  );
}

interface SidebarProps {
  className?: string;
}

function Sidebar({ className }: SidebarProps) {
  return (
    <div className={cn("space-y-8", className)}>
      <QuickActions />
      <PopularBooks />
      <LibraryStats />
    </div>
  );
}
