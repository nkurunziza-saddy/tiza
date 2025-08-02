export interface Book {
  id: string;
  title: string;
  author: string;
  quantity: number;
  isbn: string;
  category: string;
  status: "available" | "unavailable";
  created_at: string;
}

export type BookTableRow = Book;

export interface Student {
  id: string;
  name: string;
  grade: string;
  phone_number: string | null;
  student_id: string;
  status: "active" | "inactive";
  created_at: string;
}

export interface Lending {
  id: string;
  book_id: string;
  student_id: string;
  lent_at: string;
  due_date: string;
  returned_at: string | null;
  status: "lent" | "returned";
  book_title: string;
  book_author: string;
  student_name: string;
  student_number: string;
}
export interface CreateLendingInput {
  book_id: string;
  student_id: string;
  lent_at: string;
  due_date: string;
}
