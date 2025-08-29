import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Pressable,
  useColorScheme,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import {
  User,
  ShoppingBag,
  Heart,
  Settings,
  HelpCircle,
  Phone,
  MapPin,
  ChevronRight,
  LogOut,
  Camera,
  Bell,
} from "lucide-react-native";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";
import { useState, useEffect } from "react";
import * as Haptics from 'expo-haptics';
import { addToCart, getCartItems } from '../../utils/cartUtils';
import * as ImagePicker from "expo-image-picker";
import * as Notifications from 'expo-notifications';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [profileImage, setProfileImage] = useState(
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
  );
  
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    loadCartItems();
    requestNotificationPermissions();
  }, []);

  const loadCartItems = async () => {
    try {
      const items = await getCartItems();
      setCartItems(items);
    } catch (error) {
      console.error('Error loading cart items:', error);
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
        // User can still use the app without notifications
        console.log('Notification permissions not granted');
      }
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
    }
  };

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleImagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const menuItems = [
    {
      icon: User,
      label: "Edit Profile",
      onPress: () => console.log("Edit Profile"),
      showArrow: true,
    },
    {
      icon: ShoppingBag,
      label: "Order History",
      onPress: () => {
        if (Platform.OS === 'ios') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        router.push('/order-history');
      },
      showArrow: true,
    },
    {
      icon: Heart,
      label: "Wishlist",
      onPress: () => {
        if (Platform.OS === 'ios') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        router.push('/wishlist');
      },
      showArrow: true,
    },
    {
      icon: MapPin,
      label: "Campus Address",
      onPress: () => console.log("Campus Address"),
      showArrow: true,
    },
  ];

  const settingsItems = [
    {
      icon: Settings,
      label: "App Settings",
      onPress: () => {
        if (Platform.OS === 'ios') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        router.push('/settings');
      },
      showArrow: true,
    },
    {
      icon: Bell,
      label: "Notifications",
      onPress: () => {
        if (Platform.OS === 'ios') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        router.push('/notifications');
      },
      showArrow: true,
    },
    {
      icon: HelpCircle,
      label: "Help & Support",
      onPress: () => console.log("Help & Support"),
      showArrow: true,
    },
    {
      icon: Phone,
      label: "Contact Us",
      onPress: () => console.log("Contact Us"),
      showArrow: true,
    },
  ];

  const renderMenuItem = ({ icon: Icon, label, onPress, showArrow }, index) => (
    <Pressable
      key={index}
      onPress={onPress}
      style={({ pressed }) => [{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 16,
        paddingHorizontal: 20,
        backgroundColor: pressed 
          ? (isDark ? "#374151" : "#F3F4F6")
          : (isDark ? "#1E1E1E" : "#FFFFFF"),
        borderBottomWidth: index < menuItems.length - 1 ? 1 : 0,
        borderBottomColor: isDark ? "#374151" : "#E5E7EB",
      }]}
    >
      <View style={{
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: isDark ? "#374151" : "#F3F4F6",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 16,
      }}>
        <Icon size={20} color={isDark ? "#FFFFFF" : "#374151"} />
      </View>
      
      <Text style={{
        flex: 1,
        fontSize: 16,
        fontFamily: "Inter_500Medium",
        color: isDark ? "#FFFFFF" : "#000000",
      }}>
        {label}
      </Text>
      
      {showArrow && (
        <ChevronRight size={20} color={isDark ? "#9CA3AF" : "#6B7280"} />
      )}
    </Pressable>
  );

  return (
    <View style={{
      flex: 1,
      backgroundColor: isDark ? "#000000" : "#F9FAFB",
      paddingTop: insets.top,
    }}>
      <StatusBar style={isDark ? "light" : "dark"} />
      
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{
          backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: 24,
        }}>
          <Text style={{
            fontSize: 28,
            fontFamily: "Inter_600SemiBold",
            color: isDark ? "#FFFFFF" : "#000000",
            marginBottom: 24,
          }}>
            Profile
          </Text>
          
          {/* Profile Info */}
          <View style={{
            flexDirection: "row",
            alignItems: "center",
          }}>
            <View style={{ position: "relative" }}>
              <Image
                source={{ uri: profileImage }}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  marginRight: 16,
                }}
                contentFit="cover"
              />
              
              <TouchableOpacity
                onPress={handleImagePicker}
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 12,
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: "#10B981",
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 3,
                  borderColor: isDark ? "#1E1E1E" : "#FFFFFF",
                }}
              >
                <Camera size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            
            <View style={{ flex: 1 }}>
              <Text style={{
                fontSize: 22,
                fontFamily: "Inter_600SemiBold",
                color: isDark ? "#FFFFFF" : "#000000",
                marginBottom: 4,
              }}>
                John Doe
              </Text>
              
              <Text style={{
                fontSize: 16,
                fontFamily: "Inter_400Regular",
                color: isDark ? "#9CA3AF" : "#6B7280",
                marginBottom: 8,
              }}>
                john.doe@lpu.in
              </Text>
              
              <View style={{
                flexDirection: "row",
                alignItems: "center",
              }}>
                <MapPin size={16} color={isDark ? "#9CA3AF" : "#6B7280"} />
                <Text style={{
                  fontSize: 14,
                  fontFamily: "Inter_400Regular",
                  color: isDark ? "#9CA3AF" : "#6B7280",
                  marginLeft: 4,
                }}>
                  Block A, Room 205
                </Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* Menu Items */}
        <View style={{
          backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
          marginTop: 16,
          marginHorizontal: 20,
          borderRadius: 16,
          overflow: "hidden",
        }}>
          {menuItems.map((item, index) => renderMenuItem(item, index))}
        </View>
        
        {/* Settings */}
        <View style={{
          backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
          marginTop: 16,
          marginHorizontal: 20,
          borderRadius: 16,
          overflow: "hidden",
        }}>
          {settingsItems.map((item, index) => (
            <Pressable
              key={index}
              onPress={item.onPress}
              style={({ pressed }) => [{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 16,
                paddingHorizontal: 20,
                backgroundColor: pressed 
                  ? (isDark ? "#374151" : "#F3F4F6")
                  : (isDark ? "#1E1E1E" : "#FFFFFF"),
                borderBottomWidth: index < settingsItems.length - 1 ? 1 : 0,
                borderBottomColor: isDark ? "#374151" : "#E5E7EB",
              }]}
            >
              <View style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: isDark ? "#374151" : "#F3F4F6",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 16,
              }}>
                <item.icon size={20} color={isDark ? "#FFFFFF" : "#374151"} />
              </View>
              
              <Text style={{
                flex: 1,
                fontSize: 16,
                fontFamily: "Inter_500Medium",
                color: isDark ? "#FFFFFF" : "#000000",
              }}>
                {item.label}
              </Text>
              
              {item.showArrow && (
                <ChevronRight size={20} color={isDark ? "#9CA3AF" : "#6B7280"} />
              )}
            </Pressable>
          ))}
        </View>
        
        {/* Logout */}
        <TouchableOpacity
          style={{
            backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
            marginTop: 16,
            marginHorizontal: 20,
            borderRadius: 16,
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 16,
            paddingHorizontal: 20,
          }}
          onPress={() => console.log("Logout")}
        >
          <View style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: "#FEE2E2",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 16,
          }}>
            <LogOut size={20} color="#EF4444" />
          </View>
          
          <Text style={{
            flex: 1,
            fontSize: 16,
            fontFamily: "Inter_500Medium",
            color: "#EF4444",
          }}>
            Logout
          </Text>
          
          <ChevronRight size={20} color="#EF4444" />
        </TouchableOpacity>
        
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}