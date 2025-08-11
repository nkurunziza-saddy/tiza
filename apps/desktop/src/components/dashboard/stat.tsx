import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Clock, AlertTriangle, TrendingUp } from "lucide-react";

interface StatsOverviewProps {
  stats: any;
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  const statCards = [
    {
      title: "Total Books",
      value: stats?.total_books ?? 0,
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Available",
      value: stats?.available_books ?? 0,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "On Loan",
      value: stats?.books_on_loan ?? 0,
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      title: "Overdue",
      value: stats?.overdue_books ?? 0,
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor?: string;
}

export function StatCard({ title, value }: StatCardProps) {
  return (
    <Card className={`px-2.5 py-4`}>
      <CardContent className="py-1 px-4">
        <dt className="text-sm font-medium text-muted-foreground">{title}</dt>
        <dd className="mt-4 flex items-baseline space-x-2.5">
          <span className="text-2xl font-semibold text-foreground">
            {value.toLocaleString()}
          </span>
        </dd>
      </CardContent>
    </Card>
  );
}
