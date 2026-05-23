use app_tauri_core::system::SystemInfo;
use app_tauri_core::fs::FsEntry;

#[tauri::command]
fn get_system_info() -> SystemInfo {
    app_tauri_core::system::get_system_info()
}

#[tauri::command]
fn list_dir(path: String) -> Result<Vec<FsEntry>, String> {
    app_tauri_core::fs::list_dir(&path)
}

#[tauri::command]
fn get_home_dir() -> Result<String, String> {
    app_tauri_core::fs::home_dir()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![get_system_info, list_dir, get_home_dir])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
