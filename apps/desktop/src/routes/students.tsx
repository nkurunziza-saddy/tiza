import { DataTable } from "@/components/table/data-table";
import { getAllLendings, getAllStudents, getOverdueBooks } from "@/utils/api";
import { StudentColumn } from "@/utils/columns";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, BookOpen, Clock } from "lucide-react";
import { PageHeader, PageLayout } from "@/components/page-layout";
import { StudentsPageSkeleton } from "@/components/skeletons/students-page";
import { StatCard } from "@/components/dashboard/stat";

export const Route = createFileRoute("/students")({
  component: StudentsPage,
});

function StudentsPage() {
  const {
    data: students,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["getAllStudents"],
    queryFn: getAllStudents,
  });

  const { data: lendings } = useQuery({
    queryKey: ["getAllLendings"],
    queryFn: getAllLendings,
  });
  const { data: overdueBooks } = useQuery({
    queryKey: ["overdueBooks"],
    queryFn: getOverdueBooks,
  });

  const stats = students
    ? {
        totalLendings: students.length,
        activeLendings:
          lendings?.filter((l) => l.status === "Returned").length ?? 0,
        overdue: overdueBooks?.length ?? 0,
      }
    : null;
  const percentageLent =
    stats?.activeLendings && stats.activeLendings > 0
      ? (stats.activeLendings / stats.totalLendings) * 100
      : 0;
  console.log(
    "Percentage of active lendings:",
    percentageLent,
    stats?.activeLendings,
    stats?.totalLendings
  );

  const gradeDistribution = students
    ? students.reduce((acc, student) => {
        acc[student.grade] = (acc[student.grade] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    : {};

  if (isLoading) {
    return <StudentsPageSkeleton />;
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
        title="Student Directory"
        description="Manage student records and track reading activity"
      />

      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-6">
          <StatCard
            title="Total Lendings"
            value={stats.totalLendings}
            icon={BookOpen}
            color="blue"
          />
          <StatCard
            title="Active Loans"
            value={`${percentageLent}%`}
            icon={Clock}
            color="green"
          />
          <StatCard
            title="Overdue"
            value={stats.overdue}
            icon={AlertTriangle}
            color="red"
          />
        </div>
      )}

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">
          Grade Distribution
        </h3>
        <div className="flex flex-wrap gap-3">
          {Object.entries(gradeDistribution)
            .sort(([a], [b]: [string, number]) => a.localeCompare(b))
            .map(([grade, count]: [string, number]) => (
              <Badge
                key={grade}
                variant="outline"
                className="text-xs py-1.5 px-2"
              >
                Grade {grade}: {count}
              </Badge>
            ))}
        </div>
      </div>

      <DataTable columns={StudentColumn} data={students ?? []} tag="students" />
    </PageLayout>
  );
}
