import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 50,
    zIndex: 9999,
  },
  pressable: {
    width: '100%',
  },
  text: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  toast: {
    backgroundColor: '#26272D',
    borderRadius: 8,
    marginBottom: 8,
    maxWidth: '90%',
    minWidth: 200,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  toast_default: {
    backgroundColor: '#26272D',
  },
  toast_error: {
    backgroundColor: '#ec4868',
  },
  toast_info: {
    backgroundColor: '#0085ff',
  },
  toast_success: {
    backgroundColor: '#20bc07',
  },
  toast_warning: {
    backgroundColor: '#f59e0b',
  },
});
