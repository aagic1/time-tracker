import { Link, redirect, useActionData, useSubmit } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Formik, Form, Field, ErrorMessage } from 'formik';

import styles from '../auth-form.module.css';
import { useAuth } from '../AuthProvider';
import { login as loginAPI, resendVerificationCode } from '../../api';
import { LoginSchema, validateForm } from '../../utils/validation';
import SubmitButton from '../../components/SubmitButton/SubmitButton';

export default function Login() {
  const actionData = useActionData();
  const auth = useAuth();
  const submit = useSubmit();

  // client-side login after successful authentication
  if (actionData?.success) {
    auth.login(actionData.email);
  }

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validate={(values) => validateForm(values, LoginSchema)}
      onSubmit={(values) => submit(values, { method: values.method })}
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
          <Link to="../forgot-password" className={styles.forgotPassword}>
            Forgot password?
          </Link>
        </div>
        <div className={styles.buttonContainer}>
          <SubmitButton
            defaultText="Log in"
            submittingText="Logging in..."
            method="post"
            action="login"
            className={styles.confirmButton}
          />
        </div>
      </Form>
    </Formik>
  );
}

export async function action({ request }) {
  const formData = await request.formData();
  const email = formData.get('email');
  const password = formData.get('password');

  const loginResult = await loginAPI(email, password);
  if (loginResult.status === 401) {
    resendVerificationCode(email);
    toast('Please verify your email');
    return redirect(`/verify-email?email=${email}`);
  } else if (!loginResult.success) {
    toast.error('Wrong email or password');
  }
  return { ...loginResult, email };
}
