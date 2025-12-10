import { StyleSheet, type ViewStyle } from 'react-native';

export const styles = StyleSheet.create({
  actions: {
    gap: 16,
    width: '100%',
  },
  container: {
    backgroundColor: '#ffffff',
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
  },
  loginLink: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'center',
    marginTop: 6,
  },
  loginLinkButton: {
    color: '#007AFF',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  loginLinkText: {
    color: '#666',
    fontSize: 16,
  },
  subtitle: {
    color: '#666',
    fontSize: 18,
    paddingHorizontal: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
});

export const getContainerStyle = (insets: {
  top: number;
  bottom: number;
}): ViewStyle => ({
  ...styles.container,
  paddingTop: insets.top,
  paddingBottom: insets.bottom + 40,
});
