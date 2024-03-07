import { useEffect } from 'react';
import {
  Link,
  useActionData,
  useLocation,
  useNavigate,
  useNavigation,
  useSubmit,
} from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { Formik, Form, Field, ErrorMessage } from 'formik';

import styles from '../auth-form.module.css';
import { useAuth } from '../AuthProvider';
import { login as loginAPI } from '../../api';
import { LoginSchema, validateForm } from '../../utils/validation';

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const actionData = useActionData();
  const auth = useAuth();
  const submit = useSubmit();

  useSuccessfulVerificationToast(navigate, location);
  useWrongCredentialsToast(actionData);
  useLogin(actionData, auth);

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validate={(values) => validateForm(values, LoginSchema)}
      onSubmit={(values) => submit(values, { method: 'post' })}
    >
      <Form>
        <Toaster />
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
            className={styles.confirmButton}
          />
        </div>
      </Form>
    </Formik>
  );
}

function SubmitButton({
  defaultText,
  submittingText,
  method,
  onClick,
  type = 'submit',
  className,
}) {
  const navigation = useNavigation();

  if (navigation.state === 'submitting' && method === navigation.formMethod) {
    return (
      <button type={type} onClick={onClick} className={`${className} ${styles.submitting}`}>
        {submittingText}
      </button>
    );
  } else {
    return (
      <button type={type} onClick={onClick} className={className}>
        {defaultText}
      </button>
    );
  }
}

export async function action({ request }) {
  const formData = await request.formData();
  const email = formData.get('email');
  const password = formData.get('password');

  const loginResult = await loginAPI(email, password);
  return { ...loginResult, email };
}

function useSuccessfulVerificationToast(navigate, location) {
  useEffect(() => {
    if (location.state?.from === 'verify-email' && location.state?.result === 'success') {
      toast.success('Verified account successfully', { id: 'successful verification' });
      navigate('/login', { replace: true });
    }
    return () => toast.remove('successful verification');
  }, [location, navigate]);
}

function useWrongCredentialsToast(actionData) {
  useEffect(() => {
    if (!actionData) {
      return;
    }
    if (!actionData.success) {
      toast.error('Wrong email or password');
    }

    return () => toast.remove('wrong credentials');
  }, [actionData]);
}

function useLogin(actionData, auth) {
  useEffect(() => {
    if (!actionData) {
      return;
    }
    if (actionData.success) {
      auth.login(actionData.email);
    }
  }, [actionData, auth]);
}
