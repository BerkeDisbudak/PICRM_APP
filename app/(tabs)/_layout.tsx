import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
// İkonlar için doğru import yolları (lucide-react-native)
import { Chrome as Home, FileText, TrendingUp, Settings, Lock } from 'lucide-react-native';

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          height: 90, // Yüksekliği artırıldı (örneğin 84'ten 90'a)
          paddingBottom: 24, // Alt dolgu korunabilir veya biraz azaltılabilir (örn: 20)
          paddingTop: 8,     // Üst dolgu korunabilir veya biraz azaltılabilir (örn: 4)
          elevation: 0,      // Android'deki gölgeyi kaldırır
          shadowOpacity: 0,  // iOS'teki gölgeyi kaldırır
          borderTopWidth: 1, // Üst kenarlık kalınlığı
        },
        tabBarActiveTintColor: colors.primary,      // Aktif sekme metin ve ikon rengi
        tabBarInactiveTintColor: colors.textTertiary, // Pasif sekme metin ve ikon rengi
        tabBarLabelStyle: {
          fontFamily: 'Inter-Medium', // Font ailesi
          fontSize: 13,                // Font boyutu
          marginTop: 2,                // İkon ile metin arasındaki boşluk azaltıldı (örneğin 4'ten 2'ye)
        },
        tabBarIconStyle: {
          marginBottom: 0, // İkonun altında boşluk bırakılmaz
        },
        headerShown: false, // Her bir ekranın başlığını gizler
      }}
    >
      {/* Ana Sayfa Sekmesi */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Ana Sayfa', // Sekme başlığı
          tabBarIcon: ({ color, size }) => (
            <View style={styles.iconContainer}>
              <Home color={color} size={size} />
            </View>
          ),
        }}
      />
      {/* Raporlar Sekmesi */}
      <Tabs.Screen
        name="reports"
        options={{
          title: 'Raporlar',
          tabBarIcon: ({ color, size }) => (
            <View style={styles.iconContainer}>
              <FileText color={color} size={size} />
            </View>
          ),
        }}
      />
      {/* Trendler Sekmesi */}
      <Tabs.Screen
        name="trends"
        options={{
          title: 'Trendler',
          tabBarIcon: ({ color, size }) => (
            <View style={styles.iconContainer}>
              <TrendingUp color={color} size={size} />
            </View>
          ),
        }}
      />
      {/* Gizlilik Sekmesi */}
      <Tabs.Screen
        name="privacy"
        options={{
          title: 'Gizlilik',
          tabBarIcon: ({ color, size }) => (
            <View style={styles.iconContainer}>
              <Lock color={color} size={size} />
            </View>
          ),
        }}
      />
      {/* Ayarlar Sekmesi */}
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Ayarlar',
          tabBarIcon: ({ color, size }) => (
            <View style={styles.iconContainer}>
              <Settings color={color} size={size} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 32, // İkon kapsayıcısının genişliği
    height: 32, // İkon kapsayıcısının yüksekliği
  },
});