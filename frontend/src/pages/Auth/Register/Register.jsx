import { Form } from 'react-router-dom';
// import styles from './register.module.css';
import styles from '../auth-form.module.css';

export default function Register() {
  return (
    <Form className={styles.authForm}>
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
