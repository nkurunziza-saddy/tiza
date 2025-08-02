import { invoke } from "@tauri-apps/api/core";
import type {
  DashboardStats,
  PopularBook,
  OverdueBook,
  RecentActivity,
} from "@/types/api";
import type {
  Book,
  Student,
  Lending,
  CreateLendingInput,
} from "@/types/models";

export const getDashboardStats = () =>
  invoke<DashboardStats>("get_dashboard_stats");
export const getPopularBooks = () => invoke<PopularBook[]>("get_popular_books");
export const getOverdueBooks = () => invoke<OverdueBook[]>("get_overdue_books");
export const getRecentActivity = () =>
  invoke<RecentActivity[]>("get_recent_activity");

// Book functions
export const getAllBooks = () => invoke<Book[]>("get_all_books");
export const getBookById = (id: string) =>
  invoke<Book>("get_book_by_id", { id });
export const createBook = (book: Omit<Book, "id" | "created_at">) =>
  invoke<void>("create_book", book);
export const updateBook = (book: Omit<Book, "created_at">) =>
  invoke<void>("update_book", { ...book });
export const deleteBook = (id: string) => invoke<void>("delete_book", { id });

// Student functions
export const getAllStudents = () => invoke<Student[]>("get_all_students");
export const getStudentById = (id: string) =>
  invoke<Student>("get_student_by_id", { id });
export const createStudent = (student: Omit<Student, "id" | "created_at">) => {
  return invoke<void>("create_student", {
    ...student,
    studentId: student.student_id,
  });
};
export const updateStudent = (student: Omit<Student, "created_at">) =>
  invoke<void>("update_student", { ...student });
export const deleteStudent = (id: string) =>
  invoke<void>("delete_student", { id });

// Lending functions
export const getAllLendings = () => invoke<Lending[]>("get_all_lendings");
export const getLendingById = (id: string) =>
  invoke<Lending>("get_lending_by_id", { id });
export const getLendingRecordsByBookId = (id: string) =>
  invoke<Lending[]>("get_lending_records_by_book_id", { id });
export const getLendingRecordsByStudentId = (id: string) =>
  invoke<Lending[]>("get_lending_records_by_student_id", { id });
export const createLending = (lending: CreateLendingInput) =>
  invoke<void>("create_lending", {
    ...lending,
    bookId: lending.book_id,
    studentId: lending.student_id,
    dueDate: lending.due_date,
  });
export const updateLending = (lending: Lending) =>
  invoke<void>("update_lending", { ...lending });
export const returnBook = (id: string) =>
  invoke<void>("return_lending", { id });
export const deleteLending = (id: string) =>
  invoke<void>("delete_lending", { id });
