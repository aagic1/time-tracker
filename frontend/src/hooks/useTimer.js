import { useEffect, useState } from 'react';

export default function useTimer(startedAt) {
  const [timer, setTimer] = useState(() => {
    return new Date() - startedAt;
  });
  const startEpoch = startedAt.valueOf();

  useEffect(() => {
    setTimer(Date.now() - startEpoch);
    const now = new Date();
    const ms = now.getMilliseconds();
    const timeout = 1000 - ms;
    let intervalID;
    const timeoutID = setTimeout(() => {
      setTimer(Date.now() - startEpoch);
      intervalID = setInterval(() => {
        setTimer(Date.now() - startEpoch);
      }, 1000);
    }, timeout);
    return () => {
      clearTimeout(timeoutID);
      clearInterval(intervalID);
    };
  }, [startEpoch]);

  return timer;
}
