use sqlx::{Pool, Sqlite};
use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};

#[derive(Debug, Serialize, Deserialize)]
pub struct DashboardStats {
    total_students: i64,
    total_books: i64,
    available_books: i64,
    books_on_loan: i64,
    overdue_books: i64,
    utilization_rate: i64,
    popular_categories: Vec<CategoryStats>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CategoryStats {
    name: String,
    count: i64,
    percentage: i64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PopularBook {
    id: String,
    title: String,
    author: String,
    category: String,
    status: String,
    times_loaned: i64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct OverdueBook {
    id: String,
    book_title: String,
    author: String,
    student_name: String,
    grade: String,
    student_id: String,
    due_date: DateTime<Utc>,
    days_overdue: i64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct RecentActivity {
    id: String,
    student_name: String,
    book_title: String,
    author: String,
    activity_type: String,
    due_date: Option<DateTime<Utc>>,
    created_at: DateTime<Utc>,
}

pub async fn get_dashboard_stats(pool: &Pool<Sqlite>) -> Result<DashboardStats, sqlx::Error> {
    let total_students: i64 = sqlx::query_scalar!(
        "SELECT COUNT(*) FROM students"
    )
    .fetch_one(pool)
    .await?
    .into();

    let in_library_books: i64 = sqlx::query_scalar!(
        "SELECT SUM(quantity) FROM books"
    )
    .fetch_one(pool)
    .await?
    .unwrap_or(0)
    .into();

    let available_books: i64 = sqlx::query_scalar!(
        "SELECT SUM(quantity) FROM books WHERE status = 'available'"
    )
    .fetch_one(pool)
    .await?
    .unwrap_or(0)
    .into();

    let books_on_loan: i64 = sqlx::query_scalar!(
        "SELECT COUNT(*) FROM lent WHERE status = 'lent'"
    )
    .fetch_one(pool)
    .await?
    .into();
    let total_books = in_library_books + books_on_loan;
    let overdue_books: i64 = sqlx::query_scalar!(
        "SELECT COUNT(*) FROM lent WHERE status = 'lent' AND due_date < CURRENT_TIMESTAMP"
    )
    .fetch_one(pool)
    .await?
    .into();

    let category_stats = sqlx::query!(
        r#"
        SELECT b.category, COUNT(*) as count
        FROM lent l
        LEFT JOIN books b ON l.book_id = b.id
        GROUP BY b.category
        ORDER BY count DESC
        "#
    )
    .fetch_all(pool)
    .await?;

    let total_loans: i64 = category_stats.iter().map(|stat| stat.count as i64).sum();
    let popular_categories = category_stats
        .iter()
        .take(4)
        .map(|stat| CategoryStats {
            name: stat.category.clone().unwrap_or_default(),
            count: stat.count as i64,
            percentage: if total_loans > 0 {
                ((stat.count as i64) * 100) / total_loans
            } else {
                0
            },
        })
        .collect();

    Ok(DashboardStats {
        total_students,
        total_books,
        available_books,
        books_on_loan,
        overdue_books,
        utilization_rate: if total_books > 0 {
            (books_on_loan * 100) / total_books
        } else {
            0
        },
        popular_categories,
    })
}


pub async fn get_popular_books(pool: &Pool<Sqlite>) -> Result<Vec<PopularBook>, sqlx::Error> {
    sqlx::query_as!(
        PopularBook,
        r#"
        SELECT 
            COALESCE(b.id, '') as id,
            COALESCE(b.title, '') as title,
            COALESCE(b.author, '') as author,
            COALESCE(b.category, '') as category,
            COALESCE(b.status, '') as status,
            COUNT(l.id) as times_loaned
        FROM books b
        LEFT JOIN lent l ON b.id = l.book_id
        GROUP BY b.id
        ORDER BY times_loaned DESC
        LIMIT 5
        "#
    )
    .fetch_all(pool)
    .await
}

pub async fn get_overdue_books(pool: &Pool<Sqlite>) -> Result<Vec<OverdueBook>, sqlx::Error> {
    sqlx::query_as!(
        OverdueBook,
        r#"
        SELECT 
            COALESCE(l.id, '') as id,
            COALESCE(b.title, '') as book_title,
            COALESCE(b.author, '') as author,
            COALESCE(s.name, '') as student_name,
            COALESCE(s.grade, '') as grade,
            COALESCE(s.student_id, '') as student_id,
            l.due_date as "due_date!: chrono::DateTime<chrono::Utc>",
            CAST(JULIANDAY('now') - JULIANDAY(l.due_date) AS INTEGER) as "days_overdue!: i64"
        FROM lent l
        JOIN books b ON l.book_id = b.id
        JOIN students s ON l.student_id = s.id
        WHERE l.status = 'lent' AND l.due_date < CURRENT_TIMESTAMP
        ORDER BY l.due_date ASC
        "#
    )
    .fetch_all(pool)
    .await
}

pub async fn get_recent_activity(pool: &Pool<Sqlite>) -> Result<Vec<RecentActivity>, sqlx::Error> {
    sqlx::query_as!(
        RecentActivity,
        r#"
        SELECT 
            COALESCE(l.id, '') as id,
            COALESCE(s.name, '') as student_name,
            COALESCE(b.title, '') as book_title,
            COALESCE(b.author, '') as author,
            COALESCE(l.status, '') as activity_type,
            l.due_date as "due_date?: chrono::DateTime<chrono::Utc>",
            l.lent_at as "created_at!: chrono::DateTime<chrono::Utc>"
        FROM lent l
        JOIN books b ON l.book_id = b.id
        JOIN students s ON l.student_id = s.id
        WHERE l.lent_at >= datetime('now', '-1 day')
        ORDER BY l.lent_at DESC
        LIMIT 10
        "#
    )
    .fetch_all(pool)
    .await
}
