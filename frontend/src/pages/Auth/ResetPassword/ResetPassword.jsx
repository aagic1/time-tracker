import { Form } from 'react-router-dom';
// import styles from './reset-password.module.css';
import styles from '../auth-form.module.css';

export default function ResetPassword() {
  return (
    <Form className={styles.authForm}>
      <p className={styles.message}>Please enter your new password below.</p>
      <div className={styles.inputContainer}>
        <label htmlFor="password">New password:</label>
        <input type="password" name="password" id="password" />
      </div>
      <div className={styles.inputContainer}>
        <label htmlFor="passwordRepeat">Repeat new password:</label>
        <input type="password" name="passwordRepeat" id="passwordRepeat" />
      </div>
      <div className={styles.buttonContainer}>
        <button className={styles.confirmButton}>Reset password</button>
      </div>
    </Form>
  );
}
