import { IPostgresInterval } from 'postgres-interval';

export type ActivityRecord = {
  recordId: bigint;
  comment: string | null;
  startedAt: Date;
  stoppedAt: Date | null;
  activityId: bigint;
  activityName: string;
  color: string;
  dayGoal: IPostgresInterval | null;
  sessionGoal: IPostgresInterval | null;
};

export type Statistics = {
  totalTime: number;
  hasActive: boolean;
  records: ActivityRecord[];
};
