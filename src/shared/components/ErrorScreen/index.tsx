import { View, Text, type ViewStyle } from 'react-native';
import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import { styles } from './styles';

interface ErrorScreenProps {
  title: string;
  message: string;
  details?: string;
  onPressTryAgain?: () => void;
  testID?: string;
  style?: ViewStyle;
}

export function ErrorScreen({
  title,
  message,
  details,
  onPressTryAgain,
  testID,
  style,
}: ErrorScreenProps) {
  const { _ } = useLingui();

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
  );
}
