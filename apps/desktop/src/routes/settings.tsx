import { PageLayout } from "@/components/page-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/hooks/use-theme";
import { confirm } from "@tauri-apps/plugin-dialog";
import { invoke } from "@tauri-apps/api/core";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <PageLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>

        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize how the application looks and feels.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="dark-mode">Dark Mode</Label>
                <Switch
                  id="dark-mode"
                  checked={theme === "dark"}
                  onCheckedChange={(checked) =>
                    setTheme(checked ? "dark" : "light")
                  }
                />
              </div>
            </CardContent>
          </Card>

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
                <button
                  onClick={() =>
                    confirm("Do you want to backup the database?", {
                      title: "Backup Database",
                      type: "info",
                    }).then((confirmed) => {
                      if (confirmed) {
                        invoke("backup_database");
                      }
                    })
                  }
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                >
                  Backup Now
                </button>
              </div>

              <Separator />

              <div className="flex items-center justify-between space-x-2">
                <div>
                  <Label>Restore Database</Label>
                  <p className="text-sm text-muted-foreground">
                    Restore from a previous backup
                  </p>
                </div>
                <button
                  onClick={() =>
                    confirm(
                      "Do you want to restore the database? This will overwrite your current data.",
                      {
                        title: "Restore Database",
                        type: "warning",
                      }
                    ).then((confirmed) => {
                      if (confirmed) {
                        invoke("restore_database");
                      }
                    })
                  }
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-4 py-2"
                >
                  Restore
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
