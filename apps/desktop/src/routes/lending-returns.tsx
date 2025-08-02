import { DataTable } from "@/components/table/data-table";
import { getAllLendings } from "@/utils/api";
import { LendingColumn } from "@/utils/columns";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/lending-returns")({
  component: LendingsPage,
});

function LendingsPage() {
  const lendings = useQuery({
    queryKey: ["getAllLendings"],
    queryFn: getAllLendings,
  });

  if (lendings.isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-4">
          <div className="bg-muted/50 aspect-video rounded-xl" />
          <div className="bg-muted/50 aspect-video rounded-xl" />
          <div className="bg-muted/50 aspect-video rounded-xl" />
          <div className="bg-muted/50 aspect-video rounded-xl" />
        </div>
        <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DataTable
        columns={LendingColumn}
        data={lendings.data ?? []}
        tag="lending"
      />
    </div>
  );
}
