import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface ActionButtonProps {
  icon: React.ReactNode;
  onPress: () => void;
}

export function ActionButton({ icon, onPress }: ActionButtonProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        { 
          backgroundColor: pressed ? colors.cardHover : colors.card,
          borderColor: colors.border,
        },
      ]}
      onPress={onPress}
    >
      {icon}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    borderWidth: 1,
  },
});