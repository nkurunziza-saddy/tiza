use crate::models::{LendingStatus, LendingWithDetails};
use chrono::{DateTime, Utc};
use sqlx::{Pool, Sqlite};
use uuid::Uuid;

pub async fn get_all_lendings(pool: &Pool<Sqlite>) -> Result<Vec<LendingWithDetails>, sqlx::Error> {
    sqlx::query_as!(
        LendingWithDetails,
        r#"
        SELECT 
            COALESCE(l.id, '') as id,
            COALESCE(l.book_id, '') as book_id,
            COALESCE(l.student_id, '') as student_id,
            l.lent_at as "lent_at!: chrono::DateTime<chrono::Utc>",
            l.returned_at as "returned_at?: chrono::DateTime<chrono::Utc>",
            l.status as "status!: LendingStatus",
            l.due_date as "due_date!: chrono::DateTime<chrono::Utc>",
            COALESCE(b.title, '') as book_title,
            COALESCE(b.author, '') as book_author,
            COALESCE(s.name, '') as student_name,
            COALESCE(s.student_id, '') as student_number
        FROM lent l
        LEFT JOIN books b ON l.book_id = b.id
        LEFT JOIN students s ON l.student_id = s.id
        ORDER BY l.lent_at DESC
        "#
    )
    .fetch_all(pool)
    .await
}

pub async fn get_lending_by_id(
    pool: &Pool<Sqlite>,
    id: &str,
) -> Result<Option<LendingWithDetails>, sqlx::Error> {
    sqlx::query_as!(
        LendingWithDetails,
        r#"
        SELECT 
            COALESCE(l.id, '') as id,
            COALESCE(l.book_id, '') as book_id,
            COALESCE(l.student_id, '') as student_id,
            l.lent_at as "lent_at!: chrono::DateTime<chrono::Utc>",
            l.returned_at as "returned_at?: chrono::DateTime<chrono::Utc>",
            l.status as "status!: LendingStatus",
            l.due_date as "due_date!: chrono::DateTime<chrono::Utc>",
            COALESCE(b.title, '') as book_title,
            COALESCE(b.author, '') as book_author,
            COALESCE(s.name, '') as student_name,
            COALESCE(s.student_id, '') as student_number
        FROM lent l
        LEFT JOIN books b ON l.book_id = b.id
        LEFT JOIN students s ON l.student_id = s.id
        WHERE l.id = ?
        "#,
        id
    )
    .fetch_optional(pool)
    .await
}

pub async fn get_lending_records_by_book_id(
    pool: &Pool<Sqlite>,
    id: &str,
) -> Result<Vec<LendingWithDetails>, sqlx::Error> {
    sqlx::query_as!(
        LendingWithDetails,
        r#"
        SELECT 
            COALESCE(l.id, '') as id,
            COALESCE(l.book_id, '') as book_id,
            COALESCE(l.student_id, '') as student_id,
            l.lent_at as "lent_at!: chrono::DateTime<chrono::Utc>",
            l.returned_at as "returned_at?: chrono::DateTime<chrono::Utc>",
            l.status as "status!: LendingStatus",
            l.due_date as "due_date!: chrono::DateTime<chrono::Utc>",
            COALESCE(b.title, '') as book_title,
            COALESCE(b.author, '') as book_author,
            COALESCE(s.name, '') as student_name,
            COALESCE(s.student_id, '') as student_number
        FROM lent l
        LEFT JOIN books b ON l.book_id = b.id
        LEFT JOIN students s ON l.student_id = s.id
        WHERE l.book_id = ?
        ORDER BY l.lent_at DESC
        "#,
        id
    )
    .fetch_all(pool)
    .await
}

