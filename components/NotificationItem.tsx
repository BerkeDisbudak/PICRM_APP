import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'expo-router';
import { CircleAlert as AlertCircle, TrendingUp, TrendingDown, ChartBar as BarChart2 } from 'lucide-react-native';
import Animated, { FadeInLeft } from 'react-native-reanimated';

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'alert' | 'insight' | 'trend-up' | 'trend-down';
  read: boolean;
}

interface NotificationItemProps {
  notification: Notification;
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const { colors } = useTheme();
  const router = useRouter();
  const [isRead, setIsRead] = React.useState(notification.read);

  const handlePress = () => {
    setIsRead(true);
    router.push(`/notifications/${notification.id}`);
  };

  // Define icon based on notification type
  const getIcon = () => {
    const size = 20;
    switch (notification.type) {
      case 'alert':
        return (
          <View style={[styles.iconContainer, { backgroundColor: `${colors.error}20` }]}>
            <AlertCircle size={size} color={colors.error} />
          </View>
        );
      case 'insight':
        return (
          <View style={[styles.iconContainer, { backgroundColor: `${colors.info}20` }]}>
            <BarChart2 size={size} color={colors.info} />
          </View>
        );
      case 'trend-up':
        return (
          <View style={[styles.iconContainer, { backgroundColor: `${colors.success}20` }]}>
            <TrendingUp size={size} color={colors.success} />
          </View>
        );
      case 'trend-down':
        return (
          <View style={[styles.iconContainer, { backgroundColor: `${colors.warning}20` }]}>
            <TrendingDown size={size} color={colors.warning} />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <Animated.View entering={FadeInLeft.duration(400)}>
      <Pressable
        style={({ pressed }) => [
          styles.container,
          {
            backgroundColor: isRead ? colors.background : `${colors.primary}10`,
            borderBottomColor: colors.border,
            opacity: pressed ? 0.7 : 1,
          },
        ]}
        onPress={handlePress}
      >
        {getIcon()}
        
        <View style={styles.content}>
          <Text 
            style={[
              styles.title, 
              { 
                color: colors.text,
                fontFamily: isRead ? 'Inter-Regular' : 'Inter-SemiBold'
              }
            ]}
            numberOfLines={1}
          >
            {notification.title}
          </Text>
          
          <Text 
            style={[styles.message, { color: colors.textSecondary }]}
            numberOfLines={2}
          >
            {notification.message}
          </Text>
          
          <Text style={[styles.timestamp, { color: colors.textTertiary }]}>
            {notification.timestamp}
          </Text>
        </View>
        
        {!isRead && (
          <View style={[styles.unreadIndicator, { backgroundColor: colors.primary }]} />
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
    fontFamily: 'Inter-Regular',
  },
  timestamp: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
    alignSelf: 'center',
  },
});