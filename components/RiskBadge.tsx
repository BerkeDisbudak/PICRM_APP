import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { TriangleAlert as AlertTriangle, CircleAlert as AlertCircle, CircleCheck as CheckCircle } from 'lucide-react-native';

type RiskLevel = 'high' | 'medium' | 'low';

interface RiskBadgeProps {
  riskLevel: RiskLevel;
  size?: 'small' | 'medium' | 'large';
}

export function RiskBadge({ riskLevel, size = 'medium' }: RiskBadgeProps) {
  const { colors } = useTheme();
  
  const riskConfig = {
    high: {
      color: colors.high,
      icon: <AlertCircle size={size === 'small' ? 14 : 16} color={colors.high} />,
      label: 'Yüksek Risk',
    },
    medium: {
      color: colors.medium,
      icon: <AlertTriangle size={size === 'small' ? 14 : 16} color={colors.medium} />,
      label: 'Orta Risk',
    },
    low: {
      color: colors.low,
      icon: <CheckCircle size={size === 'small' ? 14 : 16} color={colors.low} />,
      label: 'Düşük Risk',
    }
  };
  
  const config = riskConfig[riskLevel];
  
  const fontSize = size === 'small' ? 12 : size === 'medium' ? 14 : 16;
  const paddingVertical = size === 'small' ? 4 : size === 'medium' ? 6 : 8;
  const paddingHorizontal = size === 'small' ? 8 : size === 'medium' ? 10 : 12;
  
  return (
    <View 
      style={[
        styles.badge, 
        { 
          backgroundColor: `${config.color}20`,
          paddingVertical,
          paddingHorizontal,
        }
      ]}
    >
      {config.icon}
      <Text 
        style={[
          styles.text, 
          { color: config.color, fontSize, marginLeft: size === 'small' ? 4 : 6 }
        ]}
      >
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
  },
  text: {
    fontFamily: 'Inter-Medium',
  },
});