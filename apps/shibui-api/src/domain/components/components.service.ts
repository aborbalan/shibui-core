import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateComponentDto } from './dto/create-component.dto';
import { UpdateComponentDto } from './dto/update-component.dto';
import { Component, ComponentStatus } from './entities/component.entity';
import { COMPONENTS_GENERATED } from './data/components.generated';
import { randomUUID } from 'crypto';

// Fecha fija para los componentes generados (datos de catálogo, no transaccionales).
const SEED_DATE = new Date('2024-01-01T00:00:00Z');

@Injectable()
export class ComponentsService {
  private components: Component[] = COMPONENTS_GENERATED.map((c) => ({
    ...c,
    status: c.status as ComponentStatus,
    createdAt: SEED_DATE,
    updatedAt: SEED_DATE,
  }));

  create(createComponentDto: CreateComponentDto): Component {
    const existing = this.components.find(
      (c) => c.slug === createComponentDto.slug,
    );
    if (existing) {
      throw new ConflictException(
        `Component with slug "${createComponentDto.slug}" already exists`,
      );
    }
    const component: Component = {
      id: randomUUID(),
      name: createComponentDto.name,
      slug: createComponentDto.slug,
      tagName: createComponentDto.tagName,
      description: createComponentDto.description,
      version: createComponentDto.version,
      status: createComponentDto.status,
      categoryId: createComponentDto.categoryId,
      packageName: createComponentDto.packageName ?? null,
      tags: createComponentDto.tags ?? [],
      docsUrl: createComponentDto.docsUrl ?? null,
      api: createComponentDto.api,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.components.push(component);
    return component;
  }

  findAll(): Component[] {
    return this.components;
  }

  findOne(id: string): Component {
    const component = this.components.find((c) => c.id === id);
    if (!component)
      throw new NotFoundException(`Component with id ${id} not found`);
    return component;
  }

  findBySlug(slug: string): Component {
    const component = this.components.find((c) => c.slug === slug);
    if (!component)
      throw new NotFoundException(`Component with slug "${slug}" not found`);
    return component;
  }

  findByCategory(categoryId: string): Component[] {
    return this.components.filter((c) => c.categoryId === categoryId);
  }

  update(id: string, updateComponentDto: UpdateComponentDto): Component {
    const index = this.components.findIndex((c) => c.id === id);
    if (index === -1)
      throw new NotFoundException(`Component with id ${id} not found`);
    this.components[index] = {
      ...this.components[index],
      ...updateComponentDto,
      updatedAt: new Date(),
    };
    return this.components[index];
  }

  remove(id: string): void {
    const index = this.components.findIndex((c) => c.id === id);
    if (index === -1)
      throw new NotFoundException(`Component with id ${id} not found`);
    this.components.splice(index, 1);
  }
}
