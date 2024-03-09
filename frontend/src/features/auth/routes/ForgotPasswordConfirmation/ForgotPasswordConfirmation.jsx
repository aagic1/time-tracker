import { Navigate, useActionData, useNavigate, useSearchParams, useSubmit } from 'react-router-dom';
import { Form, Formik, Field, ErrorMessage } from 'formik';
import toast from 'react-hot-toast';

import styles from '../auth-form.module.css';
import { resendPasswordRecoveryCode, verifyPasswordRecoveryCode } from '../../api';
import { validateForm, ForgotPasswordConfirmationSchema } from '../../utils/validation';
import SubmitButton from '../../components/SubmitButton/SubmitButton';
import { useState } from 'react';

export default function ForgotPasswordConfirmation() {
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
  if (actionData?.status === 'Success' && actionData.action === 'verify') {
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
            action="verify"
            method="post"
            defaultText="Verify"
            submittingText="Verifiying..."
            className={styles.confirmButton}
          />
          <SubmitButton
            action="resend"
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

export async function action({ request }) {
  const formData = await request.formData();
  const action = formData.get('action');
  const email = new URL(request.url).searchParams.get('email');

  if (action === 'verify') {
    const code = formData.get('code');
    const verifyResult = await verifyPasswordRecoveryCode(email, code);
    if (!verifyResult.success) {
      toast.error(verifyResult.error, { id: 'verify-error' });
      return { status: 'Failure', action, message: verifyResult.error };
    }
    toast.success(verifyResult.data, { id: 'verify-success' });
    return { status: 'Success', action, message: verifyResult.data };
  } else if (action === 'resend') {
    const resendResult = await resendPasswordRecoveryCode(email);
    if (resendResult.success) {
      toast.success(resendResult.data, { id: 'resend-success' });
      return { status: 'Success', action, message: resendResult.data };
    }
    toast.success(resendResult.error, { id: 'resend-error' });
    return { status: 'Failure', action, message: resendResult.error };
  } else {
    return null;
  }
}
