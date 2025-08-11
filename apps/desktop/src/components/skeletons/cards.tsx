import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export function LoadingCard({ title }: { title: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-muted rounded animate-pulse" />
              <div className="h-3 bg-muted/60 rounded animate-pulse w-3/4" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
