use tauri::menu::{Menu, MenuItem, PredefinedMenuItem, Submenu};
use tauri::Emitter;

pub fn create_menu(app: &tauri::AppHandle) -> tauri::Result<Menu<tauri::Wry>> {
    // File menu
    let file_menu = Submenu::with_items(
        app,
        "File",
        true,
        &[
            &MenuItem::with_id(app, "new", "New", true, None::<&str>)?,
            &PredefinedMenuItem::separator(app)?,
            &MenuItem::with_id(app, "import", "Import", true, Some("Ctrl+I"))?,
            &MenuItem::with_id(app, "export", "Export", true, Some("Ctrl+E"))?,
            &PredefinedMenuItem::separator(app)?,
            &PredefinedMenuItem::quit(app, Some("Quit"))?,
        ],
    )?;

    // Edit menu
    let edit_menu = Submenu::with_items(
        app,
        "Edit",
        true,
        &[
            &PredefinedMenuItem::undo(app, Some("Undo"))?,
            &PredefinedMenuItem::redo(app, Some("Redo"))?,
            &PredefinedMenuItem::separator(app)?,
            &PredefinedMenuItem::cut(app, Some("Cut"))?,
            &PredefinedMenuItem::copy(app, Some("Copy"))?,
            &PredefinedMenuItem::paste(app, Some("Paste"))?,
            &PredefinedMenuItem::select_all(app, Some("Select All"))?,
        ],
    )?;

    // View menu
    let view_menu = Submenu::with_items(
        app,
        "View",
        true,
        &[
            &MenuItem::with_id(app, "dashboard", "Dashboard", true, Some("Ctrl+D"))?,
            &MenuItem::with_id(app, "books", "Books", true, Some("Ctrl+B"))?,
            &MenuItem::with_id(app, "students", "Students", true, Some("Ctrl+S"))?,
            &MenuItem::with_id(app, "lendings", "Lendings", true, Some("Ctrl+L"))?,
            &PredefinedMenuItem::separator(app)?,
            &MenuItem::with_id(app, "refresh", "Refresh", true, Some("F5"))?,
        ],
    )?;

    // Tools menu
    let tools_menu = Submenu::with_items(
        app,
        "Tools",
        true,
        &[
            &MenuItem::with_id(app, "backup", "Backup Database", true, None::<&str>)?,
            &MenuItem::with_id(app, "restore", "Restore Database", true, None::<&str>)?,
            &PredefinedMenuItem::separator(app)?,
            &MenuItem::with_id(app, "settings", "Settings", true, Some("Ctrl+,"))?,
        ],
    )?;

    // Help menu
    let help_menu = Submenu::with_items(
        app,
        "Help",
        true,
        &[
            &MenuItem::with_id(app, "about", "About Tiza", true, None::<&str>)?,
            &MenuItem::with_id(app, "help", "Help", true, Some("F1"))?,
            &MenuItem::with_id(app, "shortcuts", "Keyboard Shortcuts", true, Some("Ctrl+?"))?,
            &MenuItem::with_id(app, "contact", "Contact Support", true, None::<&str>)?,
        ],
    )?;

    // Create the main menu
    let menu = Menu::with_items(
        app,
        &[&file_menu, &edit_menu, &view_menu, &tools_menu, &help_menu],
    )?;

    Ok(menu)
}

// Menu event handler
pub fn handle_menu_event(app: &tauri::AppHandle, event: tauri::menu::MenuEvent) {
    match event.id().as_ref() {
        "new" => {
            println!("New menu item clicked");
            app.emit("menu_action", "new").unwrap(); 
        }
        "import" => {
            println!("Import menu item clicked");
            app.emit("menu_action", "import").unwrap();
        }
        "export" => {
            println!("Export menu item clicked");
            app.emit("menu_action", "export").unwrap();
        }
        "dashboard" => {
            println!("Dashboard menu item clicked");
            app.emit("navigate", "dashboard").unwrap();
        }
        "books" => {
            println!("Books menu item clicked");
            app.emit("navigate", "books").unwrap();
        }
        "students" => {
            println!("Students menu item clicked");
            app.emit("navigate", "students").unwrap();
        }
        "lendings" => {
            println!("Lendings menu item clicked");
            app.emit("navigate", "lendings").unwrap();
        }
        "refresh" => {
            println!("Refresh menu item clicked");
            app.emit("menu_action", "refresh").unwrap();
        }
        "backup" => {
            println!("Backup menu item clicked");
            app.emit("menu_action", "backup").unwrap();
        }
        "restore" => {
            println!("Restore menu item clicked");
            app.emit("menu_action", "restore").unwrap();
        }
        "settings" => {
            println!("Settings menu item clicked");
            app.emit("navigate", "settings").unwrap();
        }
        "about" => {
            println!("About menu item clicked");
            app.emit("menu_action", "about").unwrap();
        }
        "help" => {
            println!("Help menu item clicked");
            app.emit("menu_action", "help").unwrap();
        }
        "shortcuts" => {
            println!("Shortcuts menu item clicked");
            app.emit("menu_action", "shortcuts").unwrap();
        }
        "contact" => {
            println!("Contact menu item clicked");
            app.emit("menu_action", "contact").unwrap();
        }
        _ => {}
    }
}