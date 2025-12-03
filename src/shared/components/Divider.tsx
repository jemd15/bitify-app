import {View, StyleSheet, type ViewStyle} from 'react-native'

interface DividerProps {
  style?: ViewStyle
}

export function Divider({style}: DividerProps) {
  return <View style={[styles.divider, style]} />
}

const styles = StyleSheet.create({
  divider: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#E2E2E4',
  },
})

