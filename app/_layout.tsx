import { Stack } from 'expo-router';

import { AppProviders } from '../src/AppProviders';

export default function Layout() {
  return (
    <AppProviders>
      <Stack />
    </AppProviders>
  );
}
