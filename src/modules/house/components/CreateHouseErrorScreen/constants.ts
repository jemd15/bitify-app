import { t } from '@lingui/macro';

export const CREATE_HOUSE_ERROR_SCREEN_LABELS = {
  TITLE: t`Error Creating House`,
  DEFAULT_MESSAGE: t`An error occurred while creating your house. Please try again or join an existing house.`,
  RETRY_BUTTON: t`Try Again`,
  RETRYING: t`Retrying...`,
  CHANGE_ACTION_BUTTON: t`Join Existing House`,
} as const;
