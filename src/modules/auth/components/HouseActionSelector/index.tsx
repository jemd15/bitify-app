import React from 'react';
import { View } from 'react-native';
import { SelectableCard } from '@shared/components';

import { HouseActionSelectorProps } from './types';
import { HOUSE_ACTION_CONSTANTS } from './constants';
import { styles } from './styles';

export const HouseActionSelector: React.FC<HouseActionSelectorProps> = ({
  selectedAction,
  onActionSelect,
}) => {
  return (
    <View style={styles.container}>
      <SelectableCard
        title={HOUSE_ACTION_CONSTANTS.CREATE_HOUSE_TITLE}
        description={HOUSE_ACTION_CONSTANTS.CREATE_HOUSE_DESCRIPTION}
        icon="home-outline"
        selected={selectedAction === 'create'}
        onPress={() => onActionSelect('create')}
        testID="create-house-card"
      />
      <SelectableCard
        title={HOUSE_ACTION_CONSTANTS.ACCEPT_INVITATION_TITLE}
        description={HOUSE_ACTION_CONSTANTS.ACCEPT_INVITATION_DESCRIPTION}
        icon="mail-outline"
        selected={selectedAction === 'accept_invitation'}
        onPress={() => onActionSelect('accept_invitation')}
        testID="accept-invitation-card"
      />
    </View>
  );
};
