import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserRole } from './entities/user.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class UsersService {
  private users: User[] = [
    {
      id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      email: 'admin@shibui.dev',
      name: 'Shibui Admin',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
      role: UserRole.ADMIN,
      createdAt: new Date('2024-01-01T00:00:00Z'),
      updatedAt: new Date('2024-01-01T00:00:00Z'),
    },
    {
      id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
      email: 'contributor@shibui.dev',
      name: 'Ana García',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ana',
      role: UserRole.CONTRIBUTOR,
      createdAt: new Date('2024-02-15T10:30:00Z'),
      updatedAt: new Date('2024-03-20T14:00:00Z'),
    },
    {
      id: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
      email: 'viewer@shibui.dev',
      name: 'Carlos López',
      avatarUrl: null,
      role: UserRole.VIEWER,
      createdAt: new Date('2024-03-01T09:00:00Z'),
      updatedAt: new Date('2024-03-01T09:00:00Z'),
    },
  ];

  create(createUserDto: CreateUserDto): User {
    const existing = this.users.find((u) => u.email === createUserDto.email);
    if (existing) {
      throw new ConflictException(
        `User with email ${createUserDto.email} already exists`,
      );
    }

    const user: User = {
      id: randomUUID(),
      email: createUserDto.email,
      name: createUserDto.name,
      avatarUrl: createUserDto.avatarUrl ?? null,
      role: createUserDto.role,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.push(user);
    return user;
  }

  findAll(): User[] {
    return this.users;
  }

  findOne(id: string): User {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  update(id: string, updateUserDto: UpdateUserDto): User {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    this.users[index] = {
      ...this.users[index],
      ...updateUserDto,
      updatedAt: new Date(),
    };

    return this.users[index];
  }

  remove(id: string): void {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    this.users.splice(index, 1);
  }
}
