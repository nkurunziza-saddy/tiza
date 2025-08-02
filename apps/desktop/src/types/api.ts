export interface DashboardStats {
  total_students: number;
  total_books: number;
  available_books: number;
  books_on_loan: number;
  overdue_books: number;
  utilization_rate: number;
  popular_categories: CategoryStats[];
}

export interface CategoryStats {
  name: string;
  count: number;
  percentage: number;
}

export interface PopularBook {
  id: string;
  title: string;
  author: string;
  category: string;
  status: string;
  times_loaned: number;
}

export interface OverdueBook {
  id: string;
  book_title: string;
  author: string;
  student_name: string;
  grade: string;
  student_id: string;
  due_date: string;
  days_overdue: number;
}

export interface RecentActivity {
  id: string;
  student_name: string;
  student_id: string;
  book_title: string;
  author: string;
  category: string;
  activity_type: "borrowed" | "returned";
  due_date?: string;
  created_at: string;
}
