export enum UserRole {
  ADMIN = 'admin',
  CONTRIBUTOR = 'contributor',
  VIEWER = 'viewer',
}

export class User {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}
