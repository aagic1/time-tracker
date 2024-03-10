import { redirect, useNavigation, useSubmit } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { ZodError, z } from 'zod';
import toast from 'react-hot-toast';
// import styles from './register.module.css';
import styles from '../auth-form.module.css';
import { register as registerAPI } from '../../api';

export async function registerAction({ request }) {
  const formData = await request.formData();
  const email = formData.get('email');
  const password = formData.get('password');

  const registerResult = await registerAPI(email, password);
  if (registerResult.success) {
    return redirect(`/verify-email?email=${email}`);
  }

  if (registerResult.status === 409) {
    toast.error('This email is already taken');
  }
  return registerResult;
}

const ValidationSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must have at least 8 characters'),
    passwordRepeat: z.string(),
  })
  .refine(({ password, passwordRepeat }) => passwordRepeat === password, {
    path: ['passwordRepeat'],
    message: 'Passwords do not match',
  });

function validateForm(values) {
  try {
    ValidationSchema.parse(values);
  } catch (error) {
    if (error instanceof ZodError) {
      return error.formErrors.fieldErrors;
    }
  }
}

export function Register() {
  const navigation = useNavigation();
  const submit = useSubmit();

  return (
    <Formik
      initialValues={{ email: '', password: '', passwordRepeat: '' }}
      validate={validateForm}
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
