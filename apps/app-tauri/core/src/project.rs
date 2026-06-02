use std::path::Path;
use std::process::Command;

/// Información de un proyecto abierto, detectada al apuntar a su carpeta raíz.
///
/// Es un snapshot: se calcula en el momento de abrir. La rama git puede quedar
/// obsoleta si el usuario cambia de rama por fuera; refrescar reabriendo.
#[derive(serde::Serialize, Clone)]
pub struct ProjectInfo {
    /// Ruta raíz absoluta del proyecto.
    pub path: String,
    /// Nombre del proyecto (último segmento de la ruta).
    pub name: String,
    /// Tipos detectados por ficheros marcadores (p.ej. ["node", "rust"]).
    pub kinds: Vec<String>,
    /// Rama git actual, o `None` si la carpeta no es un repositorio git.
    pub git_branch: Option<String>,
    /// `true` si la ruta existe y es un directorio.
    pub exists: bool,
}

/// Ficheros/carpetas marcadores → etiqueta de tipo de proyecto.
const MARKERS: &[(&str, &str)] = &[
    ("package.json", "node"),
    ("pnpm-workspace.yaml", "pnpm-workspace"),
    ("Cargo.toml", "rust"),
    ("go.mod", "go"),
    ("pyproject.toml", "python"),
    ("requirements.txt", "python"),
    ("pom.xml", "java"),
    ("build.gradle", "gradle"),
    ("composer.json", "php"),
    ("Gemfile", "ruby"),
    ("tsconfig.json", "typescript"),
    ("Dockerfile", "docker"),
    (".git", "git"),
];

/// Inspecciona la carpeta `path` y devuelve la metadata del proyecto.
///
/// No falla si la carpeta no es un proyecto reconocible: devuelve `kinds`
/// vacío y `git_branch: None`. Solo retorna `Err` si la ruta no existe o no
/// es accesible como directorio.
pub fn get_project_info(path: &str) -> Result<ProjectInfo, String> {
    let dir = Path::new(path);

    if !dir.exists() {
        return Err(format!("La ruta no existe: {path}"));
    }
    if !dir.is_dir() {
        return Err(format!("La ruta no es un directorio: {path}"));
    }

    let name = dir
        .file_name()
        .and_then(|n| n.to_str())
        .unwrap_or(path)
        .to_string();

    let kinds: Vec<String> = MARKERS
        .iter()
        .filter(|(marker, _)| dir.join(marker).exists())
        .map(|(_, label)| (*label).to_string())
        .collect();

    let git_branch = detect_git_branch(path);

    Ok(ProjectInfo {
        path: path.to_string(),
        name,
        kinds,
        git_branch,
        exists: true,
    })
}

/// Rama git actual mediante `git rev-parse --abbrev-ref HEAD`.
/// Devuelve `None` si no es repo, si git no está disponible o en detached HEAD.
fn detect_git_branch(path: &str) -> Option<String> {
    let output = Command::new("git")
        .args(["-C", path, "rev-parse", "--abbrev-ref", "HEAD"])
        .output()
        .ok()?;

    if !output.status.success() {
        return None;
    }

    let branch = String::from_utf8_lossy(&output.stdout).trim().to_string();
    if branch.is_empty() || branch == "HEAD" {
        None
    } else {
        Some(branch)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::fs;

    #[test]
    fn err_si_ruta_no_existe() {
        let res = get_project_info("/ruta/que/no/existe/jamas-xyz");
        assert!(res.is_err());
    }

    #[test]
    fn detecta_nombre_y_tipo_node() {
        // Carpeta temporal con un package.json → debe detectar kind "node".
        let dir = std::env::temp_dir().join("shibui_proj_test_node");
        let _ = fs::remove_dir_all(&dir);
        fs::create_dir_all(&dir).unwrap();
        fs::write(dir.join("package.json"), "{}").unwrap();

        let info = get_project_info(dir.to_str().unwrap()).unwrap();
        assert_eq!(info.name, "shibui_proj_test_node");
        assert!(info.kinds.contains(&"node".to_string()));
        assert!(info.exists);

        let _ = fs::remove_dir_all(&dir);
    }

    #[test]
    fn carpeta_vacia_sin_tipos() {
        let dir = std::env::temp_dir().join("shibui_proj_test_empty");
        let _ = fs::remove_dir_all(&dir);
        fs::create_dir_all(&dir).unwrap();

        let info = get_project_info(dir.to_str().unwrap()).unwrap();
        assert!(info.kinds.is_empty());
        assert_eq!(info.git_branch, None);

        let _ = fs::remove_dir_all(&dir);
    }
}
