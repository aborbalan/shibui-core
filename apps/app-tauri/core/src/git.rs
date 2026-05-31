use std::process::Command;

#[derive(serde::Serialize, Clone)]
pub struct GitCommit {
    pub hash: String,
    pub message: String,
    pub author: String,
    pub date: String,
    pub parents: Vec<String>,
    pub refs: Vec<String>,
}

/// Ejecuta `git log` en el directorio indicado y devuelve commits en orden
/// topológico (más reciente primero), listo para consumir por `lib-git-graph`.
///
/// Usa `%h` / `%p` (hashes cortos) para que los IDs de padres coincidan
/// con los IDs de hijos. Máx. 200 commits para evitar timeouts.
pub fn get_git_log(path: &str, max_count: Option<u32>) -> Result<Vec<GitCommit>, String> {
    // \x1f = ASCII Unit Separator: delimitador de campo que no aparece en
    // mensajes, autores ni refs normales.
    let format = "--pretty=tformat:%h\x1f%s\x1f%an\x1f%aI\x1f%p\x1f%D";
    let limit = format!("--max-count={}", max_count.unwrap_or(200));

    let output = Command::new("git")
        .args(["-C", path, "log", "--all", "--topo-order", &limit, format])
        .output()
        .map_err(|e| format!("No se pudo ejecutar git: {e}"))?;

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        return Err(format!("git log falló: {stderr}"));
    }

    let stdout = String::from_utf8_lossy(&output.stdout);
    let commits = stdout
        .lines()
        .filter(|l| !l.is_empty())
        .filter_map(parse_line)
        .collect();

    Ok(commits)
}

fn parse_line(line: &str) -> Option<GitCommit> {
    let parts: Vec<&str> = line.splitn(6, '\x1f').collect();
    if parts.len() < 6 {
        return None;
    }

    let hash = parts[0].trim().to_string();
    let message = parts[1].trim().to_string();
    let author = parts[2].trim().to_string();
    let date = parts[3].trim().to_string();

    // %p da hashes cortos separados por espacio (raíz → vacío)
    let parents: Vec<String> = parts[4]
        .split_whitespace()
        .filter(|s| !s.is_empty())
        .map(|s| s.to_string())
        .collect();

    // %D da refs separadas por coma, ej. "HEAD -> main, origin/main, v1.0"
    let refs: Vec<String> = parts[5]
        .split(',')
        .map(|r| r.trim().to_string())
        .filter(|r| !r.is_empty())
        .collect();

    if hash.is_empty() {
        return None;
    }

    Some(GitCommit {
        hash,
        message,
        author,
        date,
        parents,
        refs,
    })
}
