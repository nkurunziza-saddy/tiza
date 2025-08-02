use sqlx::{Pool, Sqlite, SqlitePool};

pub async fn init_db() -> Result<Pool<Sqlite>, sqlx::Error> {
    std::fs::create_dir_all("data").unwrap();
    let pool = SqlitePool::connect("sqlite:data/library.db").await?;
    sqlx::migrate!("./migrations").run(&pool).await?;
    Ok(pool)
}