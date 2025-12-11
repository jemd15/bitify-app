import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  checkbox: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderColor: '#007AFF',
    borderRadius: 4,
    borderWidth: 2,
    height: 20,
    justifyContent: 'center',
    width: 20,
  },
  checkboxChecked: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  checkboxDisabled: {
    borderColor: '#CCCCCC',
    opacity: 0.5,
  },
  checkmark: {
    borderBottomWidth: 2,
    borderColor: '#FFFFFF',
    borderRightWidth: 2,
    height: 10,
    marginTop: -2,
    transform: [{ rotate: '45deg' }],
    width: 6,
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
