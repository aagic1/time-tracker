export class FakeRecord {
  constructor(activity) {
    this.recordId = `fake-${activity.name}`;
    this.startedAt = new Date().toISOString();
    this.stoppedAt = null;
    this.activityId = activity.id;
    this.activityName = activity.name;
    this.color = activity.color.slice(1);
    this.sessionGoal = activity.sessionGoal;
    this.dayGoal = activity.dayGoal;
    this.weekGoal = activity.weekGoal;
    this.monthGoal = activity.monthGoal;
    this.comment = null;
    this.fake = true;
  }
}
