import type { PointsExpirationType } from '../../types/house.types';

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
