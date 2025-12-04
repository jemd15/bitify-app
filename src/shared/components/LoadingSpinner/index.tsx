import React from 'react';
import { ActivityIndicator, View, type ViewStyle } from 'react-native';

import { styles } from './styles';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  style?: ViewStyle;
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
  );
}
