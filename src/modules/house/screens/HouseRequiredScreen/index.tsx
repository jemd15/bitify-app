import React from 'react';
import { View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HouseActionSelector } from '@modules/auth/components/HouseActionSelector';
import { HouseCoordinator } from '../../coordinator/HouseCoordinator';
import { HouseRequiredConstants } from './constants';
import type { HouseAction } from '@modules/auth/components/HouseActionSelector/types';
import { styles } from './styles';

export const HouseRequiredScreen: React.FC = () => {
  const insets = useSafeAreaInsets();

  const handleActionSelect = (action: HouseAction) => {
    if (action === 'create') {
      HouseCoordinator.navigateToCreateHouse();
    } else {
      HouseCoordinator.navigateToAcceptInvitation();
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 20 }]}>
      <View style={styles.header}>
        <Text style={styles.title}>{HouseRequiredConstants.TITLE}</Text>
        <Text style={styles.subtitle}>{HouseRequiredConstants.SUBTITLE}</Text>
      </View>

      <View style={styles.content}>
        <HouseActionSelector
          selectedAction={undefined}
          onActionSelect={handleActionSelect}
        />
      </View>
    </View>
  );
};
