import { ScrollView, StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { QuickActions } from '@/components/profile/QuickActions';
import { MenuSection } from '@/components/profile/MenuSection';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <ScrollView 
      style={[styles.container, { paddingTop: insets.top }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.profileInfo}>
          <Image
            source={{ uri: 'https://placeholder.com/150' }}
            style={styles.avatar}
          />
          <ThemedText style={styles.username}>John Doe</ThemedText>
        </View>
        
        <TouchableOpacity 
          style={styles.checkInButton}
          onPress={() => router.push('/profile/check-in')}
        >
          <Ionicons name="calendar-outline" size={20} color="#000" />
          <ThemedText style={styles.checkInText}>Check-in</ThemedText>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.stats}>
        <StatItem label="Check-in Streak" value="1" />
        <StatItem label="Total Days" value="1930" />
        <StatItem label="Total Entries" value="3183" />
      </View>

      {/* VIP Banner */}
      <TouchableOpacity 
        style={styles.vipBanner}
        onPress={() => router.push('/profile/vip')}
      >
        <View style={styles.vipLeft}>
          {/* <Ionicons name="crown" size={24} color="#FFD700" /> */}
          <View>
            <ThemedText style={styles.vipTitle}>Upgrade to VIP</ThemedText>
            <ThemedText style={styles.vipSubtitle}>
              Unlock premium features
            </ThemedText>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#666" />
      </TouchableOpacity>

      {/* Quick Actions */}
      <QuickActions />

      {/* Menu Sections */}
      <MenuSection
        title="Account"
        items={[
          {
            icon: 'wallet-outline',
            label: 'My Accounts',
            onPress: () => router.push('/profile/accounts'),
          },
          {
            icon: 'people-outline',
            label: 'Family Budget',
            onPress: () => router.push('/profile/family'),
          },
        ]}
      />

<MenuSection
        title="Settings & Support"
        items={[
          {
            icon: 'settings-outline',
            label: 'Settings',
            onPress: () => router.push('/(app)/profile/settings'),
          },
          {
            icon: 'shield-outline',
            label: 'Security Center',
            badge: 'High Risk',
            badgeColor: '#EF4444',
            onPress: () => router.push('/(app)/profile/security'),
          },
          {
            icon: 'help-circle-outline',
            label: 'Help Center',
            onPress: () => router.push('/(app)/profile/help'),
          },
          {
            icon: 'chatbubble-outline',
            label: 'Feedback',
            onPress: () => router.push('/(app)/profile/feedback'),
          },
          {
            icon: 'star-outline',
            label: 'Rate on App Store',
            onPress: () => {/* Handle app store rating */},
          },
        ]}
      />
    </ScrollView>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statItem}>
      <ThemedText style={styles.statValue}>{value}</ThemedText>
      <ThemedText style={styles.statLabel}>{label}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE135',
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
  },
  username: {
    fontSize: 20,
    fontWeight: '600',
  },
  checkInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  checkInText: {
    fontSize: 14,
    fontWeight: '500',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  vipBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
  },
  vipLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  vipTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  vipSubtitle: {
    fontSize: 14,
    color: '#666',
  },
});
