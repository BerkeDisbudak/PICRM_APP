import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { supabase } from '@/lib/supabase';
import { TrendingUp } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

// Trend verisinin yapısını tanımlar.
// 'created_at' sütunu artık bu arayüzde yer almayacak
// çünkü sadece bileşen state'inde 'trends' verisini tutmak istiyoruz.
interface TrendData {
  trends: string; // Veritabanındaki 'trends' sütununun içeriği
}

export function TrendCapsule() {
  const { colors } = useTheme();
  // Bileşen state'leri
  const [trendData, setTrendData] = useState<TrendData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Supabase'den en son trend verisini çeker.
   * Bu fonksiyon hem ilk yüklemede hem de gerçek zamanlı değişikliklerde çağrılır.
   */
  const fetchLatestTrend = async () => {
    setLoading(true); // Veri çekme başladığında yükleme durumunu ayarla
    setError(null);   // Önceki hataları temizle

    try {
      // Supabase kimlik doğrulama servisinden oturum açmış kullanıcıyı alır.
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // Eğer kullanıcı oturumu bulunamazsa, uyarı ver ve işlemi durdur.
        console.warn('Kullanıcı oturumu bulunamadı, trend verisi çekilemiyor.');
        setError('Kullanıcı oturumu bulunamadı.'); // Kullanıcıya gösterilecek hata mesajı
        return;
      }

      // Supabase'den 'trend_analyses' tablosunu sorgular.
      // DİKKAT: 'trend_analyses' yerine Supabase'deki gerçek tablo adınızı (örneğin 'Trends') yazmalısınız.
      const { data, error: fetchError } = await supabase
        .from('trend_analyses') // <-- BURAYI KONTROL ET VE DOĞRU TABLO ADINI YAZIN!
        .select('trends, created_at') // 'trends' sütununu ve sıralama için 'created_at'ı seçiyoruz.
        // NOT: 'created_at'ı tabloda yoksa bu satır hataya neden olur.
        .eq('user_id', user.id) // Oturum açmış kullanıcının ID'sine göre filtrele
        .order('created_at', { ascending: false }) // En yeni kaydı almak için oluşturulma tarihine göre azalan sırada sırala
        .limit(1) // Sadece en son bir kaydı al
        .maybeSingle(); // Eğer tek bir sonuç bulunamazsa null döner, hata fırlatmaz

      if (fetchError) {
        // Supabase sorgusundan bir hata gelirse yakala ve konsola yaz.
        console.error('Supabase sorgu hatası:', fetchError);
        throw fetchError; // Hata yakalayıcıya yönlendir
      }

      // Sorgu sonucunda veri dönüp dönmediğini kontrol et.
      if (data) {
        // Veri döndüyse, sadece 'trends' kısmını alıp state'e kaydet.
        // Çünkü TrendData arayüzümüzde sadece 'trends' var.
        setTrendData({ trends: data.trends });
        console.log('Trend verisi başarıyla çekildi:', data.trends);
      } else {
        // Eğer hiçbir kayıt bulunamazsa (örneğin 'user_id' için veri yoksa), state'i null yap.
        setTrendData(null); 
        console.log('Belirtilen kullanıcı için trend verisi bulunamadı.');
      }

    } catch (err: any) {
      // Herhangi bir hata durumunda (ağ hatası, Supabase hatası vb.)
      console.error('Trend verisi yüklenirken genel bir hata oluştu:', err.message || err);
      setError('Trend verisi yüklenemedi: ' + (err.message || 'Bilinmeyen Hata')); // Kullanıcıya gösterilecek hata mesajı
    } finally {
      setLoading(false); // Yükleme durumunu bitir
    }
  };

  // Bileşen yüklendiğinde ve Supabase'deki değişiklikleri dinlemek için useEffect kullanılır.
  useEffect(() => {
    // Bileşen ilk yüklendiğinde veriyi çeker.
    fetchLatestTrend();

    // Supabase gerçek zamanlı dinleyiciyi ayarlar.
    // 'trend_analyses' tablosundaki herhangi bir değişiklikte veriyi yeniden çeker.
    const channel = supabase
      .channel('trend_changes') // Kanal adı benzersiz olmalı
      .on('postgres_changes', {
        event: '*', // Tüm olayları dinle (INSERT, UPDATE, DELETE)
        schema: 'public', // Dinlenecek şema
        table: 'trend_analyses' // DİKKAT: Dinlenecek tablo adı, '.from()' içindekiyle aynı olmalı.
      }, (payload) => {
        console.log('Supabase gerçek zamanlı değişiklik algılandı:', payload);
        fetchLatestTrend(); // Değişiklik algılandığında veriyi yeniden çek
      })
      .subscribe(); // Kanala abone ol

    // Bileşen kaldırıldığında (unmount) dinleyiciyi temizler.
    return () => {
      channel.unsubscribe();
      console.log('Supabase kanal aboneliği kaldırıldı.');
    };
  }, []); // Bağımlılık dizisi boş olduğu için bu useEffect sadece bir kez çalışır (bileşen monte edildiğinde).

  // Yükleme durumu arayüzü
  if (loading) {
    return (
      <Animated.View 
        entering={FadeIn.duration(400)}
        style={[styles.container, { backgroundColor: `${colors.primary}15` }]}
      >
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={[styles.text, { color: colors.primary, marginLeft: 8 }]}>Yükleniyor...</Text>
      </Animated.View>
    );
  }

  // Hata durumu arayüzü
  if (error) {
    return (
      <Animated.View 
        entering={FadeIn.duration(400)}
        style={[styles.container, { backgroundColor: `${colors.error}15` }]}
      >
        <TrendingUp size={16} color={colors.error} style={styles.icon} />
        <Text style={[styles.text, { color: colors.error }]}>{error}</Text>
      </Animated.View>
    );
  }

  // Veri yok durumu arayüzü (trendData null ise veya trends alanı boşsa)
  if (!trendData || !trendData.trends) {
    return (
      <Animated.View 
        entering={FadeIn.duration(400)}
        style={[styles.container, { backgroundColor: `${colors.primary}15` }]}
      >
        <TrendingUp size={16} color={colors.primary} style={styles.icon} />
        <Text style={[styles.text, { color: colors.primary }]}>
          Henüz trend analizi yok
        </Text>
      </Animated.View>
    );
  }

  // Veri başarıyla çekildiğinde trendi gösteren arayüz
  return (
    <Animated.View 
      entering={FadeIn.duration(400)}
      style={[styles.container, { backgroundColor: `${colors.primary}15` }]}
    >
      <TrendingUp size={16} color={colors.primary} style={styles.icon} />
      <View style={styles.contentContainer}>
        <Text 
          style={[styles.text, { color: colors.primary }]}
          numberOfLines={1} // Tek satırda göster, taşarsa kes
        >
          {trendData.trends}
        </Text>
      </View>
    </Animated.View>
  );
}

// React Native stil tanımlamaları
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start', // İçeriği sola yasla
    maxWidth: '100%', // Maksimum genişlik
  },
  icon: {
    marginRight: 8,
    flexShrink: 0, // Icon boyutunu küçültme
  },
  contentContainer: {
    flex: 1, // Metnin kalan alanı doldurmasını sağla
  },
  text: {
    fontFamily: 'Inter-Medium', // Özel font kullanımı
    fontSize: 14,
  },
});