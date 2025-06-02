import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { RiskBadge } from './RiskBadge';
import { Bookmark } from 'lucide-react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';

interface Insight {
  id: string;
  title: string;
  summary: string;
  date: string;
  riskLevel: 'high' | 'medium' | 'low';
  isFavorite?: boolean;
}

interface InsightCardProps {
  insight: Insight;
  onPress: () => void;
}

export function InsightCard({ insight, onPress }: InsightCardProps) {
  const { colors } = useTheme();
  const [isFavorite, setIsFavorite] = React.useState(insight.isFavorite || false);

  const toggleFavorite = (event: any) => {
    event.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <Animated.View entering={FadeInRight.duration(400)}>
      <Pressable
        style={({ pressed }) => [
          styles.container,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            transform: [{ scale: pressed ? 0.98 : 1 }],
          },
        ]}
        onPress={onPress}
      >
        <View style={styles.header}>
          <RiskBadge riskLevel={insight.riskLevel} size="small" />
          <Pressable onPress={toggleFavorite} style={styles.bookmarkButton}>
            <Bookmark
              size={20}
              color={isFavorite ? colors.primary : colors.textTertiary}
              fill={isFavorite ? colors.primary : 'transparent'}
            />
          </Pressable>
        </View>

        <Text
          style={[styles.title, { color: colors.text }]}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {insight.title}
        </Text>

        <Text
          style={[styles.summary, { color: colors.textSecondary }]}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {insight.summary}
        </Text>

        <Text style={[styles.date, { color: colors.textTertiary }]}>
          {insight.date}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    marginBottom: 8,
  },
  summary: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  date: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
  bookmarkButton: {
    padding: 4,
  },
});