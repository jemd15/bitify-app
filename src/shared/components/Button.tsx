import React from 'react'
import {
  Pressable,
  Text,
  StyleSheet,
  type PressableProps,
  type TextStyle,
  type ViewStyle,
  ActivityIndicator,
} from 'react-native'

export type ButtonVariant = 'solid' | 'outline' | 'ghost'
export type ButtonColor = 'primary' | 'secondary' | 'danger'
export type ButtonSize = 'small' | 'medium' | 'large'

interface ButtonProps extends Omit<PressableProps, 'style'> {
  title: string
  variant?: ButtonVariant
  color?: ButtonColor
  size?: ButtonSize
  loading?: boolean
  disabled?: boolean
  style?: ViewStyle
  textStyle?: TextStyle
  accessibilityLabel?: string
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
  const isDisabled = disabled || loading

  const buttonStyle = [
    styles.button,
    styles[`button_${size}`],
    styles[`button_${variant}_${color}`],
    isDisabled && styles.buttonDisabled,
    style,
  ]

  const textStyles = [
    styles.text,
    styles[`text_${size}`],
    styles[`text_${variant}_${color}`],
    isDisabled && styles.textDisabled,
    textStyle,
  ]

  return (
    <Pressable
      style={({pressed}) => [
        buttonStyle,
        pressed && !isDisabled && styles.buttonPressed,
      ]}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityState={{disabled: isDisabled}}
      {...props}>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'solid' ? '#fff' : '#0085ff'}
        />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  button_small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: 32,
  },
  button_medium: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    minHeight: 44,
  },
  button_large: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    minHeight: 56,
  },
  button_solid_primary: {
    backgroundColor: '#0085ff',
  },
  button_solid_secondary: {
    backgroundColor: '#545664',
  },
  button_solid_danger: {
    backgroundColor: '#ec4868',
  },
  button_outline_primary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#0085ff',
  },
  button_outline_secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#545664',
  },
  button_outline_danger: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ec4868',
  },
  button_ghost_primary: {
    backgroundColor: 'transparent',
  },
  button_ghost_secondary: {
    backgroundColor: 'transparent',
  },
  button_ghost_danger: {
    backgroundColor: 'transparent',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  text_small: {
    fontSize: 14,
  },
  text_medium: {
    fontSize: 16,
  },
  text_large: {
    fontSize: 18,
  },
  text_solid_primary: {
    color: '#fff',
  },
  text_solid_secondary: {
    color: '#fff',
  },
  text_solid_danger: {
    color: '#fff',
  },
  text_outline_primary: {
    color: '#0085ff',
  },
  text_outline_secondary: {
    color: '#545664',
  },
  text_outline_danger: {
    color: '#ec4868',
  },
  text_ghost_primary: {
    color: '#0085ff',
  },
  text_ghost_secondary: {
    color: '#545664',
  },
  text_ghost_danger: {
    color: '#ec4868',
  },
  textDisabled: {
    opacity: 0.5,
  },
})

