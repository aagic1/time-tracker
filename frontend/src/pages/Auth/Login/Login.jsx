import { Link, useNavigate } from 'react-router-dom';
// import styles from './login.module.css';
import styles from '../auth-form.module.css';
import { useAuth } from '../AuthProvider';
import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  async function handleLogin(event) {
    event.preventDefault();
    const res = await fetch('http://localhost:8000/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });

    if (!res.ok) {
      console.log(res);
      return await res.json();
    }

    return login(email);
  }

  function handleChangeEmail(event) {
    setEmail(event.target.value);
  }
  function handleChangePassword(event) {
    setPassword(event.target.value);
  }

  return (
    <form className={styles.authForm} method="POST" onSubmit={handleLogin}>
      <div className={styles.inputContainer}>
        <label className={styles.label} htmlFor="email">
          Email:
        </label>
        <input
          type="email"
          name="email"
          id="email"
          onChange={handleChangeEmail}
        />
      </div>
      <div className={styles.inputContainer}>
        <label className={styles.label} htmlFor="password">
          Password:
        </label>
        <input
          type="password"
          name="password"
          id="password"
          onChange={handleChangePassword}
        />
        <Link to="../forgot-password" className={styles.forgotPassword}>
          Forgot password?
        </Link>
      </div>
      <div className={styles.buttonContainer}>
        <button className={styles.confirmButton}>Log in</button>
      </div>
    </form>
  );
}
