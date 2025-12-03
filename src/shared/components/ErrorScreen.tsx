import {View, Text, StyleSheet, type ViewStyle} from 'react-native'
import {msg, Trans} from '@lingui/macro'
import {useLingui} from '@lingui/react'

interface ErrorScreenProps {
  title: string
  message: string
  details?: string
  onPressTryAgain?: () => void
  testID?: string
  style?: ViewStyle
}

export function ErrorScreen({
  title,
  message,
  details,
  onPressTryAgain,
  testID,
  style,
}: ErrorScreenProps) {
  const {_} = useLingui()

  return (
    <View style={[styles.container, style]} testID={testID}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>⚠️</Text>
          </View>
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
        {details && (
          <View style={styles.detailsContainer}>
            <Text testID={`${testID}-details`} style={styles.detailsText}>
              {details}
            </Text>
          </View>
        )}
        {onPressTryAgain && (
          <View style={styles.buttonContainer}>
            <Text style={styles.button} onPress={onPressTryAgain}>
              {_(msg`Try again`)}
            </Text>
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  content: {
    alignItems: 'center',
    maxWidth: 400,
  },
  iconContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#26272D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    color: '#000',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: '#545664',
  },
  detailsContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#E2E2E4',
    backgroundColor: '#F3F3F8',
    marginBottom: 24,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  detailsText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#545664',
  },
  buttonContainer: {
    alignItems: 'center',
  },
  button: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0085ff',
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
})

