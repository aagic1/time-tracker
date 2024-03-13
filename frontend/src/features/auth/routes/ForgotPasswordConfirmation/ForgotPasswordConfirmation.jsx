import { Navigate, useActionData, useNavigate, useSearchParams, useSubmit } from 'react-router-dom';
import { Form, Formik, Field, ErrorMessage } from 'formik';
import toast from 'react-hot-toast';

import styles from '../auth-form.module.css';
import { resendPasswordRecoveryCode, verifyPasswordRecoveryCode } from '../../api';
import { validateForm, ForgotPasswordConfirmationSchema } from '../../utils/validation';
import { SubmitButton } from '../../components/SubmitButton';
import { useState } from 'react';

export function ForgotPasswordConfirmation() {
  const actionData = useActionData();
  const submit = useSubmit();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [code, setCode] = useState('');
  const email = searchParams.get('email');

  // if email is not supplied in query string, redirect
  if (email == null) {
    return <Navigate to="/forgot-password" />;
  }

  // if successfully verified => redirect
  if (actionData?.success && actionData.intent === 'verify') {
    return <Navigate to="/reset-password" replace={true} state={{ code, email }} />;
  }

  function handleCancel() {
    navigate('/login', { replace: true });
  }

  return (
    <Formik
      initialValues={{ code: '' }}
      validate={(values) => validateForm(values, ForgotPasswordConfirmationSchema)}
      onSubmit={(values) => {
        setCode(values.code);
        submit(values, { method: values.method });
      }}
    >
      <Form method="POST" className={styles.authForm}>
        <p className={styles.message}>A password recovery code has been sent to {email}.</p>
        <p className={styles.message}>Please enter the code below.</p>
        <div className={styles.inputContainer}>
          <label htmlFor="code">Code:</label>
          <Field type="text" name="code" />
          <ErrorMessage name="code" component="div" className={styles.errorMessage} />
        </div>
        <div className={styles.buttonContainer}>
          <SubmitButton
            intent="verify"
            method="post"
            defaultText="Verify"
            submittingText="Verifiying..."
            className={styles.confirmButton}
          />
          <SubmitButton
            intent="resend"
            method="post"
            defaultText="Resend code"
            submittingText="Sending..."
            ignoreValidation
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

export async function forgotPasswordConfirmationAction({ request }) {
  const formData = await request.formData();
  const intent = formData.get('intent');
  const email = new URL(request.url).searchParams.get('email');

  if (intent === 'verify') {
    const code = formData.get('code');
    const { response, data } = await verifyPasswordRecoveryCode(email, code);
    if (!response.ok) {
      return toast.error(data.error.message, { id: 'verify-error' });
    }
    toast.success(data, { id: 'verify-success' });
    return { success: true, intent };
  } else if (intent === 'resend') {
    const { response, data } = await resendPasswordRecoveryCode(email);
    if (!response.ok) {
      return toast.error(data.error.message, { id: 'resend-error' });
    }
    toast.success(data, { id: 'resend-success' });
    return { success: true, intent };
  } else {
    return null;
  }
}
