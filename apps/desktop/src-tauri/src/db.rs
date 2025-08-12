use sqlx::{Pool, Sqlite, SqlitePool};
use tauri::Manager;
use std::path::PathBuf;

pub async fn init_db(app_handle: &tauri::AppHandle) -> Result<Pool<Sqlite>, sqlx::Error> {
    let app_data_dir = app_handle
        .path()
        .app_data_dir()
        .expect("Could not get app data dir");

    println!("Resolved app data dir: {}", app_data_dir.display());

    std::fs::create_dir_all(&app_data_dir)
        .expect("Failed to create app data directory");

    let db_path: PathBuf = app_data_dir.join("library.db");
    println!("Resolved database path: {}", db_path.display());

    let db_exists = db_path.exists();

    let uri = format!("sqlite:file:{}?mode=rwc", db_path.to_str().unwrap());

    println!("Connecting with URI: {}", uri);

    let pool = SqlitePool::connect(&uri).await?;

    if db_exists {
        println!("Opened existing database");
    } else {
        println!("Created new database");
    }

    // Run migrations (if any)
    sqlx::migrate!("./migrations").run(&pool).await?;

    Ok(pool)
}
