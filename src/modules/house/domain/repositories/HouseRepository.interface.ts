import type { House, CreateHouseParams } from '../../types/house.types';

export interface HouseRepository {
  create(params: CreateHouseParams): Promise<House>;
  findById(id: string): Promise<House | null>;
  findByOwnerId(ownerId: string): Promise<House[]>;
  countByOwnerId(ownerId: string): Promise<number>;
}
