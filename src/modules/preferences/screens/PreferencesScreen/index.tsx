import React from 'react';
import { View, Text } from 'react-native';

import { PREFERENCES_CONSTANTS } from '../../constants/preferences.constants';
import { styles } from './styles';

export const PreferencesScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{PREFERENCES_CONSTANTS.TITLE}</Text>
      <Text style={styles.subtitle}>{PREFERENCES_CONSTANTS.SUBTITLE}</Text>
    </View>
  );
};
