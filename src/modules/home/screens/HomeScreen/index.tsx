import React from 'react';
import { View, Text } from 'react-native';

import { HOME_CONSTANTS } from '../../constants/home.constants';
import type { HomeScreenProps } from '../../types/home.types';
import { styles } from './styles';

export const HomeScreen: React.FC<HomeScreenProps> = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{HOME_CONSTANTS.TITLE}</Text>
      <Text style={styles.subtitle}>{HOME_CONSTANTS.SUBTITLE}</Text>
    </View>
  );
};
