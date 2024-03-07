import { useSubmit, useSearchParams, useNavigate, useActionData, Navigate } from 'react-router-dom';
import { Form, Field, ErrorMessage, Formik } from 'formik';
import toast, { Toaster } from 'react-hot-toast';

import styles from '../auth-form.module.css';
import { resendVerificationCode, verifyEmail } from '../../api';
import { EmailVerificationSchema, validateForm } from '../../utils/validation';
import SubmitButton from '../../components/SubmitButton/SubmitButton';

export default function VerifyEmail() {
  const submit = useSubmit();
  const navigate = useNavigate();
  const actionData = useActionData();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');

  function handleResend() {
    const formData = new FormData();
    formData.append('email', email);
    submit(formData, { method: 'POST' });
  }

  function handleCancel() {
    navigate('/login');
  }

  // navigate to login page after successfull email verification
  if (actionData && actionData.success && actionData.type === 'verification') {
    return (
      <Navigate to="/login" replace={true} state={{ from: 'verify-email', result: 'success' }} />
    );
  }

  return (
    <Formik
      initialValues={{ code: '' }}
      validate={(values) => validateForm(values, EmailVerificationSchema)}
      onSubmit={(values) => submit(values, { method: 'PATCH' })}
    >
      <Form>
        <p className={styles.message}>An account verification code has been sent to {email}.</p>
        <p className={styles.message}>Please enter the code below.</p>
        <div className={styles.inputContainer}>
          <label htmlFor="code">Verification code:</label>
          <Field type="text" name="code" id="code" />
          <ErrorMessage name="code" component="div" className={styles.errorMessage} />
        </div>
        <div className={styles.buttonContainer}>
          <SubmitButton
            className={styles.confirmButton}
            defaultText={'Verify'}
            submittingText={'Verifying...'}
            method="patch"
          />
          <SubmitButton
            className={styles.confirmButton}
            defaultText={'Resend verification code'}
            submittingText={'Sending...'}
            method="post"
            onClick={handleResend}
            type="button"
          />
          <button type="button" onClick={handleCancel} className={styles.confirmButton}>
            Cancel
          </button>
        </div>
        <Toaster />
      </Form>
    </Formik>
  );
}

export async function action({ request }) {
  const url = new URL(request.url);
  const email = url.searchParams.get('email');

  if (request.method === 'PATCH') {
    const formData = await request.formData();
    const code = formData.get('code');

    const response = await verifyEmail(email, code);
    if (!response.ok) {
      const error = await response.json();
      return toast.error(error);
    }
    return { success: true, type: 'verification' };
  } else {
    const response = await resendVerificationCode(email);

    if (!response.ok) {
      const error = await response.json();
      return toast.error(error);
    }
    return toast.success('Verification code sent successfully');
  }
}
