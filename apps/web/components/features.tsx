import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookOpen,
  Users,
  TrendingUp,
  Shield,
  Zap,
  Download,
} from "lucide-react";

export function Features() {
  const features = [
    {
      icon: BookOpen,
      title: "Book Management",
      description:
        "Catalog and organize your collection with intuitive search and filtering.",
    },
    {
      icon: Users,
      title: "Student Records",
      description:
        "Track student information and borrowing history effortlessly.",
    },
    {
      icon: TrendingUp,
      title: "Lending Tracking",
      description:
        "Monitor loans, due dates, and returns with automated notifications.",
    },
    {
      icon: Shield,
      title: "Reliable",
      description:
        "Built with Rust for performance, safety, and data integrity.",
    },
    {
      icon: Zap,
      title: "Fast & Offline",
      description: "Native performance with minimal resource usage.",
    },
    {
      icon: Download,
      title: "Cross-Platform",
      description: "Available for Windows, macOS, and Linux distributions.",
    },
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16 space-y-3">
          <h2 className="text-2xl font-medium text-foreground tracking-tight">
            Everything you need
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-sm leading-relaxed">
            Essential tools for school library management without unnecessary
            complexity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <Card key={index} className="transition-smooth hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="w-9 h-9 bg-muted rounded-lg flex items-center justify-center mb-3">
                  <feature.icon className="w-4 h-4 text-muted-foreground" />
                </div>
                <CardTitle className="text-sm font-medium">
                  {feature.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="pt-0">
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
