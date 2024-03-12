import { useSubmit, useSearchParams, useNavigate, useActionData, Navigate } from 'react-router-dom';
import { Form, Field, ErrorMessage, Formik } from 'formik';
import toast from 'react-hot-toast';

import styles from '../auth-form.module.css';
import { resendVerificationCode, verifyEmail } from '../../api';
import { EmailVerificationSchema, validateForm } from '../../utils/validation';
import SubmitButton from '../../components/SubmitButton/SubmitButton';

export function VerifyEmail() {
  const submit = useSubmit();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const actionData = useActionData();

  function handleCancel() {
    navigate('/login');
  }

  // redirect if no email is supplied as search param
  if (!searchParams.get('email')) {
    return <Navigate to="/login" replace={true} />;
  }

  // redirect after successful verification or if already verified
  if (actionData?.success || actionData?.status === 409) {
    return <Navigate to="/login" replace={true} />;
  }

  return (
    <Formik
      initialValues={{ code: '' }}
      validate={(values) => validateForm(values, EmailVerificationSchema)}
      onSubmit={(values) => {
        submit(values, { method: values.method });
      }}
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
            defaultText="Verify"
            submittingText="Verifying..."
            method="patch"
            intent="verify"
            className={styles.confirmButton}
          />
          <SubmitButton
            defaultText="Resend verification code"
            submittingText="Sending..."
            method="post"
            intent="resend"
            ignoreValidation
            className={styles.confirmButton}
          />
          <button type="button" onClick={handleCancel} className={styles.confirmButton}>
            Cancel
          </button>
        </div>
      </Form>
    </Formik>
  );
}

export async function verifyEmailAction({ request }) {
  const email = new URL(request.url).searchParams.get('email');

  if (request.method === 'PATCH') {
    const formData = await request.formData();
    const code = formData.get('code');
    const { response, data } = await verifyEmail(email, code);
    if (!response.ok) {
      toast.error(data.error.message, { id: 'verify-error' });
      return { success: false, status: response.status };
    }
    toast.success('Account verified successfully', { id: 'verify-success' });
    return { success: true, data };
  } else {
    const { response, data } = await resendVerificationCode(email);
    if (!response.ok) {
      toast.error(data.error.message, { id: 'resend-verification-error' });
      return { success: false, status: response.status };
    }
    toast.success('Verification code sent successfully', {
      id: 'resend-verification-success',
    });
    return { success: true, data };
  }
}
