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
    return { success: false, error: (await response.json()).error };
  }
  return { success: true, data: await response.json() };
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
    return { success: false, status: response.status, error: (await response.json()).error };
  }
  return { success: true, status: response.status, data: await response.json() };
}

async function verifyEmail(email, code) {
  return await fetch('http://localhost:8000/api/v1/auth/verify-email', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code, email }),
  });
}

async function resendVerificationCode(email) {
  return await fetch('http://localhost:8000/api/v1/auth/verify-email/resend', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });
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
    return { success: false, error: (await response.json()).error };
  }
  return { success: true, data: await response.json() };
}

async function verifyPasswordRecoveryCode(code) {
  const response = await fetch('http://localhost:8000/api/v1/auth/forgot-password/code', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token: code }),
  });

  if (!response.ok) {
    return { success: false, error: (await response.json()).error };
  }
  return { success: true, data: await response.json() };
}

export {
  login,
  register,
  forgotPassword,
  verifyPasswordRecoveryCode,
  verifyEmail,
  resendVerificationCode,
};
