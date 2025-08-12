use chrono::{DateTime, Utc};
use crate::models;
use crate::services;

#[tauri::command]
pub fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
pub fn my_custom_command() -> String {
    "Hello from Rust!".into()
}

#[tauri::command]
pub fn test_command() -> String {
    println!("test_command was called from frontend!");
    "Test successful from Rust!".to_string()
}

#[tauri::command]
pub async fn get_all_books(
    state: tauri::State<'_, sqlx::Pool<sqlx::Sqlite>>,
) -> Result<Vec<models::Book>, String> {
    services::books::get_all_books(&state)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_book_by_id(
    state: tauri::State<'_, sqlx::Pool<sqlx::Sqlite>>,
    id: String,
) -> Result<Option<models::Book>, String> {
    services::books::get_book_by_id(&state, &id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn create_book(
    state: tauri::State<'_, sqlx::Pool<sqlx::Sqlite>>,
    title: String,
    author: String,
    quantity: i32,
    isbn: String,
    category: String,
) -> Result<(), String> {
    services::books::create_book(&state, &title, &author, quantity, &isbn, &category)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn update_book(
    state: tauri::State<'_, sqlx::Pool<sqlx::Sqlite>>,
    id: String,
    title: String,
    author: String,
    quantity: i32,
    isbn: String,
    category: String,
    status: models::BookStatus,
) -> Result<(), String> {
    services::books::update_book(
        &state, &id, &title, &author, quantity, &isbn, &category, status,
    )
    .await
    .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn delete_book(
    state: tauri::State<'_, sqlx::Pool<sqlx::Sqlite>>,
    id: String,
) -> Result<(), String> {
    services::books::delete_book(&state, &id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_all_students(
    state: tauri::State<'_, sqlx::Pool<sqlx::Sqlite>>,
) -> Result<Vec<models::Student>, String> {
    services::students::get_all_students(&state)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_student_by_id(
    state: tauri::State<'_, sqlx::Pool<sqlx::Sqlite>>,
    id: String,
) -> Result<Option<models::Student>, String> {
    services::students::get_student_by_id(&state, &id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn create_student(
    state: tauri::State<'_, sqlx::Pool<sqlx::Sqlite>>,
    name: String,
    grade: String,
    phone_number: Option<String>,
    student_id: String,
) -> Result<(), String> {
    println!("Creating student with Student ID: {}", student_id);
    services::students::create_student(&state, &name, &grade, phone_number.as_deref(), &student_id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn update_student(
    state: tauri::State<'_, sqlx::Pool<sqlx::Sqlite>>,
    id: String,
    name: String,
    grade: String,
    phone_number: Option<String>,
    student_id: String,
    status: models::StudentStatus,
) -> Result<(), String> {
    services::students::update_student(
        &state,
        &id,
        &name,
        &grade,
        phone_number.as_deref(),
        &student_id,
        status,
    )
    .await
    .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn delete_student(
    state: tauri::State<'_, sqlx::Pool<sqlx::Sqlite>>,
    id: String,
) -> Result<(), String> {
    services::students::delete_student(&state, &id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_all_lendings(
    state: tauri::State<'_, sqlx::Pool<sqlx::Sqlite>>,
) -> Result<Vec<models::LendingWithDetails>, String> {
    services::lendings::get_all_lendings(&state)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_lending_by_id(
    state: tauri::State<'_, sqlx::Pool<sqlx::Sqlite>>,
    id: String,
) -> Result<Option<models::LendingWithDetails>, String> {
    services::lendings::get_lending_by_id(&state, &id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_lending_records_by_book_id(
    state: tauri::State<'_, sqlx::Pool<sqlx::Sqlite>>,
    id: String,
) -> Result<Vec<models::LendingWithDetails>, String> {
    services::lendings::get_lending_records_by_book_id(&state, &id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_lending_records_by_student_id(
    state: tauri::State<'_, sqlx::Pool<sqlx::Sqlite>>,
    id: String,
) -> Result<Vec<models::LendingWithDetails>, String> {
    services::lendings::get_lending_records_by_student_id(&state, &id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn create_lending(
    state: tauri::State<'_, sqlx::Pool<sqlx::Sqlite>>,
    book_id: String,
    student_id: String,
    due_date: String,
) -> Result<(), String> {
    let due_date = chrono::DateTime::parse_from_rfc3339(&due_date)
        .map_err(|e| e.to_string())?
        .with_timezone(&chrono::Utc);
    services::lendings::create_lending(&state, &book_id, &student_id, due_date)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn update_lending(
    state: tauri::State<'_, sqlx::Pool<sqlx::Sqlite>>,
    id: String,
    book_id: String,
    student_id: String,
    due_date: String,
    returned_at: DateTime<Utc>,
) -> Result<(), String> {
    let due_date = chrono::DateTime::parse_from_rfc3339(&due_date)
        .map_err(|e| e.to_string())?
        .with_timezone(&chrono::Utc);
    services::lendings::update_lending(&state, &id, &book_id, &student_id, due_date, returned_at)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn return_lending(
    state: tauri::State<'_, sqlx::Pool<sqlx::Sqlite>>,
    id: String,
) -> Result<(), String> {
    services::lendings::return_lending(&state, &id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn delete_lending(
    state: tauri::State<'_, sqlx::Pool<sqlx::Sqlite>>,
    id: String,
) -> Result<(), String> {
    services::lendings::delete_lending(&state, &id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_dashboard_stats(
    state: tauri::State<'_, sqlx::Pool<sqlx::Sqlite>>,
) -> Result<services::statistics::DashboardStats, String> {
    services::statistics::get_dashboard_stats(&state)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_popular_books(
    state: tauri::State<'_, sqlx::Pool<sqlx::Sqlite>>,
) -> Result<Vec<services::statistics::PopularBook>, String> {
    services::statistics::get_popular_books(&state)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_overdue_books(
    state: tauri::State<'_, sqlx::Pool<sqlx::Sqlite>>,
) -> Result<Vec<services::statistics::OverdueBook>, String> {
    services::statistics::get_overdue_books(&state)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_recent_activity(
    state: tauri::State<'_, sqlx::Pool<sqlx::Sqlite>>,
) -> Result<Vec<services::statistics::RecentActivity>, String> {
    services::statistics::get_recent_activity(&state)
        .await
        .map_err(|e| e.to_string())
}