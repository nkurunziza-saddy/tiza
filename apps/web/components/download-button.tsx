import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface Asset {
  name: string;
  browser_download_url: string;
}

interface Release {
  tag_name: string;
  published_at: string;
  assets: Asset[];
}

export function DownloadButton() {
  const [release, setRelease] = useState<Release | null>(null);
  const [loading, setLoading] = useState(true);
  const [platform, setPlatform] = useState<string>("");

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes("mac")) setPlatform("macOS");
    else if (userAgent.includes("win")) setPlatform("windows");
    else if (userAgent.includes("linux")) setPlatform("linux");
    else setPlatform("windows");

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
      windows: /\.(msi|exe)$/i,
      macos: /\.(dmg|app)$/i,
      linux: /\.(deb|rpm|AppImage)$/i,
    };

    const pattern = platformPatterns[platformName.toLowerCase()];
    if (!pattern) return [];

    return release.assets.filter((a) => pattern.test(a.name));
  };
  console.log("Detected platform:", navigator.userAgent);
  const getBestAssetForPlatform = (platformName: string): Asset | null => {
    const assets = getPlatformAssets(platformName);
    if (assets.length === 0) return null;

    const preferences: Record<string, RegExp[]> = {
      windows: [/\.msi$/i, /\.exe$/i],
      macos: [/\.dmg$/i, /\.app$/i],
      linux: [/\.AppImage$/i, /\.deb$/i, /\.rpm$/i],
    };

    const platformPrefs = preferences[platformName.toLowerCase()];
    if (!platformPrefs) return assets[0];

    for (const regex of platformPrefs) {
      const preferred = assets.find((asset) => regex.test(asset.name));
      if (preferred) return preferred;
    }

    return assets[0];
  };

  const handleDownload = () => {
    if (!release || !platform) return;

    const asset = getBestAssetForPlatform(platform);
    if (asset) {
      window.open(asset.browser_download_url, "_blank");
    }
  };

  const getFileExtension = (platformName: string): string => {
    const asset = getBestAssetForPlatform(platformName);
    if (!asset) return "";

    const ext = asset.name.split(".").pop()?.toUpperCase() || "";
    return ext;
  };

  if (loading) {
    return (
      <Button size="lg" className="font-normal text-sm h-10 px-6" disabled>
        <Download className="w-4 h-4 mr-2 animate-spin" />
        Loading...
      </Button>
    );
  }

  if (!release) {
    return (
      <Button size="lg" className="font-normal text-sm h-10 px-6" disabled>
        <Download className="w-4 h-4 mr-2" />
        Download Unavailable
      </Button>
    );
  }

  const asset = getBestAssetForPlatform(platform);
  const fileExt = getFileExtension(platform);

  return (
    <Button
      size="lg"
      className="font-normal text-sm h-10 px-6"
      onClick={handleDownload}
      disabled={!asset}
    >
      Download for {platform} {fileExt && `(.${fileExt})`}
    </Button>
  );
}
