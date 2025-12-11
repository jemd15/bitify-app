import { Stack } from 'expo-router';
import { AppProviders } from '@src/AppProviders';

export default function Layout() {
  return (
    <AppProviders>
      <Stack screenOptions={{ headerShown: false }}></Stack>
    </AppProviders>
  );
}
