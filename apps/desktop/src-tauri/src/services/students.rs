use crate::models::{Student, StudentStatus};
use chrono::Utc;
use sqlx::{Pool, Sqlite};
use uuid::Uuid;

pub async fn get_all_students(pool: &Pool<Sqlite>) -> Result<Vec<Student>, sqlx::Error> {
    sqlx::query_as!(
        Student,
        r#"
        SELECT 
            COALESCE(id, '') as id,
            COALESCE(name, '') as name,
            COALESCE(grade, '') as grade,
            phone_number as "phone_number?: String",
            COALESCE(student_id, '') as student_id,
            status as "status!: StudentStatus",
            created_at as "created_at!: chrono::DateTime<chrono::Utc>"
        FROM students 
        ORDER BY created_at DESC
        "#
    )
    .fetch_all(pool)
    .await
}

pub async fn get_student_by_id(
    pool: &Pool<Sqlite>,
    id: &str,
) -> Result<Option<Student>, sqlx::Error> {
    sqlx::query_as!(
        Student,
        r#"
        SELECT 
            COALESCE(id, '') as id,
            COALESCE(name, '') as name,
            COALESCE(grade, '') as grade,
            phone_number as "phone_number?: String",
            COALESCE(student_id, '') as student_id,
            status as "status!: StudentStatus",
            created_at as "created_at!: chrono::DateTime<chrono::Utc>"
        FROM students 
        WHERE id = ?
        "#,
        id
    )
    .fetch_optional(pool)
    .await
}

pub async fn create_student(
    pool: &Pool<Sqlite>,
    name: &str,
    grade: &str,
    phone_number: Option<&str>,
    student_id: &str,
) -> Result<(), sqlx::Error> {
    let id = Uuid::new_v4().to_string();
    let created_at = Utc::now();
    sqlx::query!(
        r#"
        INSERT INTO students (id, name, grade, phone_number, student_id, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        "#,
        id,
        name,
        grade,
        phone_number,
        student_id,
        "active",
        created_at
    )
    .execute(pool)
    .await?;

    Ok(())
}

pub async fn update_student(
    pool: &Pool<Sqlite>,
    id: &str,
    name: &str,
    grade: &str,
    phone_number: Option<&str>,
    student_id: &str,
    status: StudentStatus,
) -> Result<(), sqlx::Error> {
    let status_str = status.to_string();

    sqlx::query!(
        r#"
        UPDATE students
        SET name = ?, grade = ?, phone_number = ?, student_id = ?, status = ?
        WHERE id = ?
        "#,
        name,
        grade,
        phone_number,
        student_id,
        status_str,
        id
    )
    .execute(pool)
    .await?;

    Ok(())
}

pub async fn delete_student(pool: &Pool<Sqlite>, id: &str) -> Result<(), sqlx::Error> {
    sqlx::query!(r#"DELETE FROM students WHERE id = ?"#, id)
        .execute(pool)
        .await?;

    Ok(())
}
