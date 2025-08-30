import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Switch,
  Alert,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import {
  ArrowLeft, 
  Bell,
  Shield,
  Globe,
  HelpCircle,
  FileText,
  Users,
  ChevronRight,
  Moon,
  Sun,
  Volume2,
  Vibrate,
  Smartphone,
  MapPin,
  Languages,
  Download,
  Trash2,
  Info
} from "lucide-react-native";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";
import { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { 
  scheduleTestNotification,
  sendDemoNotifications,
  requestNotificationPermissions,
  saveNotificationSettings as saveNotificationSettingsUtil,
  checkNotificationStatus
} from '../utils/notificationUtils';


export default function SettingsPage() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  // Notification Settings
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState(true);
  const [orderUpdatesEnabled, setOrderUpdatesEnabled] = useState(true);
  const [promotionsEnabled, setPromotionsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  
  // App Settings
  const [darkModeEnabled, setDarkModeEnabled] = useState(isDark);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [autoDownloadEnabled, setAutoDownloadEnabled] = useState(false);
  const [dataUsageOptimized, setDataUsageOptimized] = useState(false);
  
  // Privacy Settings
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [crashReportingEnabled, setCrashReportingEnabled] = useState(true);
  
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  useEffect(() => {
    loadAllSettings();
  }, []);

  const loadAllSettings = async () => {
    try {
      const [notificationSettings, appSettings, privacySettings] = await Promise.all([
        AsyncStorage.getItem('notificationSettings'),
        AsyncStorage.getItem('appSettings'),
        AsyncStorage.getItem('privacySettings')
      ]);
      
      if (notificationSettings) {
        const parsed = JSON.parse(notificationSettings);
        setNotificationsEnabled(parsed.notificationsEnabled ?? true);
        setPushNotificationsEnabled(parsed.pushNotificationsEnabled ?? true);
        setOrderUpdatesEnabled(parsed.orderUpdatesEnabled ?? true);
        setPromotionsEnabled(parsed.promotionsEnabled ?? true);
        setSoundEnabled(parsed.soundEnabled ?? true);
        setVibrationEnabled(parsed.vibrationEnabled ?? true);
      }
      
      if (appSettings) {
        const parsed = JSON.parse(appSettings);
        setDarkModeEnabled(parsed.darkModeEnabled ?? isDark);
        setLocationEnabled(parsed.locationEnabled ?? true);
        setAutoDownloadEnabled(parsed.autoDownloadEnabled ?? false);
        setDataUsageOptimized(parsed.dataUsageOptimized ?? false);
      }
      
      if (privacySettings) {
        const parsed = JSON.parse(privacySettings);
        setAnalyticsEnabled(parsed.analyticsEnabled ?? true);
        setCrashReportingEnabled(parsed.crashReportingEnabled ?? true);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveNotificationSettings = async (settings) => {
    try {
      // Use the utility function which also updates notification channels
      await saveNotificationSettingsUtil(settings);
    } catch (error) {
      console.error('Error saving notification settings:', error);
    }
  };

  const saveAppSettings = async (settings) => {
    try {
      await AsyncStorage.setItem('appSettings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving app settings:', error);
    }
  };

  const toggleNotifications = async (value) => {
    setNotificationsEnabled(value);
    const settings = {
      notificationsEnabled: value,
      pushNotificationsEnabled,
      orderUpdatesEnabled,
      promotionsEnabled,
      soundEnabled,
      vibrationEnabled
    };
    await saveNotificationSettings(settings);
    if (value) {
      await requestNotificationPermissions();
    }
  };

  const togglePushNotifications = async (value) => {
    setPushNotificationsEnabled(value);
    const settings = {
      notificationsEnabled,
      pushNotificationsEnabled: value,
      orderUpdatesEnabled,
      promotionsEnabled,
      soundEnabled,
      vibrationEnabled
    };
    await saveNotificationSettings(settings);
  };

  const toggleOrderUpdates = async (value) => {
    setOrderUpdatesEnabled(value);
    const settings = {
      notificationsEnabled,
      pushNotificationsEnabled,
      orderUpdatesEnabled: value,
      promotionsEnabled,
      soundEnabled,
      vibrationEnabled
    };
    await saveNotificationSettings(settings);
  };

  const togglePromotions = async (value) => {
    setPromotionsEnabled(value);
    const settings = {
      notificationsEnabled,
      pushNotificationsEnabled,
      orderUpdatesEnabled,
      promotionsEnabled: value,
      soundEnabled,
      vibrationEnabled
    };
    await saveNotificationSettings(settings);
  };

  const toggleSound = async (value) => {
    setSoundEnabled(value);
    const settings = {
      notificationsEnabled,
      pushNotificationsEnabled,
      orderUpdatesEnabled,
      promotionsEnabled,
      soundEnabled: value,
      vibrationEnabled
    };
    await saveNotificationSettings(settings);
  };

  const toggleVibration = async (value) => {
    setVibrationEnabled(value);
    const settings = {
      notificationsEnabled,
      pushNotificationsEnabled,
      orderUpdatesEnabled,
      promotionsEnabled,
      soundEnabled,
      vibrationEnabled: value
    };
    await saveNotificationSettings(settings);
  };

  const toggleDarkMode = async (value) => {
    setDarkModeEnabled(value);
    const settings = {
      darkModeEnabled: value,
      locationEnabled,
      autoDownloadEnabled,
      dataUsageOptimized
    };
    await saveAppSettings(settings);
    
    Alert.alert(
      'Theme Changed',
      'Please restart the app to apply the new theme.',
      [{ text: 'OK' }]
    );
  };

  const toggleLocation = async (value) => {
    setLocationEnabled(value);
    const settings = {
      darkModeEnabled,
      locationEnabled: value,
      autoDownloadEnabled,
      dataUsageOptimized
    };
    await saveAppSettings(settings);
  };

  const clearAppData = () => {
    Alert.alert(
      'Clear App Data',
      'This will remove all your preferences, cart items, and order history. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Data',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              Alert.alert('Success', 'App data cleared successfully. Please restart the app.');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear app data.');
            }
          }
        }
      ]
    );
  };

  const handleTestNotification = async () => {
    try {
      if (Platform.OS === 'ios') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      
      // First check notification status
      const status = await checkNotificationStatus();
      console.log('Notification Status:', status);
      
      const result = await scheduleTestNotification();
      
      if (result.success) {
        Alert.alert(
          'Test Notification Sent!', 
          `${result.message}\n\nSound: ${soundEnabled ? 'Enabled' : 'Disabled'}\nVibration: ${vibrationEnabled ? 'Enabled' : 'Disabled'}\n\nCheck your notification tray in 1 second.`
        );
        if (Platform.OS === 'ios') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      } else {
        Alert.alert('Test Failed', `${result.message}\n\nPlease check your notification settings.`);
      }
    } catch (error) {
      console.error('Error testing notification:', error);
      Alert.alert('Error', 'Failed to test notification: ' + error.message);
    }
  };
  
  const handleCheckStatus = async () => {
    try {
      const status = await checkNotificationStatus();
      
      let message = `Platform: ${status.platform}\n`;
      message += `Permissions: ${status.permissions?.status || 'Unknown'}\n`;
      
      if (status.permissions?.ios) {
        message += `iOS - Alert: ${status.permissions.ios.allowsAlert}\n`;
        message += `iOS - Sound: ${status.permissions.ios.allowsSound}\n`;
        message += `iOS - Badge: ${status.permissions.ios.allowsBadge}\n`;
      }
      
      if (status.permissions?.android) {
        message += `Android - Alerts: ${status.permissions.android.canShowAlertsAndNotifications}\n`;
        message += `Android - Sounds: ${status.permissions.android.canPlaySounds}\n`;
      }
      
      message += `\nApp Settings:\n`;
      message += `Notifications: ${status.settings?.notificationsEnabled ? 'ON' : 'OFF'}\n`;
      message += `Sound: ${status.settings?.soundEnabled ? 'ON' : 'OFF'}\n`;
      message += `Vibration: ${status.settings?.vibrationEnabled ? 'ON' : 'OFF'}\n`;
      message += `Push: ${status.settings?.pushNotificationsEnabled ? 'ON' : 'OFF'}\n`;
      message += `\nScheduled: ${status.scheduled || 0} notifications`;
      
      if (status.error) {
        message += `\n\nError: ${status.error}`;
      }
      
      Alert.alert('Notification Status', message);
    } catch (error) {
      Alert.alert('Error', 'Failed to check status: ' + error.message);
    }
  };

  const handleDemoNotifications = async () => {
    try {
      await sendDemoNotifications();
      Alert.alert('Demo Sent', 'Demo notifications have been scheduled!');
    } catch (error) {
      Alert.alert('Error', 'Failed to send demo notifications.');
    }
  };

  const SettingItem = ({ icon: Icon, title, subtitle, rightContent, onPress, disabled = false }) => (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 16,
        paddingHorizontal: 20,
        backgroundColor: disabled 
          ? (isDark ? "#1A1A1A" : "#F8F9FA")
          : (isDark ? "#1E1E1E" : "#FFFFFF"),
        opacity: disabled ? 0.6 : 1,
      }}
      onPress={disabled ? undefined : onPress}
      activeOpacity={disabled ? 1 : 0.7}
    >
      <View style={{
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: isDark ? "#374151" : "#F3F4F6",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 16,
      }}>
        <Icon size={20} color={isDark ? "#FFFFFF" : "#374151"} />
      </View>
      
      <View style={{ flex: 1 }}>
        <Text style={{
          fontSize: 16,
          fontFamily: "Inter_500Medium",
          color: isDark ? "#FFFFFF" : "#000000",
          marginBottom: subtitle ? 2 : 0,
        }}>
          {title}
        </Text>
        {subtitle && (
          <Text style={{
            fontSize: 14,
            fontFamily: "Inter_400Regular",
            color: isDark ? "#9CA3AF" : "#6B7280",
          }}>
            {subtitle}
          </Text>
        )}
      </View>
      
      {rightContent}
    </TouchableOpacity>
  );

  const SectionHeader = ({ title }) => (
    <Text style={{
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
      color: isDark ? "#9CA3AF" : "#6B7280",
      marginTop: 24,
      marginBottom: 8,
      marginHorizontal: 20,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    }}>
      {title}
    </Text>
  );

  const Divider = () => (
    <View style={{ 
      height: 1, 
      backgroundColor: isDark ? "#374151" : "#E5E7EB", 
      marginLeft: 76 
    }} />
  );

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
            marginRight: 16,
          }}
        >
          <ArrowLeft size={20} color={isDark ? "#FFFFFF" : "#000000"} />
        </TouchableOpacity>
        
        <Text style={{
          fontSize: 18,
          fontFamily: "Inter_600SemiBold",
          color: isDark ? "#FFFFFF" : "#000000",
        }}>
          Settings
        </Text>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Notifications */}
        <SectionHeader title="Notifications" />
        <View style={{
          backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
          borderRadius: 16,
          marginHorizontal: 20,
          overflow: "hidden",
        }}>
          <SettingItem
            icon={Bell}
            title="Notifications"
            subtitle="Enable all notifications"
            rightContent={
              <Switch
                value={notificationsEnabled}
                onValueChange={toggleNotifications}
                trackColor={{ false: "#767577", true: "#10B981" }}
                thumbColor={notificationsEnabled ? "#FFFFFF" : "#f4f3f4"}
              />
            }
          />
          
          <Divider />
          
          <SettingItem
            icon={Smartphone}
            title="Push Notifications"
            subtitle="Receive notifications when app is closed"
            disabled={!notificationsEnabled}
            rightContent={
              <Switch
                value={pushNotificationsEnabled}
                onValueChange={togglePushNotifications}
                trackColor={{ false: "#767577", true: "#10B981" }}
                thumbColor={pushNotificationsEnabled ? "#FFFFFF" : "#f4f3f4"}
                disabled={!notificationsEnabled}
              />
            }
          />
          
          <Divider />
          
          <SettingItem
            icon={Shield}
            title="Order Updates"
            subtitle="Get notified about order status changes"
            disabled={!notificationsEnabled}
            rightContent={
              <Switch
                value={orderUpdatesEnabled}
                onValueChange={toggleOrderUpdates}
                trackColor={{ false: "#767577", true: "#10B981" }}
                thumbColor={orderUpdatesEnabled ? "#FFFFFF" : "#f4f3f4"}
                disabled={!notificationsEnabled}
              />
            }
          />
          
          <Divider />
          
          <SettingItem
            icon={Globe}
            title="Promotions & Offers"
            subtitle="Receive special offers and discounts"
            disabled={!notificationsEnabled}
            rightContent={
              <Switch
                value={promotionsEnabled}
                onValueChange={togglePromotions}
                trackColor={{ false: "#767577", true: "#10B981" }}
                thumbColor={promotionsEnabled ? "#FFFFFF" : "#f4f3f4"}
                disabled={!notificationsEnabled}
              />
            }
          />
          
          <Divider />
          
          <SettingItem
            icon={Volume2}
            title="Sound"
            subtitle="Play sound for notifications"
            disabled={!notificationsEnabled}
            rightContent={
              <Switch
                value={soundEnabled}
                onValueChange={toggleSound}
                trackColor={{ false: "#767577", true: "#10B981" }}
                thumbColor={soundEnabled ? "#FFFFFF" : "#f4f3f4"}
                disabled={!notificationsEnabled}
              />
            }
          />
          
          <Divider />
          
          <SettingItem
            icon={Vibrate}
            title="Vibration"
            subtitle="Vibrate device for notifications"
            disabled={!notificationsEnabled}
            rightContent={
              <Switch
                value={vibrationEnabled}
                onValueChange={toggleVibration}
                trackColor={{ false: "#767577", true: "#10B981" }}
                thumbColor={vibrationEnabled ? "#FFFFFF" : "#f4f3f4"}
                disabled={!notificationsEnabled}
              />
            }
          />
        </View>

        {/* Notification Testing */}
        <SectionHeader title="Notification Testing" />
        <View style={{
          backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
          borderRadius: 16,
          marginHorizontal: 20,
          overflow: "hidden",
        }}>
          <SettingItem
            icon={Bell}
            title="Send Test Notification"
            subtitle="Test if notifications are working"
            onPress={handleTestNotification}
            rightContent={
              <ChevronRight size={20} color={isDark ? "#9CA3AF" : "#6B7280"} />
            }
          />
          
          <Divider />
          
          <SettingItem
            icon={Bell}
            title="Send Demo Notifications"
            subtitle="Multiple sample notifications"
            onPress={handleDemoNotifications}
            rightContent={
              <ChevronRight size={20} color={isDark ? "#9CA3AF" : "#6B7280"} />
            }
          />
          
          <Divider />
          
          <SettingItem
            icon={Info}
            title="Check Notification Status"
            subtitle="Debug notification permissions and settings"
            onPress={handleCheckStatus}
            rightContent={
              <ChevronRight size={20} color={isDark ? "#9CA3AF" : "#6B7280"} />
            }
          />
        </View>

        {/* App Settings */}
        <SectionHeader title="App Settings" />
        <View style={{
          backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
          borderRadius: 16,
          marginHorizontal: 20,
          overflow: "hidden",
        }}>
          <SettingItem
            icon={isDark ? Sun : Moon}
            title="Dark Mode"
            subtitle="Switch between light and dark theme"
            rightContent={
              <Switch
                value={darkModeEnabled}
                onValueChange={toggleDarkMode}
                trackColor={{ false: "#767577", true: "#10B981" }}
                thumbColor={darkModeEnabled ? "#FFFFFF" : "#f4f3f4"}
              />
            }
          />
          
          <Divider />
          
          <SettingItem
            icon={MapPin}
            title="Location Services"
            subtitle="Allow app to access your location"
            rightContent={
              <Switch
                value={locationEnabled}
                onValueChange={toggleLocation}
                trackColor={{ false: "#767577", true: "#10B981" }}
                thumbColor={locationEnabled ? "#FFFFFF" : "#f4f3f4"}
              />
            }
          />
          
          <Divider />
          
          <SettingItem
            icon={Download}
            title="Auto Download Images"
            subtitle="Download images automatically"
            rightContent={
              <Switch
                value={autoDownloadEnabled}
                onValueChange={setAutoDownloadEnabled}
                trackColor={{ false: "#767577", true: "#10B981" }}
                thumbColor={autoDownloadEnabled ? "#FFFFFF" : "#f4f3f4"}
              />
            }
          />
          
          <Divider />
          
          <SettingItem
            icon={Smartphone}
            title="Data Usage Optimization"
            subtitle="Reduce data usage"
            rightContent={
              <Switch
                value={dataUsageOptimized}
                onValueChange={setDataUsageOptimized}
                trackColor={{ false: "#767577", true: "#10B981" }}
                thumbColor={dataUsageOptimized ? "#FFFFFF" : "#f4f3f4"}
              />
            }
          />
          
          <Divider />
          
          <SettingItem
            icon={Languages}
            title="Language"
            subtitle="English"
            onPress={() => Alert.alert('Language', 'Language selection coming soon!')}
            rightContent={
              <ChevronRight size={20} color={isDark ? "#9CA3AF" : "#6B7280"} />
            }
          />
        </View>

        {/* Privacy & Security */}
        <SectionHeader title="Privacy & Security" />
        <View style={{
          backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
          borderRadius: 16,
          marginHorizontal: 20,
          overflow: "hidden",
        }}>
          <SettingItem
            icon={Shield}
            title="Analytics"
            subtitle="Help improve the app"
            rightContent={
              <Switch
                value={analyticsEnabled}
                onValueChange={setAnalyticsEnabled}
                trackColor={{ false: "#767577", true: "#10B981" }}
                thumbColor={analyticsEnabled ? "#FFFFFF" : "#f4f3f4"}
              />
            }
          />
          
          <Divider />
          
          <SettingItem
            icon={Shield}
            title="Crash Reporting"
            subtitle="Send crash reports to improve stability"
            rightContent={
              <Switch
                value={crashReportingEnabled}
                onValueChange={setCrashReportingEnabled}
                trackColor={{ false: "#767577", true: "#10B981" }}
                thumbColor={crashReportingEnabled ? "#FFFFFF" : "#f4f3f4"}
              />
            }
          />
          
          <Divider />
          
          <SettingItem
            icon={Trash2}
            title="Clear App Data"
            subtitle="Remove all data and preferences"
            onPress={clearAppData}
            rightContent={
              <ChevronRight size={20} color="#EF4444" />
            }
          />
        </View>

        {/* Support & Info */}
        <SectionHeader title="Support & Info" />
        <View style={{
          backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
          borderRadius: 16,
          marginHorizontal: 20,
          overflow: "hidden",
        }}>
          <SettingItem
            icon={HelpCircle}
            title="Help & Support"
            subtitle="Get help with using the app"
            onPress={() => Alert.alert('Help', 'Help & Support feature coming soon!')}
            rightContent={
              <ChevronRight size={20} color={isDark ? "#9CA3AF" : "#6B7280"} />
            }
          />
          
          <Divider />
          
          <SettingItem
            icon={FileText}
            title="Privacy Policy"
            subtitle="Read our privacy policy"
            onPress={() => Alert.alert('Privacy Policy', 'Privacy Policy will be available soon.')}
            rightContent={
              <ChevronRight size={20} color={isDark ? "#9CA3AF" : "#6B7280"} />
            }
          />
          
          <Divider />
          
          <SettingItem
            icon={FileText}
            title="Terms of Service"
            subtitle="Read our terms of service"
            onPress={() => Alert.alert('Terms', 'Terms of Service will be available soon.')}
            rightContent={
              <ChevronRight size={20} color={isDark ? "#9CA3AF" : "#6B7280"} />
            }
          />
          
          <Divider />
          
          <SettingItem
            icon={Info}
            title="About"
            subtitle="App version and information"
            onPress={() => {
              Alert.alert(
                'About FoodieApp',
                'Version 1.0.0\n\nA food ordering app for LPU campus students.\n\nDeveloped with ❤️ for the campus community.',
                [{ text: 'OK' }]
              );
            }}
            rightContent={
              <ChevronRight size={20} color={isDark ? "#9CA3AF" : "#6B7280"} />
            }
          />
        </View>
        
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}