import { Form, redirect, useNavigation } from 'react-router-dom';
// import styles from './register.module.css';
import styles from '../auth-form.module.css';
import { register as registerAPI } from '../../api';

export async function action({ request }) {
  const formData = await request.formData();
  const email = formData.get('email');
  const password = formData.get('password');
  // check if passwords match before sending request to server
  // const repeatPassword = formData.get('repeatPassword');

  const registerResult = await registerAPI(email, password);
  if (registerResult.success) {
    console.log('hheee');
    return redirect(`/verify-email?email=${email}`);
  }

  return registerResult;
}

export default function Register() {
  const navigation = useNavigation();

  return (
    <Form method="post" className={styles.authForm}>
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
        {navigation.state === 'submitting' ? (
          <button className={`${styles.confirmButton} ${styles.submitting}`}>Submitting...</button>
        ) : (
          <button className={styles.confirmButton}>Register</button>
        )}
      </div>
    </Form>
  );
}
