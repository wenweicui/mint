import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { format, addMonths, addYears, subMonths, subYears } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { PeriodType } from '@/types/reports';
interface Props {
  periodType: PeriodType;
  selectedPeriod: Date;
  onPeriodChange: (date: Date) => void;
}

export function ChartPeriodPicker({ periodType, selectedPeriod, onPeriodChange }: Props) {
  const handlePrevious = () => {
    if (periodType === 'monthly') {
      onPeriodChange(subMonths(selectedPeriod, 1));
    } else {
      onPeriodChange(subYears(selectedPeriod, 1));
    }
  };

  const handleNext = () => {
    if (periodType === 'monthly') {
      onPeriodChange(addMonths(selectedPeriod, 1));
    } else {
      onPeriodChange(addYears(selectedPeriod, 1));
    }
  };

  const periodLabel = periodType === 'monthly'
    ? format(selectedPeriod, 'MMMM yyyy')
    : format(selectedPeriod, 'yyyy');

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePrevious} style={styles.button}>
        <Ionicons name="chevron-back" size={24} color="#666" />
      </TouchableOpacity>
      
      <ThemedText style={styles.periodText}>{periodLabel}</ThemedText>
      
      <TouchableOpacity onPress={handleNext} style={styles.button}>
        <Ionicons name="chevron-forward" size={24} color="#666" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  button: {
    padding: 8,
  },
  periodText: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 16,
  },
}); 