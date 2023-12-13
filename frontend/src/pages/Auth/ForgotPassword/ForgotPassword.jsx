import { Form } from 'react-router-dom';
// import styles from './forgot-password.module.css';
import styles from '../auth-form.module.css';

export default function ForgotPassword() {
  return (
    <Form className={styles.authForm}>
      <p className={styles.message}>
        Please provide the email adress that you used when you registered up for
        your account.
      </p>
      <div className={styles.inputContainer}>
        <label htmlFor="email">Email:</label>
        <input type="text" name="email" id="email" />
      </div>
      <div className={styles.buttonContainer}>
        <button className={styles.confirmButton}>Confirm</button>
      </div>
    </Form>
  );
}
