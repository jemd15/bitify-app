import type { UserType } from '@modules/account/types/account.types';

export type PointsType = 'on_time' | 'extended' | 'not_completed' | 'reward_redemption';

export interface UserLimits {
  id: string;
  userType: UserType;
  maxHouses: number;
  maxOccupantsWithPermissions: number;
  maxTasksPerHouse: number;
  maxRoomsPerHouse: number;
  maxRewardsPerHouse: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserHousePoints {
  id: string;
  userId: string;
  houseId: string;
  totalPoints: number;
  availablePoints: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PointHistory {
  id: string;
  userId: string;
  houseId: string;
  taskId: string | null;
  points: number;
  pointsType: PointsType;
  earnedAt: Date;
  expiresAt: Date | null;
  description: string | null;
}

export interface CreatePointHistoryParams {
  userId: string;
  houseId: string;
  taskId?: string | null;
  points: number;
  pointsType: PointsType;
  earnedAt?: Date;
  expiresAt?: Date | null;
  description?: string;
}

export type NotificationType =
  | 'task_reminder'
  | 'task_validation'
  | 'member_joined'
  | 'member_left';

export interface Notification {
  id: string;
  userId: string;
  taskId: string | null;
  houseId: string | null;
  notificationType: NotificationType;
  scheduledFor: Date;
  sentAt: Date | null;
  createdAt: Date;
}

export interface CreateNotificationParams {
  userId: string;
  taskId?: string | null;
  houseId?: string | null;
  notificationType: NotificationType;
  scheduledFor: Date;
  sentAt?: Date | null;
}

export interface UpdateNotificationParams {
  sentAt?: Date | null;
}
