import React from 'react'
import {ActivityIndicator, StyleSheet, View, type ViewStyle} from 'react-native'

interface LoadingSpinnerProps {
  size?: 'small' | 'large'
  color?: string
  style?: ViewStyle
}

export function LoadingSpinner({
  size = 'small',
  color = '#0085ff',
  style,
}: LoadingSpinnerProps) {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={color} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
})

