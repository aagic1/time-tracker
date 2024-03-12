import { useLocation, useNavigate, Navigate, useFetcher } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import toast from 'react-hot-toast';

import styles from '../auth-form.module.css';
import { validateForm, ResetPasswordSchema } from '../../utils/validation';
import SubmitButton from '../../components/SubmitButton/SubmitButton';
import { resetPassword } from '../../api';

export function ResetPassword() {
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const location = useLocation();

  const actionData = fetcher.data;
  const code = location.state?.code;
  const email = location.state?.email;

  // redirect if data is missing
  if (code == null || email == null) {
    return <Navigate to="/forgot-password" replace={true} />;
  }

  // redirect if reset successfully
  if (actionData?.success) {
    return <Navigate to="/login" replace={true} />;
  }

  function handleCancel() {
    return navigate('/login', { replace: true });
  }

  return (
    <Formik
      initialValues={{ password: '', passwordRepeat: '' }}
      validate={(values) => validateForm(values, ResetPasswordSchema)}
      onSubmit={(values) => fetcher.submit({ ...values, code, email }, { method: values.method })}
    >
      <Form className={styles.authForm}>
        <p className={styles.message}>Please enter your new password below.</p>
        <div className={styles.inputContainer}>
          <label htmlFor="password">New password:</label>
          <Field type="password" name="password" />
          <ErrorMessage name="password" component="div" className={styles.errorMessage} />
        </div>
        <div className={styles.inputContainer}>
          <label htmlFor="passwordRepeat">Repeat password:</label>
          <Field type="password" name="passwordRepeat" />
          <ErrorMessage name="passwordRepeat" component="div" className={styles.errorMessage} />
        </div>
        <div className={styles.buttonContainer}>
          <SubmitButton
            intent="reset"
            defaultText="Reset password"
            submittingText="Submitting..."
            method="patch"
            fetcher={fetcher}
            className={styles.confirmButton}
          />
          <button type="button" className={styles.confirmButton} onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </Form>
    </Formik>
  );
}

export async function resetPasswordAction({ request }) {
  const formData = await request.formData();
  const password = formData.get('password');
  const code = formData.get('code');
  const email = formData.get('email');

  const { response, data } = await resetPassword(password, email, code);

  if (!response.ok) {
    toast.error('Failed to reset password. ' + data.error.message);
    return { success: false, error: data.error };
  }
  toast.success('Reset password successfully');
  return { success: true, data };
}
