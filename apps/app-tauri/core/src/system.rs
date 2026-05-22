use sysinfo::{Disks, System};

#[derive(serde::Serialize)]
pub struct SystemInfo {
    pub cpu_usage: f32,
    pub ram_used_gb: f64,
    pub ram_total_gb: f64,
    pub disk_used_gb: f64,
    pub disk_total_gb: f64,
}

pub fn get_system_info() -> SystemInfo {
    let mut sys = System::new_all();
    sys.refresh_all();

    let cpu_usage = sys.global_cpu_usage();
    let ram_used_gb  = sys.used_memory()  as f64 / 1_073_741_824.0;
    let ram_total_gb = sys.total_memory() as f64 / 1_073_741_824.0;

    let disks = Disks::new_with_refreshed_list();
    let (disk_total, disk_available) = disks.iter().fold((0u64, 0u64), |(t, a), d| {
        (t + d.total_space(), a + d.available_space())
    });
    let disk_total_gb = disk_total                          as f64 / 1_073_741_824.0;
    let disk_used_gb  = disk_total.saturating_sub(disk_available) as f64 / 1_073_741_824.0;

    SystemInfo { cpu_usage, ram_used_gb, ram_total_gb, disk_used_gb, disk_total_gb }
}
