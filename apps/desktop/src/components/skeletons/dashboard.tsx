import { PageLayout } from "../page-layout";
import { Card, CardContent } from "../ui/card";
import { LoadingCard } from "./cards";

export function LoadingDashboard() {
  return (
    <PageLayout>
      <div className="space-y-4">
        <div className="h-8 bg-muted rounded w-64 animate-pulse" />
        <div className="h-4 bg-muted/60 rounded w-96 animate-pulse" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="px-4 py-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-20 animate-pulse" />
                  <div className="h-8 bg-muted rounded w-16 animate-pulse" />
                </div>
                <div className="size-12 bg-muted rounded-full animate-pulse" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8 space-y-8">
          <LoadingCard title="Recent Activity" />
          <LoadingCard title="Overdue Books" />
        </div>
        <div className="xl:col-span-4 space-y-8">
          <LoadingCard title="Quick Actions" />
          <LoadingCard title="Popular Books" />
          <LoadingCard title="Library Stats" />
        </div>
      </div>
    </PageLayout>
  );
}
