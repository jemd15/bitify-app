import { View, type ViewStyle } from 'react-native';

import { styles } from './styles';

interface DividerProps {
  style?: ViewStyle;
}

export function Divider({ style }: DividerProps) {
  return <View style={[styles.divider, style]} />;
}
