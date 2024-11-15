import { View, StyleSheet, Pressable, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useBottomTab } from './BottomTabContext';
import { ThemedText } from '@/components/ThemedText';

interface TabItem {
  route: 'list' | 'chart' | 'add' | 'discover' | 'profile';
  label: string;
  icon: {
    active: keyof typeof Ionicons.glyphMap;
    inactive: keyof typeof Ionicons.glyphMap;
  };
  href: string;
}

const TAB_ITEMS: TabItem[] = [
  {
    route: 'list',
    label: 'Transactions',
    icon: {
      active: 'list',
      inactive: 'list-outline',
    },
    href: '/',
  },
  {
    route: 'chart',
    label: 'Reports',
    icon: {
      active: 'stats-chart',
      inactive: 'stats-chart-outline',
    },
    href: '/chart',
  },
  {
    route: 'add',
    label: 'Add Transaction',
    icon: {
      active: 'add-circle',
      inactive: 'add-circle',
    },
    href: '/add',
  },
  {
    route: 'discover',
    label: 'Discover',
    icon: {
      active: 'compass',
      inactive: 'compass-outline',
    },
    href: '/discover',
  },
  {
    route: 'profile',
    label: 'Profile',
    icon: {
      active: 'person',
      inactive: 'person-outline',
    },
    href: '/profile',
  },
];

export function CustomTabBar() {
  const { bottom } = useSafeAreaInsets();
  const router = useRouter();
  const { activeRoute, setActiveRoute } = useBottomTab();

  const handlePress = (item: TabItem) => {
    setActiveRoute(item.route);
    router.push(item.href);
  };

  return (
    <View style={[styles.container, { paddingBottom: bottom }]}>
      {TAB_ITEMS.map((item) => (
        <Pressable
          key={item.route}
          style={[
            styles.tabItem,
            item.route === 'add' && styles.addButton,
          ]}
          onPress={() => handlePress(item)}
        >
          {item.route === 'add' ? (
            <View style={styles.addButtonInner}>
              <Ionicons
                name={item.icon.active}
                size={32}
                color="#FFE135"
              />
            </View>
          ) : (
            <>
              <Ionicons
                name={activeRoute === item.route ? item.icon.active : item.icon.inactive}
                size={24}
                color={activeRoute === item.route ? '#000' : '#666'}
              />
              <ThemedText
                style={[
                  styles.label,
                  activeRoute === item.route && styles.activeLabel,
                ]}
              >
                {item.label}
              </ThemedText>
            </>
          )}
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  label: {
    fontSize: 12,
    marginTop: 4,
    color: '#666',
  },
  activeLabel: {
    color: '#000',
    fontWeight: '500',
  },
  addButton: {
    marginTop: -20,
  },
  addButtonInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
}); 