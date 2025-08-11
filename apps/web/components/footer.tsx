import { Badge } from "@/components/ui/badge";
import { Heart, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-12 px-6 border-t">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-medium text-foreground tracking-tight">
              Tiza
            </h3>
          </div>

          <div className="flex items-center space-x-6">
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-2 text-xs"
            >
              <Mail className="w-4 h-4" />
              <span>Mail</span>
            </a>
            <div className="flex items-center space-x-2 text-muted-foreground text-xs">
              <span>Made with</span>
              <Heart className="w-3 h-3 text-red-500" />
              <span>for schools</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t text-center">
          <p className="text-muted-foreground text-xs">
            © 2024 Tiza. Free library management system.
          </p>
        </div>
      </div>
    </footer>
  );
}
