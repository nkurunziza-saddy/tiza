import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Monitor, Apple, Smartphone } from "lucide-react";

interface Asset {
  name: string;
  browser_download_url: string;
}

interface Release {
  tag_name: string;
  published_at: string;
  assets: Asset[];
}

export function Downloads() {
  const [release, setRelease] = useState<Release | null>(null);
  const [loading, setLoading] = useState(true);
  const [platform, setPlatform] = useState<string>("");

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes("mac")) setPlatform("macOS");
    else if (userAgent.includes("win")) setPlatform("windows");
    else if (userAgent.includes("linux")) setPlatform("linux");

    const fetchRelease = async () => {
      try {
        const repo = "nkurunziza-saddy/tiza";
        const response = await fetch(
          `https://api.github.com/repos/${repo}/releases/latest`
        );
        if (response.ok) {
          const data = await response.json();
          setRelease(data);
        }
      } catch (error) {
        console.error("Failed to fetch release:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelease();
  }, []);

  const getPlatformAssets = (platformName: string): Asset[] => {
    if (!release) return [];

    const platformPatterns: Record<string, RegExp> = {
      windows: /\.(msi|exe)$/,
      macOS: /\.dmg$/,
      linux: /\.(deb|rpm|AppImage)$/,
    };

    const pattern = platformPatterns[platformName.toLowerCase()];
    if (!pattern) return [];

    return release.assets.filter((a) => pattern.test(a.name));
  };

  const platforms = [
    {
      name: "Windows",
      icon: Monitor,
      description: "Windows 10/11",
      downloads: getPlatformAssets("windows").map((asset) => ({
        name: asset.name.split("_")[0] || asset.name,
        format: `.${asset.name.split(".").pop()?.toUpperCase()}`,
        size: "N/A",
        url: asset.browser_download_url,
      })),
    },
    {
      name: "macOS",
      icon: Apple,
      description: "macOS 10.15+",
      downloads: getPlatformAssets("macOS").map((asset) => ({
        name: asset.name.split("_")[0] || asset.name,
        format: `.${asset.name.split(".").pop()?.toUpperCase()}`,
        size: "N/A",
        url: asset.browser_download_url,
      })),
    },
    {
      name: "Linux",
      icon: Smartphone,
      description: "Multiple formats",
      downloads: getPlatformAssets("linux").map((asset) => ({
        name: asset.name.split("_")[0] || asset.name,
        format: `.${asset.name.split(".").pop()?.toUpperCase()}`,
        size: "N/A",
        url: asset.browser_download_url,
      })),
    },
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-2xl font-medium text-foreground tracking-tight">
            Download Tiza
          </h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed">
            Free and open source. Choose your platform below.
          </p>
          {loading ? (
            <div className="text-muted-foreground text-sm">
              Loading latest version...
            </div>
          ) : release ? (
            <Badge
              variant="secondary"
              className="text-xs font-normal px-3 py-1"
            >
              {release.tag_name}
            </Badge>
          ) : (
            <Badge
              variant="secondary"
              className="text-xs font-normal px-3 py-1"
            >
              v1.0.0
            </Badge>
          )}
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
                {platform.downloads.length > 0 ? (
                  platform.downloads.map((download, downloadIndex) => (
                    <a key={downloadIndex} href={download.url} download>
                      <Button
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
                    </a>
                  ))
                ) : (
                  <p className="text-muted-foreground text-xs text-center">
                    No downloads available
                  </p>
                )}
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
