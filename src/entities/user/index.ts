import UserRepo, { schema } from './user_repo';

declare module '@/entities/user' {
  type UserRole = 'cashier' | 'manager' | 'admin';

  interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    role: UserRole;
  }

  type UserInput = Omit<User, 'id'>;
  type UserResult = Omit<User, 'password'>;
}

const userRepo = new UserRepo();
const UserSchema = schema;

export { userRepo, UserSchema };
