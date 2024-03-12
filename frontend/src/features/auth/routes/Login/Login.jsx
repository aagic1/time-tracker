import { Link, redirect, useActionData, useSubmit } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Formik, Form, Field, ErrorMessage } from 'formik';

import styles from '../auth-form.module.css';
import { useAuth } from '../AuthProvider';
import { login as loginAPI, resendVerificationCode } from '../../api';
import { LoginSchema, validateForm } from '../../utils/validation';
import SubmitButton from '../../components/SubmitButton/SubmitButton';
import { useEffect } from 'react';

export function Login() {
  const actionData = useActionData();
  const auth = useAuth();
  const submit = useSubmit();

  // client side login if successfully logged in server side
  useEffect(() => {
    if (actionData?.success) {
      auth.login(actionData.email);
    }
  }, [actionData, auth]);

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
            intent="login"
            className={styles.confirmButton}
          />
        </div>
      </Form>
    </Formik>
  );
}

export async function loginAction({ request }) {
  const formData = await request.formData();
  const email = formData.get('email');
  const password = formData.get('password');

  const { response, data } = await loginAPI(email, password);
  if (response.status === 401) {
    resendVerificationCode(email);
    toast('Please verify your email', { id: 'verify-email-message' });
    return redirect(`/verify-email?email=${email}`);
  } else if (!response.ok) {
    toast.error('Wrong email or password');
    return { success: false, error: data.error };
  }
  return { success: true, data };
}
