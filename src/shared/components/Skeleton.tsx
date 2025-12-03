import {View, StyleSheet, type ViewStyle} from 'react-native'
import type {ReactNode} from 'react'

interface SkeletonProps {
  blend?: boolean
}

export function SkeletonText({
  blend,
  style,
  width,
}: ViewStyle & SkeletonProps & {width?: number}) {
  return (
    <View style={[styles.textContainer, {maxWidth: width}, style]}>
      <View
        style={[
          styles.textSkeleton,
          {
            opacity: blend ? 0.6 : 1,
          },
        ]}
      />
    </View>
  )
}

export function SkeletonCircle({
  children,
  size,
  blend,
  style,
}: ViewStyle &
  SkeletonProps & {
    children?: ReactNode
    size: number
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
      ]}>
      {children}
    </View>
  )
}

export function SkeletonPill({
  size,
  blend,
  style,
}: ViewStyle &
  SkeletonProps & {
    size: number
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
  )
}

const styles = StyleSheet.create({
  textContainer: {
    flex: 1,
    paddingVertical: 2,
  },
  textSkeleton: {
    borderRadius: 4,
    backgroundColor: '#E2E2E4',
    height: 14,
  },
  circleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E2E2E4',
  },
  pillContainer: {
    backgroundColor: '#E2E2E4',
  },
})

