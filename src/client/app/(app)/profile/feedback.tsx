import { useState } from 'react';
import { 
  ScrollView, 
  StyleSheet, 
  View, 
  TextInput,
  TouchableOpacity,
  Alert 
} from 'react-native';
import { ScreenHeader } from '@/components/navigation/ScreenHeader';
import { ThemedText } from '@/components/ThemedText';

export default function FeedbackScreen() {
  const [feedback, setFeedback] = useState('');
  const [category, setCategory] = useState<string | null>(null);

  const categories = [
    'Bug Report',
    'Feature Request',
    'User Experience',
    'Other',
  ];

  const handleSubmit = () => {
    if (!category) {
      Alert.alert('Error', 'Please select a category');
      return;
    }
    if (!feedback.trim()) {
      Alert.alert('Error', 'Please enter your feedback');
      return;
    }
    // Handle feedback submission
    Alert.alert('Success', 'Thank you for your feedback!');
  };

  return (
    <ScrollView style={styles.container}>
      <ScreenHeader title="Feedback" />

      <View style={styles.content}>
        <ThemedText style={styles.label}>Category</ThemedText>
        <View style={styles.categories}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryButton,
                category === cat && styles.categoryButtonActive,
              ]}
              onPress={() => setCategory(cat)}
            >
              <ThemedText
                style={[
                  styles.categoryText,
                  category === cat && styles.categoryTextActive,
                ]}
              >
                {cat}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        <ThemedText style={styles.label}>Your Feedback</ThemedText>
        <TextInput
          style={styles.input}
          multiline
          numberOfLines={6}
          placeholder="Please describe your feedback here..."
          value={feedback}
          onChangeText={setFeedback}
          textAlignVertical="top"
        />

        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <ThemedText style={styles.submitText}>Submit Feedback</ThemedText>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  categoryButtonActive: {
    backgroundColor: '#FFE135',
    borderColor: '#FFE135',
  },
  categoryText: {
    color: '#666',
  },
  categoryTextActive: {
    color: '#000',
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 24,
    height: 120,
  },
  submitButton: {
    backgroundColor: '#000',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 