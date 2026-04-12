import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateComponentDto } from './dto/create-component.dto';
import { UpdateComponentDto } from './dto/update-component.dto';
import { Component, ComponentStatus } from './entities/component.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class ComponentsService {
  private components: Component[] = [
    {
      id: 'cmp-0001-0000-0000-000000000001',
      name: 'Button',
      slug: 'shibui-button',
      tagName: 'shibui-button',
      description:
        'A versatile button component supporting multiple variants, sizes and states including loading and disabled.',
      version: '1.3.0',
      status: ComponentStatus.STABLE,
      categoryId: 'cat-0001-0000-0000-000000000001',
      packageName: '@shibui-ui/components',
      tags: ['interactive', 'form', 'accessible'],
      docsUrl: null,
      createdAt: new Date('2024-01-10T00:00:00Z'),
      updatedAt: new Date('2024-06-01T00:00:00Z'),
    },
    {
      id: 'cmp-0002-0000-0000-000000000002',
      name: 'Input',
      slug: 'shibui-input',
      tagName: 'shibui-input',
      description:
        'Text input field with support for labels, helper text, error states and prefix/suffix slots.',
      version: '1.2.1',
      status: ComponentStatus.STABLE,
      categoryId: 'cat-0001-0000-0000-000000000001',
      packageName: '@shibui-ui/components',
      tags: ['form', 'accessible', 'text'],
      docsUrl: null,
      createdAt: new Date('2024-01-15T00:00:00Z'),
      updatedAt: new Date('2024-05-20T00:00:00Z'),
    },
    {
      id: 'cmp-0003-0000-0000-000000000003',
      name: 'Select',
      slug: 'shibui-select',
      tagName: 'shibui-select',
      description:
        'Dropdown select component with single and multi-select modes, search and custom option rendering.',
      version: '1.1.0',
      status: ComponentStatus.STABLE,
      categoryId: 'cat-0001-0000-0000-000000000001',
      packageName: '@shibui-ui/components',
      tags: ['form', 'accessible', 'dropdown'],
      docsUrl: null,
      createdAt: new Date('2024-02-01T00:00:00Z'),
      updatedAt: new Date('2024-05-10T00:00:00Z'),
    },
    {
      id: 'cmp-0004-0000-0000-000000000004',
      name: 'Toast',
      slug: 'shibui-toast',
      tagName: 'shibui-toast',
      description:
        'Non-blocking notification component with configurable position, duration and dismissal.',
      version: '1.0.2',
      status: ComponentStatus.STABLE,
      categoryId: 'cat-0003-0000-0000-000000000003',
      packageName: '@shibui-ui/components',
      tags: ['feedback', 'notification', 'accessible'],
      docsUrl: null,
      createdAt: new Date('2024-03-01T00:00:00Z'),
      updatedAt: new Date('2024-04-15T00:00:00Z'),
    },
    {
      id: 'cmp-0005-0000-0000-000000000005',
      name: 'Nav Menu',
      slug: 'shibui-nav-menu',
      tagName: 'shibui-nav-menu',
      description:
        'Horizontal and vertical navigation menu with support for nested items and keyboard navigation.',
      version: '0.9.0',
      status: ComponentStatus.DRAFT,
      categoryId: 'cat-0002-0000-0000-000000000002',
      packageName: '@shibui-ui/components',
      tags: ['navigation', 'accessible', 'keyboard'],
      docsUrl: null,
      createdAt: new Date('2024-04-01T00:00:00Z'),
      updatedAt: new Date('2024-06-10T00:00:00Z'),
    },
    {
      id: 'cmp-0006-0000-0000-000000000006',
      name: 'Card',
      slug: 'shibui-card',
      tagName: 'shibui-card',
      description:
        'Flexible container component with header, body and footer slots. Supports elevation and interactive variants.',
      version: '1.0.0',
      status: ComponentStatus.STABLE,
      categoryId: 'cat-0004-0000-0000-000000000004',
      packageName: '@shibui-ui/components',
      tags: ['layout', 'container'],
      docsUrl: null,
      createdAt: new Date('2024-01-20T00:00:00Z'),
      updatedAt: new Date('2024-03-05T00:00:00Z'),
    },
    {
      id: 'cmp-0007-0000-0000-000000000007',
      name: 'Badge',
      slug: 'shibui-badge',
      tagName: 'shibui-badge',
      description:
        'Small status descriptor for UI elements. Supports semantic color variants and dot mode.',
      version: '2.0.0',
      status: ComponentStatus.STABLE,
      categoryId: 'cat-0005-0000-0000-000000000005',
      packageName: '@shibui-ui/components',
      tags: ['data-display', 'status'],
      docsUrl: null,
      createdAt: new Date('2024-01-05T00:00:00Z'),
      updatedAt: new Date('2024-06-15T00:00:00Z'),
    },
    {
      id: 'cmp-0008-0000-0000-000000000008',
      name: 'Spinner (legacy)',
      slug: 'shibui-spinner',
      tagName: 'shibui-spinner',
      description:
        'Legacy loading spinner. Replaced by shibui-progress in v2. Will be removed in v3.',
      version: '1.0.0',
      status: ComponentStatus.DEPRECATED,
      categoryId: 'cat-0003-0000-0000-000000000003',
      packageName: '@shibui-ui/components',
      tags: ['feedback', 'loading', 'deprecated'],
      docsUrl: null,
      createdAt: new Date('2023-06-01T00:00:00Z'),
      updatedAt: new Date('2024-02-01T00:00:00Z'),
    },
  ];

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
    if (!component) {
      throw new NotFoundException(`Component with id ${id} not found`);
    }
    return component;
  }

  findByCategory(categoryId: string): Component[] {
    return this.components.filter((c) => c.categoryId === categoryId);
  }

  update(id: string, updateComponentDto: UpdateComponentDto): Component {
    const index = this.components.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new NotFoundException(`Component with id ${id} not found`);
    }

    this.components[index] = {
      ...this.components[index],
      ...updateComponentDto,
      updatedAt: new Date(),
    };

    return this.components[index];
  }

  remove(id: string): void {
    const index = this.components.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new NotFoundException(`Component with id ${id} not found`);
    }
    this.components.splice(index, 1);
  }
}
