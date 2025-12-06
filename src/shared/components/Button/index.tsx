import React from 'react';
import {
  Pressable,
  Text,
  type PressableProps,
  type TextStyle,
  type ViewStyle,
  ActivityIndicator,
} from 'react-native';

import { styles } from './styles';

export type ButtonVariant = 'solid' | 'outline' | 'ghost';
export type ButtonColor = 'primary' | 'secondary' | 'danger';
export type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends Omit<PressableProps, 'style'> {
  title: string;
  variant?: ButtonVariant;
  color?: ButtonColor;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  accessibilityLabel?: string;
}

export function Button({
  title,
  variant = 'solid',
  color = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
  textStyle,
  accessibilityLabel,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const buttonStyle = [
    styles.button,
    styles[`button_${size}`],
    styles[`button_${variant}_${color}`],
    isDisabled && styles.buttonDisabled,
    style,
  ];
  const textStyles = [
    styles.text,
    styles[`text_${size}`],
    styles[`text_${variant}_${color}`],
    isDisabled && styles.textDisabled,
    textStyle,
  ];

  return (
    <Pressable
      style={({ pressed }) => [
        buttonStyle,
        pressed && !isDisabled && styles.buttonPressed,
      ]}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityState={{ disabled: isDisabled }}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'solid' ? '#fff' : '#0085ff'}
        />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </Pressable>
  );
}
