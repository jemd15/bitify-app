import React from 'react';
import {
  TextInput,
  View,
  Text,
  type TextInputProps,
  type ViewStyle,
  type TextStyle,
} from 'react-native';

import { styles } from './styles';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
}

export function Input({
  label,
  error,
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  ...props
}: InputProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          error && styles.inputError,
          props.editable === false && styles.inputDisabled,
          inputStyle,
        ]}
        placeholderTextColor="#8D8E96"
        accessibilityLabel={label}
        accessibilityState={{ invalid: !!error }}
        {...props}
      />
      {error && <Text style={[styles.error, errorStyle]}>{error}</Text>}
    </View>
  );
}
