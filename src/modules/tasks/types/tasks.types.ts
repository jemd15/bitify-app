export type TaskStatus = 'pending' | 'completed' | 'validated' | 'expired';

export type RecurrenceType = 'none' | 'weekly' | 'monthly' | 'yearly';

export interface Task {
  id: string;
  houseId: string;
  roomId: string | null;
  title: string;
  description: string | null;
  assignedTo: string;
  validatorId: string | null;
  requiresValidation: boolean;
  pointsOnTime: number;
  pointsExtended: number;
  pointsNotCompleted: number;
  dueDate: Date;
  extendedDueDate: Date | null;
  extendedDays: number;
  isRecurring: boolean;
  recurrenceType: RecurrenceType;
  recurrenceDate: Date | null;
  status: TaskStatus;
  parentTaskId: string | null;
  completedAt: Date | null;
  completedBy: string | null;
  validatedAt: Date | null;
  validatedBy: string | null;
  validationDescription: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskParams {
  houseId: string;
  roomId?: string | null;
  title: string;
  description?: string;
  assignedTo: string;
  validatorId?: string | null;
  requiresValidation?: boolean;
  pointsOnTime?: number;
  pointsExtended?: number;
  pointsNotCompleted?: number;
  dueDate: Date;
  extendedDays?: number;
  isRecurring?: boolean;
  recurrenceType?: RecurrenceType;
  recurrenceDate?: Date | null;
}

export interface UpdateTaskParams {
  roomId?: string | null;
  title?: string;
  description?: string;
  assignedTo?: string;
  validatorId?: string | null;
  requiresValidation?: boolean;
  pointsOnTime?: number;
  pointsExtended?: number;
  pointsNotCompleted?: number;
  dueDate?: Date;
  extendedDays?: number;
  isRecurring?: boolean;
  recurrenceType?: RecurrenceType;
  recurrenceDate?: Date | null;
  status?: TaskStatus;
  completedAt?: Date | null;
  completedBy?: string | null;
}

export interface TaskValidation {
  id: string;
  taskId: string;
  validatedBy: string;
  validationDescription: string | null;
  createdAt: Date;
}

export interface CreateTaskValidationParams {
  taskId: string;
  validatedBy: string;
  validationDescription?: string;
}
