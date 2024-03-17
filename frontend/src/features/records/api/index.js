async function getRecords(queryString) {
  const response = await fetch(`http://localhost:8000/api/v1/records?${queryString}`, {
    method: 'GET',
    credentials: 'include',
  });
  const data = await response.json();
  return { response, data };
}

export { getRecords };
