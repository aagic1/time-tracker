import { Form, Link } from 'react-router-dom';
import styles from './login.module.css';

export default function Login() {
  return (
    <Form className={styles.loginForm}>
      <div className={styles.inputContainer}>
        <label className={styles.label} htmlFor="email">
          Email:
        </label>
        <input type="email" name="email" id="email" />
      </div>
      <div className={styles.inputContainer}>
        <label className={styles.label} htmlFor="password">
          Password:
        </label>
        <input type="password" name="password" id="password" />
        <Link to="../forgot-password" className={styles.forgotPassword}>
          Forgot password?
        </Link>
      </div>
      <div className={styles.buttonContainer}>
        <button className={styles.loginButton}>Log in</button>
      </div>
    </Form>
  );
}
