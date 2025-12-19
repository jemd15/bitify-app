import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  avatarContainer: {
    alignItems: 'center',
    backgroundColor: '#aaa',
    borderColor: '#FFFFFF',
    borderRadius: 50,
    borderWidth: 3,
    height: 100,
    justifyContent: 'center',
    marginBottom: 16,
    width: 100,
  },
  avatarWrapper: {
    position: 'relative',
  },
  container: {
    paddingHorizontal: 16,
    paddingVertical: 32,
  },
  editAvatarButton: {
    alignItems: 'center',
    backgroundColor: '#007AFF',
    borderColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 3,
    bottom: 0,
    elevation: 5,
    height: 40,
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: 40,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginBottom: 8,
    marginTop: 8,
    textAlign: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: '600',
  },
});
