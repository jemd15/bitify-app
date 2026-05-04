import type { PointsExpirationType } from '../../types/house.types';

export interface PointsExpirationFormProps {
  value?: PointsExpirationType;
  onChange: (value: PointsExpirationType) => void;
  customDate?: Date | null;
  onCustomDateChange?: (date: Date | null) => void;
  error?: string;
  isDisabled?: boolean;
}
