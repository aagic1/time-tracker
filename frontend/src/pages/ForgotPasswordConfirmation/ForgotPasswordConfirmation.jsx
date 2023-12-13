import { Form } from 'react-router-dom';
import styles from './forgot-password-confirmation.module.css';

export default function ForgotPasswordConfirmation() {
  return (
    <Form className={styles.authForm}>
      <p>We have sent a code to "email@email.com".</p>
      <p>Please enter the code below.</p>
      <div className={styles.authInputContainer}>
        <label htmlFor="code">Code</label>
        <input type="text" name="code" id="code" />
      </div>
      <div className={styles.authButtonContainer}>
        <button className={styles.confirmButton}>Confirm</button>
      </div>
      <div className={styles.resendButtonContainer}>
        <button className={styles.confirmButton}>Resend code</button>
      </div>
    </Form>
  );
}
