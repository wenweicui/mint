import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';

interface MenuItem {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  badge?: string;
  badgeColor?: string;
  onPress: () => void;
  rightElement?: React.ReactNode;
}

interface MenuSectionProps {
  title?: string;
  items: MenuItem[];
}

export function MenuSection({ title, items }: MenuSectionProps) {
  return (
    <View style={styles.container}>
      {title && <ThemedText style={styles.title}>{title}</ThemedText>}
      <View style={styles.menu}>
        {items.map((item, index) => (
          <TouchableOpacity
            key={item.label}
            style={[
              styles.menuItem,
              index !== items.length - 1 && styles.menuItemBorder,
            ]}
            onPress={item.onPress}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name={item.icon} size={24} color="#000" />
              <ThemedText style={styles.menuItemLabel}>{item.label}</ThemedText>
            </View>
            
            <View style={styles.menuItemRight}>
              {item.badge && (
                <View style={[styles.badge, item.badgeColor && { backgroundColor: item.badgeColor }]}>
                  <ThemedText style={styles.badgeText}>{item.badge}</ThemedText>
                </View>
              )}
              <Ionicons name="chevron-forward" size={20} color="#666" />
              {item.rightElement}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  menu: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemLabel: {
    fontSize: 16,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
}); 