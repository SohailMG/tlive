import { useEffect, useRef, useState } from "react";

export function useInterval(callback, delay, once, dependencies) {
  const savedCallback = useRef();
  const [countdown, setCountdown] = useState(delay / 1000);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
      resetCountdown();
    }
    tick(); // Call the function on initial load
    if (delay !== null && !once) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay, once, dependencies]);

  // Decrement the countdown every second
  useEffect(() => {
    if (countdown > 0) {
      const id = setInterval(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearInterval(id);
    }
  }, [countdown]);

  // Reset the countdown to the original delay value
  function resetCountdown() {
    setCountdown(delay / 1000);
  }

  return [countdown, resetCountdown];
}
