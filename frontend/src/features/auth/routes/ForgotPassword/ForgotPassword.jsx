import { Form, redirect, useNavigate } from 'react-router-dom';
// import styles from './forgot-password.module.css';
import styles from '../auth-form.module.css';
import { forgotPassword as forgotPasswordAPI } from '../../api';

export async function action({ request }) {
  const formData = await request.formData();
  const email = formData.get('email');

  const forgotPasswordResult = await forgotPasswordAPI(email);

  if (!forgotPasswordResult.succes) {
    return forgotPasswordResult.error;
  }
  return redirect(`../forgot-password-confirmation?email=${email}`);
}

export default function ForgotPassword() {
  const navigate = useNavigate();

  return (
    <Form method="post" className={styles.authForm}>
      <p className={styles.message}>
        Please provide the email adress that you used when you registered up for your account.
      </p>
      <div className={styles.inputContainer}>
        <label htmlFor="email">Email:</label>
        <input type="text" name="email" id="email" />
      </div>
      <div className={styles.buttonContainer}>
        <button type="submit" className={styles.confirmButton}>
          Confirm
        </button>
        <button type="button" className={styles.confirmButton} onClick={() => navigate('/login')}>
          Cancel
        </button>
      </div>
    </Form>
  );
}
