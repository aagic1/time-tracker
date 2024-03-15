async function getGoalData() {
  const response = await fetch(
    `http://localhost:8000/api/v1/records/goals?timezoneOffset=${new Date().getTimezoneOffset()}`,
    {
      credentials: 'include',
    }
  );
  const data = await response.json();
  return { response, data };
}

export { getGoalData };
