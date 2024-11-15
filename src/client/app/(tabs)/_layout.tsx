import { Tabs } from 'expo-router';
import { CustomTabBar } from '@/components/navigation/CustomTabBar';

export default function TabsLayout() {
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
        name="chart"
        options={{
          href: '/chart',
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          href: '/add',
        }}
      />
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
