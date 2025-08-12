import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getRecentActivity } from "@/utils/api";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { RecentActivity as RecentActivityInterface } from "@/types";
import { LoadingCard } from "../skeletons/cards";

export function RecentActivity() {
  const { data: activities, isLoading } = useQuery({
    queryKey: ["recentActivity"],
    queryFn: getRecentActivity,
  });
  console.log("Activities", activities);

  if (isLoading) return <LoadingCard title="Recent Activity" />;
  if (!activities?.length) return null;

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest transactions and library updates
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-xs">
            Last 24 hours
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <ActivityItem key={activity.id} activity={activity} />
        ))}
      </CardContent>
    </Card>
  );
}

function ActivityItem({ activity }: { activity: RecentActivityInterface }) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-lg border bg-card/50 hover:bg-card/80 transition-colors">
      <Avatar className="size-10">
        <AvatarFallback className="text-xs">
          {activity.student_name?.charAt(0) ?? "U"}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">{activity.student_name}</h4>
          <Badge variant="secondary" className="capitalize text-xs">
            {activity.activity_type}
          </Badge>
        </div>

        <div className="flex items-center text-sm text-muted-foreground">
          <span className="font-medium">{activity.book_title}</span>
          <ArrowRight className="size-3 mx-2" />
          <span>{activity.author}</span>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          {/* <div className="flex items-center gap-3"> */}
          {/* <span>ID: {activity.student_id}</span> */}
          {activity.category && (
            <Badge variant="outline" className="text-xs">
              {activity.category}
            </Badge>
          )}
          {/* </div> */}
          <time>{new Date(activity.created_at).toLocaleString()}</time>
        </div>

        {activity.due_date && (
          <p className="text-xs text-muted-foreground">
            Due: {new Date(activity.due_date).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
}
