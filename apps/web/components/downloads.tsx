import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Monitor, Apple, Smartphone } from "lucide-react";

export function Downloads() {
  const platforms = [
    {
      name: "Windows",
      icon: Monitor,
      description: "Windows 10/11",
      downloads: [{ name: "Installer", format: ".exe", size: "15MB" }],
    },
    {
      name: "macOS",
      icon: Apple,
      description: "macOS 10.15+",
      downloads: [{ name: "Bundle", format: ".dmg", size: "18MB" }],
    },
    {
      name: "Linux",
      icon: Smartphone,
      description: "Multiple formats",
      downloads: [
        { name: "Debian", format: ".deb", size: "12MB" },
        { name: "RPM", format: ".rpm", size: "12MB" },
        { name: "AppImage", format: ".AppImage", size: "20MB" },
      ],
    },
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-2xl font-medium text-foreground tracking-tight">
            Download Luu
          </h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed">
            Free and open source. Choose your platform below.
          </p>
          <Badge variant="secondary" className="text-xs font-normal px-3 py-1">
            v1.0.0
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {platforms.map((platform, index) => (
            <Card key={index} className="transition-smooth hover:shadow-md">
              <CardHeader className="text-center pb-3">
                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center mx-auto mb-3">
                  <platform.icon className="w-4 h-4 text-muted-foreground" />
                </div>
                <CardTitle className="text-sm font-medium">
                  {platform.name}
                </CardTitle>
                <p className="text-muted-foreground text-xs">
                  {platform.description}
                </p>
              </CardHeader>

              <CardContent className="space-y-2 pt-0">
                {platform.downloads.map((download, downloadIndex) => (
                  <Button
                    key={downloadIndex}
                    variant="outline"
                    size="sm"
                    className="w-full justify-between text-xs h-8"
                  >
                    <div className="flex items-center space-x-2">
                      <Download className="w-3 h-3" />
                      <span>{download.name}</span>
                    </div>
                    <span className="text-muted-foreground text-xs">
                      {download.format} • {download.size}
                    </span>
                  </Button>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="ghost" className="text-xs font-normal">
            Installation Guide
          </Button>
        </div>
      </div>
    </section>
  );
}
