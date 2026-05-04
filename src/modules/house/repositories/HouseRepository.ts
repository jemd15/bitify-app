import { supabase } from '@lib/supabase';
import { transformSupabaseError } from '@shared/utils/errorTransformers';
import { DomainError } from '@shared/errors/DomainError';
import { ERROR_CODES } from '@shared/constants/errors.constants';

import { HOUSE_DB_CONSTANTS, HOUSE_DB_FIELDS } from '../constants/house.constants';
import type { HouseRepository as IHouseRepository } from '../domain/repositories/HouseRepository.interface';
import type { House, CreateHouseParams } from '../types/house.types';

export class HouseRepository implements IHouseRepository {
  private mapHouseFromDb(data: any): House {
    return {
      id: data[HOUSE_DB_FIELDS.ID],
      name: data[HOUSE_DB_FIELDS.NAME],
      description: data[HOUSE_DB_FIELDS.DESCRIPTION],
      ownerId: data[HOUSE_DB_FIELDS.OWNER_ID],
      pointsExpirationType: data[HOUSE_DB_FIELDS.POINTS_EXPIRATION_TYPE],
      pointsExpirationCustomDate: data[HOUSE_DB_FIELDS.POINTS_EXPIRATION_CUSTOM_DATE]
        ? new Date(data[HOUSE_DB_FIELDS.POINTS_EXPIRATION_CUSTOM_DATE])
        : null,
      createdAt: new Date(data[HOUSE_DB_FIELDS.CREATED_AT]),
      updatedAt: new Date(data[HOUSE_DB_FIELDS.UPDATED_AT]),
    };
  }

  async create(params: CreateHouseParams): Promise<House> {
    try {
      const { data, error } = await supabase
        .from(HOUSE_DB_CONSTANTS.TABLE_NAME)
        .insert({
          [HOUSE_DB_FIELDS.NAME]: params.name,
          [HOUSE_DB_FIELDS.DESCRIPTION]: params.description ?? null,
          [HOUSE_DB_FIELDS.OWNER_ID]: params.ownerId,
          [HOUSE_DB_FIELDS.POINTS_EXPIRATION_TYPE]: params.pointsExpirationType,
          [HOUSE_DB_FIELDS.POINTS_EXPIRATION_CUSTOM_DATE]:
            params.pointsExpirationCustomDate
              ? params.pointsExpirationCustomDate.toISOString().split('T')[0]
              : null,
        })
        .select()
        .single();

      if (error) {
        throw transformSupabaseError(error);
      }

      if (!data) {
        throw new DomainError(ERROR_CODES.GENERIC.UNKNOWN_ERROR);
      }

      return this.mapHouseFromDb(data);
    } catch (error) {
      if (error instanceof DomainError) {
        throw error;
      }
      throw transformSupabaseError(error as Error);
    }
  }

  async findById(id: string): Promise<House | null> {
    try {
      const { data, error } = await supabase
        .from(HOUSE_DB_CONSTANTS.TABLE_NAME)
        .select('*')
        .eq(HOUSE_DB_FIELDS.ID, id)
        .single();

      if (error) {
        throw transformSupabaseError(error);
      }

      return data ? this.mapHouseFromDb(data) : null;
    } catch (error) {
      if (error instanceof DomainError) {
        throw error;
      }
      throw transformSupabaseError(error as Error);
    }
  }

  async findByOwnerId(ownerId: string): Promise<House[]> {
    try {
      const { data, error } = await supabase
        .from(HOUSE_DB_CONSTANTS.TABLE_NAME)
        .select('*')
        .eq(HOUSE_DB_FIELDS.OWNER_ID, ownerId);

      if (error) {
        throw transformSupabaseError(error);
      }

      return (data || []).map(item => this.mapHouseFromDb(item));
    } catch (error) {
      if (error instanceof DomainError) {
        throw error;
      }
      throw transformSupabaseError(error as Error);
    }
  }

  async countByOwnerId(ownerId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from(HOUSE_DB_CONSTANTS.TABLE_NAME)
        .select('*', { count: 'exact' })
        .eq(HOUSE_DB_FIELDS.OWNER_ID, ownerId);

      if (error) {
        throw transformSupabaseError(error);
      }

      return count ?? 0;
    } catch (error) {
      if (error instanceof DomainError) {
        throw error;
      }
      throw transformSupabaseError(error as Error);
    }
  }
}
