import { ApiProperty } from '@nestjs/swagger';

export class GitCommitDto {
  @ApiProperty({ example: 'a1b2c3d', description: 'Hash corto del commit' })
  hash: string;

  @ApiProperty({ example: 'feat: add git graph', description: 'Mensaje (primera línea)' })
  message: string;

  @ApiProperty({ example: 'Alejandro Borbalán', description: 'Nombre del autor' })
  author: string;

  @ApiProperty({ example: '2026-05-31T10:00:00+02:00', description: 'Fecha ISO 8601' })
  date: string;

  @ApiProperty({ example: ['e4f5a6b'], description: 'Hashes de commits padre' })
  parents: string[];

  @ApiProperty({
    example: ['HEAD -> main', 'origin/main'],
    description: 'Refs que apuntan a este commit',
  })
  refs: string[];
}
