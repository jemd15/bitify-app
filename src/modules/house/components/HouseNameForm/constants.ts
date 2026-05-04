import { t } from '@lingui/macro';

import { VALIDATION_ERROR_CODES } from '../../constants/house.constants';

export const HOUSE_NAME_FORM_LABELS = {
  NAME: t`House Name`,
  DESCRIPTION: t`Description`,
  POINTS_EXPIRATION: t`Points Expiration`,
  CUSTOM_DATE: t`Custom Date`,
} as const;

export const HOUSE_NAME_FORM_PLACEHOLDERS = {
  NAME: t`Enter house name`,
  DESCRIPTION: t`Enter description (optional)`,
  CUSTOM_DATE: t`Select expiration date`,
} as const;

export const errorMessages: Record<string, string> = {
  [VALIDATION_ERROR_CODES.HOUSE_NAME_REQUIRED]: t`House name is required`,
  [VALIDATION_ERROR_CODES.HOUSE_NAME_TOO_LONG]: t`House name is too long`,
  [VALIDATION_ERROR_CODES.HOUSE_DESCRIPTION_TOO_LONG]: t`Description is too long`,
  [VALIDATION_ERROR_CODES.CUSTOM_DATE_REQUIRED]: t`Custom date is required`,
};
