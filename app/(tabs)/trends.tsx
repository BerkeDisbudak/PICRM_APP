import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { TrendingUp, TrendingDown, Pi } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function TrendsScreen() {
  const { colors } = useTheme();

  const trends = [
    {
      title: 'Müşteri Memnuniyeti',
      value: '92%',
      change: '+5%',
      isPositive: true,
    },
    {
      title: 'Ortalama Yanıt Süresi',
      value: '2.5 saat',
      change: '-30dk',
      isPositive: true,
    },
    {
      title: 'Aktif Kullanıcılar',
      value: '1,234',
      change: '+12%',
      isPositive: true,
    },
    {
      title: 'Bekleyen Talepler',
      value: '45',
      change: '+8',
      isPositive: false,
    },
    {
      title: 'Dönüşüm Oranı',
      value: '3.8%',
      change: '+0.5%',
      isPositive: true,
    },
    {
      title: 'Ortalama Oturum Süresi',
      value: '12.5 dk',
      change: '+2.3 dk',
      isPositive: true,
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>Trendler</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Son 30 günün analizi
          </Text>
        </View>
        <Pi size={32} color={colors.primary} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {trends.map((trend, index) => (
          <Animated.View
            key={trend.title}
            entering={FadeInDown.delay(index * 100)}
            style={[styles.card, { backgroundColor: colors.card }]}
          >
            <View style={styles.cardContent}>
              <Text style={[styles.trendTitle, { color: colors.text }]}>
                {trend.title}
              </Text>
              <Text style={[styles.trendValue, { color: colors.text }]}>
                {trend.value}
              </Text>
              <View style={styles.changeContainer}>
                {trend.isPositive ? (
                  <TrendingUp size={16} color={colors.success} />
                ) : (
                  <TrendingDown size={16} color={colors.error} />
                )}
                <Text
                  style={[
                    styles.changeText,
                    { color: trend.isPositive ? colors.success : colors.error },
                  ]}
                >
                  {trend.change}
                </Text>
              </View>
            </View>
          </Animated.View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    borderRadius: 16,
    marginBottom: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardContent: {
    alignItems: 'flex-start',
  },
  trendTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginBottom: 8,
  },
  trendValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    marginBottom: 8,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginLeft: 4,
  },
});