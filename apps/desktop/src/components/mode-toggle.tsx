import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Sun,
  Moon,
  Sparkles,
  Flame,
  Droplets,
  Waves,
  CloudMoon,
} from "lucide-react";

const themes = [
  { name: "light", label: "Light", icon: Sun },
  { name: "dark", label: "Dark", icon: Moon },
  { name: "warm", label: "Warm Light", icon: Flame },
  { name: "cool", label: "Cool Light", icon: Droplets },
  { name: "charcoal", label: "Charcoal", icon: Sparkles },
  { name: "ocean", label: "Ocean Blue", icon: Waves },
  { name: "twilight", label: "Twilight", icon: CloudMoon },
];

export default function ThemeModeToggler() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const currentTheme =
    themes.find((theme) => theme.name === resolvedTheme) || themes[0];
  const CurrentIcon = currentTheme.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="secondary"
          aria-label="Toggle Theme"
          title="Choose theme"
        >
          <CurrentIcon size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map((theme) => {
          const Icon = theme.icon;
          return (
            <DropdownMenuItem
              key={theme.name}
              onClick={() => setTheme(theme.name)}
              className="flex items-center gap-2"
            >
              <Icon size={14} />
              {theme.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
