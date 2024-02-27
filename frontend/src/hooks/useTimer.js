import { useEffect, useState } from 'react';

// hook that starts a stopwatch and measures the elapsed time while keeping
// ticking seconds in sync
export default function useTimer(startedAt) {
  const [timer, setTimer] = useState(new Date() - startedAt);
  const startEpoch = startedAt.valueOf();

  // synchronize seconds and start measuring time
  useEffect(() => {
    let intervalStopwatchID;
    const timeoutSyncSeconds = 1000 - new Date().getMilliseconds();
    const timeoutSyncSecondsID = setTimeout(() => {
      intervalStopwatchID = setInterval(() => {
        setTimer(Date.now() - startEpoch);
      }, 1000);

      setTimer(Date.now() - startEpoch);
    }, timeoutSyncSeconds);

    return () => {
      clearTimeout(timeoutSyncSecondsID);
      clearInterval(intervalStopwatchID);
    };
  }, [startEpoch]);

  return timer;
}
