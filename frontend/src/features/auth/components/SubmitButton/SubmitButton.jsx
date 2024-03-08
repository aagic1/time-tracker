import { useNavigation, useSubmit } from 'react-router-dom';
import { useFormikContext } from 'formik';

import styles from '../../routes/auth-form.module.css';

export default function SubmitButton({
  action,
  method,
  defaultText,
  submittingText,
  ignoreValidation = false,
  className,
}) {
  const navigation = useNavigation();
  const submit = useSubmit();
  const { setFieldValue, submitForm, values } = useFormikContext();
  const type = ignoreValidation ? 'button' : 'submit';

  // render disabled button while submitting
  if (navigation.state === 'submitting' && navigation.formData.get('action') === action) {
    return (
      <button type={type} className={`${className} ${styles.submitting}`}>
        {submittingText}
      </button>
    );
  }

  return (
    <button
      type={type}
      className={className}
      onClick={() => {
        // submit form directly to react router action without validating
        if (ignoreValidation === true) {
          return submit({ ...values, method, action }, { method });
        }

        setFieldValue('action', action);
        setFieldValue('method', method);
        submitForm();
      }}
    >
      {defaultText}
    </button>
  );
}
