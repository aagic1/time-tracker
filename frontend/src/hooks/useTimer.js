import { useEffect, useState } from 'react';

export default function useTimer(startedAt) {
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const now = new Date();
    const ms = now.getMilliseconds();
    const timeout = 1000 - ms;
    let intervalId;
    const timeoutId = setTimeout(() => {
      setTimer(Date.now() - startedAt.valueOf());
      intervalId = setInterval(() => {
        setTimer(Date.now() - startedAt.valueOf());
      }, 1000);
    }, timeout);
    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, []);

  return timer;
}
