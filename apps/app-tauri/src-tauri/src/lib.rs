use app_tauri_core::fs::FsEntry;
use app_tauri_core::git::GitCommit;
use app_tauri_core::project::ProjectInfo;
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

#[tauri::command]
fn read_file(path: String) -> Result<String, String> {
    app_tauri_core::fs::read_file(&path)
}

#[tauri::command]
fn write_file(path: String, content: String) -> Result<(), String> {
    app_tauri_core::fs::write_file(&path, &content)
}

#[tauri::command]
fn get_git_log(path: String, max_count: Option<u32>) -> Result<Vec<GitCommit>, String> {
    app_tauri_core::git::get_git_log(&path, max_count)
}

#[tauri::command]
fn get_project_info(path: String) -> Result<ProjectInfo, String> {
    app_tauri_core::project::get_project_info(&path)
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
            read_file,
            write_file,
            get_git_log,
            get_project_info,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
