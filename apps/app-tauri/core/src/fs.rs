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
        .map(|entry| {
            let p = entry.path();
            let is_dir = p.is_dir();
            let size = if is_dir {
                None
            } else {
                p.metadata().ok().map(|m| m.len())
            };

            FsEntry {
                name: entry.file_name().to_string_lossy().into_owned(),
                path: p.to_string_lossy().into_owned(),
                is_dir,
                extension: p.extension().map(|e| e.to_string_lossy().into_owned()),
                size,
            }
        })
        .collect();

    entries.sort_by(|a, b| match (a.is_dir, b.is_dir) {
        (true, false) => std::cmp::Ordering::Less,
        (false, true) => std::cmp::Ordering::Greater,
        _ => a.name.to_lowercase().cmp(&b.name.to_lowercase()),
    });

    Ok(entries)
}

/// Límite de lectura: 5 MiB. Por encima asumimos binario/no editable y
/// rechazamos para no volcar ficheros enormes al editor del frontend.
const MAX_READ_BYTES: u64 = 5 * 1024 * 1024;

/// Lee el contenido de un fichero de texto (UTF-8) para el editor.
///
/// Falla si la ruta no existe, no es un fichero, supera `MAX_READ_BYTES`, o
/// el contenido no es UTF-8 válido (probable binario).
pub fn read_file(path: &str) -> Result<String, String> {
    let meta = fs::metadata(path).map_err(|e| format!("No se pudo acceder a {path}: {e}"))?;

    if !meta.is_file() {
        return Err(format!("La ruta no es un fichero: {path}"));
    }
    if meta.len() > MAX_READ_BYTES {
        return Err(format!(
            "Fichero demasiado grande ({} bytes; máx {MAX_READ_BYTES}): {path}",
            meta.len()
        ));
    }

    let bytes = fs::read(path).map_err(|e| format!("No se pudo leer {path}: {e}"))?;
    String::from_utf8(bytes)
        .map_err(|_| format!("El fichero no es texto UTF-8 (¿binario?): {path}"))
}

/// Escribe (sobrescribe) el contenido de un fichero. Crea el fichero si no
/// existe, pero NO crea directorios padre que falten.
///
/// Si la ruta ya existe, exige que sea un fichero (no sobrescribir un
/// directorio por accidente).
pub fn write_file(path: &str, content: &str) -> Result<(), String> {
    if let Ok(meta) = fs::metadata(path) {
        if !meta.is_file() {
            return Err(format!("La ruta existe y no es un fichero: {path}"));
        }
    }
    fs::write(path, content).map_err(|e| format!("No se pudo escribir {path}: {e}"))
}

#[cfg(test)]
mod tests {
    use super::*;

    fn temp_path(name: &str) -> std::path::PathBuf {
        std::env::temp_dir().join(name)
    }

    #[test]
    fn write_then_read_roundtrip() {
        let p = temp_path("shibui_fs_test_roundtrip.txt");
        let _ = fs::remove_file(&p);
        let body = "línea 1\nlínea 2\n";

        write_file(p.to_str().unwrap(), body).unwrap();
        let read = read_file(p.to_str().unwrap()).unwrap();
        assert_eq!(read, body);

        let _ = fs::remove_file(&p);
    }

    #[test]
    fn read_missing_file_errs() {
        assert!(read_file("/no/existe/shibui-xyz.txt").is_err());
    }

    #[test]
    fn read_directory_errs() {
        let dir = std::env::temp_dir();
        assert!(read_file(dir.to_str().unwrap()).is_err());
    }

    #[test]
    fn write_over_directory_errs() {
        let dir = std::env::temp_dir();
        assert!(write_file(dir.to_str().unwrap(), "x").is_err());
    }
}
