import { Redirect } from 'expo-router';
import { useAuthSession } from '@modules/auth/hooks/useAuthSession';
import { Spinner } from '@gluestack-ui/themed';
import { View, StyleSheet } from 'react-native';

export default function Index() {
  const { data: session, isLoading } = useAuthSession();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Spinner size="large" />
      </View>
    );
  }

  if (session) {
    return <Redirect href="/(tabs)/home" />;
  }

  return <Redirect href="/account/auth" />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
