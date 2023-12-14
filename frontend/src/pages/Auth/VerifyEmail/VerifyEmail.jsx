import { Form, redirect, useSearchParams } from 'react-router-dom';
// import styles from './verify-email.module.css';
import styles from '../auth-form.module.css';

export async function action({ request }) {
  if (request.method === 'PATCH') {
    const formData = await request.formData();
    const code = formData.get('code');

    const res = await fetch('http://localhost:8000/api/v1/auth/verify-email', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: code }),
    });

    if (!res.ok) {
      return await res.json();
    }
    return redirect('/login');
  } else {
    const url = new URL(request.url);
    const email = url.searchParams.get('email');
    const res = await fetch(
      'http://localhost:8000/api/v1/auth/verify-email/resend',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      }
    );

    if (!res.ok) {
      return await res.json();
    }
    return true;
  }
}

export default function VerifyEmail() {
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <>
      <Form method="patch" className={styles.authForm}>
        <p className={styles.message}>
          We sent an email verification code to {searchParams.get('email')}.
        </p>
        <p className={styles.message}>Please enter the code below.</p>
        <div className={styles.inputContainer}>
          <label htmlFor="code">Verification code:</label>
          <input type="text" name="code" id="code" />
        </div>
        <div className={styles.buttonContainer}>
          <button className={styles.confirmButton}>Verify</button>
        </div>
      </Form>
      <Form method="post">
        <div className={styles.resendButtonContainer}>
          <button className={styles.confirmButton}>
            Resend verification code
          </button>
        </div>
      </Form>
    </>
  );
}
