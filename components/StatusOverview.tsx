import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { ArrowDown, ArrowUp } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

export function StatusOverview() {
  const { colors } = useTheme();
  
  const metrics = [
    { 
      label: 'Risk Skoru', 
      value: '32%', 
      change: -3, 
      isPositive: true 
    },
    { 
      label: 'Yeni Öngörüler', 
      value: '18', 
      change: 5, 
      isPositive: true 
    },
    { 
      label: 'Bildirimler', 
      value: '4', 
      change: 2, 
      isPositive: false 
    }
  ];

  return (
    <Animated.View 
      entering={FadeIn.duration(800)}
      style={styles.container}
    >
      <View style={[styles.metricsContainer, { backgroundColor: colors.card }]}>
        {metrics.map((metric, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
            )}
            <View style={styles.metricItem}>
              <Text style={[styles.metricValue, { color: colors.text }]}>
                {metric.value}
              </Text>
              
              <View style={styles.metricDetails}>
                <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
                  {metric.label}
                </Text>
                
                <View style={styles.changeContainer}>
                  {metric.change !== 0 && (
                    <>
                      {metric.isPositive ? (
                        <ArrowUp size={12} color={colors.success} />
                      ) : (
                        <ArrowDown size={12} color={colors.error} />
                      )}
                      <Text 
                        style={[
                          styles.changeText, 
                          { 
                            color: metric.isPositive ? colors.success : colors.error 
                          }
                        ]}
                      >
                        {Math.abs(metric.change)}
                      </Text>
                    </>
                  )}
                </View>
              </View>
            </View>
          </React.Fragment>
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  metricsContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 16,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    marginHorizontal: 8,
  },
  metricValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    marginBottom: 4,
  },
  metricDetails: {
    alignItems: 'center',
  },
  metricLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    textAlign: 'center',
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  changeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    marginLeft: 2,
  },
});