const BASE_URL = import.meta.env.VITE_API_URL;

async function getRecords(queryString) {
  const response = await fetch(BASE_URL + `/records?${queryString}`, {
    method: 'GET',
    credentials: 'include',
  });
  const data = await response.json();
  return { response, data };
}

async function getRecord(recordId) {
  const response = await fetch(BASE_URL + `/records/${recordId}`, {
    credentials: 'include',
  });
  const data = await response.json();
  return { response, data };
}

async function createRecord({ activityId, startedAt, stoppedAt }) {
  const response = await fetch(BASE_URL + '/records', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      activityId,
      startedAt,
      stoppedAt,
    }),
  });

  const data = await response.json();
  return { response, data };
}

async function updateRecord(recordId, body) {
  const response = await fetch(BASE_URL + `/records/${recordId}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  return { response, data };
}

async function stopRecord(recordId, stoppedAt) {
  const response = await fetch(BASE_URL + `/records/${recordId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      stoppedAt: stoppedAt.toISOString(),
    }),
  });
  const data = await response.json();
  return { response, data };
}
async function getActiveRecords() {
  const response = await fetch(BASE_URL + '/records?active=true', {
    method: 'GET',
    credentials: 'include',
  });
  const data = await response.json();
  return { response, data };
}

async function deleteRecord(recordId) {
  const response = await fetch(BASE_URL + `/records/${recordId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  return { response, data: null };
}

export {
  getRecords,
  getRecord,
  getActiveRecords,
  createRecord,
  updateRecord,
  stopRecord,
  deleteRecord,
};
