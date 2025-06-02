import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Pressable, RefreshControl, TextInput, Modal, Dimensions } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'expo-router';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { FileText, RefreshCw, Sun, Moon, MoreVertical } from 'lucide-react-native';
import { Report, createReport, getReports, supabase } from '@/lib/supabase';
import Animated, { FadeInDown, FadeOut, Layout, useAnimatedStyle, withRepeat, withTiming, withSequence, FadeIn, SlideInRight, SlideOutRight } from 'react-native-reanimated'; // SlideInRight, SlideOutRight eklendi
import { TrendCapsule } from '@/components/TrendCapsule'; // TrendCapsule'ın doğru import edildiğinden emin olun!

// Ekran boyutlarını alalım, modal konumlandırması için
const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const { colors, theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showNewReport, setShowNewReport] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [creating, setCreating] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [user, setUser] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false); // Modal görünürlüğü için state

  // Animation style for refresh icon (for the spinning effect)
  const refreshIconStyle = useAnimatedStyle(() => {
    if (!isRefreshing) return {};
    return {
      transform: [
        {
          rotate: withRepeat(
            withSequence(
              withTiming('0deg', { duration: 0 }),
              withTiming('360deg', { duration: 1000 })
            ),
            -1, // Sonsuz tekrar
            false
          ),
        },
      ],
    };
  });

  // Tema değiştirme ikonu animasyonu (Menü içinde kullanılacak)
  const themeIconAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: withTiming(isMenuVisible ? 1.1 : 1, { duration: 200 }) },
        { rotate: withTiming(isMenuVisible ? '360deg' : '0deg', { duration: 400 }) },
      ],
    };
  }, [theme, isMenuVisible]); // isMenuVisible değiştiğinde de tetikle

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting('Günaydın');
    } else if (hour >= 12 && hour < 18) {
      setGreeting('İyi Günler');
    } else {
      setGreeting('İyi Akşamlar');
    }
  }, []);

  useEffect(() => {
    fetchUserData();
    fetchReports();

    const channel = supabase
      .channel('reports_channel')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'Reports'
      }, () => {
        fetchReports();
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  async function fetchUserData() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  }

  async function fetchReports() {
    try {
      const data = await getReports();
      setReports(data || []);
    } catch (err) {
      setError('Raporlar yüklenirken bir hata oluştu.');
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setIsRefreshing(false);
    }
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setError(null);
    fetchReports();
  }, []);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setIsMenuVisible(false); // Menüyü kapat
    fetchReports();
  };

  const handleToggleTheme = () => {
    toggleTheme();
    setIsMenuVisible(false); // Menüyü kapat
  };

  const handleCreateReport = async () => {
    if (!newContent.trim()) {
      setError('Lütfen rapor içeriği giriniz');
      return;
    }

    setCreating(true);
    setError(null);

    try {
      await createReport('Untitled Report', newContent.trim());
      setNewContent('');
      setShowNewReport(false);
      fetchReports();
    } catch (err) {
      setError('Rapor oluşturulurken bir hata oluştu');
      console.error('Error creating report:', err);
    } finally {
      setCreating(false);
    }
  };

  const renderReport = ({ item }: { item: Report }) => (
    <Animated.View entering={FadeInDown.duration(400)} layout={Layout.springify()}>
      <Pressable
        style={({ pressed }) => [
          styles.card,
          {
            backgroundColor: colors.card,
            transform: [{ scale: pressed ? 0.98 : 1 }],
            borderColor: `${colors.border}50`, // Hafif border rengi
            borderWidth: 1,
          },
        ]}
        onPress={() => router.push(`/report/${item.id}`)}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.cardIconContainer, { backgroundColor: `${colors.primary}15` }]}>
            <FileText size={24} color={colors.primary} />
          </View>
          <View style={styles.contentContainer}>
            <Text 
              style={[styles.content, { color: colors.textSecondary }]}
              numberOfLines={3} // Rapor içeriği 3 satırla sınırlı
            >
              {item.report}
            </Text>
            <Text style={[styles.date, { color: colors.textTertiary }]}>
              {format(new Date(item.created_at), 'dd MMMM, HH:mm', { locale: tr })} {/* Tarih formatı düzeltildi */}
            </Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Raporlar yükleniyor...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Ayarlar ve Yenileme Menüsü Modalı */}
      <Modal
        animationType="fade" // Arka plan soluklaşması için fade animasyonu
        transparent={true}  // Arka planı şeffaf yapar
        visible={isMenuVisible} // Görünürlük state'i
        onRequestClose={() => setIsMenuVisible(false)} // Geri tuşuna basıldığında menüyü kapat
      >
        {/* Overlay'e basınca menüyü kapat */}
        <Pressable style={styles.modalOverlay} onPress={() => setIsMenuVisible(false)}>
          {/* Menü Kutusu - Sola doğru kayarak açılacak animasyon */}
          <Animated.View 
            entering={SlideInRight.duration(300)} // Sağa kayarak girme animasyonu
            exiting={SlideOutRight.duration(300)} // Sağa kayarak çıkış animasyonu
            style={[styles.menuContainer, { backgroundColor: colors.card }]}
          >
            {/* Raporları Yenile Seçeneği */}
            <Pressable
              style={styles.menuItem}
              onPress={handleManualRefresh}
              disabled={isRefreshing}
            >
              <Text style={[styles.menuItemText, { color: colors.text }]}>
                Raporları Yenile
              </Text>
              {isRefreshing && <ActivityIndicator size="small" color={colors.primary} style={styles.menuItemIcon} />}
            </Pressable>
            <View style={[styles.menuDivider, { backgroundColor: colors.border }]} />
            {/* Tema Değiştirme Seçeneği */}
            <Pressable style={styles.menuItem} onPress={handleToggleTheme}>
              <Text style={[styles.menuItemText, { color: colors.text }]}>
                {theme === 'dark' ? "Açık Tema" : "Koyu Tema"}
              </Text>
              {/* Tema ikonlarının animasyonu buraya uygulandı */}
              <Animated.View style={themeIconAnimatedStyle}>
                {theme === 'dark' ? (
                  <Sun size={20} color={colors.text} style={styles.menuItemIcon} />
                ) : (
                  <Moon size={20} color={colors.text} style={styles.menuItemIcon} />
                )}
              </Animated.View>
            </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>

      {/* Ana Sayfa Başlık ve Tuş Bölümü */}
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
          <Text style={[styles.greeting, { color: colors.textSecondary }]}>
            {greeting},
          </Text>
          <Text style={[styles.userName, { color: colors.text }]}>
            {user?.user_metadata?.display_name || 'Kullanıcı'}
          </Text>
          {/* TrendCapsule artık başlık altında */}
          <View style={styles.trendCapsuleWrapper}>
            <TrendCapsule />
          </View>
          <Text style={[styles.aiText, { color: colors.primary }]}>
            Yapay Zeka Raporlarınız Hazır
          </Text>
        </View>
        
        {/* Ayarlar tuşu - Başlığın sağ üstünde çaprazda */}
        <Pressable
          style={[styles.settingsButton, { backgroundColor: colors.card }]}
          onPress={() => setIsMenuVisible(true)} // Tuşa basıldığında menüyü aç
        >
          {isRefreshing ? ( // Yenileme aktifken refresh ikonu döner
            <Animated.View style={refreshIconStyle}>
              <RefreshCw size={20} color={colors.primary} /> {/* Animasyonlu refresh ikonu */}
            </Animated.View>
          ) : (
            <MoreVertical size={20} color={colors.text} /> // Normalde 3 nokta ikonu
          )}
        </Pressable>
      </View>

      {/* Hata Mesajı */}
      {error && (
        <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
      )}

      {/* Yeni Rapor Oluşturma Formu (Gerektiğinde Görünür) */}
      {showNewReport && (
        <View style={[styles.newReportContainer, { backgroundColor: colors.card }]}>
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.border, height: 100 }]}
            placeholder="Rapor İçeriği"
            placeholderTextColor={colors.textTertiary}
            value={newContent}
            onChangeText={setNewContent}
            multiline
            textAlignVertical="top"
          />
          <Pressable
            style={[styles.createButton, { backgroundColor: colors.primary }]}
            onPress={handleCreateReport}
            disabled={creating}
          >
            {creating ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.createButtonText}>Rapor Oluştur</Text>
            )}
          </Pressable>
        </View>
      )}

      {/* Rapor Listesi */}
      <FlatList
        data={reports}
        renderItem={renderReport}
        keyExtractor={item => item.id}
        contentContainerStyle={[
          styles.list,
          reports.length === 0 && styles.emptyList,
          { paddingBottom: 100 } // En alttaki raporun tab barın arkasında kalmaması için boşluk
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <FileText size={48} color={colors.textTertiary} style={styles.emptyIcon} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              Henüz Rapor Yok
            </Text>
            <Text style={[styles.emptyDescription, { color: colors.textSecondary }]}>
              Yeni raporunuz geldiğinde ana sayfada görüntülenecektir
            </Text>
          </View>
        )}
      />
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
    alignItems: 'flex-start', // Metinleri yukarıdan hizalamak için
    paddingTop: 60, // Üstten boşluk
    paddingHorizontal: 20, // Yanlardan boşluk
    paddingBottom: 20, // Alttan boşluk
    position: 'relative', // İçindeki absolute konumlandırılmış elemanlar için
  },
  headerTextContainer: {
    flex: 1, // Kalan alanı doldurarak ayarlar tuşunun yerini bırakır
    marginRight: 60, // Ayarlar tuşunun yerini garanti altına alır
  },
  greeting: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginBottom: 4,
  },
  userName: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    marginBottom: 8,
  },
  trendCapsuleWrapper: {
    marginBottom: 8, // Trend kapsülü ile altındaki metin arasına boşluk
  },
  aiText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginTop: 8,
  },
  // Sağ üstteki ayarlar/yenileme tuşu
  settingsButton: {
    position: 'absolute', // Başlık View'ı içinde absolute konumlandırılır
    top: 50, // `paddingTop: 60`'dan biraz daha aşağıda olması için ayarlandı
    right: 10, // Sağdan iç boşluk
    width: 48, // Daha büyük dokunmatik alan
    height: 48,
    borderRadius: 24, // Tamamen yuvarlak
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10, // Diğer her şeyin üstünde olması için
  },
  refreshIcon: { // Yenileme ikonu animasyonu için
    opacity: 0.8,
  },
  list: {
    padding: 16,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Rapor Kartları Stilleri
  card: {
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    // Ek gölge ve yükseltme efektleri
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  cardIconContainer: { // Rapor kartı içindeki ikon kapsayıcısı
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  content: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20, // Satır yüksekliği okumayı kolaylaştırır
    marginBottom: 8,
  },
  date: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyIcon: {
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    textAlign: 'center',
  },
  newReportContainer: {
    padding: 16,
    margin: 16,
    borderRadius: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  createButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  // Modal ve Menü Stilleri
  modalOverlay: {
    flex: 1,
    // Menüyü sağ üst tuşun altından açmak için konumlandırma
    justifyContent: 'flex-start', 
    alignItems: 'flex-end',   
    backgroundColor: 'rgba(0,0,0,0.4)', // Yarı şeffaf arka plan
    paddingTop: 100, // Ayarlar tuşunun altından başlayacak şekilde ayarlandı
    paddingRight: 20, // Sağdan boşluk
  },
  menuContainer: {
    borderRadius: 8,
    paddingVertical: 8,
    minWidth: 180, // Menü genişliği
    // Gölge ayarları
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    // Çekmece gibi açılma animasyonu için başlangıçta sağda konumlandırılmalı
    // 'SlideInRight' ve 'SlideOutRight' reanimated animasyonları bunu sağlar
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: 'space-between', // Metin ve ikon arasına boşluk bırakır
  },
  menuItemText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
  menuItemIcon: { // Animasyonlu ikonlar için
    marginLeft: 10,
  },
  menuDivider: {
    height: 1,
    marginVertical: 4,
    marginHorizontal: 16,
  },
});