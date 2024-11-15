import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';

const ACTIONS = [
  {
    id: 'coupons',
    icon: 'ticket',
    label: 'Coupons',
    color: '#FFE135',
  },
  {
    id: 'assets',
    icon: 'shield',
    label: 'Assets',
    color: '#FFE135',
  },
  {
    id: 'receipts',
    icon: 'receipt',
    label: 'Receipts',
    color: '#FFE135',
  },
  {
    id: 'mortgage',
    icon: 'home',
    label: 'Mortgage\nCalculator',
    color: '#FFE135',
  },
  {
    id: 'exchange',
    icon: 'calculator',
    label: 'Exchange\nRate',
    color: '#FFE135',
  },
];

export function QuickActions() {
  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Quick Actions</ThemedText>
      <View style={styles.grid}>
        {ACTIONS.map((action) => (
          <TouchableOpacity key={action.id} style={styles.action}>
            <View style={[styles.iconContainer, { backgroundColor: action.color }]}>
              <Ionicons name={action.icon as any} size={24} color="#000" />
            </View>
            <ThemedText style={styles.label}>{action.label}</ThemedText>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  action: {
    width: '18%',
    alignItems: 'center',
    gap: 8,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 12,
    textAlign: 'center',
  },
}); 