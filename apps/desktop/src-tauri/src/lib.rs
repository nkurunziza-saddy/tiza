use tauri::Manager;

mod db;
mod commands;
mod menu;
mod models;
mod services;


use menu::{backup_database, export_data, import_data, refresh_app, restore_database};
use commands::{
    greet, my_custom_command, test_command, get_all_books, get_book_by_id, create_book,
    update_book, delete_book, get_all_students, get_student_by_id, create_student,
    update_student, delete_student, get_all_lendings, get_lending_by_id,
    get_lending_records_by_book_id, get_lending_records_by_student_id, create_lending,
    update_lending, return_lending, delete_lending, get_dashboard_stats,
    get_popular_books, get_overdue_books, get_recent_activity,
};


#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let app_handle = app.handle().clone();
            let runtime = tokio::runtime::Runtime::new().expect("Failed to create Tokio runtime");
            let db_pool = runtime
                .block_on(db::init_db(&app_handle))
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
            get_recent_activity,
            backup_database,
            restore_database,
            export_data,
            import_data,
            refresh_app
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
