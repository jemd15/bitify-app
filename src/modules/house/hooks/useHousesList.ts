import { useQuery } from '@tanstack/react-query';
import { useAuthSession } from '@modules/auth/hooks/useAuthSession';

import { HouseRepository } from '../repositories/HouseRepository';
import { RQKEY_HOUSES_LIST } from '../constants/house.constants';
import type { House } from '../types/house.types';

const houseRepository = new HouseRepository();

export const useHousesList = () => {
  const { data: session } = useAuthSession();

  return useQuery<House[]>({
    queryKey: RQKEY_HOUSES_LIST,
    queryFn: async () => {
      if (!session?.user?.id) {
        return [];
      }

      return await houseRepository.findByOwnerId(session.user.id);
    },
    enabled: !!session?.user?.id,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};
