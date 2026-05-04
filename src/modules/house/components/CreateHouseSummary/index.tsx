import React from 'react';
import { Text } from 'react-native';
import { Box } from '@gluestack-ui/themed';

import { CREATE_HOUSE_SUMMARY_LABELS } from './constants';
import { styles } from './styles';
import type { CreateHouseSummaryProps } from './types';

export const CreateHouseSummary: React.FC<CreateHouseSummaryProps> = ({ houseData }) => {
  return (
    <Box style={styles.container}>
      <Text style={styles.title}>{CREATE_HOUSE_SUMMARY_LABELS.TITLE}</Text>
      <Text style={styles.label}>{CREATE_HOUSE_SUMMARY_LABELS.NAME}</Text>
      <Text style={styles.value}>{houseData.name}</Text>
      {houseData.description && (
        <>
          <Text style={styles.label}>{CREATE_HOUSE_SUMMARY_LABELS.DESCRIPTION}</Text>
          <Text style={styles.value}>{houseData.description}</Text>
        </>
      )}
      <Text style={styles.label}>{CREATE_HOUSE_SUMMARY_LABELS.POINTS_EXPIRATION}</Text>
      <Text style={styles.value}>{houseData.pointsExpirationType}</Text>
    </Box>
  );
};
