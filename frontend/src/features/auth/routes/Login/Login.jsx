import { Link } from 'react-router-dom';
// import styles from './login.module.css';
import styles from '../auth-form.module.css';
import { useAuth } from '../AuthProvider';
import { useState } from 'react';
import { login as loginAPI } from '../../api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login: loginClient } = useAuth();

  async function handleLogin(event) {
    event.preventDefault();

    const loginResult = await loginAPI(email, password);
    if (!loginResult.success) {
      return loginResult.error;
    }

    return loginClient(email);
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
        <input type="email" name="email" id="email" onChange={handleChangeEmail} />
      </div>
      <div className={styles.inputContainer}>
        <label className={styles.label} htmlFor="password">
          Password:
        </label>
        <input type="password" name="password" id="password" onChange={handleChangePassword} />
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
