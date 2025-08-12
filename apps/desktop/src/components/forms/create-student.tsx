import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { FormDialog } from "../form-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Student } from "@/types/models";
import { createStudent, updateStudent } from "@/utils/api";

export const studentSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Full name must be at least 2 characters long." })
    .max(100, { message: "Full name cannot exceed 100 characters." }),
  grade: z
    .string()
    .min(1, { message: "Grade is required." })
    .max(50, { message: "Grade value is too long." }),
  student_id: z
    .string()
    .min(1, { message: "Student ID is required." })
    .max(100, { message: "Student ID cannot exceed 100 characters." }),
  phone_number: z
    .string()
    .refine(
      (val) => {
        if (!val) return true; // allow optional
        const digits = val.replace(/\D/g, "");
        return (
          /^\d+$/.test(digits) && digits.length >= 10 && digits.length <= 15
        );
      },
      {
        message:
          "Phone number must contain only digits and be between 10 and 15 digits.",
      }
    )
    .optional(),
  status: z.enum(["Active", "Inactive"]).default("Active"),
  created_at: z.string().optional(),
});

export default function CreateStudent({ student }: { student?: Student }) {
  const queryClient = useQueryClient();
  const createMutation = useMutation({
    mutationFn: createStudent,
    onSuccess: () => {
      toast.success(`Student has been created`, {
        description: format(new Date(), "EEEE MM yyyy h:mm a"),
      });
      queryClient.invalidateQueries();
      form.reset();
    },
  });
  const updateMutation = useMutation({
    mutationFn: updateStudent,
    onSuccess: () => {
      toast.success(`Student has been updated`, {
        description: format(new Date(), "EEEE MM yyyy h:mm a"),
      });
      queryClient.invalidateQueries();
      form.reset();
    },
  });

  const form = useForm({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: student ? student.name : "",
      grade: student ? student.grade : "6",
      phone_number: student ? student.phone_number ?? "" : "",
      student_id: student ? student.student_id : "",
    },
  });

  function onSubmit(values: z.infer<typeof studentSchema>) {
    try {
      student
        ? updateMutation.mutate({
            ...values,
            id: student.id,
            phone_number: values.phone_number ?? null,
          })
        : createMutation.mutate({
            ...values,
            phone_number: values.phone_number ?? null,
          });
    } catch (error) {
      toast.error(`Failed to ${student ? "update" : "create"} student`, {
        description: "Please try again",
      });
      console.error(error);
    }
  }
  const { isSubmitting } = form.formState;
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., John Smith" {...field} />
                </FormControl>
                <FormDescription>
                  Enter student&rsquo;s complete name as it appears in official
                  documents
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="grade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Grade</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select student's grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6">Grade 6</SelectItem>
                      <SelectItem value="7">Grade 7</SelectItem>
                      <SelectItem value="8">Grade 8</SelectItem>
                      <SelectItem value="9">Grade 9</SelectItem>
                      <SelectItem value="10">Grade 10</SelectItem>
                      <SelectItem value="11">Grade 11</SelectItem>
                      <SelectItem value="12">Grade 12</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>
                  Current academic year of the student
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="student_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Student ID</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., ST2024001" {...field} />
                </FormControl>
                <FormDescription>
                  Unique identifier for the student. Use school&rsquo;s standard
                  format
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  Phone number
                </FormLabel>
                <FormControl>
                  <Input placeholder="078473822" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter>
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? `${student ? "Updating" : "Creating"} ...`
                : `${student ? "Update" : "Create"} student`}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </div>
  );
}

export const CreateStudentDialog = () => {
  return (
    <FormDialog
      title="Create Student"
      triggerText="Create new student"
      description="Create a new student record"
    >
      <CreateStudent />
    </FormDialog>
  );
};
