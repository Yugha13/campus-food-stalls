import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

// Configure notification handler with branding
Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    try {
      const settings = await getNotificationSettings();
      
      // Trigger haptic feedback on iOS if vibration is enabled
      if (Platform.OS === 'ios' && settings.vibrationEnabled) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      
      return {
        shouldShowAlert: true,
        shouldPlaySound: settings.soundEnabled ?? true,
        shouldSetBadge: false,
      };
    } catch (error) {
      console.error('Error in notification handler:', error);
      return {
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      };
    }
  },
});

// Configure notification channel for Android with secondary logo
let updateNotificationChannel;
if (Platform.OS === 'android') {
  // Function to update Android notification channel based on user preferences
  updateNotificationChannel = async () => {
    const settings = await getNotificationSettings();
    
    console.log('Updating Android notification channel with settings:', settings);
    
    const channelConfig = {
      name: 'Tap2Eat Notifications',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: settings.vibrationEnabled ? [0, 250, 250, 250] : [0],
      lightColor: '#22C55E',
      sound: settings.soundEnabled ? 'default' : null,
      description: 'General notifications from Tap2Eat app',
      enableVibrate: settings.vibrationEnabled ?? true,
      enableLights: true,
      bypassDnd: false,
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    };
    
    console.log('Setting Android channel config:', channelConfig);
    
    await Notifications.setNotificationChannelAsync('tap2eat-default', channelConfig);
  };
  
  // Set up initial channel
  updateNotificationChannel();
}

// Export function to update channel when settings change
export const updateAndroidNotificationChannel = updateNotificationChannel;

// Request notification permissions with sound and vibration
export const requestNotificationPermissions = async () => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
          allowAnnouncements: true,
        },
        android: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
          allowVibrate: true,
        }
      });
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
        priority: Notifications.AndroidImportance.HIGH,
      },
      trigger,
    };
    
    // Platform-specific configuration
    if (Platform.OS === 'android') {
      notificationConfig.content.channelId = 'tap2eat-default';
      // Update channel with current settings
      if (updateNotificationChannel) {
        await updateNotificationChannel();
      }
    } else if (Platform.OS === 'ios') {
      // For iOS, set sound directly in content
      notificationConfig.content.sound = settings.soundEnabled ? 'default' : null;
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
      promotionsEnabled: true,
      soundEnabled: true,
      vibrationEnabled: true
    };
  } catch (error) {
    console.error('Error getting notification settings:', error);
    return {
      notificationsEnabled: true,
      pushNotificationsEnabled: true,
      orderUpdatesEnabled: true,
      promotionsEnabled: true,
      soundEnabled: true,
      vibrationEnabled: true
    };
  }
};

// Save notification settings and update notification channels
export const saveNotificationSettings = async (settings) => {
  try {
    await AsyncStorage.setItem('notificationSettings', JSON.stringify(settings));
    
    // Update Android notification channel with new settings
    if (Platform.OS === 'android' && updateNotificationChannel) {
      await updateNotificationChannel();
    }
    
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
export const handleNotificationReceived = async (notification) => {
  console.log('Notification received:', notification);
  
  // Get user settings for vibration
  const settings = await getNotificationSettings();
  
  // Trigger haptic feedback if vibration is enabled
  if (settings.vibrationEnabled && Platform.OS === 'ios') {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.log('Haptic feedback not available:', error);
    }
  }
  
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
// Schedule a test notification with user preferences
export const scheduleTestNotification = async () => {
  try {
    const settings = await getNotificationSettings();
    
    if (!settings.notificationsEnabled) {
      return { success: false, message: 'Notifications are disabled in settings' };
    }
    
    // Check system permissions
    const hasPermissions = await requestNotificationPermissions();
    if (!hasPermissions) {
      return { success: false, message: 'Notification permissions not granted' };
    }
    
    // Force update notification channel for Android
    if (Platform.OS === 'android' && updateNotificationChannel) {
      await updateNotificationChannel();
    }
    
    // Schedule the test notification
    const notificationConfig = {
      content: {
        title: '🔔 Tap2Eat - Test Notification',
        body: `Testing: Sound ${settings.soundEnabled ? 'ON' : 'OFF'} • Vibration ${settings.vibrationEnabled ? 'ON' : 'OFF'}`,
        data: {
          type: 'test',
          appName: 'Tap2Eat',
          soundEnabled: settings.soundEnabled,
          vibrationEnabled: settings.vibrationEnabled
        },
        priority: Notifications.AndroidImportance.HIGH,
      },
      trigger: { seconds: 1 },
      identifier: `test_notification_${Date.now()}`
    };
    
    // Platform-specific configuration
    if (Platform.OS === 'android') {
      notificationConfig.content.channelId = 'tap2eat-default';
    } else if (Platform.OS === 'ios') {
      // For iOS, set sound directly
      notificationConfig.content.sound = settings.soundEnabled ? 'default' : null;
    }
    
    const notificationId = await Notifications.scheduleNotificationAsync(notificationConfig);
    
    // Trigger immediate haptic feedback for iOS
    if (Platform.OS === 'ios' && settings.vibrationEnabled) {
      setTimeout(() => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }, 1000);
    }
    
    return {
      success: !!notificationId,
      message: notificationId 
        ? `Test notification scheduled (ID: ${notificationId.slice(0,8)}...)` 
        : 'Failed to schedule test notification'
    };
  } catch (error) {
    console.error('Error scheduling test notification:', error);
    return {
      success: false,
      message: `Error: ${error.message || 'Unknown error'}`
    };
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

// Debug function to check current notification status
export const checkNotificationStatus = async () => {
  try {
    const permissions = await Notifications.getPermissionsAsync();
    const settings = await getNotificationSettings();
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
    
    console.log('=== NOTIFICATION DEBUG STATUS ===');
    console.log('Platform:', Platform.OS);
    console.log('Permissions:', permissions);
    console.log('Settings:', settings);
    console.log('Scheduled notifications:', scheduledNotifications.length);
    
    const status = {
      permissions: {
        status: permissions.status,
        canAskAgain: permissions.canAskAgain,
        granted: permissions.granted,
        ios: Platform.OS === 'ios' ? {
          allowsAlert: permissions.ios?.allowsAlert,
          allowsSound: permissions.ios?.allowsSound,
          allowsBadge: permissions.ios?.allowsBadge
        } : undefined,
        android: Platform.OS === 'android' ? {
          canShowAlertsAndNotifications: permissions.android?.canShowAlertsAndNotifications,
          canPlaySounds: permissions.android?.canPlaySounds,
          canScheduleExactAlarms: permissions.android?.canScheduleExactAlarms
        } : undefined
      },
      settings: {
        notificationsEnabled: settings.notificationsEnabled,
        soundEnabled: settings.soundEnabled,
        vibrationEnabled: settings.vibrationEnabled,
        pushNotificationsEnabled: settings.pushNotificationsEnabled
      },
      scheduled: scheduledNotifications.length,
      platform: Platform.OS
    };
    
    console.log('Final status object:', status);
    return status;
  } catch (error) {
    console.error('Error checking notification status:', error);
    return { error: error.message };
  }
};