import { useEffect, useState } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

export function useAppState(): AppStateStatus {
  const [state, setState] = useState<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    const sub = AppState.addEventListener('change', nextAppState => {
      setState(nextAppState);
    });

    return () => sub.remove();
  }, []);

  return state;
}
