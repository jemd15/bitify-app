import { t } from '@lingui/macro';

export const HOUSE_DB_CONSTANTS = {
  TABLE_NAME: 'houses',
} as const;

export const HOUSE_DB_FIELDS = {
  ID: 'id',
  NAME: 'name',
  DESCRIPTION: 'description',
  OWNER_ID: 'owner_id',
  POINTS_EXPIRATION_TYPE: 'points_expiration_type',
  POINTS_EXPIRATION_CUSTOM_DATE: 'points_expiration_custom_date',
  CREATED_AT: 'created_at',
  UPDATED_AT: 'updated_at',
} as const;

export const POINTS_EXPIRATION_TYPES = {
  NONE: 'none',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
  CUSTOM_DATE: 'custom_date',
} as const;

export const HOUSE_CONSTANTS = {
  MAX_NAME_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500,
} as const;

export const VALIDATION_ERROR_CODES = {
  HOUSE_NAME_REQUIRED: 'HOUSE_NAME_REQUIRED',
  HOUSE_NAME_TOO_LONG: 'HOUSE_NAME_TOO_LONG',
  HOUSE_DESCRIPTION_TOO_LONG: 'HOUSE_DESCRIPTION_TOO_LONG',
  CUSTOM_DATE_REQUIRED: 'CUSTOM_DATE_REQUIRED',
} as const;

export const POINTS_EXPIRATION_OPTIONS = [
  { value: POINTS_EXPIRATION_TYPES.NONE, label: t`Never` },
  { value: POINTS_EXPIRATION_TYPES.WEEKLY, label: t`Weekly` },
  { value: POINTS_EXPIRATION_TYPES.MONTHLY, label: t`Monthly` },
  { value: POINTS_EXPIRATION_TYPES.YEARLY, label: t`Yearly` },
  { value: POINTS_EXPIRATION_TYPES.CUSTOM_DATE, label: t`Custom Date` },
] as const;

export const HOUSE_ROUTES = {
  CREATE: '/house/create',
  HOME: '/(tabs)/home',
  DETAIL: '/house/[id]',
  HOUSE_REQUIRED: '/house/house-required',
  ACCEPT_INVITATION: '/house/accept-invitation',
} as const;

export const CREATE_HOUSE_STEPS = {
  NAME: 'name',
  EXPIRATION: 'expiration',
  SUMMARY: 'summary',
} as const;

export const RQKEY_ROOT = 'house';
export const RQKEY_HOUSES_LIST = [RQKEY_ROOT, 'list'] as const;

export const CREATE_HOUSE_SCREEN_LABELS = {
  ERROR_TITLE: t`Error`,
  CREATE_BUTTON: t`Create House`,
  NEXT_BUTTON: t`Next`,
  BACK_BUTTON: t`Back`,
  CANCEL_BUTTON: t`Cancel`,
} as const;
