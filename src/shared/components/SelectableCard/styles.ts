import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  checkmarkContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E5E5',
    borderRadius: 16,
    borderWidth: 2,
    elevation: 3,
    flex: 1,
    justifyContent: 'center',
    marginBottom: 16,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  containerDisabled: {
    opacity: 0.5,
  },
  containerPressed: {
    opacity: 0.7,
  },
  containerSelected: {
    backgroundColor: '#F0F8FF',
    borderColor: '#007AFF',
  },
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    position: 'relative',
  },
  description: {
    color: '#666666',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  descriptionSelected: {
    color: '#007AFF',
  },
  icon: {
    marginRight: 0,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  textContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    color: '#000000',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  titleSelected: {
    color: '#007AFF',
  },
});
