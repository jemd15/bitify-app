import { POINTS_EXPIRATION_TYPES } from '../constants/house.constants';

export type PointsExpirationType =
  | typeof POINTS_EXPIRATION_TYPES.NONE
  | typeof POINTS_EXPIRATION_TYPES.WEEKLY
  | typeof POINTS_EXPIRATION_TYPES.MONTHLY
  | typeof POINTS_EXPIRATION_TYPES.YEARLY
  | typeof POINTS_EXPIRATION_TYPES.CUSTOM_DATE;

export interface House {
  id: string;
  name: string;
  description: string | null;
  ownerId: string;
  pointsExpirationType: PointsExpirationType;
  pointsExpirationCustomDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateHouseParams {
  name: string;
  description?: string | null;
  ownerId: string;
  pointsExpirationType: PointsExpirationType;
  pointsExpirationCustomDate?: Date | null;
}
