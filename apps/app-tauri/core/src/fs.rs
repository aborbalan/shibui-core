use std::fs;

pub fn home_dir() -> Result<String, String> {
    let key = if cfg!(windows) { "USERPROFILE" } else { "HOME" };
    std::env::var(key).map_err(|e| e.to_string())
}

#[derive(serde::Serialize)]
pub struct FsEntry {
    pub name: String,
    pub path: String,
    pub is_dir: bool,
    pub extension: Option<String>,
    pub size: Option<u64>,
}

pub fn list_dir(path: &str) -> Result<Vec<FsEntry>, String> {
    let read = fs::read_dir(path).map_err(|e| e.to_string())?;

    let mut entries: Vec<FsEntry> = read
        .filter_map(|e| e.ok())
        .filter_map(|entry| {
            let p = entry.path();
            let is_dir = p.is_dir();
            let size = if is_dir { None } else { p.metadata().ok().map(|m| m.len()) };

            Some(FsEntry {
                name: entry.file_name().to_string_lossy().into_owned(),
                path: p.to_string_lossy().into_owned(),
                is_dir,
                extension: p.extension().map(|e| e.to_string_lossy().into_owned()),
                size,
            })
        })
        .collect();

    entries.sort_by(|a, b| match (a.is_dir, b.is_dir) {
        (true, false) => std::cmp::Ordering::Less,
        (false, true) => std::cmp::Ordering::Greater,
        _ => a.name.to_lowercase().cmp(&b.name.to_lowercase()),
    });

    Ok(entries)
}
