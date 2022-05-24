import { UserResult } from '@/interfaces/user';

declare module '@/interfaces/activity' {
	interface Activity {
		id: string;
		user_id: string;
		action: string;
		created_at: string;
		user?: UserResult;
	}

	type ActivityInput = Pick<Activity, 'user_id' | 'action'>;
	type ActivityResult = Omit<Activity, 'user_id'>;
}

export {};
