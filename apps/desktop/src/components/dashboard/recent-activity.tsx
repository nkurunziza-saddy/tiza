import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getRecentActivity } from "@/utils/api";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export function RecentActivity() {
  const recentActivities = useQuery({
    queryKey: ["recentActivity"],
    queryFn: getRecentActivity,
  });
  if (!recentActivities.data) return null;
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest transactions and library updates
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-muted-foreground">
            Last 24 hours
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivities.data.map((activity) => {
            return (
              <div key={activity.id} className={`p-2 border`}>
                <div className="flex items-start space-x-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <p className="font-medium ">{activity.student_name}</p>
                      </div>
                      <Badge className="capitalize">
                        {activity.activity_type}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span className="font-medium">
                          {activity.book_title}
                        </span>
                        <ArrowRight className="size-3 mx-2 text-muted-foreground" />
                        <span>{activity.author}</span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center space-x-4">
                          <span>Student ID: {activity.student_id}</span>
                          {activity.category && (
                            <Badge variant="outline" className="text-xs">
                              {activity.category}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span>
                            {new Date(activity.created_at).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {activity.due_date && (
                        <p className="text-xs rounded-md inline-block">
                          Due: {activity.due_date}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
