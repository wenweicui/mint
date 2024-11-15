import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';

const QUICK_ACTIONS = [
  {
    icon: 'notifications-outline',
    label: 'Notifications',
    route: '/profile/notifications',
  },
  {
    icon: 'trophy-outline',
    label: 'Achievements',
    route: '/profile/achievements',
  },
  {
    icon: 'gift-outline',
    label: 'Points',
    badge: 'Collect',
    route: '/profile/points',
  },
  {
    icon: 'people-outline',
    label: 'Invite Friends',
    badge: 'VIP',
    route: '/profile/invite',
  },
  {
    icon: 'settings-outline',
    label: 'Settings',
    route: '/profile/settings',
  },
];

export function QuickActions() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {QUICK_ACTIONS.map((action) => (
        <TouchableOpacity
          key={action.label}
          style={styles.action}
          onPress={() => router.push(action.route)}
        >
          <View style={styles.iconContainer}>
            {/* <Ionicons name={action.icon} size={24} color="#000" /> */}
            {action.badge && (
              <View style={styles.badge}>
                <ThemedText style={styles.badgeText}>
                  {action.badge}
                </ThemedText>
              </View>
            )}
          </View>
          <ThemedText style={styles.label}>{action.label}</ThemedText>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
  },
  action: {
    alignItems: 'center',
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 4,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#EF4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '500',
  },
  label: {
    fontSize: 12,
  },
}); 