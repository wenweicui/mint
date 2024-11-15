import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

interface CategoryRanking {
  category: string;
  amount: number;
  percentage: number;
}

interface Props {
  categories: CategoryRanking[];
  isLoading: boolean;
  error: string | null;
}

export function CategoryRankingList({ categories, isLoading, error }: Props) {
  if (isLoading) return <ThemedText>Loading...</ThemedText>;
  if (error) return <ThemedText>{error}</ThemedText>;

  return (
    <View style={styles.container}>
      {categories.map((category, index) => (
        <View key={category.category} style={styles.categoryRow}>
          <View style={styles.rankInfo}>
            <ThemedText style={styles.rank}>#{index + 1}</ThemedText>
            <ThemedText style={styles.category}>{category.category}</ThemedText>
          </View>
          
          <View style={styles.amountInfo}>
            <ThemedText style={styles.amount}>
              ${category.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </ThemedText>
            <ThemedText style={styles.percentage}>
              {category.percentage.toFixed(1)}%
            </ThemedText>
          </View>
          
          <View style={[styles.progressBar, { width: `${category.percentage}%` }]} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  rankInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rank: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
    width: 30,
  },
  category: {
    fontSize: 14,
  },
  amountInfo: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 14,
    fontWeight: '600',
  },
  percentage: {
    fontSize: 12,
    color: '#666',
  },
  progressBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 2,
    backgroundColor: '#2563EB',
    opacity: 0.2,
    borderRadius: 1,
  },
}); 