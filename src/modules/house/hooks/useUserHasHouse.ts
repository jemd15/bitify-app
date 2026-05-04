import { useMemo } from 'react';
import { useHousesList } from '../hooks/useHousesList';

export const useUserHasHouse = () => {
  const { data: houses, isLoading: isLoadingHouses } = useHousesList();

  const hasHouse = useMemo(() => {
    if (isLoadingHouses) {
      return undefined;
    }

    return (houses?.length ?? 0) > 0;
  }, [houses, isLoadingHouses]);

  return {
    hasHouse,
    isLoading: isLoadingHouses,
  };
};
