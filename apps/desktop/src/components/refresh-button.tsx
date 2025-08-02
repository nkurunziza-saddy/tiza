import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export default function RefreshButton() {
  const queryClient = useQueryClient();

  const handleRefresh = () => {
    queryClient.invalidateQueries();
  };

  return (
    <Button variant="outline" size="sm" onClick={handleRefresh}>
      <RefreshCw className="h-4 w-4" />
    </Button>
  );
}
