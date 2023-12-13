import { Form, redirect } from 'react-router-dom';
// import styles from './forgot-password.module.css';
import styles from '../auth-form.module.css';

export async function action({ request }) {
  const formData = await request.formData();
  const email = formData.get('email');
  const response = await fetch(
    'http://localhost:8000/api/v1/auth/forgot-password',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email }),
    }
  );
  if (response.status !== 200) {
    return await response.json();
  }
  return redirect(`../forgot-password-confirmation?email=${email}`);
}

export default function ForgotPassword() {
  return (
    <Form method="post" className={styles.authForm}>
      <p className={styles.message}>
        Please provide the email adress that you used when you registered up for
        your account.
      </p>
      <div className={styles.inputContainer}>
        <label htmlFor="email">Email:</label>
        <input type="text" name="email" id="email" />
      </div>
      <div className={styles.buttonContainer}>
        <button type="submit" className={styles.confirmButton}>
          Confirm
        </button>
      </div>
    </Form>
  );
}
