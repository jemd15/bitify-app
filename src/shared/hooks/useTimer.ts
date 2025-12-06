import * as React from 'react';

export function useTimer(time: number, handler: () => void) {
  const timer = React.useRef<undefined | ReturnType<typeof setTimeout>>(undefined);
  const reset = React.useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(handler, time);
  }, [time, timer, handler]);
  const cancel = React.useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = undefined;
    }
  }, [timer]);

  React.useEffect(() => {
    reset();
  }, []);

  return [reset, cancel] as const;
}
