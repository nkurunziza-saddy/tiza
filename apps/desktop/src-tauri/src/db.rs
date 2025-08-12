use sqlx::{Pool, Sqlite, SqlitePool};
use tauri::Manager;

pub async fn init_db(app_handle: &tauri::AppHandle) -> Result<Pool<Sqlite>, sqlx::Error> {
    let app_data_dir = app_handle
        .path()
        .app_data_dir()
        .expect("Could not get app data dir");

    println!("Resolved app data dir: {}", app_data_dir.display());

    std::fs::create_dir_all(&app_data_dir).unwrap();

    let db_path = app_data_dir.join("library.db");
    println!("Resolved database path: {}", db_path.display());
    let pool = SqlitePool::connect(&format!("sqlite:{}", db_path.display())).await?;
    sqlx::migrate!("./migrations").run(&pool).await?;
    Ok(pool)
}
