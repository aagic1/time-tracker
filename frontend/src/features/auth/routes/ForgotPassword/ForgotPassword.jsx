import { redirect, useNavigate, useSubmit } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';

import styles from '../auth-form.module.css';
import { forgotPassword as forgotPasswordAPI } from '../../api';
import { ForgotPasswordSchema, validateForm } from '../../utils/validation';
import SubmitButton from '../../components/SubmitButton/SubmitButton';

export default function ForgotPassword() {
  const submit = useSubmit();
  const navigate = useNavigate();

  function handleCancel() {
    navigate('/login');
  }

  return (
    <Formik
      initialValues={{ email: '' }}
      validate={(values) => validateForm(values, ForgotPasswordSchema)}
      onSubmit={(values) => submit(values, { method: 'post' })}
    >
      <Form method="post" className={styles.authForm}>
        <p className={styles.message}>
          Please provide the email adress that you used when you registered your account.
        </p>
        <div className={styles.inputContainer}>
          <label htmlFor="email">Email:</label>
          <Field type="text" name="email" />
          <ErrorMessage name="email" component="div" className={styles.errorMessage} />
        </div>
        <div className={styles.buttonContainer}>
          <SubmitButton
            defaultText="Submit"
            submittingText="Submitting..."
            method="post"
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
  const email = formData.get('email');

  const forgotPasswordResult = await forgotPasswordAPI(email);

  if (!forgotPasswordResult.success) {
    return forgotPasswordResult.error;
  }
  return redirect(`../forgot-password-confirmation?email=${email}`);
}
