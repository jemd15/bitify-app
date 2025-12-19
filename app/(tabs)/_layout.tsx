import { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthSession } from '@modules/auth/hooks/useAuthSession';
import { useOnboardingCheck } from '@modules/auth/hooks/useOnboardingCheck';
import { AccountCoordinator } from '@modules/account/coordinator/AccountCoordinator';
import { AuthCoordinator } from '@modules/auth/coordinator/AuthCoordinator';

export default function TabsLayout() {
  const { data: session, isLoading: isLoadingSession } = useAuthSession();
  const { data: needsOnboarding, isLoading: isLoadingOnboarding } = useOnboardingCheck();

  useEffect(() => {
    if (!isLoadingSession && !isLoadingOnboarding) {
      if (!session) {
        AccountCoordinator.navigateToAuth();
      } else if (needsOnboarding) {
        AuthCoordinator.navigateToOnboarding();
      }
    }
  }, [isLoadingSession, isLoadingOnboarding, session, needsOnboarding]);

  return isLoadingSession || isLoadingOnboarding ? null : (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: 'Tasks',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="checkmark-circle" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
