import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import ThemeModeToggler from "@/components/mode-toggle";
import "../styles/index.css";
import { useMenuHandler } from "@/utils/menu-api";

export const Route = createRootRoute({
  component: Root,
});

function Root() {
  useMenuHandler();
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  });
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
      themes={[
        "light",
        "dark",
        "warm",
        "cool",
        "charcoal",
        "ocean",
        "twilight",
      ]}
    >
      <QueryClientProvider client={queryClient}>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 justify-between items-center gap-2 px-4">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
              </div>
              <div className="flex gap-2">
                <ThemeModeToggler />
              </div>
            </header>
            <main className="my-4">
              <Outlet />
            </main>
          </SidebarInset>
        </SidebarProvider>
        <ReactQueryDevtools />
        <TanStackRouterDevtools />
      </QueryClientProvider>
      <Toaster richColors />
    </ThemeProvider>
  );
}
