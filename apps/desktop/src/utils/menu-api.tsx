// src/utils/menu-api.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
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
import CreateStudent from "@/components/forms/create-student";
import CreateBook from "@/components/forms/create-book";
import CreateLending from "@/components/forms/create-lending";
import { createAppMenu } from "./menu-config";

export function useMenuHandler() {
  const navigate = useNavigate();
  const [dialogContent, setDialogContent] = useState<{
    isOpen: boolean;
    title: string;
    content: React.ReactNode;
  }>({
    isOpen: false,
    title: "",
    content: null,
  });

  const [showNewBookDialog, setShowNewBookDialog] = useState(false);
  const [showNewStudentDialog, setShowNewStudentDialog] = useState(false);
  const [showNewLendingDialog, setShowNewLendingDialog] = useState(false);

  useEffect(() => {
    // Initialize the menu
    createAppMenu().catch(console.error);

    // Handle navigation events
    const handleNavigate = (event: CustomEvent) => {
      const destination = event.detail;
      console.log(`Navigate to: ${destination}`);

      switch (destination) {
        case "dashboard":
          navigate({ to: "/" });
          break;
        case "books":
          navigate({ to: "/books" });
          break;
        case "students":
          navigate({ to: "/students" });
          break;
        case "lendings":
          navigate({ to: "/lending-returns" });
          break;
      }
    };

    // Handle menu actions
    const handleMenuAction = (event: CustomEvent) => {
      const action = event.detail;
      console.log(`Menu action: ${action}`);

      switch (action) {
        case "new":
          handleNewItem();
          break;
        case "about":
          handleAboutDialog();
          break;
        case "help":
          handleHelpDialog();
          break;
        case "shortcuts":
          handleShortcutsDialog();
          break;
        case "contact":
          handleContact();
          break;
        case "refresh":
          window.location.reload();
          break;
      }
    };

    window.addEventListener("navigate", handleNavigate as EventListener);
    window.addEventListener("menu_action", handleMenuAction as EventListener);

    return () => {
      window.removeEventListener("navigate", handleNavigate as EventListener);
      window.removeEventListener(
        "menu_action",
        handleMenuAction as EventListener
      );
    };
  }, [navigate]);

  // Menu action handlers...
  const handleNewItem = () => {
    const currentPath = window.location.pathname;
    switch (currentPath) {
      case "/books":
        setShowNewBookDialog(true);
        break;
      case "/students":
        setShowNewStudentDialog(true);
        break;
      case "/lending-returns":
        setShowNewLendingDialog(true);
        break;
    }
  };

  const handleAboutDialog = () => {
    setDialogContent({
      isOpen: true,
      title: `About ${schoolName}`,
      content: (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">
            {schoolName} Library Management System
          </h2>
          <p>Version 1.0.0</p>
          <p>A modern library management system built with Tauri and React.</p>
          <div className="flex justify-end">
            <Button
              onClick={() =>
                setDialogContent((prev) => ({ ...prev, isOpen: false }))
              }
            >
              Close
            </Button>
          </div>
        </div>
      ),
    });
  };

  const handleHelpDialog = () => {
    setDialogContent({
      isOpen: true,
      title: "Help",
      content: (
        <div className="space-y-4">
          <h3 className="font-semibold">Quick Start Guide</h3>
          <ul className="list-disc pl-4 space-y-2">
            <li>Manage books in the Books section</li>
            <li>Add and track students in the Students section</li>
            <li>Handle book lending and returns in the Lending section</li>
            <li>View statistics and reports in the Dashboard</li>
          </ul>
          <div className="flex justify-end">
            <Button
              onClick={() =>
                setDialogContent((prev) => ({ ...prev, isOpen: false }))
              }
            >
              Close
            </Button>
          </div>
        </div>
      ),
    });
  };

  const handleShortcutsDialog = () => {
    setDialogContent({
      isOpen: true,
      title: "Keyboard Shortcuts",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>Ctrl + D</div>
            <div>Dashboard</div>
            <div>Ctrl + B</div>
            <div>Books</div>
            <div>Ctrl + S</div>
            <div>Students</div>
            <div>Ctrl + L</div>
            <div>Lending</div>
            <div>F5</div>
            <div>Refresh</div>
            <div>Ctrl + ,</div>
            <div>Settings</div>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={() =>
                setDialogContent((prev) => ({ ...prev, isOpen: false }))
              }
            >
              Close
            </Button>
          </div>
        </div>
      ),
    });
  };

  const handleContact = () => {
    // Open email client with pre-filled subject
    window.location.href = makeGmailLink(
      `Contact about ${schoolName}`,
      "Hello, I would like to inquire about..."
    );
  };

  return (
    <>
      {/* Regular dialogs for About, Help, etc. */}
      <Dialog
        open={dialogContent.isOpen}
        onOpenChange={(open) =>
          setDialogContent((prev) => ({ ...prev, isOpen: open }))
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogContent.title}</DialogTitle>
          </DialogHeader>
          {dialogContent.content}
        </DialogContent>
      </Dialog>

      {/* Form Dialogs */}
      <Dialog open={showNewBookDialog} onOpenChange={setShowNewBookDialog}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Book</DialogTitle>
            <DialogDescription>Add new book to library</DialogDescription>
          </DialogHeader>
          <CreateBook />
        </DialogContent>
      </Dialog>

      <Dialog
        open={showNewStudentDialog}
        onOpenChange={setShowNewStudentDialog}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Student</DialogTitle>
            <DialogDescription>Register new student</DialogDescription>
          </DialogHeader>
          <CreateStudent />
        </DialogContent>
      </Dialog>

      <Dialog
        open={showNewLendingDialog}
        onOpenChange={setShowNewLendingDialog}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Issue Book</DialogTitle>
            <DialogDescription>Create new loan</DialogDescription>
          </DialogHeader>
          <CreateLending />
        </DialogContent>
      </Dialog>
    </>
  );
}
