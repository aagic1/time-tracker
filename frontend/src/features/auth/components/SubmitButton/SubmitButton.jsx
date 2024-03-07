import { useNavigation } from 'react-router-dom';

import styles from '../../routes/auth-form.module.css';

export default function SubmitButton({
  defaultText,
  submittingText,
  method,
  onClick,
  type = 'submit',
  className,
}) {
  const navigation = useNavigation();

  if (navigation.state === 'submitting' && method === navigation.formMethod) {
    return (
      <button type={type} onClick={onClick} className={`${className} ${styles.submitting}`}>
        {submittingText}
      </button>
    );
  } else {
    return (
      <button type={type} onClick={onClick} className={className}>
        {defaultText}
      </button>
    );
  }
}
