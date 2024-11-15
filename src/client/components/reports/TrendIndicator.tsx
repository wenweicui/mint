import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';

interface TrendIndicatorProps {
  value: number;
  type?: 'positive-up' | 'positive-down';
  size?: 'small' | 'medium' | 'large';
}

export function TrendIndicator({ 
  value, 
  type = 'positive-up',
  size = 'medium' 
}: TrendIndicatorProps) {
  const isPositive = value > 0;
  const isGood = (type === 'positive-up' && isPositive) || 
                 (type === 'positive-down' && !isPositive);

  return (
    <View style={[
      styles.container,
      styles[size],
      isGood ? styles.positive : styles.negative
    ]}>
      <Ionicons
        name={isPositive ? 'arrow-up' : 'arrow-down'}
        size={size === 'small' ? 12 : size === 'medium' ? 16 : 20}
        color={isGood ? '#10B981' : '#EF4444'}
      />
      <ThemedText style={[
        styles.text,
        styles[size === 'small' ? 'textSmall' : size === 'medium' ? 'textMedium' : 'textLarge'],
        isGood ? styles.positiveText : styles.negativeText
      ]}>
        {Math.abs(value).toFixed(1)}%
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 8,
  },
  small: {
    paddingVertical: 2,
  },
  medium: {
    paddingVertical: 4,
  },
  large: {
    paddingVertical: 6,
  },
  positive: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  negative: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  text: {
    marginLeft: 4,
    fontWeight: '600',
  },
  textSmall: {
    fontSize: 12,
  },
  textMedium: {
    fontSize: 14,
  },
  textLarge: {
    fontSize: 16,
  },
  positiveText: {
    color: '#10B981',
  },
  negativeText: {
    color: '#EF4444',
  },
}); 