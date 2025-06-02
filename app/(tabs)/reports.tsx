import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Pressable, RefreshControl } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'expo-router';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { FileText, RefreshCw, Moon, Sun } from 'lucide-react-native';
import { supabase, Report } from '@/lib/supabase';
import Animated, { FadeInDown, useAnimatedStyle, withRepeat, withTiming, withSequence } from 'react-native-reanimated';

export default function ReportsScreen() {
  const { colors, theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Animation style for refresh icon
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
            -1,
            false
          ),
        },
      ],
    };
  });

  useEffect(() => {
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

  // Auto-refresh when screen comes into focus
  useEffect(() => {
    const focusHandler = () => {
      fetchReports();
    };

    window.addEventListener('focus', focusHandler);
    return () => {
      window.removeEventListener('focus', focusHandler);
    };
  }, []);

  async function fetchReports() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace('/login');
        return;
      }

      const { data, error } = await supabase
        .from('Reports')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
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
    fetchReports();
  };

  const renderReport = ({ item }: { item: Report }) => (
    <Animated.View entering={FadeInDown.duration(400)}>
      <Pressable
        style={({ pressed }) => [
          styles.card,
          {
            backgroundColor: colors.card,
            transform: [{ scale: pressed ? 0.98 : 1 }],
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
          },
        ]}
        onPress={() => router.push(`/report/${item.id}`)}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}15` }]}>
            <FileText size={24} color={colors.primary} />
          </View>
          <View style={styles.contentContainer}>
            <Text 
              style={[styles.content, { color: colors.textSecondary }]}
              numberOfLines={3}
            >
              {item.report}
            </Text>
            <Text style={[styles.date, { color: colors.textTertiary }]}>
              {format(new Date(item.created_at), 'dd MMMM yyyy, HH:mm', { locale: tr })}
            </Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.centerContent}>
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
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>Raporlar</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Tüm raporları görüntüle
          </Text>
        </View>
        <View style={styles.headerRight}>
          <Pressable
            style={[styles.iconButton, { backgroundColor: colors.card }]}
            onPress={handleManualRefresh}
            disabled={isRefreshing}
          >
            <Animated.View style={refreshIconStyle}>
              <RefreshCw 
                size={20} 
                color={colors.text}
                style={styles.buttonIcon}
              />
            </Animated.View>
          </Pressable>
          <Pressable
            style={[styles.iconButton, { backgroundColor: colors.card }]}
            onPress={toggleTheme}
          >
            {theme === 'dark' ? (
              <Sun size={20} color={colors.text} style={styles.buttonIcon} />
            ) : (
              <Moon size={20} color={colors.text} style={styles.buttonIcon} />
            )}
          </Pressable>
        </View>
      </View>

      {error ? (
        <View style={styles.centerContent}>
          <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
          <Text 
            style={[styles.retryText, { color: colors.primary }]}
            onPress={fetchReports}
          >
            Tekrar Dene
          </Text>
        </View>
      ) : (
        <FlatList
          data={reports}
          renderItem={renderReport}
          keyExtractor={item => item.id}
          contentContainerStyle={[
            styles.list,
            reports.length === 0 && styles.emptyList
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
                Yeni raporunuz geldiğinde burada görüntülenecektir
              </Text>
            </View>
          )}
        />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonIcon: {
    opacity: 0.8,
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
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  list: {
    padding: 16,
  },
  emptyList: {
    flexGrow: 1,
  },
  card: {
    borderRadius: 16,
    marginBottom: 16,
    padding: 20,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contentContainer: {
    flex: 1,
  },
  content: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  date: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
  loadingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginTop: 12,
  },
  errorText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  retryText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    textDecorationLine: 'underline',
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
});