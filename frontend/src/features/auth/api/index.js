const BASE_URL = 'http://localhost:8000/api/v1';

async function login(email, password) {
  const response = await fetch(BASE_URL + '/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
    credentials: 'include',
  });

  if (!response.ok) {
    return { success: false, error: await response.json() };
  }
  return { succes: true, data: await response.json() };
}

async function register(email, password) {
  const response = await fetch(BASE_URL + '/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    return { succes: false, error: await response.json() };
  }
  return { succes: true, data: await response.json() };
}

async function forgotPassword(email) {
  const response = await fetch(BASE_URL + '/auth/forgot-password/initiate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    return { succes: false, error: await response.json() };
  }
  return { succes: true, data: await response.json() };
}

export { login, register, forgotPassword };
