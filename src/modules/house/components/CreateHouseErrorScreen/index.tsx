import React from 'react';
import { View, Text } from 'react-native';
import { Button, ButtonText, ButtonSpinner } from '@gluestack-ui/themed';

import { HouseCoordinator } from '../../coordinator/HouseCoordinator';
import { CREATE_HOUSE_ERROR_SCREEN_LABELS } from './constants';
import { styles } from './styles';
import type { CreateHouseErrorScreenProps } from './types';

export const CreateHouseErrorScreen: React.FC<CreateHouseErrorScreenProps> = ({
  error,
  onRetry,
  isRetrying,
}) => {
  const handleAcceptInvitation = () => {
    HouseCoordinator.navigateToAcceptInvitation();
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.iconText}>⚠️</Text>
        </View>
        <Text style={styles.title}>{CREATE_HOUSE_ERROR_SCREEN_LABELS.TITLE}</Text>
        <Text style={styles.message}>
          {error.message || CREATE_HOUSE_ERROR_SCREEN_LABELS.DEFAULT_MESSAGE}
        </Text>
        <View style={styles.buttonsContainer}>
          <Button
            variant="solid"
            action="primary"
            onPress={onRetry}
            isDisabled={isRetrying}
            style={styles.retryButton}
          >
            {isRetrying ? (
              <ButtonSpinner />
            ) : (
              <ButtonText>{CREATE_HOUSE_ERROR_SCREEN_LABELS.RETRY_BUTTON}</ButtonText>
            )}
          </Button>
          <Button
            variant="outline"
            action="secondary"
            onPress={handleAcceptInvitation}
            isDisabled={isRetrying}
            style={styles.changeActionButton}
          >
            <ButtonText>
              {CREATE_HOUSE_ERROR_SCREEN_LABELS.CHANGE_ACTION_BUTTON}
            </ButtonText>
          </Button>
        </View>
      </View>
    </View>
  );
};
