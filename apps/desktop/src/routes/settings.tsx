import { PageLayout } from "@/components/page-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { confirm } from "@tauri-apps/plugin-dialog";
import { invoke } from "@tauri-apps/api/core";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { THEMES } from "@/components/mode-toggle";
import { useTheme } from "next-themes";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <PageLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Choose your preferred theme.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {mounted &&
                  THEMES.map((t) => {
                    const Icon = t.icon;
                    return (
                      <Button
                        key={t.name}
                        variant={theme === t.name ? "default" : "outline"}
                        onClick={() => setTheme(t.name)}
                        size={"sm"}
                        className="flex items-center gap-2 h-7 text-sm"
                        aria-label={t.label}
                      >
                        <Icon size={16} />
                        {t.label}
                      </Button>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
          {/* TODO: Add custom grades alongside default ones */}
          <Card>
            <CardHeader>
              <CardTitle>Database</CardTitle>
              <CardDescription>
                Manage your database backup and restore options.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <div>
                  <Label>Backup Database</Label>
                  <p className="text-sm text-muted-foreground">
                    Create a backup of your current database
                  </p>
                </div>
                <Button
                  onClick={() =>
                    confirm("Do you want to backup the database?", {
                      title: "Backup Database",
                      kind: "info",
                    }).then((confirmed) => {
                      if (confirmed) {
                        invoke("backup_database");
                      }
                    })
                  }
                  variant={"default"}
                >
                  Backup Now
                </Button>
              </div>

              <Separator />

              <div className="flex items-center justify-between space-x-2">
                <div>
                  <Label>Restore Database</Label>
                  <p className="text-sm text-muted-foreground">
                    Restore from a previous backup
                  </p>
                </div>
                <Button
                  onClick={() =>
                    confirm(
                      "Do you want to restore the database? This will overwrite your current data.",
                      {
                        title: "Restore Database",
                        kind: "warning",
                      }
                    ).then((confirmed) => {
                      if (confirmed) {
                        invoke("restore_database");
                      }
                    })
                  }
                  variant="destructive"
                >
                  Restore
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
