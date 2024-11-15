import { Tabs } from 'expo-router';
import React from 'react';

import { useColorScheme } from '@/hooks/useColorScheme';
import { CustomTabBar } from '@/components/navigation/CustomTabBar';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <CustomTabBar />}
    >
      <Tabs.Screen
        name="index"
        options={{
          href: '/',
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          href: '/reports',
        }}
      />
      {/* <Tabs.Screen
        name="add"
        options={{
          href: '/add',
        }}
      /> */}
      <Tabs.Screen
        name="discover"
        options={{
          href: '/discover',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          href: '/profile',
        }}
      />
    </Tabs>
  );
}
