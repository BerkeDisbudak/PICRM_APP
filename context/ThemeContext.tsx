import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '@/constants/colors';
import Animated, { 
  useSharedValue,
  withTiming, 
  useAnimatedStyle, 
  interpolateColor 
} from 'react-native-reanimated';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  colors: typeof colors.light | typeof colors.dark;
  AnimatedView: typeof Animated.View;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const colorScheme = Appearance.getColorScheme();
    return colorScheme === 'dark' ? 'dark' : 'light';
  });

  const progress = useSharedValue(theme === 'dark' ? 1 : 0);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme) {
          setTheme(savedTheme as Theme);
          progress.value = savedTheme === 'dark' ? 1 : 0;
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };
    loadTheme();
  }, []);

  useEffect(() => {
    if (Platform.OS === 'web') {
      document.body.style.backgroundColor = 
        theme === 'dark' ? colors.dark.background : colors.light.background;
    }
  }, [theme]);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    progress.value = withTiming(newTheme === 'dark' ? 1 : 0, { duration: 300 });
    try {
      await AsyncStorage.setItem('theme', newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const AnimatedView = ({ style, ...props }: any) => {
    const animatedStyle = useAnimatedStyle(() => {
      const backgroundColor = interpolateColor(
        progress.value,
        [0, 1],
        [colors.light.background, colors.dark.background]
      );

      return {
        backgroundColor,
        ...style,
      };
    });

    return <Animated.View style={animatedStyle} {...props} />;
  };

  const currentColors = theme === 'light' ? colors.light : colors.dark;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors: currentColors, AnimatedView }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};