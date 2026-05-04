import type { PointsExpirationType } from '../../types/house.types';

export interface HouseNameFormProps {
  name: string;
  onNameChange: (value: string) => void;
  nameError?: string;
  description: string;
  onDescriptionChange: (value: string) => void;
  descriptionError?: string;
  pointsExpirationType?: PointsExpirationType;
  onPointsExpirationTypeChange: (value: PointsExpirationType) => void;
  pointsExpirationError?: string;
  customDate?: Date | null;
  onCustomDateChange?: (date: Date | null) => void;
  customDateError?: string;
  isDisabled?: boolean;
}
