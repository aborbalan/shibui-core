import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class CategoriesService {
  private categories: Category[] = [
    {
      id: 'cat-0001-0000-0000-000000000000',
      name: 'Inputs & Forms',
      slug: 'inputs-forms',
      description:
        'Text fields, buttons, selects, checkboxes and all form-related components.',
      icon: 'form',
      order: 0,
      createdAt: new Date('2024-01-01T00:00:00Z'),
      updatedAt: new Date('2024-01-01T00:00:00Z'),
    },
    {
      id: 'cat-0002-0000-0000-000000000000',
      name: 'Navigation',
      slug: 'navigation',
      description:
        'Menus, tabs, breadcrumbs, steppers and components that help users move through the UI.',
      icon: 'navigation',
      order: 1,
      createdAt: new Date('2024-01-01T00:00:00Z'),
      updatedAt: new Date('2024-01-01T00:00:00Z'),
    },
    {
      id: 'cat-0003-0000-0000-000000000000',
      name: 'Feedback',
      slug: 'feedback',
      description:
        'Alerts, modals, toasts, progress bars and components that communicate state to the user.',
      icon: 'bell',
      order: 2,
      createdAt: new Date('2024-01-01T00:00:00Z'),
      updatedAt: new Date('2024-01-01T00:00:00Z'),
    },
    {
      id: 'cat-0004-0000-0000-000000000000',
      name: 'Layout',
      slug: 'layout',
      description:
        'Cards, panels, accordions, grids and structural components.',
      icon: 'layout',
      order: 3,
      createdAt: new Date('2024-01-01T00:00:00Z'),
      updatedAt: new Date('2024-01-01T00:00:00Z'),
    },
    {
      id: 'cat-0005-0000-0000-000000000000',
      name: 'Data Display',
      slug: 'data-display',
      description:
        'Tables, badges, avatars, timelines and components focused on presenting information.',
      icon: 'table',
      order: 4,
      createdAt: new Date('2024-01-01T00:00:00Z'),
      updatedAt: new Date('2024-01-01T00:00:00Z'),
    },
    {
      id: 'cat-0006-0000-0000-000000000000',
      name: 'Visual Effects',
      slug: 'visual-effects',
      description:
        'Animations, parallax, ripples and components focused on motion and visual enhancement.',
      icon: 'sparkles',
      order: 5,
      createdAt: new Date('2024-01-01T00:00:00Z'),
      updatedAt: new Date('2024-01-01T00:00:00Z'),
    },
  ];

  create(createCategoryDto: CreateCategoryDto): Category {
    const existing = this.categories.find(
      (c) => c.slug === createCategoryDto.slug,
    );
    if (existing) {
      throw new ConflictException(
        `Category with slug "${createCategoryDto.slug}" already exists`,
      );
    }
    const category: Category = {
      id: randomUUID(),
      name: createCategoryDto.name,
      slug: createCategoryDto.slug,
      description: createCategoryDto.description ?? null,
      icon: createCategoryDto.icon ?? null,
      order: createCategoryDto.order,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.categories.push(category);
    return category;
  }

  findAll(): Category[] {
    return [...this.categories].sort((a, b) => a.order - b.order);
  }

  findOne(id: string): Category {
    const category = this.categories.find((c) => c.id === id);
    if (!category)
      throw new NotFoundException(`Category with id ${id} not found`);
    return category;
  }

  update(id: string, updateCategoryDto: UpdateCategoryDto): Category {
    const index = this.categories.findIndex((c) => c.id === id);
    if (index === -1)
      throw new NotFoundException(`Category with id ${id} not found`);
    this.categories[index] = {
      ...this.categories[index],
      ...updateCategoryDto,
      updatedAt: new Date(),
    };
    return this.categories[index];
  }

  remove(id: string): void {
    const index = this.categories.findIndex((c) => c.id === id);
    if (index === -1)
      throw new NotFoundException(`Category with id ${id} not found`);
    this.categories.splice(index, 1);
  }
}
