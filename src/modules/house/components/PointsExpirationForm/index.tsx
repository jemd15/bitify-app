import React from 'react';
import { View } from 'react-native';
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  FormControlError,
  FormControlErrorText,
} from '@gluestack-ui/themed';
import { SelectableCard } from '@shared/components';

import {
  POINTS_EXPIRATION_OPTIONS,
  POINTS_EXPIRATION_TYPES,
} from '../../constants/house.constants';
import { POINTS_EXPIRATION_FORM_LABELS } from './constants';
import type { PointsExpirationType } from '../../types/house.types';
import { styles } from './styles';
import type { PointsExpirationFormProps } from './types';

export const PointsExpirationForm: React.FC<PointsExpirationFormProps> = ({
  value,
  onChange,
  customDate,
  onCustomDateChange,
  error,
  isDisabled,
}) => {
  return (
    <View style={styles.container}>
      <FormControl isInvalid={!!error} marginBottom="$4">
        <FormControlLabel>
          <FormControlLabelText>
            {POINTS_EXPIRATION_FORM_LABELS.TYPE}
          </FormControlLabelText>
        </FormControlLabel>
        {POINTS_EXPIRATION_OPTIONS.map(option => (
          <SelectableCard
            key={option.value}
            title={option.label}
            selected={value === option.value}
            onPress={() => !isDisabled && onChange(option.value as PointsExpirationType)}
            disabled={isDisabled}
          />
        ))}
        {value === POINTS_EXPIRATION_TYPES.CUSTOM_DATE && <View />}
        {error && (
          <FormControlError>
            <FormControlErrorText>{error}</FormControlErrorText>
          </FormControlError>
        )}
      </FormControl>
    </View>
  );
};
