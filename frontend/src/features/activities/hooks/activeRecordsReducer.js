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
      const fakeIndex = draft.findIndex(
        (record) =>
          record.fake && record.recordId.includes('fake') && record.activityId === action.activityId
      );
      if (fakeIndex === -1) {
        break;
      }
      draft[fakeIndex] = { ...draft[fakeIndex], fake: undefined, recordId: action.recordId };
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
