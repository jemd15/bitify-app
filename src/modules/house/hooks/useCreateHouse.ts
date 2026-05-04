import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthSession } from '@modules/auth/hooks/useAuthSession';
import { UserLimitsRepositoryImpl } from '@shared/repositories/UserLimitsRepository';
import { ERROR_CODES } from '@shared/constants/errors.constants';

import { HouseService } from '../services/HouseService';
import { HouseRepository } from '../repositories/HouseRepository';
import { HouseCoordinator } from '../coordinator/HouseCoordinator';
import { RQKEY_HOUSES_LIST } from '../constants/house.constants';
import type { CreateHouseInput } from '../domain/validators/createHouse.validator';

const houseService = new HouseService(
  new HouseRepository(),
  new UserLimitsRepositoryImpl(),
);

export const useCreateHouse = () => {
  const { data: session } = useAuthSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateHouseInput) => {
      if (!session?.user?.id) {
        throw new Error(ERROR_CODES.AUTH.SESSION_EXPIRED);
      }

      return await houseService.createHouse(session.user.id, input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RQKEY_HOUSES_LIST });
      HouseCoordinator.navigateToHome();
    },
    onError: () => {},
  });
};
