import { Form, Link, redirect } from 'react-router-dom';
// import styles from './login.module.css';
import styles from '../auth-form.module.css';

export async function action({ request }) {
  const formData = await request.formData();
  const email = formData.get('email');
  const password = formData.get('password');

  const res = await fetch('http://localhost:8000/api/v1/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
    credentials: 'include',
  });

  if (!res.ok) {
    return await res.json();
  }

  return redirect('/');
}

export default function Login() {
  return (
    <Form method="POST" className={styles.authForm}>
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
        <button className={styles.confirmButton}>Log in</button>
      </div>
    </Form>
  );
}
