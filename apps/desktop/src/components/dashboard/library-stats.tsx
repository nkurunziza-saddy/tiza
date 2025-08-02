import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BookOpen, TrendingUp, Clock, Users2, AlertCircle } from "lucide-react";
import { Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "@/utils/api";

export function LibraryStats() {
  const statsReq = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: getDashboardStats,
  });
  const stats = statsReq.data;
  if (statsReq.isLoading) {
    return (
      <CardContent className="p-6">
        <div className="space-y-3">
          <div className="h-4 bg-muted rounded animate-pulse" />
          <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
          <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
        </div>
      </CardContent>
    );
  }

  if (statsReq.error) {
    return (
      <CardContent>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Failed to load library stats</AlertDescription>
        </Alert>
      </CardContent>
    );
  }

  if (!stats) return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Library Overview</CardTitle>
      </CardHeader>
      <Suspense
        fallback={<div className="p-4 text-center">Loading stats...</div>}
      >
        <CardContent className="pt-0 space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Users2 className="size-4" />
                <span className="text-sm text-muted-foreground">
                  Total Students
                </span>
              </div>
              <Badge variant="secondary">{stats.total_students}</Badge>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <BookOpen className="size-4" />
                <span className="text-sm text-muted-foreground">
                  Available Books
                </span>
              </div>
              <Badge variant="secondary">{stats.available_books}</Badge>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Clock className="size-4" />
                <span className="text-sm text-muted-foreground">
                  Currently Loaned
                </span>
              </div>
              <Badge variant="outline">{stats.books_on_loan}</Badge>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <TrendingUp className="size-4" />
                <span className="text-sm text-muted-foreground">
                  Overdue Items
                </span>
              </div>
              <Badge variant="destructive">{stats.overdue_books}</Badge>
            </div>

            <div className="pt-2 border-t">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Utilization Rate</span>
                <span className="text-sm font-semibold">
                  {stats.utilization_rate}%
                </span>
              </div>
              <Progress value={stats.utilization_rate} className="h-2" />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium">Popular Categories</h4>
            <div className="space-y-3">
              {stats.popular_categories.map((category, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {category.name}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-muted-foreground/90">
                        {category.count} loans
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {category.percentage}%
                      </Badge>
                    </div>
                  </div>
                  <Progress value={category.percentage} className="h-1.5" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Suspense>
    </Card>
  );
}
