// src/utils/menu-api.tsx
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { makeGmailLink } from "@/lib/utils";
import { schoolName } from "@/utils/constants";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import CreateStudent from "@/components/forms/create-student";
import CreateBook from "@/components/forms/create-book";
import CreateLending from "@/components/forms/create-lending";
import {
  createAppMenu,
  type MenuAction,
  type NavigationAction,
} from "./menu-config";
import { toast } from "sonner";

interface DialogState {
  isOpen: boolean;
  title: string;
  content: React.ReactNode;
}

interface FormDialogState {
  book: boolean;
  student: boolean;
  lending: boolean;
}

interface BackupResult {
  success: boolean;
  message: string;
  path?: string;
}

interface RestoreResult {
  success: boolean;
  message: string;
}

export function useMenuHandler() {
  const navigate = useNavigate();

  // Dialog states
  const [dialogContent, setDialogContent] = useState<DialogState>({
    isOpen: false,
    title: "",
    content: null,
  });

  const [formDialogs, setFormDialogs] = useState<FormDialogState>({
    book: false,
    student: false,
    lending: false,
  });

  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: () => {},
  });

  // Helper to close general dialogs
  const closeDialog = useCallback(() => {
    setDialogContent((prev) => ({ ...prev, isOpen: false }));
  }, []);

  // Helper to toggle form dialogs
  const toggleFormDialog = useCallback(
    (type: keyof FormDialogState, isOpen: boolean) => {
      setFormDialogs((prev) => ({ ...prev, [type]: isOpen }));
    },
    []
  );

  // Show confirmation dialog
  const showConfirmDialog = useCallback(
    (title: string, description: string, onConfirm: () => void) => {
      setConfirmDialog({
        isOpen: true,
        title,
        description,
        onConfirm,
      });
    },
    []
  );

  // Navigation handler
  const handleNavigation = useCallback(
    (destination: NavigationAction) => {
      console.log(`Navigating to: ${destination}`);

      const routes = {
        dashboard: "/",
        books: "/books",
        students: "/students",
        lendings: "/lending-returns",
      } as const;

      if (routes[destination]) {
        navigate({ to: routes[destination] });
      }
    },
    [navigate]
  );

  // Tauri command handlers
  const handleBackup = useCallback(async () => {
    try {
      const result = await invoke<BackupResult>("backup_database");

      if (result.success) {
        toast.success("Backup Successful", {
          description: result.message,
        });
      } else {
        toast.error("Backup Failed", {
          description: result.message,
        });
      }
    } catch (error) {
      console.error("Backup error:", error);
      toast.error("Backup Error", {
        description: "An unexpected error occurred during backup.",
      });
    }
  }, [toast]);

  const handleRestore = useCallback(async () => {
    try {
      const result = await invoke<RestoreResult>("restore_database");

      if (result.success) {
        toast.success("Restore Successful", {
          description: result.message,
        });

        // Refresh the app after successful restore
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toast.error("Restore Failed", {
          description: result.message,
        });
      }
    } catch (error) {
      console.error("Restore error:", error);
      toast("Restore Error", {
        description: "An unexpected error occurred during restore.",
      });
    }
  }, [toast]);

  const handleExport = useCallback(async () => {
    try {
      const result = await invoke<BackupResult>("export_data", {
        exportType: "csv",
      });

      if (result.success) {
        toast.success("Export Successful", {
          description: result.message,
        });
      } else {
        toast.error("Export Failed", {
          description: result.message,
        });
      }
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Export Error", {
        description: "An unexpected error occurred during export.",
      });
    }
  }, [toast]);

  const handleImport = useCallback(async () => {
    try {
      const result = await invoke<RestoreResult>("import_data");

      if (result.success) {
        toast.success("Import Successful", {
          description: result.message,
        });

        // Refresh data after successful import
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toast.error("Import Failed", {
          description: result.message,
        });
      }
    } catch (error) {
      console.error("Import error:", error);
      toast.error("Import Error", {
        description: "An unexpected error occurred during import.",
      });
    }
  }, [toast]);

  // Menu action handlers
  const menuActionHandlers = {
    new: () => {
      const currentPath = window.location.pathname;
      const pathToDialog = {
        "/books": () => toggleFormDialog("book", true),
        "/students": () => toggleFormDialog("student", true),
        "/lending-returns": () => toggleFormDialog("lending", true),
      } as const;

      const handler = pathToDialog[currentPath as keyof typeof pathToDialog];
      if (handler) {
        handler();
      } else {
        // Show a selection dialog for new items
        showNewItemDialog();
      }
    },

    refresh: async () => {
      try {
        await invoke("refresh_app");
        window.location.reload();
      } catch (error) {
        console.error("Refresh error:", error);
        window.location.reload();
      }
    },

    import: () => {
      showConfirmDialog(
        "Import Data",
        "This will import data from a selected file. Are you sure you want to continue?",
        handleImport
      );
    },

    export: handleExport,

    backup: handleBackup,

    restore: () => {
      showConfirmDialog(
        "Restore Database",
        "This will replace your current database with the selected backup. Your current data will be backed up automatically. Are you sure you want to continue?",
        handleRestore
      );
    },

    about: () => {
      setDialogContent({
        isOpen: true,
        title: `About ${schoolName}`,
        content: <AboutContent onClose={closeDialog} />,
      });
    },

    help: () => {
      setDialogContent({
        isOpen: true,
        title: "Help & User Guide",
        content: <HelpContent onClose={closeDialog} />,
      });
    },

    shortcuts: () => {
      setDialogContent({
        isOpen: true,
        title: "Keyboard Shortcuts",
        content: <ShortcutsContent onClose={closeDialog} />,
      });
    },

    contact: () => {
      window.open(
        makeGmailLink(
          `Support Request - ${schoolName}`,
          "Hello Support Team,\n\nI need assistance with...\n\nBest regards"
        ),
        "_blank"
      );
    },

    settings: () => {
      // Navigate to settings page or show settings dialog
      navigate({ to: "/settings" });
    },
  } as const;

  const showNewItemDialog = () => {
    setDialogContent({
      isOpen: true,
      title: "Create New Item",
      content: (
        <NewItemSelector
          onSelect={(type) => {
            closeDialog();
            toggleFormDialog(type as keyof FormDialogState, true);
          }}
          onClose={closeDialog}
        />
      ),
    });
  };

  // Main menu action handler
  const handleMenuAction = useCallback(
    (action: MenuAction) => {
      console.log(`Menu action: ${action}`);

      const handler = menuActionHandlers[action];
      if (handler) {
        handler();
      } else {
        console.warn(`No handler found for menu action: ${action}`);
      }
    },
    [menuActionHandlers]
  );

  // Effect to setup menu and event listeners
  useEffect(() => {
    // Initialize the menu
    createAppMenu().catch(console.error);

    // Setup Tauri event listeners
    const setupEventListeners = async () => {
      // Listen for refresh events from Tauri
      await listen("refresh_data", () => {
        console.log("Received refresh event from Tauri");
        // You can emit custom events to your components here
        window.dispatchEvent(new CustomEvent("data_refresh"));
      });
    };

    setupEventListeners().catch(console.error);

    // Event handlers
    const handleNavigateEvent = (event: CustomEvent<NavigationAction>) => {
      handleNavigation(event.detail);
    };

    const handleMenuActionEvent = (event: CustomEvent<MenuAction>) => {
      handleMenuAction(event.detail);
    };

    // Add event listeners
    window.addEventListener("navigate", handleNavigateEvent as EventListener);
    window.addEventListener(
      "menu_action",
      handleMenuActionEvent as EventListener
    );

    // Cleanup
    return () => {
      window.removeEventListener(
        "navigate",
        handleNavigateEvent as EventListener
      );
      window.removeEventListener(
        "menu_action",
        handleMenuActionEvent as EventListener
      );
    };
  }, [handleNavigation, handleMenuAction]);

  return (
    <>
      {/* General purpose dialog */}
      <Dialog open={dialogContent.isOpen} onOpenChange={closeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogContent.title}</DialogTitle>
          </DialogHeader>
          {dialogContent.content}
        </DialogContent>
      </Dialog>

      {/* Confirmation dialog */}
      <AlertDialog
        open={confirmDialog.isOpen}
        onOpenChange={(open) =>
          setConfirmDialog((prev) => ({ ...prev, isOpen: open }))
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmDialog.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDialog.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDialog.onConfirm}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Form Dialogs */}
      <Dialog
        open={formDialogs.book}
        onOpenChange={(open) => toggleFormDialog("book", open)}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Book</DialogTitle>
            <DialogDescription>
              Add a new book to the library collection
            </DialogDescription>
          </DialogHeader>
          <CreateBook />
        </DialogContent>
      </Dialog>

      <Dialog
        open={formDialogs.student}
        onOpenChange={(open) => toggleFormDialog("student", open)}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Register New Student</DialogTitle>
            <DialogDescription>
              Register a new student in the system
            </DialogDescription>
          </DialogHeader>
          <CreateStudent />
        </DialogContent>
      </Dialog>

      <Dialog
        open={formDialogs.lending}
        onOpenChange={(open) => toggleFormDialog("lending", open)}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Issue Book</DialogTitle>
            <DialogDescription>
              Create a new book lending record
            </DialogDescription>
          </DialogHeader>
          <CreateLending />
        </DialogContent>
      </Dialog>
    </>
  );
}

