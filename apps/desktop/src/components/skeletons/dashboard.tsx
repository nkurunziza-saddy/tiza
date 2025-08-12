import { PageLayout } from "../page-layout";

export function LoadingDashboard() {
  return (
    <PageLayout>
      <div className="space-y-4">
        <div className="h-8 bg-muted rounded w-64 animate-pulse" />
        <div className="h-4 bg-muted/60 rounded w-96 animate-pulse" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8 space-y-8">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-72 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="xl:col-span-4 space-y-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-48 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
