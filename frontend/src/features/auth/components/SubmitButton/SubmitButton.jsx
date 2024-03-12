import { useNavigation, useSubmit } from 'react-router-dom';
import { useFormikContext } from 'formik';

import styles from '../../routes/auth-form.module.css';

export default function SubmitButton({
  intent,
  method,
  defaultText,
  submittingText,
  ignoreValidation = false,
  fetcher,
  className,
}) {
  const navigation = useNavigation();
  const submit = useSubmit();
  const { setFieldValue, values } = useFormikContext();
  const type = ignoreValidation ? 'button' : 'submit';

  // render disabled button while submitting
  if (
    (navigation.state === 'submitting' && navigation.formData.get('intent') === intent) ||
    (fetcher?.state === 'submitting' && fetcher?.formData.get('intent') === intent)
  ) {
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
        // submit form directly to react router intent without validating
        if (ignoreValidation === true) {
          if (fetcher) {
            return fetcher.submit({ ...values, method, intent: intent }, { method });
          }
          return submit({ ...values, method, intent: intent }, { method });
        }

        setFieldValue('intent', intent);
        setFieldValue('method', method);
      }}
    >
      {defaultText}
    </button>
  );
}