// Dialog Content Components remain the same...
const AboutContent = ({ onClose }: { onClose: () => void }) => (
  <div className="space-y-4">
    <div className="text-center">
      <h2 className="text-xl font-bold mb-2">
        {schoolName} Library Management System
      </h2>
      <p className="text-sm text-muted-foreground">Version 1.0.0</p>
    </div>

    <div className="space-y-2">
      <p>A modern, efficient library management system built with:</p>
      <ul className="text-sm space-y-1 ml-4">
        <li>• Tauri for cross-platform desktop performance</li>
        <li>• React for modern user interface</li>
        <li>• TypeScript for type safety</li>
      </ul>
    </div>

    <div className="flex justify-end pt-4">
      <Button onClick={onClose}>Close</Button>
    </div>
  </div>
);

const HelpContent = ({ onClose }: { onClose: () => void }) => (
  <div className="space-y-4 max-h-96 overflow-y-auto">
    <div className="space-y-4">
      <section>
        <h3 className="font-semibold mb-2">Quick Start Guide</h3>
        <ul className="list-disc pl-4 space-y-1 text-sm">
          <li>
            Use the <strong>Dashboard</strong> to view system overview and
            statistics
          </li>
          <li>
            Manage your book collection in the <strong>Books</strong> section
          </li>
          <li>
            Register and track students in the <strong>Students</strong> section
          </li>
          <li>
            Handle book lending and returns in the <strong>Lending</strong>{" "}
            section
          </li>
        </ul>
      </section>

      <section>
        <h3 className="font-semibold mb-2">Navigation</h3>
        <p className="text-sm">
          Use the View menu or keyboard shortcuts to quickly navigate between
          sections.
        </p>
      </section>

      <section>
        <h3 className="font-semibold mb-2">Data Management</h3>
        <p className="text-sm">
          Import/export data and create backups using the File and Tools menus.
        </p>
      </section>
    </div>

    <div className="flex justify-end pt-4">
      <Button onClick={onClose}>Close</Button>
    </div>
  </div>
);

