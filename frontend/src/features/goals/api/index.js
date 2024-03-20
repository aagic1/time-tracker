const BASE_URL = import.meta.env.VITE_API_URL;

async function getGoalData() {
  const response = await fetch(
    BASE_URL + `/records/goals?timezoneOffset=${new Date().getTimezoneOffset()}`,
    {
      credentials: 'include',
    }
  );
  const data = await response.json();
  return { response, data };
}

export { getGoalData };
