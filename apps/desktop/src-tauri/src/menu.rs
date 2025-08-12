use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use tauri::{AppHandle, Manager, Emitter};
use tauri_plugin_dialog::DialogExt;

#[derive(Debug, Serialize, Deserialize)]
pub struct BackupResult {
    success: bool,
    message: String,
    path: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct RestoreResult {
    success: bool,
    message: String,
}

// Get the current database path
pub fn get_db_path(app_handle: &AppHandle) -> Result<PathBuf, String> {
    let app_data_dir = app_handle
        .path()
        .app_data_dir()
        .map_err(|e| format!("Could not get app data dir: {}", e))?;

    Ok(app_data_dir.join("library.db"))
}

#[tauri::command]
pub async fn backup_database(app_handle: AppHandle) -> Result<BackupResult, String> {
    let db_path =
        get_db_path(&app_handle).map_err(|e| format!("Failed to get database path: {}", e))?;

    if !db_path.exists() {
        return Ok(BackupResult {
            success: false,
            message: "Database file does not exist".to_string(),
            path: None,
        });
    }

    // Generate backup filename with timestamp
    let timestamp = chrono::Utc::now().format("%Y%m%d_%H%M%S");
    let backup_filename = format!("library_backup_{}.db", timestamp);

    // Use Tauri's file dialog to let user choose backup location
    let backup_path = match app_handle
        .dialog()
        .file()
        .set_title("Save Database Backup")
        .set_file_name(&backup_filename)
        .add_filter("Database files", &["db"])
        .blocking_save_file()
    {
        Some(path) => {
            // Convert FilePath to PathBuf
            match path {
                tauri_plugin_dialog::FilePath::Path(pb) => pb,
                tauri_plugin_dialog::FilePath::Url(url) => {
                    PathBuf::from(url.to_file_path().map_err(|_| "Invalid file path")?)
                }
            }
        }
        None => {
            return Ok(BackupResult {
                success: false,
                message: "Backup cancelled by user".to_string(),
                path: None,
            });
        }
    };

    // Copy the database file
    match std::fs::copy(&db_path, &backup_path) {
        Ok(_) => Ok(BackupResult {
            success: true,
            message: format!(
                "Database backed up successfully to {}",
                backup_path.display()
            ),
            path: Some(backup_path.to_string_lossy().to_string()),
        }),
        Err(e) => Ok(BackupResult {
            success: false,
            message: format!("Failed to backup database: {}", e),
            path: None,
        }),
    }
}

#[tauri::command]
pub async fn restore_database(app_handle: AppHandle) -> Result<RestoreResult, String> {
    // Use file dialog to select backup file
    let backup_path = match app_handle
        .dialog()
        .file()
        .set_title("Select Database Backup to Restore")
        .add_filter("Database files", &["db"])
        .blocking_pick_file()
    {
        Some(path) => {
            // Convert FilePath to PathBuf
            match path {
                tauri_plugin_dialog::FilePath::Path(pb) => pb,
                tauri_plugin_dialog::FilePath::Url(url) => {
                    PathBuf::from(url.to_file_path().map_err(|_| "Invalid file path")?)
                }
            }
        }
        None => {
            return Ok(RestoreResult {
                success: false,
                message: "Restore cancelled by user".to_string(),
            });
        }
    };

    if !backup_path.exists() {
        return Ok(RestoreResult {
            success: false,
            message: "Selected backup file does not exist".to_string(),
        });
    }

    let current_db_path =
        get_db_path(&app_handle).map_err(|e| format!("Failed to get database path: {}", e))?;

    // Create backup of current database before restoring
    if current_db_path.exists() {
        let timestamp = chrono::Utc::now().format("%Y%m%d_%H%M%S");
        let backup_current =
            current_db_path.with_file_name(format!("library_pre_restore_{}.db", timestamp));

        if let Err(e) = std::fs::copy(&current_db_path, &backup_current) {
            return Ok(RestoreResult {
                success: false,
                message: format!("Failed to backup current database before restore: {}", e),
            });
        }
    }

    // Copy the selected backup to current database location
    match std::fs::copy(&backup_path, &current_db_path) {
        Ok(_) => Ok(RestoreResult {
            success: true,
            message: format!(
                "Database restored successfully from {}",
                backup_path.display()
            ),
        }),
        Err(e) => Ok(RestoreResult {
            success: false,
            message: format!("Failed to restore database: {}", e),
        }),
    }
}

#[tauri::command]
pub async fn export_data(
    app_handle: AppHandle,
    export_type: String,
) -> Result<BackupResult, String> {
    // This is a placeholder for data export functionality
    // You can implement CSV, JSON, or other export formats here

    let timestamp = chrono::Utc::now().format("%Y%m%d_%H%M%S");
    let filename = match export_type.as_str() {
        "csv" => format!("library_data_{}.csv", timestamp),
        "json" => format!("library_data_{}.json", timestamp),
        _ => format!("library_data_{}.csv", timestamp),
    };

    let export_path = match app_handle
        .dialog()
        .file()
        .set_title("Export Library Data")
        .set_file_name(&filename)
        .blocking_save_file()
    {
        Some(path) => {
            // Convert FilePath to PathBuf
            match path {
                tauri_plugin_dialog::FilePath::Path(pb) => pb,
                tauri_plugin_dialog::FilePath::Url(url) => {
                    PathBuf::from(url.to_file_path().map_err(|_| "Invalid file path")?)
                }
            }
        }
        None => {
            return Ok(BackupResult {
                success: false,
                message: "Export cancelled by user".to_string(),
                path: None,
            });
        }
    };

    // TODO: Implement actual data export logic here
    // For now, just create an empty file as placeholder
    match std::fs::write(&export_path, "Export functionality not yet implemented") {
        Ok(_) => Ok(BackupResult {
            success: true,
            message: format!("Data exported to {}", export_path.display()),
            path: Some(export_path.to_string_lossy().to_string()),
        }),
        Err(e) => Ok(BackupResult {
            success: false,
            message: format!("Failed to export data: {}", e),
            path: None,
        }),
    }
}

#[tauri::command]
pub async fn import_data(app_handle: AppHandle) -> Result<RestoreResult, String> {
    let import_path = match app_handle
        .dialog()
        .file()
        .set_title("Select Data File to Import")
        .add_filter("CSV files", &["csv"])
        .add_filter("JSON files", &["json"])
        .blocking_pick_file()
    {
        Some(path) => {
            // Convert FilePath to PathBuf
            match path {
                tauri_plugin_dialog::FilePath::Path(pb) => pb,
                tauri_plugin_dialog::FilePath::Url(url) => {
                    PathBuf::from(url.to_file_path().map_err(|_| "Invalid file path")?)
                }
            }
        }
        None => {
            return Ok(RestoreResult {
                success: false,
                message: "Import cancelled by user".to_string(),
            });
        }
    };

    if !import_path.exists() {
        return Ok(RestoreResult {
            success: false,
            message: "Selected import file does not exist".to_string(),
        });
    }

    // TODO: Implement actual data import logic here
    // This would involve parsing the file and inserting into database

    Ok(RestoreResult {
        success: true,
        message: format!(
            "Import functionality not yet implemented for {}",
            import_path.display()
        ),
    })
}

#[tauri::command]
pub async fn refresh_app(app_handle: AppHandle) -> Result<(), String> {
    // Emit an event to refresh the frontend
    app_handle
        .emit("refresh_data", ())
        .map_err(|e| e.to_string())?;
    Ok(())
}