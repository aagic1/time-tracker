import { useEffect, useState } from 'react';
import { useNavigation } from 'react-router-dom';

function useDelayedLoadingIndicator(delay = 100) {
  const navigation = useNavigation();
  const [delayedLoading, setDelayedLoading] = useState(false);

  useEffect(() => {
    let timeoutId;
    if (navigation.state === 'loading') {
      timeoutId = setTimeout(() => {
        setDelayedLoading(true);
      }, delay);
    } else if (navigation.state === 'idle') {
      setDelayedLoading(false);
    }

    return () => clearTimeout(timeoutId);
  }, [navigation.state, delay]);

  return delayedLoading && navigation.state === 'loading';
}

export { useDelayedLoadingIndicator };
