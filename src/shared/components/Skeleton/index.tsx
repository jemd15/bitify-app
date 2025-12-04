import { View, type ViewStyle } from 'react-native';
import type { ReactNode } from 'react';

import { styles } from './styles';

interface SkeletonProps {
  blend?: boolean;
}

export function SkeletonText({
  blend,
  style,
  width,
}: ViewStyle & SkeletonProps & { width?: number }) {
  return (
    <View style={[styles.textContainer, { maxWidth: width }, style]}>
      <View
        style={[
          styles.textSkeleton,
          {
            opacity: blend ? 0.6 : 1,
          },
        ]}
      />
    </View>
  );
}

export function SkeletonCircle({
  children,
  size,
  blend,
  style,
}: ViewStyle &
  SkeletonProps & {
    children?: ReactNode;
    size: number;
  }) {
  return (
    <View
      style={[
        styles.circleContainer,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          opacity: blend ? 0.6 : 1,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function SkeletonPill({
  size,
  blend,
  style,
}: ViewStyle &
  SkeletonProps & {
    size: number;
  }) {
  return (
    <View
      style={[
        styles.pillContainer,
        {
          width: size * 1.618,
          height: size,
          borderRadius: size / 2,
          opacity: blend ? 0.6 : 1,
        },
        style,
      ]}
    />
  );
}
