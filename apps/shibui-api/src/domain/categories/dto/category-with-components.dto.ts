// apps/shibui-api/src/domain/categories/dto/category-with-components.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Component,
  ComponentStatus,
} from '../../components/entities/component.entity';

export class ComponentSummaryDto implements Omit<
  Component,
  'createdAt' | 'updatedAt'
> {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiProperty() slug: string;
  @ApiProperty() tagName: string;
  @ApiProperty() description: string;
  @ApiProperty() version: string;
  @ApiProperty({ enum: ComponentStatus }) status: ComponentStatus;
  @ApiProperty() categoryId: string;
  @ApiPropertyOptional({ nullable: true }) packageName: string | null;
  @ApiProperty({ type: [String] }) tags: string[];
  @ApiPropertyOptional({ nullable: true }) docsUrl: string | null;
}

export class CategoryWithComponentsDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiProperty() slug: string;
  @ApiPropertyOptional({ nullable: true }) description: string | null;
  @ApiPropertyOptional({ nullable: true }) icon: string | null;
  @ApiProperty() order: number;
  @ApiProperty({ type: [ComponentSummaryDto] })
  components: ComponentSummaryDto[];
}
