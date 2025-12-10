import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  actions: {
    gap: 16,
    width: '100%',
  },
  container: {
    backgroundColor: '#ffffff',
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 40,
    paddingHorizontal: 20,
    paddingTop: 60,
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
    marginTop: 20,
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
