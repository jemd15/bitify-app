import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  divider: {
    alignSelf: 'center',
    flexDirection: 'row',
    marginVertical: 10,
  },
  dividerText: {
    color: '#999',
    marginHorizontal: 10,
  },
  footerLink: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'center',
    marginTop: 20,
    paddingBottom: 40,
  },
  footerLinkButton: {
    color: '#007AFF',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  footerLinkText: {
    color: '#666',
    fontSize: 16,
  },
  form: {
    gap: 16,
    marginTop: 40,
  },
  header: {
    marginBottom: 40,
  },
  subtitle: {
    color: '#666',
    fontSize: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});
