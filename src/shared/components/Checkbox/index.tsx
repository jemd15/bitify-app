import React from 'react';
import { Pressable, View } from 'react-native';

import { styles } from './styles';

export interface CheckboxProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  accessibilityLabel?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  value,
  onValueChange,
  disabled = false,
  accessibilityLabel,
}) => {
  const handlePress = () => {
    if (!disabled) {
      onValueChange(!value);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: value, disabled }}
      accessibilityLabel={accessibilityLabel}
      style={styles.container}
    >
      <View
        style={[
          styles.checkbox,
          value && styles.checkboxChecked,
          disabled && styles.checkboxDisabled,
        ]}
      >
        {value && <View style={styles.checkmark} />}
      </View>
    </Pressable>
  );
};
