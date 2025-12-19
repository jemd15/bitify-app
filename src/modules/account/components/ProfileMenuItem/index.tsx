import React from 'react';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  Box,
  HStack,
  VStack,
  Text,
  Switch,
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicatorWrapper,
  SelectDragIndicator,
  SelectItem,
} from '@gluestack-ui/themed';

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
            <Select
              selectedValue={rightElement.value}
              onValueChange={rightElement.onValueChange}
            >
              <SelectTrigger style={styles.selectTrigger}>
                <SelectInput style={styles.selectInput} />
                <SelectIcon>
                  <Ionicons name="chevron-down-outline" size={16} color="#666" />
                </SelectIcon>
              </SelectTrigger>
              <SelectPortal>
                <SelectBackdrop />
                <SelectContent>
                  <SelectDragIndicatorWrapper>
                    <SelectDragIndicator />
                  </SelectDragIndicatorWrapper>
                  {rightElement.options.map(option => (
                    <SelectItem
                      key={option.value}
                      label={option.label}
                      value={option.value}
                    />
                  ))}
                </SelectContent>
              </SelectPortal>
            </Select>
          </Box>
        );
      case 'none':
        return null;
      default:
        return null;
    }
  };
  const isPressable = rightElement.type === 'icon' || rightElement.type === 'none';
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
    return <Pressable onPress={onPress}>{content}</Pressable>;
  }

  return <Box>{content}</Box>;
};