const ShortcutsContent = ({ onClose }: { onClose: () => void }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-2 text-sm">
      <div className="font-medium">Ctrl+N</div>
      <div>New Item</div>
      <div className="font-medium">Ctrl+I</div>
      <div>Import Data</div>
      <div className="font-medium">Ctrl+E</div>
      <div>Export Data</div>
      <div className="font-medium">F5</div>
      <div>Refresh</div>
      <div className="font-medium">Ctrl+D</div>
      <div>Dashboard</div>
      <div className="font-medium">Ctrl+B</div>
      <div>Books</div>
      <div className="font-medium">Ctrl+Shift+S</div>
      <div>Students</div>
      <div className="font-medium">Ctrl+L</div>
      <div>Lending</div>
      <div className="font-medium">Ctrl+,</div>
      <div>Settings</div>
      <div className="font-medium">F1</div>
      <div>Help</div>
    </div>

    <div className="flex justify-end pt-4">
      <Button onClick={onClose}>Close</Button>
    </div>
  </div>
);

const NewItemSelector = ({
  onSelect,
  onClose,
}: {
  onSelect: (type: string) => void;
  onClose: () => void;
}) => (
  <div className="space-y-4">
    <p>What would you like to create?</p>
    <div className="flex flex-col space-y-2">
      <Button onClick={() => onSelect("book")} variant="outline">
        📚 New Book
      </Button>
      <Button onClick={() => onSelect("student")} variant="outline">
        👤 New Student
      </Button>
      <Button onClick={() => onSelect("lending")} variant="outline">
        📖 New Lending
      </Button>
    </div>

    <div className="flex justify-end pt-4">
      <Button onClick={onClose} variant="ghost">
        Cancel
      </Button>
    </div>
  </div>
);
