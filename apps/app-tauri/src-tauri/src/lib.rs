use app_tauri_core::fs::FsEntry;
use app_tauri_core::system::{CpuDetail, DiskDetail, MemoryDetail, NetworkInterface, SystemInfo};

#[tauri::command]
fn get_system_info() -> SystemInfo {
    app_tauri_core::system::get_system_info()
}

#[tauri::command]
fn get_cpu_detail() -> CpuDetail {
    app_tauri_core::system::get_cpu_detail()
}

#[tauri::command]
fn get_memory_detail() -> MemoryDetail {
    app_tauri_core::system::get_memory_detail()
}

#[tauri::command]
fn get_disk_detail() -> Vec<DiskDetail> {
    app_tauri_core::system::get_disk_detail()
}

#[tauri::command]
fn get_network_detail() -> Vec<NetworkInterface> {
    app_tauri_core::system::get_network_detail()
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
        .invoke_handler(tauri::generate_handler![
            get_system_info,
            get_cpu_detail,
            get_memory_detail,
            get_disk_detail,
            get_network_detail,
            list_dir,
            get_home_dir,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
