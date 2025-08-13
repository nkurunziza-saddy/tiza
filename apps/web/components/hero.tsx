import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-3xl mx-auto text-center space-y-10">
        <div className="space-y-6">
          <Badge variant="secondary" className="text-xs font-normal px-3 py-1">
            Built for schools
          </Badge>

          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-light tracking-tight text-foreground">
              Tiza
            </h1>
            <div>
              <p className="text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
                Minimal library management.
              </p>
              <p className="text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
                Simple, fast, reliable.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto">
          <Button size="lg" className="font-normal text-sm h-10 px-6">
            <Link href="#downloads">Download</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="font-normal text-sm h-10 px-6"
          >
            {" "}
            <Link href="#learn-more">Learn More</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
