const BASE_URL = import.meta.env.VITE_API_URL;

async function getStatistics(timezoneOffset, filters) {
  let queryString = `?timezoneOffset=${timezoneOffset}`;
  if (filters?.from) {
    queryString += `&from=${filters.from.toISOString()}`;
  }
  if (filters.to) {
    queryString += `&to=${filters.to.toISOString()}`;
  }
  if (filters?.activityIds) {
    filters.activityIds.forEach((id) => (queryString += `&activityId=${id}`));
  }

  const response = await fetch(BASE_URL + '/records/statistics' + queryString, {
    credentials: 'include',
    method: 'GET',
  });
  const data = await response.json();
  return { response, data };
}

export { getStatistics };