pub async fn get_lending_records_by_student_id(
    pool: &Pool<Sqlite>,
    id: &str,
) -> Result<Vec<LendingWithDetails>, sqlx::Error> {
    sqlx::query_as!(
        LendingWithDetails,
        r#"
        SELECT 
            COALESCE(l.id, '') as id,
            COALESCE(l.book_id, '') as book_id,
            COALESCE(l.student_id, '') as student_id,
            l.lent_at as "lent_at!: chrono::DateTime<chrono::Utc>",
            l.returned_at as "returned_at?: chrono::DateTime<chrono::Utc>",
            l.status as "status!: LendingStatus",
            l.due_date as "due_date!: chrono::DateTime<chrono::Utc>",
            COALESCE(b.title, '') as book_title,
            COALESCE(b.author, '') as book_author,
            COALESCE(s.name, '') as student_name,
            COALESCE(s.student_id, '') as student_number
        FROM lent l
        LEFT JOIN books b ON l.book_id = b.id
        LEFT JOIN students s ON l.student_id = s.id
        WHERE l.student_id = ?
        ORDER BY l.lent_at DESC
        "#,
        id
    )
    .fetch_all(pool)
    .await
}

pub async fn create_lending(
    pool: &Pool<Sqlite>,
    book_id: &str,
    student_id: &str,
    due_date: DateTime<Utc>,
) -> Result<(), sqlx::Error> {
    let existing = sqlx::query_scalar!(
        r#"
        SELECT COUNT(*) as count
        FROM lent
        WHERE student_id = ? AND status = 'lent'
        "#,
        student_id
    )
    .fetch_one(pool)
    .await?;

    if existing > 0 {
        return Err(sqlx::Error::RowNotFound);
    }

    let id = Uuid::new_v4().to_string();
    let lent_at = Utc::now();

    let mut tx = pool.begin().await?;

    sqlx::query!(
        r#"
        INSERT INTO lent (id, book_id, student_id, lent_at, due_date, status)
        VALUES (?, ?, ?, ?, ?, ?)
        "#,
        id,
        book_id,
        student_id,
        lent_at,
        due_date,
        "lent"
    )
    .execute(&mut *tx)
    .await?;

    sqlx::query!(
        r#"
        UPDATE books
        SET quantity = quantity - 1,
            status = CASE WHEN quantity - 1 <= 0 THEN 'unavailable' ELSE 'available' END
        WHERE id = ?
        "#,
        book_id
    )
    .execute(&mut *tx)
    .await?;

    tx.commit().await?;

    Ok(())
}

pub async fn update_lending(
    pool: &Pool<Sqlite>,
    id: &str,
    book_id: &str,
    student_id: &str,
    due_date: DateTime<Utc>,
    returned_at: DateTime<Utc>,
) -> Result<(), sqlx::Error> {
    sqlx::query!(
        r#"
        UPDATE lent
        SET book_id = ?, student_id = ?, due_date = ?, returned_at = ?
        WHERE id = ?
        "#,
        book_id,
        student_id,
        due_date,
        returned_at,
        id
    )
    .execute(pool)
    .await?;

    Ok(())
}

pub async fn return_lending(pool: &Pool<Sqlite>, id: &str) -> Result<(), sqlx::Error> {
    let returned_at = Utc::now();

    let mut tx = pool.begin().await?;

    let lending = sqlx::query!(r#"SELECT book_id FROM lent WHERE id = ?"#, id)
        .fetch_one(&mut *tx)
        .await?;

    sqlx::query!(
        r#"
        UPDATE lent
        SET status = ?, returned_at = ?
        WHERE id = ?
        "#,
        "returned",
        returned_at,
        id
    )
    .execute(&mut *tx)
    .await?;

    sqlx::query!(
        r#"
        UPDATE books
        SET quantity = quantity + 1,
            status = 'available'
        WHERE id = ?
        "#,
        lending.book_id
    )
    .execute(&mut *tx)
    .await?;

    tx.commit().await?;

    Ok(())
}

pub async fn delete_lending(pool: &Pool<Sqlite>, id: &str) -> Result<(), sqlx::Error> {
    sqlx::query!(r#"DELETE FROM lent WHERE id = ?"#, id)
        .execute(pool)
        .await?;

    Ok(())
}
