export function activitiesReducer(activities, action) {
  switch (action.type) {
    case 'setLoading': {
      const deepCopy = structuredClone(activities);
      return deepCopy.map((activity) =>
        activity.id === action.activityId ? { ...activity, loading: true } : activity
      );
    }
    case 'setNotLoading': {
      const deepCopy = structuredClone(activities);
      return deepCopy.map((activity) =>
        activity.id === action.activityId ? { ...activity, loading: false } : activity
      );
    }
    case 'restore': {
      const deepCopy = structuredClone(activities);
      return deepCopy.map((activity) =>
        activity.id === action.activityId
          ? { ...activity, archived: false, loading: false }
          : activity
      );
    }
    case 'delete': {
      const deepCopy = structuredClone(activities);
      return deepCopy.filter((activity) => activity.id !== action.activityId);
    }
  }
}
