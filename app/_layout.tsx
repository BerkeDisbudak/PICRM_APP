import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { ThemeProvider } from '@/context/ThemeContext';
import { SplashScreen } from 'expo-router';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { supabase } from '@/lib/supabase';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();
  const [showSplash, setShowSplash] = useState(true);
  const [session, setSession] = useState<any>(null);
  const segments = useSegments();
  const router = useRouter();
  
  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    if (!fontsLoaded || fontError) return;

    const inAuthGroup = segments[0] === '(auth)';

    // Show splash screen for 2 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
      SplashScreen.hideAsync();
      
      // After splash screen, handle navigation based on auth state
      if (!session && !inAuthGroup) {
        router.replace('/login');
      } else if (session && inAuthGroup) {
        router.replace('/(tabs)');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [fontsLoaded, fontError, session, segments]);

  // Return null to keep splash screen visible while fonts load
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ThemeProvider>
      {showSplash ? (
        <Animated.View 
          entering={FadeIn.duration(1000)}
          exiting={FadeOut.duration(500)}
          style={styles.splashContainer}
        >
          <Text style={styles.splashTitle}>πCRM</Text>
          <Text style={styles.splashSubtitle}>by DijitalPi</Text>
        </Animated.View>
      ) : (
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'fade',
            animationDuration: 200,
          }}
        >
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen 
            name="report/[id]" 
            options={{ 
              presentation: 'card',
              animation: 'slide_from_right',
            }} 
          />
          <Stack.Screen name="+not-found" options={{ title: 'Not Found' }} />
        </Stack>
      )}
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#4361EE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 48,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  splashSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 18,
    color: '#FFFFFF',
    opacity: 0.8,
  },
});