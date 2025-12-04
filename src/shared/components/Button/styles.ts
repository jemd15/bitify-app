import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  button_ghost_danger: {
    backgroundColor: 'transparent',
  },
  button_ghost_primary: {
    backgroundColor: 'transparent',
  },
  button_ghost_secondary: {
    backgroundColor: 'transparent',
  },
  button_large: {
    minHeight: 56,
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  button_medium: {
    minHeight: 44,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  button_outline_danger: {
    backgroundColor: 'transparent',
    borderColor: '#ec4868',
    borderWidth: 1,
  },
  button_outline_primary: {
    backgroundColor: 'transparent',
    borderColor: '#0085ff',
    borderWidth: 1,
  },
  button_outline_secondary: {
    backgroundColor: 'transparent',
    borderColor: '#545664',
    borderWidth: 1,
  },
  button_small: {
    minHeight: 32,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  button_solid_danger: {
    backgroundColor: '#ec4868',
  },
  button_solid_primary: {
    backgroundColor: '#0085ff',
  },
  button_solid_secondary: {
    backgroundColor: '#545664',
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  textDisabled: {
    opacity: 0.5,
  },
  text_ghost_danger: {
    color: '#ec4868',
  },
  text_ghost_primary: {
    color: '#0085ff',
  },
  text_ghost_secondary: {
    color: '#545664',
  },
  text_large: {
    fontSize: 18,
  },
  text_medium: {
    fontSize: 16,
  },
  text_outline_danger: {
    color: '#ec4868',
  },
  text_outline_primary: {
    color: '#0085ff',
  },
  text_outline_secondary: {
    color: '#545664',
  },
  text_small: {
    fontSize: 14,
  },
  text_solid_danger: {
    color: '#fff',
  },
  text_solid_primary: {
    color: '#fff',
  },
  text_solid_secondary: {
    color: '#fff',
  },
});
