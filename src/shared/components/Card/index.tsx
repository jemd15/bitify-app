import { View, type ViewStyle, type ViewProps } from 'react-native';

import { styles } from './styles';

interface CardProps extends ViewProps {
  style?: ViewStyle;
}

export function Card({ style, children, ...props }: CardProps) {
  return (
    <View style={[styles.card, style]} {...props}>
      {children}
    </View>
  );
}
