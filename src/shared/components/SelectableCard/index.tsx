import React from 'react';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Box, VStack, Text } from '@gluestack-ui/themed';

import { styles } from './styles';

export interface SelectableCardProps {
  title: string;
  description?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  selected?: boolean;
  onPress: () => void;
  disabled?: boolean;
  testID?: string;
}

export const SelectableCard: React.FC<SelectableCardProps> = ({
  title,
  description,
  icon,
  selected = false,
  onPress,
  disabled = false,
  testID,
}) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.container,
        selected && styles.containerSelected,
        disabled && styles.containerDisabled,
        pressed && !disabled && styles.containerPressed,
      ]}
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      accessibilityLabel={title}
    >
      <Box style={styles.content}>
        {selected && (
          <Box style={styles.checkmarkContainer}>
            <Ionicons name="checkmark-circle" size={28} color="#007AFF" />
          </Box>
        )}
        {icon && (
          <Box style={styles.iconContainer}>
            <Ionicons
              name={icon}
              size={64}
              color={selected ? '#007AFF' : '#666'}
              style={styles.icon}
            />
          </Box>
        )}
        <VStack style={styles.textContainer}>
          <Text style={[styles.title, selected && styles.titleSelected]}>{title}</Text>
          {description && (
            <Text style={[styles.description, selected && styles.descriptionSelected]}>
              {description}
            </Text>
          )}
        </VStack>
      </Box>
    </Pressable>
  );
};
