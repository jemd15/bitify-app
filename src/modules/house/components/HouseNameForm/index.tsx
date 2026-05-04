import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  FormControlError,
  FormControlErrorText,
  Input,
  InputField,
  Textarea,
  TextareaInput,
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicatorWrapper,
  SelectDragIndicator,
  SelectItem,
} from '@gluestack-ui/themed';

import { HOUSE_NAME_FORM_LABELS, HOUSE_NAME_FORM_PLACEHOLDERS } from './constants';
import {
  POINTS_EXPIRATION_OPTIONS,
  POINTS_EXPIRATION_TYPES,
} from '../../constants/house.constants';
import type { PointsExpirationType } from '../../types/house.types';
import { styles } from './styles';
import type { HouseNameFormProps } from './types';

export const HouseNameForm: React.FC<HouseNameFormProps> = ({
  name,
  onNameChange,
  nameError,
  description,
  onDescriptionChange,
  descriptionError,
  pointsExpirationType,
  onPointsExpirationTypeChange,
  pointsExpirationError,
  customDate,
  onCustomDateChange,
  customDateError,
  isDisabled,
}) => {
  const showCustomDate = pointsExpirationType === POINTS_EXPIRATION_TYPES.CUSTOM_DATE;
  const selectedOption = POINTS_EXPIRATION_OPTIONS.find(
    opt => opt.value === pointsExpirationType,
  );

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="construct" size={64} color="#666" style={styles.icon} />
      </View>

      <View style={styles.formContainer}>
        <FormControl isInvalid={!!nameError} marginBottom="$4">
          <FormControlLabel>
            <FormControlLabelText>{HOUSE_NAME_FORM_LABELS.NAME}</FormControlLabelText>
          </FormControlLabel>
          <Input>
            <InputField
              value={name}
              onChangeText={onNameChange}
              placeholder={HOUSE_NAME_FORM_PLACEHOLDERS.NAME}
              editable={!isDisabled}
              accessibilityLabel={HOUSE_NAME_FORM_LABELS.NAME}
            />
          </Input>
          {nameError && (
            <FormControlError>
              <FormControlErrorText>{nameError}</FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>

        <FormControl isInvalid={!!descriptionError} marginBottom="$4">
          <FormControlLabel>
            <FormControlLabelText>
              {HOUSE_NAME_FORM_LABELS.DESCRIPTION}
            </FormControlLabelText>
          </FormControlLabel>
          <Textarea>
            <TextareaInput
              value={description}
              onChangeText={onDescriptionChange}
              placeholder={HOUSE_NAME_FORM_PLACEHOLDERS.DESCRIPTION}
              editable={!isDisabled}
              accessibilityLabel={HOUSE_NAME_FORM_LABELS.DESCRIPTION}
              numberOfLines={3}
            />
          </Textarea>
          {descriptionError && (
            <FormControlError>
              <FormControlErrorText>{descriptionError}</FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>

        <FormControl isInvalid={!!pointsExpirationError} marginBottom="$4">
          <FormControlLabel>
            <FormControlLabelText>
              {HOUSE_NAME_FORM_LABELS.POINTS_EXPIRATION}
            </FormControlLabelText>
          </FormControlLabel>
          <Select
            selectedValue={pointsExpirationType}
            onValueChange={value =>
              onPointsExpirationTypeChange(value as PointsExpirationType)
            }
            isDisabled={isDisabled}
          >
            <SelectTrigger>
              <SelectInput placeholder={HOUSE_NAME_FORM_LABELS.POINTS_EXPIRATION} />
              <SelectIcon>
                <Ionicons name="chevron-down" size={16} color="#666" />
              </SelectIcon>
            </SelectTrigger>
            <SelectPortal>
              <SelectBackdrop />
              <SelectContent>
                <SelectDragIndicatorWrapper>
                  <SelectDragIndicator />
                </SelectDragIndicatorWrapper>
                {POINTS_EXPIRATION_OPTIONS.map(option => (
                  <SelectItem
                    key={option.value}
                    label={option.label}
                    value={option.value}
                  />
                ))}
              </SelectContent>
            </SelectPortal>
          </Select>
          {showCustomDate && (
            <Input style={{ marginTop: 12 }}>
              <InputField
                value={customDate?.toISOString().split('T')[0] ?? ''}
                onChangeText={text => {
                  if (!text) {
                    onCustomDateChange?.(null);

                    return;
                  }

                  const date = new Date(text);

                  if (!isNaN(date.getTime())) {
                    onCustomDateChange?.(date);
                  }
                }}
                placeholder={HOUSE_NAME_FORM_PLACEHOLDERS.CUSTOM_DATE}
                editable={!isDisabled}
                keyboardType="numbers-and-punctuation"
              />
            </Input>
          )}
          {customDateError && (
            <FormControlError>
              <FormControlErrorText>{customDateError}</FormControlErrorText>
            </FormControlError>
          )}
          {pointsExpirationError && (
            <FormControlError>
              <FormControlErrorText>{pointsExpirationError}</FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>
      </View>
    </View>
  );
};
