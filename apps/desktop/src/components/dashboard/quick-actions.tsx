import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CreateStudent from "@/components/forms/create-student";
import CreateBook from "@/components/forms/create-book";
import CreateLending from "@/components/forms/create-lending";
import ReturnBook from "@/components/forms/return-book";
import { FormDialog } from "../form-dialog";
import { BookOpen, BookPlus, Undo2, UserPlus } from "lucide-react";

export function QuickActions() {
  const actions = [
    {
      title: "Add Student",
      description: "Register new student",
      component: CreateStudent,
      icon: UserPlus,
    },
    {
      title: "Add Book",
      description: "Add new book to library",
      component: CreateBook,
      icon: BookPlus,
    },
    {
      title: "Issue Book",
      description: "Create new loan",
      component: CreateLending,
      icon: BookOpen,
    },
    {
      title: "Return Book",
      description: "Process book return",
      component: ReturnBook,
      icon: Undo2,
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common library operations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => (
            <FormDialog
              key={action.title}
              title={action.title}
              Icon={action.icon}
              description={action.description}
              triggerText={action.title}
            >
              <action.component />
            </FormDialog>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
