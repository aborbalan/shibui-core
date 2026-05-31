import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { GitService } from './git.service';
import { GitCommitDto } from './dto/git-commit.dto';

@ApiTags('git')
@Controller('git')
export class GitController {
  constructor(private readonly gitService: GitService) {}

  @Get('log')
  @ApiOperation({
    summary: 'Obtener historial git',
    description:
      'Devuelve commits en orden topológico (más reciente primero), ' +
      'listos para consumir por el componente lib-git-graph.',
  })
  @ApiQuery({
    name:     'path',
    required: false,
    description: 'Ruta absoluta al repositorio. Por defecto: cwd del proceso.',
  })
  @ApiQuery({
    name:     'maxCount',
    required: false,
    type:     Number,
    description: 'Número máximo de commits (1-500). Por defecto: 200.',
  })
  @ApiResponse({ status: 200, type: [GitCommitDto] })
  getLog(
    @Query('path')     path?:     string,
    @Query('maxCount') maxCount?: string,
  ): GitCommitDto[] {
    const limit = maxCount ? parseInt(maxCount, 10) : undefined;
    return this.gitService.getLog(path, limit);
  }
}
