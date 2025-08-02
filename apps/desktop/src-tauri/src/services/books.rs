use sqlx::{Pool, Sqlite};
use crate::models::{Book, BookStatus};
use uuid::Uuid;
use chrono::Utc;

pub async fn get_all_books(pool: &Pool<Sqlite>) -> Result<Vec<Book>, sqlx::Error> {
    sqlx::query_as!(
        Book,
        r#"
        SELECT 
            COALESCE(id, '') as id,
            COALESCE(title, '') as title,
            COALESCE(author, '') as author,
            CAST(quantity AS INTEGER) as "quantity!: i32",
            COALESCE(isbn, '') as isbn,
            COALESCE(category, '') as category,
            status as "status!: BookStatus",
            created_at as "created_at!: chrono::DateTime<chrono::Utc>"
        FROM books 
        ORDER BY created_at DESC
        "#
    )
    .fetch_all(pool)
    .await
}

pub async fn get_book_by_id(pool: &Pool<Sqlite>, id: &str) -> Result<Option<Book>, sqlx::Error> {
    sqlx::query_as!(
        Book,
        r#"
        SELECT 
            COALESCE(id, '') as id,
            COALESCE(title, '') as title,
            COALESCE(author, '') as author,
            CAST(quantity AS INTEGER) as "quantity!: i32",
            COALESCE(isbn, '') as isbn,
            COALESCE(category, '') as category,
            status as "status!: BookStatus",
            created_at as "created_at!: chrono::DateTime<chrono::Utc>"
        FROM books 
        WHERE id = ?
        "#,
        id
    )
    .fetch_optional(pool)
    .await
}

pub async fn create_book(
    pool: &Pool<Sqlite>,
    title: &str,
    author: &str,
    quantity: i32,
    isbn: &str,
    category: &str,
) -> Result<(), sqlx::Error> {
    let id = Uuid::new_v4().to_string();
    let created_at = Utc::now();
    
    sqlx::query!(
        r#"
        INSERT INTO books (id, title, author, quantity, isbn, category, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        "#,
        id,
        title,
        author,
        quantity,
        isbn,
        category,
        "available",
        created_at
    )
    .execute(pool)
    .await?;
    
    Ok(())
}

pub async fn update_book(
    pool: &Pool<Sqlite>,
    id: &str,
    title: &str,
    author: &str,
    quantity: i32,
    isbn: &str,
    category: &str,
    status: BookStatus,
) -> Result<(), sqlx::Error> {
    let status_str = status.to_string();
    
    sqlx::query!(
        r#"
        UPDATE books 
        SET title = ?, author = ?, quantity = ?, isbn = ?, category = ?, status = ?
        WHERE id = ?
        "#,
        title,
        author,
        quantity,
        isbn,
        category,
        status_str,
        id
    )
    .execute(pool)
    .await?;
    
    Ok(())
}

pub async fn delete_book(pool: &Pool<Sqlite>, id: &str) -> Result<(), sqlx::Error> {
    sqlx::query!(
        r#"DELETE FROM books WHERE id = ?"#,
        id
    )
    .execute(pool)
    .await?;
    
    Ok(())
}