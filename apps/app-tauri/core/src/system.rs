use sysinfo::{Disks, Networks, System};

// ── Existing overview ────────────────────────────────────

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

    let cpu_usage    = sys.global_cpu_usage();
    let ram_used_gb  = sys.used_memory()  as f64 / 1_073_741_824.0;
    let ram_total_gb = sys.total_memory() as f64 / 1_073_741_824.0;

    let disks = Disks::new_with_refreshed_list();
    let (disk_total, disk_available) = disks.iter().fold((0u64, 0u64), |(t, a), d| {
        (t + d.total_space(), a + d.available_space())
    });
    let disk_total_gb = disk_total                                   as f64 / 1_073_741_824.0;
    let disk_used_gb  = disk_total.saturating_sub(disk_available)   as f64 / 1_073_741_824.0;

    SystemInfo { cpu_usage, ram_used_gb, ram_total_gb, disk_used_gb, disk_total_gb }
}

// ── CPU detail ───────────────────────────────────────────

#[derive(serde::Serialize)]
pub struct CpuDetail {
    pub brand: String,
    pub physical_cores: usize,
    pub logical_cores: usize,
    pub global_usage: f32,
    pub frequency_mhz: u64,
    pub per_core: Vec<f32>,
}

pub fn get_cpu_detail() -> CpuDetail {
    let mut sys = System::new_all();
    sys.refresh_all();

    let cpus          = sys.cpus();
    let global_usage  = sys.global_cpu_usage();
    let brand         = cpus.first().map(|c| c.brand().to_string()).unwrap_or_default();
    let frequency_mhz = cpus.first().map(|c| c.frequency()).unwrap_or(0);
    let per_core: Vec<f32> = cpus.iter().map(|c| c.cpu_usage()).collect();
    let logical_cores  = per_core.len();
    let physical_cores = sys.physical_core_count().unwrap_or(logical_cores);

    CpuDetail { brand, physical_cores, logical_cores, global_usage, frequency_mhz, per_core }
}

// ── Memory detail ────────────────────────────────────────

#[derive(serde::Serialize)]
pub struct MemoryDetail {
    pub ram_used_gb: f64,
    pub ram_total_gb: f64,
    pub swap_used_gb: f64,
    pub swap_total_gb: f64,
}

pub fn get_memory_detail() -> MemoryDetail {
    let mut sys = System::new_all();
    sys.refresh_all();

    let gb = 1_073_741_824.0_f64;
    MemoryDetail {
        ram_used_gb:  sys.used_memory()  as f64 / gb,
        ram_total_gb: sys.total_memory() as f64 / gb,
        swap_used_gb:  sys.used_swap()  as f64 / gb,
        swap_total_gb: sys.total_swap() as f64 / gb,
    }
}

// ── Disk detail ──────────────────────────────────────────

#[derive(serde::Serialize)]
pub struct DiskDetail {
    pub name: String,
    pub mount: String,
    pub total_gb: f64,
    pub used_gb: f64,
}

pub fn get_disk_detail() -> Vec<DiskDetail> {
    let disks = Disks::new_with_refreshed_list();
    let gb = 1_073_741_824.0_f64;

    disks.iter()
        .filter(|d| d.total_space() > 0)
        .map(|d| {
            let total_gb = d.total_space()                                     as f64 / gb;
            let used_gb  = d.total_space().saturating_sub(d.available_space()) as f64 / gb;
            DiskDetail {
                name:  d.name().to_string_lossy().to_string(),
                mount: d.mount_point().display().to_string(),
                total_gb,
                used_gb,
            }
        })
        .collect()
}

// ── Network detail ───────────────────────────────────────

#[derive(serde::Serialize)]
pub struct NetworkInterface {
    pub name: String,
    pub rx_bytes: u64,
    pub tx_bytes: u64,
}

pub fn get_network_detail() -> Vec<NetworkInterface> {
    let networks = Networks::new_with_refreshed_list();

    networks.iter()
        .map(|(name, data)| NetworkInterface {
            name:     name.clone(),
            rx_bytes: data.total_received(),
            tx_bytes: data.total_transmitted(),
        })
        .collect()
}
