import { BadRequestException, Injectable } from '@nestjs/common';
import { execFileSync } from 'child_process';
import { existsSync, statSync } from 'fs';
import { GitCommitDto } from './dto/git-commit.dto';

@Injectable()
export class GitService {
  /**
   * Ejecuta `git log` en el directorio indicado y devuelve commits en orden
   * topológico (más reciente primero). Mismo contrato que el comando Tauri.
   *
   * Seguridad: usa `execFileSync` con un array de argumentos, NO un string de
   * shell. Así `git` se ejecuta directamente sin intérprete de comandos, de
   * modo que `repoPath` (valor proporcionado por el usuario vía query param) no
   * puede inyectar comandos (`;`, `$(...)`, backticks, comillas… son inertes).
   *
   * @param repoPath - Directorio del repositorio. Por defecto: cwd del proceso.
   * @param maxCount - Número máximo de commits. Por defecto: 200.
   */
  getLog(repoPath?: string, maxCount = 200): GitCommitDto[] {
    const path  = repoPath ?? process.cwd();
    const limit = Math.min(Math.max(1, maxCount), 500);

    // Defensa en profundidad: rechazar rutas que no sean un directorio real.
    if (!existsSync(path) || !statSync(path).isDirectory()) {
      throw new BadRequestException(`Ruta de repositorio inválida: ${path}`);
    }

    // \x1f = ASCII Unit Separator: mismo separador que el módulo Rust
    const format = '--pretty=tformat:%h\x1f%s\x1f%an\x1f%aI\x1f%p\x1f%D';
    const args   = [
      '-C', path,
      'log', '--all', '--topo-order',
      `--max-count=${limit}`,
      format,
    ];

    let stdout: string;
    try {
      // execFileSync NO usa shell → sin interpolación, sin inyección.
      stdout = execFileSync('git', args, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      throw new Error(`git log falló: ${msg}`);
    }

    return stdout
      .split('\n')
      .filter((line) => line.trim().length > 0)
      .map((line) => this.parseLine(line))
      .filter((c): c is GitCommitDto => c !== null);
  }

  private parseLine(line: string): GitCommitDto | null {
    const parts = line.split('\x1f');
    if (parts.length < 6) return null;

    const hash    = parts[0]?.trim() ?? '';
    const message = parts[1]?.trim() ?? '';
    const author  = parts[2]?.trim() ?? '';
    const date    = parts[3]?.trim() ?? '';

    // %p da hashes cortos separados por espacio (vacío para commit raíz)
    const parents = (parts[4] ?? '')
      .split(' ')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    // %D da refs separadas por coma
    const refs = (parts[5] ?? '')
      .split(',')
      .map((r) => r.trim())
      .filter((r) => r.length > 0);

    if (!hash) return null;

    return { hash, message, author, date, parents, refs };
  }
}
