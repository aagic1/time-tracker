async function login(email, password) {
  const response = await fetch('http://localhost:8000/api/v1/auth/login', {
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

export { login };
