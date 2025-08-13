import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Monitor, Apple, Smartphone } from "lucide-react";
import Link from "next/link";

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
  console.log("Detected platform:", release);
  const getPlatformAssets = (platformName: string): Asset[] => {
    if (!release) return [];

    const platformPatterns: Record<string, RegExp> = {
      windows: /\.(msi|exe)$/,
      macos: /\.(dmg|app)$/,
      linux: /\.(deb|rpm|AppImage)$/,
    };

    const pattern = platformPatterns[platformName.toLowerCase()];
    if (!pattern) return [];

    return release.assets.filter((a) => pattern.test(a.name));
  };

  const hardCodedEstimationSizes = {
    windows: {
      exe: "~4mb",
      msi: "~5mb",
    },
    macos: {
      dmg: "~5mb",
    },
    linux: {
      deb: "~6mb",
      rpm: "~6mb",
      appimage: "~87mb",
    },
  };
  const platforms = [
    {
      name: "Windows",
      icon: Monitor,
      description: "Windows 10/11",
      downloads: getPlatformAssets("windows").map((asset) => {
        const parts = asset.name
          .replace(".exe", "")
          .replace(".msi", "")
          .split("_");
        return {
          name: `${parts[0]}_${parts[2]}`,
          format: `.${asset.name.split(".").pop()}`,
          size:
            hardCodedEstimationSizes.windows[
              asset.name
                .split(".")
                .pop()
                ?.toLowerCase() as keyof typeof hardCodedEstimationSizes.windows
            ] || "N/A",
          url: asset.browser_download_url,
        };
      }),
    },
    {
      name: "macOS",
      icon: Apple,
      description: "macOS 10.15+",
      downloads: getPlatformAssets("macOS").map((asset) => {
        const parts = asset.name.replace(".dmg", "").split("_");
        return {
          name: `${parts[0]}_${parts[2]}`,
          format: `.${asset.name.split(".").pop()}`,
          size:
            hardCodedEstimationSizes.macos[
              asset.name
                .split(".")
                .pop()
                ?.toLowerCase() as keyof typeof hardCodedEstimationSizes.macos
            ] || "N/A",
          url: asset.browser_download_url,
        };
      }),
    },
    {
      name: "Linux",
      icon: Smartphone,
      description: "Multiple formats",
      downloads: getPlatformAssets("linux").map((asset) => {
        const ext = asset.name.split(".").pop()?.toLowerCase();
        let namePart = "";
        if (ext === "rpm") {
          const parts = asset.name.replace(".rpm", "").split("-");
          namePart = `${parts[0]}_${parts[2] || parts[1]}`;
        } else {
          const parts = asset.name
            .replace(".AppImage", "")
            .replace(".deb", "")
            .split("_");
          namePart = `${parts[0]}_${parts[2] || parts[1]}`;
        }

        return {
          name: namePart,
          format: `.${ext}`,
          size:
            hardCodedEstimationSizes.linux[
              ext as keyof typeof hardCodedEstimationSizes.linux
            ] || "N/A",
          url: asset.browser_download_url,
        };
      }),
    },
  ];
  return (
    <section className="py-24 px-6" id="downloads">
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

              <CardContent className="flex flex-col gap-y-2 pt-0">
                {platform.downloads.length > 0 ? (
                  platform.downloads.map((download, downloadIndex) => (
                    <Button
                      variant="outline"
                      size="sm"
                      key={downloadIndex}
                      asChild
                      className="w-full justify-between text-xs h-8"
                    >
                      <Link href={download.url} download>
                        <div className="flex items-center space-x-2">
                          <Download className="w-3 h-3" />
                          <span>{download.name}</span>
                        </div>
                        <span className="text-muted-foreground text-xs">
                          {download.format} • {download.size}
                        </span>
                      </Link>
                    </Button>
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

        {/* <div className="text-center mt-12">
          <Button variant="ghost" className="text-xs font-normal">
            Installation Guide
          </Button>
        </div> */}
      </div>
    </section>
  );
}
