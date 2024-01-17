import {
  Form,
  Navigate,
  useActionData,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
// import styles from './forgot-password-confirmation.module.css';
import styles from '../auth-form.module.css';

export async function action({ request }) {
  const formData = await request.formData();
  const type = formData.get('intent');

  if (type == 'confirm') {
    const token = formData.get('code');

    const res = await fetch(
      'http://localhost:8000/api/v1/auth/forgot-password/code',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      }
    );
    return await res.json();
  } else if (type == 'resend') {
    const url = new URL(request.url);
    const email = url.searchParams.get('email');

    const res = await fetch(
      'http://localhost:8000/api/v1/auth/forgot-password/initiate',
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
    console.log('hi3');
    return 'email sent successfully';
  }
}

export default function ForgotPasswordConfirmation() {
  const actionData = useActionData();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  console.log('hi');

  if (email == null) {
    console.log('hi2');
    return <Navigate to="/forgot-password" />;
  }

  return (
    <>
      {actionData && actionData.status === 'Success' && (
        <Navigate to="/reset-password" state={{ token: actionData.token }} />
      )}
      <Form method="POST" className={styles.authForm}>
        <p className={styles.message}>We have sent a code to {email}.</p>
        <p className={styles.message}>Please enter the code below.</p>
        <div className={styles.inputContainer}>
          <label htmlFor="code">Code:</label>
          <input type="text" name="code" id="code" />
        </div>
        <div className={styles.buttonContainer}>
          <button
            type="submit"
            name="intent"
            value="confirm"
            className={styles.confirmButton}
          >
            Confirm
          </button>
          <button
            type="submit"
            name="intent"
            value="resend"
            className={styles.confirmButton}
          >
            Resend code
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
    </>
  );
}
