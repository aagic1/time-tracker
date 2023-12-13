import { Form } from 'react-router-dom';
import styles from './verify-email.module.css';

export default function VerifyEmail() {
  return (
    <Form>
      <p>We sent an email verification code to "email"</p>
      <p>Please enter the code below.</p>
      <div className={styles.inputContainer}>
        <label htmlFor="code">Verification code</label>
        <input type="text" name="code" id="code" />
      </div>
      <div className={styles.buttonContainer}>
        <button className={styles.confirmButton}>Verify</button>
      </div>
      <div className={styles.resendButtonContainer}>
        <button className={styles.confirmButton}>
          Resend verification code
        </button>
      </div>
    </Form>
  );
}
