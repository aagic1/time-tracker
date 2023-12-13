import { Form } from 'react-router-dom';
// import styles from './forgot-password-confirmation.module.css';
import styles from '../auth-form.module.css';

export default function ForgotPasswordConfirmation() {
  return (
    <Form className={styles.authForm}>
      <p className={styles.message}>
        We have sent a code to "email@email.com".
      </p>
      <p className={styles.message}>Please enter the code below.</p>
      <div className={styles.inputContainer}>
        <label htmlFor="code">Code:</label>
        <input type="text" name="code" id="code" />
      </div>
      <div className={styles.buttonContainer}>
        <button className={styles.confirmButton}>Confirm</button>
      </div>
      <div className={styles.resendButtonContainer}>
        <button className={styles.confirmButton}>Resend code</button>
      </div>
    </Form>
  );
}
