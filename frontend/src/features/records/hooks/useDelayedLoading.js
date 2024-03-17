import { useEffect, useState } from 'react';
import { useNavigation } from 'react-router-dom';

function useDelayedLoadingIndicator(delay = 100) {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let timeoutId;
    if (navigation.state === 'loading') {
      timeoutId = setTimeout(() => {
        setLoading(true);
      }, delay);
    } else if (navigation.state === 'idle') {
      setLoading(false);
    }

    return () => clearTimeout(timeoutId);
  }, [navigation.state, delay]);

  return loading;
}

export { useDelayedLoadingIndicator };
