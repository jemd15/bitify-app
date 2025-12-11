import React from 'react';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Box, HStack, VStack, Text, Switch } from '@gluestack-ui/themed';

import type { ProfileMenuItemProps } from './types';
import { styles } from './styles';

export const ProfileMenuItem: React.FC<ProfileMenuItemProps> = ({
  leftIcon,
  title,
  description,
  rightElement,
  onPress,
}) => {
  const renderRightElement = () => {
    switch (rightElement.type) {
      case 'icon':
        return (
          <Box style={styles.rightElementContainer}>
            <Ionicons name={rightElement.name as any} size={20} color="#666" />
          </Box>
        );
      case 'switch':
        return (
          <Box style={styles.rightElementContainer}>
            <Switch
              value={rightElement.value}
              onValueChange={rightElement.onValueChange}
            />
          </Box>
        );
      case 'select':
        return (
          <Box style={styles.rightElementContainer}>
            <Text style={styles.selectText}>{rightElement.value}</Text>
            <Ionicons name="chevron-down-outline" size={16} color="#666" />
          </Box>
        );
      case 'none':
        return null;
      default:
        return null;
    }
  };
  const isPressable =
    rightElement.type === 'icon' ||
    rightElement.type === 'none' ||
    rightElement.type === 'select';
  const handleSelectPress = () => {
    if (rightElement.type === 'select' && onPress) {
      onPress();
    }
  };
  const content = (
    <HStack style={styles.container} alignItems="center">
      <Box style={styles.leftIconContainer}>
        <Ionicons name={leftIcon as any} size={24} color="#666" />
      </Box>
      <VStack style={styles.contentContainer}>
        <Text style={styles.title}>{title}</Text>
        {description && <Text style={styles.description}>{description}</Text>}
      </VStack>
      {renderRightElement()}
    </HStack>
  );

  if (isPressable && onPress) {
    return (
      <Pressable onPress={rightElement.type === 'select' ? handleSelectPress : onPress}>
        {content}
      </Pressable>
    );
  }

  return <Box>{content}</Box>;
};
