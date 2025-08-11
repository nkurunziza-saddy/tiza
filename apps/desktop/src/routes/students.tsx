import { DataTable } from "@/components/table/data-table";
import { getAllStudents } from "@/utils/api";
import { StudentColumn } from "@/utils/columns";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import { PageHeader, PageLayout } from "@/components/page-layout";
import { StudentsPageSkeleton } from "@/components/skeletons/students-page";

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
      <PageLayout>
        <div className="flex items-center justify-center py-20">
          <div className="text-center space-y-4">
            <AlertTriangle className="size-12 text-destructive mx-auto" />
            <h2 className="text-xl font-semibold">
              Failed to load students data
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
        title="Student Directory"
        description="Manage student records and track reading activity"
      />

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
                className="text-sm py-2 px-4"
              >
                Grade {grade}: {count} students
              </Badge>
            ))}
        </div>
      </div>

      <DataTable columns={StudentColumn} data={students ?? []} tag="students" />
    </PageLayout>
  );
}
