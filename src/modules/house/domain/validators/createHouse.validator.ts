import { z } from 'zod';

import { VALIDATION_ERROR_CODES } from '../../constants/house.constants';
import { POINTS_EXPIRATION_TYPES } from '../../constants/house.constants';
import { HOUSE_CONSTANTS } from '../../constants/house.constants';

export const createHouseSchema = z
  .object({
    name: z
      .string()
      .min(1, VALIDATION_ERROR_CODES.HOUSE_NAME_REQUIRED)
      .max(HOUSE_CONSTANTS.MAX_NAME_LENGTH, VALIDATION_ERROR_CODES.HOUSE_NAME_TOO_LONG),
    description: z
      .string()
      .max(
        HOUSE_CONSTANTS.MAX_DESCRIPTION_LENGTH,
        VALIDATION_ERROR_CODES.HOUSE_DESCRIPTION_TOO_LONG,
      )
      .optional()
      .nullable(),
    pointsExpirationType: z.enum([
      POINTS_EXPIRATION_TYPES.NONE,
      POINTS_EXPIRATION_TYPES.WEEKLY,
      POINTS_EXPIRATION_TYPES.MONTHLY,
      POINTS_EXPIRATION_TYPES.YEARLY,
      POINTS_EXPIRATION_TYPES.CUSTOM_DATE,
    ] as [string, ...string[]]),
    pointsExpirationCustomDate: z.date().nullable().optional(),
  })
  .refine(
    data => {
      if (data.pointsExpirationType === POINTS_EXPIRATION_TYPES.CUSTOM_DATE) {
        return (
          data.pointsExpirationCustomDate !== null &&
          data.pointsExpirationCustomDate !== undefined
        );
      }

      return true;
    },
    {
      message: VALIDATION_ERROR_CODES.CUSTOM_DATE_REQUIRED,
      path: ['pointsExpirationCustomDate'],
    },
  );

export type CreateHouseInput = z.infer<typeof createHouseSchema>;
