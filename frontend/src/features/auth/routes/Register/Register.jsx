import { redirect, useNavigation, useSubmit } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import toast from 'react-hot-toast';
import styles from '../auth-form.module.css';
import { register as registerAPI } from '../../api';
import { validateForm, RegisterSchema } from '../../utils/validation';

export function Register() {
  const navigation = useNavigation();
  const submit = useSubmit();

  return (
    <Formik
      initialValues={{ email: '', password: '', passwordRepeat: '' }}
      validate={(values) => validateForm(values, RegisterSchema)}
      onSubmit={(values) => {
        submit(values, { method: 'post' });
      }}
    >
      <Form>
        <div className={styles.inputContainer}>
          <label className={styles.label} htmlFor="email">
            Email:
          </label>
          <Field type="email" name="email" id="email" />
          <ErrorMessage name="email" component="div" className={styles.errorMessage} />
        </div>
        <div className={styles.inputContainer}>
          <label className={styles.label} htmlFor="password">
            Password:
          </label>
          <Field type="password" name="password" id="password" />
          <ErrorMessage name="password" component="div" className={styles.errorMessage} />
        </div>
        <div className={styles.inputContainer}>
          <label className={styles.label} htmlFor="repeatPassword">
            Repeat password:
          </label>
          <Field type="password" name="passwordRepeat" id="passwordRepeat" />
          <ErrorMessage name="passwordRepeat" component="div" className={styles.errorMessage} />
        </div>
        <div className={styles.buttonContainer}>
          {navigation.state === 'submitting' ? (
            <button className={`${styles.confirmButton} ${styles.submitting}`}>
              Submitting...
            </button>
          ) : (
            <button className={styles.confirmButton}>Register</button>
          )}
        </div>
      </Form>
    </Formik>
  );
}

export async function registerAction({ request }) {
  const formData = await request.formData();
  const email = formData.get('email');
  const password = formData.get('password');

  const { response, data } = await registerAPI(email, password);
  if (response.ok) {
    return redirect(`/verify-email?email=${email}`);
  }

  if (response.status === 409) {
    toast.error('This email is already taken', { id: 'register-error' });
  } else {
    toast.error(data.error.message, { id: 'register-error' });
  }
  return { success: false, error: data.error };
}
