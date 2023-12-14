import { Form, redirect, useActionData } from 'react-router-dom';
// import styles from './register.module.css';
import styles from '../auth-form.module.css';

export async function action({ request }) {
  const formData = await request.formData();
  const email = formData.get('email');
  const password = formData.get('password');
  const repeatPassword = formData.get('repeatPassword');

  const res = await fetch('http://localhost:8000/api/v1/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    return await res.json();
  }
  return redirect('../verify-email');
}

export default function Register() {
  const actionData = useActionData();
  console.log(actionData);

  return (
    <Form method="post" className={styles.authForm}>
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
      </div>
      <div className={styles.inputContainer}>
        <label className={styles.label} htmlFor="repeatPassword">
          Repeat password:
        </label>
        <input type="password" name="repeatPassword" id="repeatPassword" />
      </div>
      <div className={styles.buttonContainer}>
        <button className={styles.confirmButton}>Register</button>
      </div>
    </Form>
  );
}
