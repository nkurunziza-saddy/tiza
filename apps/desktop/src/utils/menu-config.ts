// src/utils/menu-config.ts
import {
  Menu,
  MenuItem,
  Submenu,
  PredefinedMenuItem,
} from "@tauri-apps/api/menu";
import { schoolName } from "./constants";

export async function createAppMenu() {
  // File Menu
  const fileSubmenu = await Submenu.new({
    text: "File",
    items: [
      await MenuItem.new({
        id: "new",
        text: "New",
        action: () => {
          window.dispatchEvent(
            new CustomEvent("menu_action", { detail: "new" })
          );
        },
      }),
      await PredefinedMenuItem.new({
        text: "",
        item: "Separator",
      }),
      await MenuItem.new({
        id: "import",
        text: "Import",
        action: () => {
          window.dispatchEvent(
            new CustomEvent("menu_action", { detail: "import" })
          );
        },
      }),
      await MenuItem.new({
        id: "export",
        text: "Export",
        action: () => {
          window.dispatchEvent(
            new CustomEvent("menu_action", { detail: "export" })
          );
        },
      }),
      await PredefinedMenuItem.new({
        text: "",
        item: "Separator",
      }),
      await PredefinedMenuItem.new({
        text: "Quit",
        item: "Quit",
      }),
    ],
  });

  // Edit Menu
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
    ],
  });

  // View Menu
  const viewSubmenu = await Submenu.new({
    text: "View",
    items: [
      await MenuItem.new({
        id: "dashboard",
        text: "Dashboard",
        action: () => {
          window.dispatchEvent(
            new CustomEvent("navigate", { detail: "dashboard" })
          );
        },
      }),
      await MenuItem.new({
        id: "books",
        text: "Books",
        action: () => {
          window.dispatchEvent(
            new CustomEvent("navigate", { detail: "books" })
          );
        },
      }),
      await MenuItem.new({
        id: "students",
        text: "Students",
        action: () => {
          window.dispatchEvent(
            new CustomEvent("navigate", { detail: "students" })
          );
        },
      }),
      await MenuItem.new({
        id: "lendings",
        text: "Lendings",
        action: () => {
          window.dispatchEvent(
            new CustomEvent("navigate", { detail: "lendings" })
          );
        },
      }),
      await PredefinedMenuItem.new({ text: "", item: "Separator" }),
      await MenuItem.new({
        id: "refresh",
        text: "Refresh",
        action: () => {
          window.dispatchEvent(
            new CustomEvent("menu_action", { detail: "refresh" })
          );
        },
      }),
    ],
  });

  // Tools Menu
  const toolsSubmenu = await Submenu.new({
    text: "Tools",
    items: [
      await MenuItem.new({
        id: "backup",
        text: "Backup Database",
        action: () => {
          window.dispatchEvent(
            new CustomEvent("menu_action", { detail: "backup" })
          );
        },
      }),
      await MenuItem.new({
        id: "restore",
        text: "Restore Database",
        action: () => {
          window.dispatchEvent(
            new CustomEvent("menu_action", { detail: "restore" })
          );
        },
      }),
    ],
  });

  // Help Menu
  const helpSubmenu = await Submenu.new({
    text: "Help",
    items: [
      await MenuItem.new({
        id: "about",
        text: `About ${schoolName}`,
        action: () => {
          window.dispatchEvent(
            new CustomEvent("menu_action", { detail: "about" })
          );
        },
      }),
      await MenuItem.new({
        id: "help",
        text: "Help",
        action: () => {
          window.dispatchEvent(
            new CustomEvent("menu_action", { detail: "help" })
          );
        },
      }),
      await MenuItem.new({
        id: "shortcuts",
        text: "Keyboard Shortcuts",
        action: () => {
          window.dispatchEvent(
            new CustomEvent("menu_action", { detail: "shortcuts" })
          );
        },
      }),
      await MenuItem.new({
        id: "contact",
        text: "Contact Support",
        action: () => {
          window.dispatchEvent(
            new CustomEvent("menu_action", { detail: "contact" })
          );
        },
      }),
    ],
  });

  // Create and set the menu
  const menu = await Menu.new({
    items: [fileSubmenu, editSubmenu, viewSubmenu, toolsSubmenu, helpSubmenu],
  });

  await menu.setAsAppMenu();
  return menu;
}
