use tauri::Manager;
use chrono::{DateTime, Utc};
mod models;
mod services;
mod db;
mod menu;
use menu::{create_menu, handle_menu_event};

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn my_custom_command() -> String {
    "Hello from Rust!".into()
}

#[tauri::command]
fn test_command() -> String {
    println!("test_command was called from frontend!");
    "Test successful from Rust!".to_string()
}

#[tauri::command]
async fn get_all_books(state: tauri::State<'_, sqlx::Pool<sqlx::Sqlite>>) -> Result<Vec<models::Book>, String> {
    services::books::get_all_books(&state).await.map_err(|e| e.to_string())
}

#[tauri::command]
async fn get_book_by_id(state: tauri::State<'_, sqlx::Pool<sqlx::Sqlite>>, id: String) -> Result<Option<models::Book>, String> {
    services::books::get_book_by_id(&state, &id).await.map_err(|e| e.to_string())
}

#[tauri::command]
async fn create_book(
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
async fn update_book(
    state: tauri::State<'_, sqlx::Pool<sqlx::Sqlite>>,
    id: String,
    title: String,
    author: String,
    quantity: i32,
    isbn: String,
    category: String,
    status: models::BookStatus,
) -> Result<(), String> {
    services::books::update_book(&state, &id, &title, &author, quantity, &isbn, &category, status)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
async fn delete_book(state: tauri::State<'_, sqlx::Pool<sqlx::Sqlite>>, id: String) -> Result<(), String> {
    services::books::delete_book(&state, &id).await.map_err(|e| e.to_string())
}

#[tauri::command]
async fn get_all_students(state: tauri::State<'_, sqlx::Pool<sqlx::Sqlite>>) -> Result<Vec<models::Student>, String> {
    services::students::get_all_students(&state).await.map_err(|e| e.to_string())
}

#[tauri::command]
async fn get_student_by_id(state: tauri::State<'_, sqlx::Pool<sqlx::Sqlite>>, id: String) -> Result<Option<models::Student>, String> {
    services::students::get_student_by_id(&state, &id).await.map_err(|e| e.to_string())
}

#[tauri::command]
async fn create_student(
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
async fn update_student(
    state: tauri::State<'_, sqlx::Pool<sqlx::Sqlite>>,
    id: String,
    name: String,
    grade: String,
    phone_number: Option<String>,
    student_id: String,
    status: models::StudentStatus,
) -> Result<(), String> {
    services::students::update_student(&state, &id, &name, &grade, phone_number.as_deref(), &student_id, status)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
async fn delete_student(state: tauri::State<'_, sqlx::Pool<sqlx::Sqlite>>, id: String) -> Result<(), String> {
    services::students::delete_student(&state, &id).await.map_err(|e| e.to_string())
}

#[tauri::command]
async fn get_all_lendings(state: tauri::State<'_, sqlx::Pool<sqlx::Sqlite>>) -> Result<Vec<models::LendingWithDetails>, String> {
    services::lendings::get_all_lendings(&state).await.map_err(|e| e.to_string())
}

#[tauri::command]
async fn get_lending_by_id(state: tauri::State<'_, sqlx::Pool<sqlx::Sqlite>>, id: String) -> Result<Option<models::LendingWithDetails>, String> {
    services::lendings::get_lending_by_id(&state, &id).await.map_err(|e| e.to_string())
}

#[tauri::command]
async fn get_lending_records_by_book_id(state: tauri::State<'_, sqlx::Pool<sqlx::Sqlite>>, id: String) -> Result<Vec<models::LendingWithDetails>, String> {
    services::lendings::get_lending_records_by_book_id(&state, &id).await.map_err(|e| e.to_string())
}

#[tauri::command]
async fn get_lending_records_by_student_id(state: tauri::State<'_, sqlx::Pool<sqlx::Sqlite>>, id: String) -> Result<Vec<models::LendingWithDetails>, String> {
    services::lendings::get_lending_records_by_student_id(&state, &id).await.map_err(|e| e.to_string())
}

#[tauri::command]
async fn create_lending(
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
async fn update_lending(
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
    services::lendings::update_lending(&state,&id, &book_id, &student_id, due_date, returned_at)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
async fn return_lending(state: tauri::State<'_, sqlx::Pool<sqlx::Sqlite>>, id: String) -> Result<(), String> {
    services::lendings::return_lending(&state, &id).await.map_err(|e| e.to_string())
}

#[tauri::command]
async fn delete_lending(state: tauri::State<'_, sqlx::Pool<sqlx::Sqlite>>, id: String) -> Result<(), String> {
    services::lendings::delete_lending(&state, &id).await.map_err(|e| e.to_string())
}

#[tauri::command]
async fn get_dashboard_stats(state: tauri::State<'_, sqlx::Pool<sqlx::Sqlite>>) -> Result<services::statistics::DashboardStats, String> {
    services::statistics::get_dashboard_stats(&state).await.map_err(|e| e.to_string())
}

#[tauri::command]
async fn get_popular_books(state: tauri::State<'_, sqlx::Pool<sqlx::Sqlite>>) -> Result<Vec<services::statistics::PopularBook>, String> {
    services::statistics::get_popular_books(&state).await.map_err(|e| e.to_string())
}

#[tauri::command]
async fn get_overdue_books(state: tauri::State<'_, sqlx::Pool<sqlx::Sqlite>>) -> Result<Vec<services::statistics::OverdueBook>, String> {
    services::statistics::get_overdue_books(&state).await.map_err(|e| e.to_string())
}

#[tauri::command]
async fn get_recent_activity(state: tauri::State<'_, sqlx::Pool<sqlx::Sqlite>>) -> Result<Vec<services::statistics::RecentActivity>, String> {
    services::statistics::get_recent_activity(&state).await.map_err(|e| e.to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let app_handle = app.handle().clone();
            let runtime = tokio::runtime::Runtime::new().expect("Failed to create Tokio runtime");
            let db_pool = runtime.block_on(db::init_db(&app_handle))
                .expect("Failed to initialize database");
            
            app.manage(db_pool);
            println!("Database initialized successfully");
            
           

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            greet,
            my_custom_command,
            test_command,
            get_all_books,
            get_book_by_id,
            create_book,
            update_book,
            delete_book,
            get_all_students,
            get_student_by_id,
            create_student,
            update_student,
            delete_student,
            get_all_lendings,
            get_lending_by_id,
            get_lending_records_by_book_id,
            get_lending_records_by_student_id,
            create_lending,
            update_lending,
            return_lending,
            delete_lending,
            get_dashboard_stats,
            get_popular_books,
            get_overdue_books,
            get_recent_activity
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}