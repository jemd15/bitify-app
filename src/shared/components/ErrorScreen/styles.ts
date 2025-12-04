import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  button: {
    color: '#0085ff',
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  content: {
    alignItems: 'center',
    maxWidth: 400,
  },
  detailsContainer: {
    backgroundColor: '#F3F3F8',
    borderColor: '#E2E2E4',
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 24,
    overflow: 'hidden',
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: '100%',
  },
  detailsText: {
    color: '#545664',
    fontSize: 14,
    textAlign: 'center',
  },
  iconCircle: {
    alignItems: 'center',
    backgroundColor: '#26272D',
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    width: 50,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  iconText: {
    fontSize: 24,
  },
  message: {
    color: '#545664',
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  title: {
    color: '#000',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
});
