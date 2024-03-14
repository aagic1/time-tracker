export function activeRecordsReducer(draft, action) {
  switch (action.type) {
    case 'createFake':
      draft.push(action.fakeRecord);
      break;
    case 'deleteFake': {
      return draft.filter(
        (record) => !record.recordId.includes('fake') && record.activityId !== action.activityId
      );
    }
    case 'swapFakeWithReal': {
      const fake = draft.find(
        (record) => record.recordId.includes('fake') && record.activityId === action.activityId
      );
      fake.recordId = action.recordId;
      delete fake.fake;
      break;
    }
    case 'stopRecord': {
      return draft.filter((record) => record.recordId !== action.recordId);
    }
    case 'restoreStoppedRecord':
      draft.push(action.stoppedRecord);
      break;
  }
}
