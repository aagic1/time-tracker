import { Link, useRouteError } from 'react-router-dom';

import styles from './error-element.module.css';

export function ErrorElement() {
  const error = useRouteError();

  let errorElement;
  if (typeof error === 'string') {
    errorElement = <div>{error}</div>;
  } else if (error instanceof Error) {
    errorElement = <div>{error.message}</div>;
  }

  return (
    <div>
      <div className={styles.errorHeader}>ERROR</div>
      {errorElement}
      <br></br>
      <Link to="/activities">Home Page</Link>
    </div>
  );
}
