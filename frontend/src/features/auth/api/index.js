const BASE_URL = import.meta.env.VITE_API_URL;

async function login(email, password) {
  const response = await fetch(BASE_URL + '/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
    credentials: 'include',
  });
  const data = await response.json();
  return { response, data };
}

async function register(email, password) {
  const response = await fetch(BASE_URL + '/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();

  return { response, data };
}

async function verifyEmail(email, code) {
  const response = await fetch(BASE_URL + '/auth/verify-email', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code, email }),
  });
  const data = await response.json();
  return { response, data };
}

async function resendVerificationCode(email) {
  const response = await fetch(BASE_URL + '/auth/verify-email/resend', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });
  const data = await response.json();
  return { response, data };
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

async function verifyPasswordRecoveryCode(email, code) {
  const response = await fetch('http://localhost:8000/api/v1/auth/forgot-password/code', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, code }),
  });

  if (!response.ok) {
    return { success: false, error: await response.json() };
  }
  return { success: true, data: await response.json() };
}

async function resendPasswordRecoveryCode(email) {
  const response = await fetch('http://localhost:8000/api/v1/auth/forgot-password/initiate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });
  if (!response.ok) {
    return { success: false, error: await response.json() };
  }

  return { success: true, data: await response.json() };
}

export {
  login,
  register,
  verifyEmail,
  resendVerificationCode,
  forgotPassword,
  verifyPasswordRecoveryCode,
  resendPasswordRecoveryCode,
};
