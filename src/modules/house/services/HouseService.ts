import { DomainError } from '@shared/errors/DomainError';
import { ERROR_CODES } from '@shared/constants/errors.constants';
import {
  transformZodError,
  transformSupabaseError,
} from '@shared/utils/errorTransformers';
import { ZodError } from 'zod';
import type { UserLimitsRepository } from '@shared/repositories/UserLimitsRepository';

import type { HouseRepository } from '../repositories/HouseRepository';
import { createHouseSchema } from '../domain/validators/createHouse.validator';
import type { House, CreateHouseParams } from '../types/house.types';

export class HouseService {
  constructor(
    private houseRepository: HouseRepository,
    private userLimitsRepository: UserLimitsRepository,
  ) {}

  async getUserProfile(ownerId: string) {
    const { supabase } = await import('@lib/supabase');
    const { data, error } = await supabase
      .from('users')
      .select('user_type')
      .eq('id', ownerId)
      .single();

    if (error || !data) {
      throw new DomainError(ERROR_CODES.GENERIC.UNKNOWN_ERROR);
    }

    return { userType: data.user_type };
  }

  async createHouse(ownerId: string, input: unknown): Promise<House> {
    try {
      const validatedInput = createHouseSchema.parse(input);
      const user = await this.getUserProfile(ownerId);
      const limits = await this.userLimitsRepository.findByUserType(user.userType);
      const currentHousesCount = await this.houseRepository.countByOwnerId(ownerId);

      if (currentHousesCount >= limits.maxHouses) {
        throw new DomainError(ERROR_CODES.HOUSE.MAX_HOUSES_REACHED);
      }

      const params: CreateHouseParams = {
        ...validatedInput,
        ownerId,
        pointsExpirationType:
          validatedInput.pointsExpirationType as CreateHouseParams['pointsExpirationType'],
      };

      return await this.houseRepository.create(params);
    } catch (error) {
      if (error instanceof DomainError) {
        throw error;
      }
      if (error instanceof ZodError) {
        throw transformZodError(error);
      }
      throw transformSupabaseError(error as Error);
    }
  }
}
