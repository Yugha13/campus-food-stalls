import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Configure notification handler with branding
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Configure notification channel for Android with secondary logo
if (Platform.OS === 'android') {
  Notifications.setNotificationChannelAsync('tap2eat-default', {
    name: 'Tap2Eat Notifications',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#22C55E',
    sound: 'default',
    description: 'General notifications from Tap2Eat app',
  });
}

// Request notification permissions
export const requestNotificationPermissions = async () => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    return finalStatus === 'granted';
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
};

// Schedule a notification
export const scheduleNotification = async ({
  title,
  body,
  data = {},
  triggerSeconds = null,
  identifier = null
}) => {
  try {
    const settings = await getNotificationSettings();
    
    // Check if notifications are enabled
    if (!settings.notificationsEnabled || !settings.pushNotificationsEnabled) {
      return null;
    }
    
    // Check specific notification type settings
    if (data.type === 'order_update' && !settings.orderUpdatesEnabled) {
      return null;
    }
    
    if (data.type === 'promotion' && !settings.promotionsEnabled) {
      return null;
    }
    
    const trigger = triggerSeconds ? { seconds: triggerSeconds } : null;
    
    const notificationConfig = {
      content: {
        title,
        body,
        data: {
          ...data,
          appName: 'Tap2Eat',
          appIcon: 'secondary-logo'
        },
        sound: Platform.OS === 'ios' ? 'default' : undefined,
      },
      trigger,
    };
    
    // Use custom notification channel on Android
    if (Platform.OS === 'android') {
      notificationConfig.content.channelId = 'tap2eat-default';
    }
    
    if (identifier) {
      notificationConfig.identifier = identifier;
    }
    
    const notificationId = await Notifications.scheduleNotificationAsync(notificationConfig);
    return notificationId;
  } catch (error) {
    console.error('Error scheduling notification:', error);
    return null;
  }
};

// Schedule order update notifications
export const scheduleOrderUpdateNotifications = async (orderId, orderStatus) => {
  try {
    const notifications = [];
    
    switch (orderStatus) {
      case 'confirmed':
        notifications.push({
          title: '🎉 Tap2Eat - Order Confirmed!',
          body: `Your order #${orderId} has been confirmed and is being prepared.`,
          data: { type: 'order_update', orderId, appName: 'Tap2Eat' },
          triggerSeconds: 2,
          identifier: `order_confirmed_${orderId}`
        });
        
        // Schedule preparing notification
        notifications.push({
          title: '👨‍🍳 Tap2Eat - Order Being Prepared',
          body: `Your order #${orderId} is now being prepared. It will be ready soon!`,
          data: { type: 'order_update', orderId, appName: 'Tap2Eat' },
          triggerSeconds: 300, // 5 minutes
          identifier: `order_preparing_${orderId}`
        });
        
        // Schedule ready notification
        notifications.push({
          title: '📦 Tap2Eat - Order Ready for Pickup!',
          body: `Your order #${orderId} is ready for pickup or delivery.`,
          data: { type: 'order_update', orderId, appName: 'Tap2Eat' },
          triggerSeconds: 900, // 15 minutes
          identifier: `order_ready_${orderId}`
        });
        
        // Schedule delivered notification
        notifications.push({
          title: '🚀 Tap2Eat - Order Delivered!',
          body: `Your order #${orderId} has been delivered successfully. Enjoy your meal!`,
          data: { type: 'order_update', orderId, appName: 'Tap2Eat' },
          triggerSeconds: 1800, // 30 minutes
          identifier: `order_delivered_${orderId}`
        });
        break;
        
      case 'cancelled':
        notifications.push({
          title: '😔 Tap2Eat - Order Cancelled',
          body: `Your order #${orderId} has been cancelled. Refund will be processed soon.`,
          data: { type: 'order_update', orderId, appName: 'Tap2Eat' },
          triggerSeconds: 2,
          identifier: `order_cancelled_${orderId}`
        });
        break;
    }
    
    // Schedule all notifications
    const results = await Promise.all(
      notifications.map(notification => scheduleNotification(notification))
    );
    
    return results;
  } catch (error) {
    console.error('Error scheduling order update notifications:', error);
    return [];
  }
};

// Schedule promotional notifications
export const schedulePromotionalNotification = async ({
  shopName,
  discount,
  code,
  shopId,
  triggerSeconds = 3600 // 1 hour by default
}) => {
  try {
    return await scheduleNotification({
      title: `🔥 Tap2Eat - Special Offer at ${shopName}!`,
      body: `Get ${discount}% off! Use code ${code}. Limited time offer.`,
      data: {
        type: 'promotion',
        shopId,
        discount,
        code,
        appName: 'Tap2Eat'
      },
      triggerSeconds,
      identifier: `promo_${shopId}_${Date.now()}`
    });
  } catch (error) {
    console.error('Error scheduling promotional notification:', error);
    return null;
  }
};

// Schedule wishlist notifications
export const scheduleWishlistNotification = async (foodName, shopName, foodId) => {
  try {
    return await scheduleNotification({
      title: '❤️ Tap2Eat - Wishlist Item Available!',
      body: `${foodName} from ${shopName} is back in stock and ready to order!`,
      data: {
        type: 'wishlist',
        foodId,
        shopName,
        appName: 'Tap2Eat'
      },
      triggerSeconds: 1800, // 30 minutes
      identifier: `wishlist_${foodId}_${Date.now()}`
    });
  } catch (error) {
    console.error('Error scheduling wishlist notification:', error);
    return null;
  }
};

