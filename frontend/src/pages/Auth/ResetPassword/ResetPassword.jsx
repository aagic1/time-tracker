import { Form, useLocation, useNavigate, Navigate } from 'react-router-dom';
// import styles from './reset-password.module.css';
import styles from '../auth-form.module.css';
import { useEffect, useState } from 'react';

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const location = useLocation();
  const token = location.state?.token;
  const navigate = useNavigate();

  async function handleResetPassword() {
    const token = location.state.token;
    const res = await fetch(
      'http://localhost:8000/api/v1/auth/forgot-password/password',
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      }
    );
    if (!res.ok) {
      return await res.json();
      // obradi sve ove slučajeve kad neki podaci fale, npr ako nema ovog tokena u location.state
    } else {
      console.log('reset password failed');
      return navigate(`/login`);
    }
  }

  if (token == null) {
    return <Navigate to="/forgot-password" />;
  }

  return (
    <Form method="PATCH" className={styles.authForm}>
      <p className={styles.message}>Please enter your new password below.</p>
      <div className={styles.inputContainer}>
        <label htmlFor="password">New password:</label>
        <input
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          type="password"
          name="password"
          id="password"
        />
      </div>
      <div className={styles.buttonContainer}>
        <button
          type="button"
          onClick={handleResetPassword}
          className={styles.confirmButton}
        >
          Reset password
        </button>
        <button
          type="button"
          className={styles.confirmButton}
          onClick={() => navigate('/login')}
        >
          Cancel
        </button>
      </div>
    </Form>
  );
}
