export type OccupantRole = 'owner' | 'occupant_with_permissions' | 'occupant';

export type PointsExpirationType =
  | 'none'
  | 'weekly'
  | 'monthly'
  | 'yearly'
  | 'custom_date';

export type InvitationStatus = 'pending' | 'accepted' | 'rejected' | 'canceled';

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
  description?: string;
  ownerId: string;
  pointsExpirationType?: PointsExpirationType;
  pointsExpirationCustomDate?: Date;
}

export interface UpdateHouseParams {
  name?: string;
  description?: string;
  pointsExpirationType?: PointsExpirationType;
  pointsExpirationCustomDate?: Date;
}

export interface HouseOccupant {
  id: string;
  houseId: string;
  userId: string;
  role: OccupantRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateHouseOccupantParams {
  houseId: string;
  userId: string;
  role: OccupantRole;
}

export interface UpdateHouseOccupantParams {
  role?: OccupantRole;
}

export interface Room {
  id: string;
  houseId: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRoomParams {
  houseId: string;
  name: string;
  description?: string;
}

export interface UpdateRoomParams {
  name?: string;
  description?: string;
}

export interface HouseReward {
  id: string;
  houseId: string;
  name: string;
  description: string | null;
  pointsCost: number;
  stockLimit: number | null;
  currentStock: number | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateHouseRewardParams {
  houseId: string;
  name: string;
  description?: string;
  pointsCost: number;
  stockLimit?: number;
  currentStock?: number;
  isActive?: boolean;
}

export interface UpdateHouseRewardParams {
  name?: string;
  description?: string;
  pointsCost?: number;
  stockLimit?: number;
  currentStock?: number;
  isActive?: boolean;
}

export interface RewardRedemption {
  id: string;
  rewardId: string;
  userId: string;
  houseId: string;
  pointsSpent: number;
  redeemedAt: Date;
}

export interface CreateRewardRedemptionParams {
  rewardId: string;
  userId: string;
  houseId: string;
  pointsSpent: number;
}

export interface HouseInvitation {
  id: string;
  houseId: string;
  invitedBy: string;
  invitedUserId: string;
  role: OccupantRole;
  status: InvitationStatus;
  createdAt: Date;
  updatedAt: Date;
  canceledAt: Date | null;
}

export interface CreateHouseInvitationParams {
  houseId: string;
  invitedBy: string;
  invitedUserId: string;
  role: OccupantRole;
}

export interface UpdateHouseInvitationParams {
  status?: InvitationStatus;
  canceledAt?: Date;
}