// Schedule recommendation notifications
export const scheduleRecommendationNotification = async ({
  foodName,
  shopName,
  shopId,
  reason = 'based on your recent orders'
}) => {
  try {
    return await scheduleNotification({
      title: '🍕 Tap2Eat - Try Something New!',
      body: `${reason}, you might like ${foodName} from ${shopName}.`,
      data: {
        type: 'recommendation',
        shopId,
        foodName,
        appName: 'Tap2Eat'
      },
      triggerSeconds: 7200, // 2 hours
      identifier: `recommendation_${shopId}_${Date.now()}`
    });
  } catch (error) {
    console.error('Error scheduling recommendation notification:', error);
    return null;
  }
};

// Cancel specific notification
export const cancelNotification = async (identifier) => {
  try {
    await Notifications.cancelScheduledNotificationAsync(identifier);
  } catch (error) {
    console.error('Error cancelling notification:', error);
  }
};

// Cancel all notifications for an order
export const cancelOrderNotifications = async (orderId) => {
  try {
    const identifiers = [
      `order_confirmed_${orderId}`,
      `order_preparing_${orderId}`,
      `order_ready_${orderId}`,
      `order_delivered_${orderId}`,
      `order_cancelled_${orderId}`
    ];
    
    await Promise.all(
      identifiers.map(id => cancelNotification(id))
    );
  } catch (error) {
    console.error('Error cancelling order notifications:', error);
  }
};

// Get notification settings
export const getNotificationSettings = async () => {
  try {
    const settings = await AsyncStorage.getItem('notificationSettings');
    if (settings) {
      return JSON.parse(settings);
    }
    
    // Default settings
    return {
      notificationsEnabled: true,
      pushNotificationsEnabled: true,
      orderUpdatesEnabled: true,
      promotionsEnabled: true
    };
  } catch (error) {
    console.error('Error getting notification settings:', error);
    return {
      notificationsEnabled: true,
      pushNotificationsEnabled: true,
      orderUpdatesEnabled: true,
      promotionsEnabled: true
    };
  }
};

// Save notification settings
export const saveNotificationSettings = async (settings) => {
  try {
    await AsyncStorage.setItem('notificationSettings', JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error('Error saving notification settings:', error);
    return false;
  }
};

// Get all scheduled notifications
export const getScheduledNotifications = async () => {
  try {
    return await Notifications.getAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error getting scheduled notifications:', error);
    return [];
  }
};

// Handle notification received (when app is in foreground)
export const handleNotificationReceived = (notification) => {
  console.log('Notification received:', notification);
  // You can add custom logic here to handle foreground notifications
};

// Handle notification response (when user taps on notification)
export const handleNotificationResponse = (response, router) => {
  const data = response.notification.request.content.data;
  
  console.log('Notification response:', data);
  
  // Navigate based on notification type
  switch (data.type) {
    case 'order_update':
      if (data.orderId) {
        router.push('/order-history');
      }
      break;
    case 'promotion':
      if (data.shopId) {
        router.push(`/(tabs)/shop/${data.shopId}`);
      }
      break;
    case 'wishlist':
      router.push('/wishlist');
      break;
    case 'recommendation':
      if (data.shopId) {
        router.push(`/(tabs)/shop/${data.shopId}`);
      }
      break;
    default:
      router.push('/(tabs)/home');
      break;
  }
};

// Initialize notification listeners
export const initializeNotificationListeners = (router) => {
  // Listen for notifications received while app is in foreground
  const notificationListener = Notifications.addNotificationReceivedListener(handleNotificationReceived);
  
  // Listen for user interaction with notifications
  const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
    handleNotificationResponse(response, router);
  });
  
  return () => {
    notificationListener.remove();
    responseListener.remove();
  };
};

// Schedule test notification
export const scheduleTestNotification = async () => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Test Notification 🔔",
        body: "This is a test notification to verify everything is working!",
        data: { type: 'test' },
      },
      trigger: { seconds: 2 },
    });
    
    return true;
  } catch (error) {
    console.error('Error scheduling test notification:', error);
    return false;
  }
};

// Send demo notifications for testing
export const sendDemoNotifications = async () => {
  const demoNotifications = [
    {
      title: "Welcome to FoodieApp! 🎉",
      body: "Discover amazing food from your favorite campus restaurants!",
      data: { type: 'welcome' },
      triggerSeconds: 5
    },
    {
      title: "Special Launch Offer! 🔥",
      body: "Get 25% off on your first order. Use code WELCOME25!",
      data: { type: 'promotion', code: 'WELCOME25' },
      triggerSeconds: 30
    },
    {
      title: "Don't Forget Your Cart! 🛒",
      body: "You have items waiting in your cart. Complete your order now!",
      data: { type: 'cart_reminder' },
      triggerSeconds: 60
    }
  ];
  
  const results = await Promise.all(
    demoNotifications.map(notification => scheduleNotification(notification))
  );
  
  return results;
};