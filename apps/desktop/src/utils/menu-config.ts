// src/utils/menu-config.ts
import {
  Menu,
  MenuItem,
  Submenu,
  PredefinedMenuItem,
} from "@tauri-apps/api/menu";
import { schoolName } from "./constants";

// Menu action types for better type safety
export type MenuAction =
  | "new"
  | "import"
  | "export"
  | "refresh"
  | "backup"
  | "restore"
  | "settings"
  | "about"
  | "help"
  | "shortcuts"
  | "contact";

export type NavigationAction = "dashboard" | "books" | "students" | "lendings";

// Helper function to create menu items with consistent event dispatching
const createMenuItem = (id: string, text: string, action: MenuAction) =>
  MenuItem.new({
    id,
    text,
    accelerator: getAccelerator(id),
    action: () => {
      window.dispatchEvent(new CustomEvent("menu_action", { detail: action }));
    },
  });

const createNavMenuItem = (id: string, text: string, route: NavigationAction) =>
  MenuItem.new({
    id,
    text,
    accelerator: getAccelerator(id),
    action: () => {
      window.dispatchEvent(new CustomEvent("navigate", { detail: route }));
    },
  });

// Keyboard shortcuts mapping
function getAccelerator(id: string): string | undefined {
  const shortcuts: Record<string, string> = {
    new: "CmdOrCtrl+N",
    import: "CmdOrCtrl+I",
    export: "CmdOrCtrl+E",
    refresh: "F5",
    dashboard: "CmdOrCtrl+D",
    books: "CmdOrCtrl+B",
    students: "CmdOrCtrl+Shift+S",
    lendings: "CmdOrCtrl+L",
    backup: "CmdOrCtrl+Shift+B",
    settings: "CmdOrCtrl+,",
    help: "F1",
    shortcuts: "CmdOrCtrl+?",
  };
  return shortcuts[id];
}

export async function createAppMenu() {
  try {
    // File Menu - Focus on core file operations
    const fileSubmenu = await Submenu.new({
      text: "File",
      items: [
        await createMenuItem("new", "New...", "new"),
        await PredefinedMenuItem.new({ text: "", item: "Separator" }),
        await createMenuItem("import", "Import Data", "import"),
        await createMenuItem("export", "Export Data", "export"),
        await PredefinedMenuItem.new({ text: "", item: "Separator" }),
        await createMenuItem("settings", "Settings", "settings"),
        await PredefinedMenuItem.new({ text: "", item: "Separator" }),
        await PredefinedMenuItem.new({ text: "Quit", item: "Quit" }),
      ],
    });

    // Edit Menu - Standard editing operations
    const editSubmenu = await Submenu.new({
      text: "Edit",
      items: [
        await PredefinedMenuItem.new({ text: "Undo", item: "Undo" }),
        await PredefinedMenuItem.new({ text: "Redo", item: "Redo" }),
        await PredefinedMenuItem.new({ text: "", item: "Separator" }),
        await PredefinedMenuItem.new({ text: "Cut", item: "Cut" }),
        await PredefinedMenuItem.new({ text: "Copy", item: "Copy" }),
        await PredefinedMenuItem.new({ text: "Paste", item: "Paste" }),
        await PredefinedMenuItem.new({ text: "Select All", item: "SelectAll" }),
        await PredefinedMenuItem.new({ text: "", item: "Separator" }),
        await createMenuItem("refresh", "Refresh", "refresh"),
      ],
    });

    // View Menu - Navigation and display options
    const viewSubmenu = await Submenu.new({
      text: "View",
      items: [
        await createNavMenuItem("dashboard", "Dashboard", "dashboard"),
        await PredefinedMenuItem.new({ text: "", item: "Separator" }),
        await createNavMenuItem("books", "Books", "books"),
        await createNavMenuItem("students", "Students", "students"),
        await createNavMenuItem("lendings", "Lending & Returns", "lendings"),
        await PredefinedMenuItem.new({ text: "", item: "Separator" }),
        await PredefinedMenuItem.new({
          text: "Toggle Fullscreen",
          item: "Fullscreen",
        }),
      ],
    });

    // Tools Menu - Administrative functions
    const toolsSubmenu = await Submenu.new({
      text: "Tools",
      items: [
        await createMenuItem("backup", "Backup Database", "backup"),
        await createMenuItem("restore", "Restore Database", "restore"),
        await PredefinedMenuItem.new({ text: "", item: "Separator" }),
        await MenuItem.new({
          id: "reports",
          text: "Generate Reports",
          action: () => {
            window.dispatchEvent(
              new CustomEvent("menu_action", { detail: "reports" })
            );
          },
        }),
      ],
    });

    // Help Menu - Support and information
    const helpSubmenu = await Submenu.new({
      text: "Help",
      items: [
        await createMenuItem("help", "User Guide", "help"),
        await createMenuItem("shortcuts", "Keyboard Shortcuts", "shortcuts"),
        await PredefinedMenuItem.new({ text: "", item: "Separator" }),
        await createMenuItem("contact", "Contact Support", "contact"),
        await createMenuItem("about", `About ${schoolName}`, "about"),
      ],
    });

    // Create and set the menu
    const menu = await Menu.new({
      items: [fileSubmenu, editSubmenu, viewSubmenu, toolsSubmenu, helpSubmenu],
    });

    await menu.setAsAppMenu();
    console.log("Application menu created successfully");
    return menu;
  } catch (error) {
    console.error("Failed to create application menu:", error);
    throw error;
  }
}
