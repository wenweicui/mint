import type { PropsWithChildren, ReactNode } from 'react';
import { StyleSheet, useColorScheme, ViewStyle } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
  withSpring,
} from 'react-native-reanimated';

import { ThemedView } from '@/components/ThemedView';
import { useBottomTabOverflow } from '@/components/ui/TabBarBackground';

interface Props extends PropsWithChildren {
  headerContent: ReactNode;
  headerBackgroundColor: { dark: string; light: string };
  headerMinHeight?: number;
  headerMaxHeight?: number;
  headerStyle?: ViewStyle;
  contentStyle?: ViewStyle;
  onScroll?: (offset: number) => void;
  refreshControl?: ReactNode;
}

export default function ParallaxScrollView({
  children,
  headerContent,
  headerBackgroundColor,
  headerMinHeight = 60,
  headerMaxHeight = 250,
  headerStyle,
  contentStyle,
  onScroll,
  refreshControl,
}: Props) {
  const colorScheme = useColorScheme() ?? 'light';
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const bottom = useBottomTabOverflow();

  // Header animations
  const headerAnimatedStyle = useAnimatedStyle(() => {
    const height = interpolate(
      scrollOffset.value,
      [-headerMaxHeight, 0],
      [headerMaxHeight * 2, headerMaxHeight],
      'clamp'
    );

    const translateY = interpolate(
      scrollOffset.value,
      [0, headerMaxHeight],
      [0, -headerMaxHeight / 2],
      'clamp'
    );

    const opacity = interpolate(
      scrollOffset.value,
      [0, headerMaxHeight - headerMinHeight],
      [1, 0],
      'clamp'
    );

    onScroll?.(scrollOffset.value);

    return {
      height: withSpring(height, { damping: 15 }),
      transform: [{ translateY }],
      opacity,
    };
  });

  // Content animations
  const contentAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollOffset.value,
      [-headerMaxHeight, 0, headerMaxHeight],
      [0, 0, headerMaxHeight / 4],
      'clamp'
    );

    return {
      transform: [{ translateY }],
    };
  });

  return (
    <ThemedView style={styles.container}>
      <Animated.ScrollView
        ref={scrollRef}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        scrollIndicatorInsets={{ bottom }}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: bottom + headerMinHeight },
        ]}
        // refreshControl={refreshControl}>
      >
        {/* Header */}
        <Animated.View
          style={[
            styles.header,
            { backgroundColor: headerBackgroundColor[colorScheme] },
            headerStyle,
            headerAnimatedStyle,
          ]}>
          {headerContent}
        </Animated.View>

        {/* Content */}
        <Animated.View style={[styles.content, contentStyle, contentAnimatedStyle]}>
          {children}
        </Animated.View>
      </Animated.ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    marginTop: 250, // Same as default headerMaxHeight
    padding: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: 'transparent',
  },
});
