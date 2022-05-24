declare module '@/interfaces/user' {
	type UserRole = 'cashier' | 'manager' | 'admin';

	interface User {
		id: string;
		email: string;
		password: string;
		role: UserRole;
	}

	type UserInput = Omit<User, 'id'>;
	type UserResult = Omit<User, 'password'>;
}

export {};
