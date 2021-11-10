import { useState, useEffect } from 'react';
import moment from 'moment-timezone';

const useCountDown = (start: number) => {
  const [running, setRunning] = useState(true);
  const [counter, setCounter] = useState(moment.duration(start, 'milliseconds'));

  useEffect(() => {
    if (
      counter.days() <= 0 &&
      counter.hours() <= 0 &&
      counter.minutes() <= 0 &&
      counter.seconds() <= 0
    ) {
      setRunning(false);
      return;
    }

    setTimeout(() => {
      setCounter(moment.duration(counter.asMilliseconds() - 1000, 'milliseconds'));
    }, 1000);
  }, [counter]);

  return running ? counter : false;
};

export default useCountDown;
