import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateExampleDto } from './dto/create-example.dto';
import { UpdateExampleDto } from './dto/update-example.dto';
import { Example, ExampleFramework } from './entities/example.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class ExamplesService {
  private examples: Example[] = [
    // ── shibui-button examples ──────────────────────────────────────────────
    {
      id: 'ex-0001-0000-0000-000000000001',
      componentId: 'cmp-0001-0000-0000-000000000001',
      title: 'Basic usage',
      description: 'Default button with primary variant.',
      code: `<shibui-button variant="primary">Click me</shibui-button>`,
      framework: ExampleFramework.VANILLA,
      order: 0,
      isDefault: true,
      createdAt: new Date('2024-01-10T00:00:00Z'),
      updatedAt: new Date('2024-01-10T00:00:00Z'),
    },
    {
      id: 'ex-0002-0000-0000-000000000002',
      componentId: 'cmp-0001-0000-0000-000000000001',
      title: 'All variants',
      description:
        'Button supports primary, secondary, ghost and danger variants.',
      code: `<shibui-button variant="primary">Primary</shibui-button>
<shibui-button variant="secondary">Secondary</shibui-button>
<shibui-button variant="ghost">Ghost</shibui-button>
<shibui-button variant="danger">Danger</shibui-button>`,
      framework: ExampleFramework.VANILLA,
      order: 1,
      isDefault: false,
      createdAt: new Date('2024-01-10T00:00:00Z'),
      updatedAt: new Date('2024-01-10T00:00:00Z'),
    },
    {
      id: 'ex-0003-0000-0000-000000000003',
      componentId: 'cmp-0001-0000-0000-000000000001',
      title: 'Usage in Angular',
      description:
        'Binding click events and disabled state in an Angular component.',
      code: `<!-- template -->
<shibui-button
  variant="primary"
  [disabled]="isLoading"
  (click)="handleSubmit()">
  {{ isLoading ? 'Saving...' : 'Save' }}
</shibui-button>`,
      framework: ExampleFramework.ANGULAR,
      order: 2,
      isDefault: false,
      createdAt: new Date('2024-02-01T00:00:00Z'),
      updatedAt: new Date('2024-02-01T00:00:00Z'),
    },
    // ── shibui-input examples ───────────────────────────────────────────────
    {
      id: 'ex-0004-0000-0000-000000000004',
      componentId: 'cmp-0002-0000-0000-000000000002',
      title: 'Basic usage',
      description: 'Simple text input with a label.',
      code: `<shibui-input
  label="Email address"
  type="email"
  placeholder="you@example.com">
</shibui-input>`,
      framework: ExampleFramework.VANILLA,
      order: 0,
      isDefault: true,
      createdAt: new Date('2024-01-15T00:00:00Z'),
      updatedAt: new Date('2024-01-15T00:00:00Z'),
    },
    {
      id: 'ex-0005-0000-0000-000000000005',
      componentId: 'cmp-0002-0000-0000-000000000002',
      title: 'Error state',
      description: 'Displaying validation errors using the error attribute.',
      code: `<shibui-input
  label="Username"
  value="ab"
  error="Username must be at least 3 characters long.">
</shibui-input>`,
      framework: ExampleFramework.VANILLA,
      order: 1,
      isDefault: false,
      createdAt: new Date('2024-01-15T00:00:00Z'),
      updatedAt: new Date('2024-01-15T00:00:00Z'),
    },
    {
      id: 'ex-0006-0000-0000-000000000006',
      componentId: 'cmp-0002-0000-0000-000000000002',
      title: 'Reactive forms in Angular',
      description: 'Integrating shibui-input with Angular reactive forms.',
      code: `// component.ts
form = this.fb.group({
  email: ['', [Validators.required, Validators.email]],
});

get emailError() {
  const ctrl = this.form.get('email');
  if (ctrl?.hasError('required')) return 'Email is required.';
  if (ctrl?.hasError('email')) return 'Enter a valid email address.';
  return null;
}

<!-- template -->
<shibui-input
  label="Email"
  type="email"
  [value]="form.get('email')?.value"
  [error]="emailError"
  (shib-change)="form.get('email')?.setValue($event.detail)">
</shibui-input>`,
      framework: ExampleFramework.ANGULAR,
      order: 2,
      isDefault: false,
      createdAt: new Date('2024-02-10T00:00:00Z'),
      updatedAt: new Date('2024-02-10T00:00:00Z'),
    },
    // ── shibui-toast examples ───────────────────────────────────────────────
    {
      id: 'ex-0007-0000-0000-000000000007',
      componentId: 'cmp-0004-0000-0000-000000000004',
      title: 'Trigger a toast',
      description: 'Dispatching a custom event to show a toast notification.',
      code: `document.dispatchEvent(new CustomEvent('shibui-toast', {
  detail: {
    message: 'Changes saved successfully.',
    variant: 'success',
    duration: 4000,
  },
}));`,
      framework: ExampleFramework.VANILLA,
      order: 0,
      isDefault: true,
      createdAt: new Date('2024-03-01T00:00:00Z'),
      updatedAt: new Date('2024-03-01T00:00:00Z'),
    },
    // ── shibui-badge examples ───────────────────────────────────────────────
    {
      id: 'ex-0008-0000-0000-000000000008',
      componentId: 'cmp-0007-0000-0000-000000000007',
      title: 'Semantic variants',
      description: 'All available color variants for communicating status.',
      code: `<shibui-badge variant="neutral">Draft</shibui-badge>
<shibui-badge variant="info">In review</shibui-badge>
<shibui-badge variant="success">Published</shibui-badge>
<shibui-badge variant="warning">Needs changes</shibui-badge>
<shibui-badge variant="danger">Rejected</shibui-badge>`,
      framework: ExampleFramework.VANILLA,
      order: 0,
      isDefault: true,
      createdAt: new Date('2024-01-05T00:00:00Z'),
      updatedAt: new Date('2024-01-05T00:00:00Z'),
    },
  ];

  create(createExampleDto: CreateExampleDto): Example {
    const example: Example = {
      id: randomUUID(),
      componentId: createExampleDto.componentId,
      title: createExampleDto.title,
      description: createExampleDto.description ?? null,
      code: createExampleDto.code,
      framework: createExampleDto.framework,
      order: createExampleDto.order,
      isDefault: createExampleDto.isDefault ?? false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.examples.push(example);
    return example;
  }

  findAll(): Example[] {
    return this.examples;
  }

  findByComponent(componentId: string): Example[] {
    return this.examples
      .filter((e) => e.componentId === componentId)
      .sort((a, b) => a.order - b.order);
  }

  findOne(id: string): Example {
    const example = this.examples.find((e) => e.id === id);
    if (!example) {
      throw new NotFoundException(`Example with id ${id} not found`);
    }
    return example;
  }

  update(id: string, updateExampleDto: UpdateExampleDto): Example {
    const index = this.examples.findIndex((e) => e.id === id);
    if (index === -1) {
      throw new NotFoundException(`Example with id ${id} not found`);
    }

    this.examples[index] = {
      ...this.examples[index],
      ...updateExampleDto,
      updatedAt: new Date(),
    };

    return this.examples[index];
  }

  remove(id: string): void {
    const index = this.examples.findIndex((e) => e.id === id);
    if (index === -1) {
      throw new NotFoundException(`Example with id ${id} not found`);
    }
    this.examples.splice(index, 1);
  }
}
