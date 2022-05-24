import { UserResult, UserRole } from '../user';

import ActivityRepo, { schema } from './activity_repo';

declare module '@/entities/activity' {
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

const activityRepo = new ActivityRepo();
const ActivitySchema = schema;

export { activityRepo, ActivitySchema };
