import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Switch, Image } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'expo-router';
import { ArrowLeft, Check, Lock } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function PrivacyScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  
  const [settings, setSettings] = useState({
    twoFactor: true,
    biometric: false,
    shareData: true,
    emailUpdates: true,
    pushNotifications: true,
    dataCollection: true,
  });
  
  const [success, setSuccess] = useState(false);
  
  const handleSave = () => {
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={colors.text} />
          </Pressable>
          <View style={styles.titleContainer}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Gizlilik</Text>
            <Lock size={20} color={colors.primary} style={styles.headerIcon} />
          </View>
        </View>
        <Image 
          source={{ uri: 'https://dijitalpi.com/wp-content/uploads/2024/10/DijitalPi-Dijital-Pazarlama-Ajansi-Logo.png' }}
          style={styles.logo}
        />
      </View>
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Güvenlik
          </Text>
          
          <Animated.View 
            entering={FadeIn.duration(400)}
            style={[styles.card, { backgroundColor: colors.card }]}
          >
            <View style={styles.setting}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>
                  İki Faktörlü Doğrulama
                </Text>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                  Hesabınıza ekstra güvenlik katmanı ekleyin
                </Text>
              </View>
              <Switch
                value={settings.twoFactor}
                onValueChange={() => toggleSetting('twoFactor')}
                trackColor={{ false: colors.border, true: colors.primary }}
              />
            </View>
            
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            
            <View style={styles.setting}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>
                  Biyometrik Giriş
                </Text>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                  Face ID veya Touch ID ile giriş yapın
                </Text>
              </View>
              <Switch
                value={settings.biometric}
                onValueChange={() => toggleSetting('biometric')}
                trackColor={{ false: colors.border, true: colors.primary }}
              />
            </View>
          </Animated.View>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Gizlilik
          </Text>
          
          <Animated.View 
            entering={FadeIn.duration(400)}
            style={[styles.card, { backgroundColor: colors.card }]}
          >
            <View style={styles.setting}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>
                  Kullanım Verilerini Paylaş
                </Text>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                  Anonim kullanım verilerini paylaşarak iyileştirmelere katkıda bulunun
                </Text>
              </View>
              <Switch
                value={settings.shareData}
                onValueChange={() => toggleSetting('shareData')}
                trackColor={{ false: colors.border, true: colors.primary }}
              />
            </View>
            
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            
            <View style={styles.setting}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>
                  Veri Toplama
                </Text>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                  Yapay zekanın iş verilerinizi analiz etmesine izin verin
                </Text>
              </View>
              <Switch
                value={settings.dataCollection}
                onValueChange={() => toggleSetting('dataCollection')}
                trackColor={{ false: colors.border, true: colors.primary }}
              />
            </View>
          </Animated.View>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Bildirimler
          </Text>
          
          <Animated.View 
            entering={FadeIn.duration(400)}
            style={[styles.card, { backgroundColor: colors.card }]}
          >
            <View style={styles.setting}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>
                  E-posta Güncellemeleri
                </Text>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                  Önemli güncellemeleri e-posta ile alın
                </Text>
              </View>
              <Switch
                value={settings.emailUpdates}
                onValueChange={() => toggleSetting('emailUpdates')}
                trackColor={{ false: colors.border, true: colors.primary }}
              />
            </View>
            
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            
            <View style={styles.setting}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>
                  Anlık Bildirimler
                </Text>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                  Cihazınızda gerçek zamanlı uyarılar alın
                </Text>
              </View>
              <Switch
                value={settings.pushNotifications}
                onValueChange={() => toggleSetting('pushNotifications')}
                trackColor={{ false: colors.border, true: colors.primary }}
              />
            </View>
          </Animated.View>
        </View>
      </ScrollView>
      
      <View style={[styles.footer, { backgroundColor: colors.background }]}>
        <Pressable
          style={[styles.saveButton, { backgroundColor: colors.primary }]}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Değişiklikleri Kaydet</Text>
        </Pressable>
      </View>
      
      {success && (
        <Animated.View 
          entering={FadeIn.duration(400)}
          style={[styles.toast, { backgroundColor: colors.success }]}
        >
          <Check size={20} color="#FFFFFF" />
          <Text style={styles.toastText}>Ayarlar başarıyla güncellendi</Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  headerTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 24,
    marginRight: 8,
  },
  headerIcon: {
    marginTop: 2,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    marginBottom: 12,
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  setting: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginBottom: 4,
  },
  settingDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  divider: {
    height: 1,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  saveButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  toast: {
    position: 'absolute',
    bottom: 90,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  toastText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFFFFF',
  },
});