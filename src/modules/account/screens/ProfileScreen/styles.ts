import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  avatarContainer: {
    alignItems: 'center',
    backgroundColor: '#aaa',
    borderRadius: 50,
    height: 100,
    justifyContent: 'center',
    marginBottom: 16,
    width: 100,
  },
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20,
    paddingHorizontal: 16,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  menuSection: {
    paddingHorizontal: 0,
  },
  profileSection: {
    paddingHorizontal: 16,
    paddingVertical: 32,
  },
  userName: {
    fontSize: 24,
    fontWeight: '600',
  },
});
