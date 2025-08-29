import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Platform,
  FlatList,
  Alert,
  Switch,
} from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { 
  ArrowLeft, 
  Bell, 
  ShoppingCart,
  Star,
  Clock,
  Gift,
  Truck,
  CheckCircle,
  Settings,
  BellOff
} from "lucide-react-native";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";
import { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import * as Haptics from 'expo-haptics';
import { scheduleTestNotification, sendDemoNotifications } from '../utils/notificationUtils';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Dummy notifications data
const dummyNotifications = [
  {
    id: "1",
    type: "order_update",
    title: "Order Delivered! 🎉",
    message: "Your order from Momos Point has been delivered successfully!",
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 mins ago
    read: false,
    icon: CheckCircle,
    color: "#22C55E",
    actionText: "Rate Order",
    orderId: "ORD001"
  },
  {
    id: "2",
    type: "promotion",
    title: "Special Offer! 🔥",
    message: "Get 30% off on Pizza Corner! Use code PIZZA30. Valid until midnight.",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    read: false,
    icon: Gift,
    color: "#F59E0B",
    actionText: "Order Now",
    shopId: "2"
  },
  {
    id: "3",
    type: "order_update",
    title: "Order On The Way! 🚛",
    message: "Your order from Burger Hub is on the way. Expected delivery in 15 mins.",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    read: true,
    icon: Truck,
    color: "#3B82F6",
    actionText: "Track Order",
    orderId: "ORD003"
  },
  {
    id: "4",
    type: "wishlist",
    title: "Back in Stock! ❤️",
    message: "Chicken Momos from your wishlist is now available at Momos Point!",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    read: true,
    icon: Star,
    color: "#EC4899",
    actionText: "Add to Cart",
    foodId: "1"
  },
  {
    id: "5",
    type: "recommendation",
    title: "Try Something New! 🍕",
    message: "Based on your recent orders, you might like Pepperoni Pizza from Pizza Corner.",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    read: true,
    icon: ShoppingCart,
    color: "#8B5CF6",
    actionText: "View Menu",
    shopId: "2"
  }
];

const formatTimeAgo = (timestamp) => {
  const now = new Date();
  const notificationTime = new Date(timestamp);
  const diffInMs = now - notificationTime;
  const diffInMins = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMins < 1) return "Just now";
  if (diffInMins < 60) return `${diffInMins}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  return `${diffInDays}d ago`;
};

export default function NotificationsPage() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  const [notifications, setNotifications] = useState(dummyNotifications);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState(true);
  const [orderUpdatesEnabled, setOrderUpdatesEnabled] = useState(true);
  const [promotionsEnabled, setPromotionsEnabled] = useState(true);
  
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  useEffect(() => {
    loadNotificationSettings();
    requestNotificationPermissions();
  }, []);

  const loadNotificationSettings = async () => {
    try {
      const settings = await AsyncStorage.getItem('notificationSettings');
      if (settings) {
        const parsed = JSON.parse(settings);
        setNotificationsEnabled(parsed.notificationsEnabled ?? true);
        setPushNotificationsEnabled(parsed.pushNotificationsEnabled ?? true);
        setOrderUpdatesEnabled(parsed.orderUpdatesEnabled ?? true);
        setPromotionsEnabled(parsed.promotionsEnabled ?? true);
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    }
  };

  const saveNotificationSettings = async (settings) => {
    try {
      await AsyncStorage.setItem('notificationSettings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving notification settings:', error);
    }
  };

  const requestNotificationPermissions = async () => {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        Alert.alert(
          'Notification Permission',
          'Enable notifications to get updates about your orders, special offers, and more!',
          [
            { text: 'Not Now', style: 'cancel' },
            { text: 'Settings', onPress: () => Notifications.openNotificationSettingsAsync() }
          ]
        );
      }
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
    }
  };

  const scheduleTestNotification = async () => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Test Notification 🔔",
          body: "This is a test notification to verify everything is working!",
          data: { type: 'test' },
        },
        trigger: { seconds: 2 },
      });
      
      if (Platform.OS === 'ios') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      
      Alert.alert('Success', 'Test notification scheduled!');
    } catch (error) {
      console.error('Error scheduling notification:', error);
      Alert.alert('Error', 'Failed to schedule notification');
    }
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const handleNotificationAction = (notification) => {
    markAsRead(notification.id);
    
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    switch (notification.type) {
      case 'order_update':
        if (notification.orderId) {
          router.push('/order-history');
        }
        break;
      case 'promotion':
        if (notification.shopId) {
          router.push(`/(tabs)/shop/${notification.shopId}`);
        }
        break;
      case 'wishlist':
        router.push('/wishlist');
        break;
      case 'recommendation':
        if (notification.shopId) {
          router.push(`/(tabs)/shop/${notification.shopId}`);
        }
        break;
      default:
        break;
    }
  };

  const clearAllNotifications = () => {
    Alert.alert(
      "Clear Notifications",
      "Are you sure you want to clear all notifications?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => {
            setNotifications([]);
            if (Platform.OS === 'ios') {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
          }
        }
      ]
    );
  };

  const toggleNotifications = async (value) => {
    setNotificationsEnabled(value);
    const settings = {
      notificationsEnabled: value,
      pushNotificationsEnabled,
      orderUpdatesEnabled,
      promotionsEnabled
    };
    await saveNotificationSettings(settings);
  };

  const togglePushNotifications = async (value) => {
    setPushNotificationsEnabled(value);
    const settings = {
      notificationsEnabled,
      pushNotificationsEnabled: value,
      orderUpdatesEnabled,
      promotionsEnabled
    };
    await saveNotificationSettings(settings);
  };

  const toggleOrderUpdates = async (value) => {
    setOrderUpdatesEnabled(value);
    const settings = {
      notificationsEnabled,
      pushNotificationsEnabled,
      orderUpdatesEnabled: value,
      promotionsEnabled
    };
    await saveNotificationSettings(settings);
  };

  const togglePromotions = async (value) => {
    setPromotionsEnabled(value);
    const settings = {
      notificationsEnabled,
      pushNotificationsEnabled,
      orderUpdatesEnabled,
      promotionsEnabled: value
    };
    await saveNotificationSettings(settings);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const renderNotificationItem = ({ item: notification }) => {
    const IconComponent = notification.icon;
    
    return (
      <TouchableOpacity
        style={{
          backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
          borderRadius: 16,
          padding: 16,
          marginBottom: 12,
          borderLeftWidth: 4,
          borderLeftColor: notification.read ? "transparent" : notification.color,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
        }}
        activeOpacity={0.7}
        onPress={() => handleNotificationAction(notification)}
      >
        <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: notification.color + "20",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 12,
            }}
          >
            <IconComponent size={20} color={notification.color} />
          </View>
          
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
              <Text style={{
                fontSize: 16,
                fontFamily: notification.read ? "Inter_500Medium" : "Inter_600SemiBold",
                color: isDark ? "#FFFFFF" : "#000000",
                flex: 1,
                marginRight: 8,
              }}>
                {notification.title}
              </Text>
              
              <Text style={{
                fontSize: 12,
                fontFamily: "Inter_400Regular",
                color: isDark ? "#9CA3AF" : "#6B7280",
              }}>
                {formatTimeAgo(notification.timestamp)}
              </Text>
            </View>
            
            <Text style={{
              fontSize: 14,
              fontFamily: "Inter_400Regular",
              color: isDark ? "#D1D5DB" : "#4B5563",
              marginTop: 4,
              marginBottom: 8,
              lineHeight: 20,
            }}>
              {notification.message}
            </Text>
            
            {notification.actionText && (
              <TouchableOpacity
                style={{
                  backgroundColor: notification.color,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 8,
                  alignSelf: "flex-start",
                }}
                onPress={() => handleNotificationAction(notification)}
              >
                <Text style={{
                  color: "#FFFFFF",
                  fontSize: 12,
                  fontFamily: "Inter_500Medium",
                }}>
                  {notification.actionText}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={{
      flex: 1,
      backgroundColor: isDark ? "#000000" : "#F9FAFB",
      paddingTop: insets.top,
    }}>
      <StatusBar style={isDark ? "light" : "dark"} />
      
      {/* Header */}
      <View style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
        borderBottomWidth: 1,
        borderBottomColor: isDark ? "#374151" : "#E5E7EB",
      }}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: isDark ? "#374151" : "#F3F4F6",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ArrowLeft size={20} color={isDark ? "#FFFFFF" : "#000000"} />
        </TouchableOpacity>
        
        <View style={{ alignItems: "center" }}>
          <Text style={{
            fontSize: 18,
            fontFamily: "Inter_600SemiBold",
            color: isDark ? "#FFFFFF" : "#000000",
          }}>
            Notifications
          </Text>
          {unreadCount > 0 && (
            <Text style={{
              fontSize: 12,
              fontFamily: "Inter_400Regular",
              color: isDark ? "#9CA3AF" : "#6B7280",
            }}>
              {unreadCount} unread
            </Text>
          )}
        </View>
        
        <TouchableOpacity
          onPress={clearAllNotifications}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: isDark ? "#374151" : "#F3F4F6",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <BellOff size={18} color={isDark ? "#FFFFFF" : "#000000"} />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>

        {/* Notifications List */}
        <View style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 100 }}>
          <Text style={{
            fontSize: 16,
            fontFamily: "Inter_600SemiBold",
            color: isDark ? "#FFFFFF" : "#000000",
            marginBottom: 16,
          }}>
            Recent Notifications
          </Text>
          
          {notifications.length === 0 ? (
            <View style={{
              backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
              borderRadius: 16,
              padding: 32,
              alignItems: "center",
            }}>
              <Bell size={48} color={isDark ? "#6B7280" : "#9CA3AF"} />
              <Text style={{
                fontSize: 16,
                fontFamily: "Inter_500Medium",
                color: isDark ? "#9CA3AF" : "#6B7280",
                marginTop: 16,
                textAlign: "center",
              }}>
                No notifications yet
              </Text>
              <Text style={{
                fontSize: 14,
                fontFamily: "Inter_400Regular",
                color: isDark ? "#6B7280" : "#9CA3AF",
                marginTop: 8,
                textAlign: "center",
              }}>
                You'll receive notifications about your orders, special offers, and more!
              </Text>
            </View>
          ) : (
            <FlatList
              data={notifications}
              renderItem={renderNotificationItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}