import { useNavigation } from 'react-router-dom';
import { useFormikContext } from 'formik';

import styles from '../../routes/auth-form.module.css';

export default function SubmitButton({
  type = 'submit',
  action,
  method,
  defaultText,
  submittingText,
  className,
}) {
  const navigation = useNavigation();
  const { setFieldValue, submitForm } = useFormikContext();

  // render disabled button while submitting
  if (navigation.state === 'submitting' && navigation.formData.get('action') === action) {
    return <button className={`${className} ${styles.submitting}`}>{submittingText}</button>;
  }

  return (
    <button
      type={type}
      className={className}
      onClick={() => {
        if (action != null) {
          setFieldValue('action', action);
        }
        if (method != null) {
          setFieldValue('method', method);
        }
        submitForm();
      }}
    >
      {defaultText}
    </button>
  );
}
