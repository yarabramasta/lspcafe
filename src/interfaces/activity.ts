import { UserResult, UserRole } from '@/interfaces/user';

declare module '@/interfaces/activity' {
	interface Activity {
		id: string;
		user_id: string;
		action: string;
		created_at: string;
		user?: UserResult;
	}

	interface ActivityJoinResult extends Omit<Activity, 'user'> {
		user_email: string;
		user_role: UserRole;
	}

	type ActivityInput = Pick<Activity, 'user_id' | 'action'>;
	type ActivityResult = Omit<Activity, 'user_id'>;
}

export {};
