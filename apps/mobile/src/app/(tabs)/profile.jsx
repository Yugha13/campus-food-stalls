import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Pressable,
  useColorScheme,
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
} from "lucide-react-native";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";

// Dummy order history
const orderHistory = [
  {
    id: "1",
    date: "March 15, 2024",
    items: "Chicken Momos, Cold Coffee",
    total: 200,
    status: "Completed",
    shop: "Momos Point",
  },
  {
    id: "2",
    date: "March 12, 2024",
    items: "Margherita Pizza",
    total: 180,
    status: "Completed",
    shop: "Pizza Corner",
  },
  {
    id: "3",
    date: "March 10, 2024",
    items: "Crispy Burger, Fries",
    total: 220,
    status: "Completed",
    shop: "Burger Hub",
  },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [profileImage, setProfileImage] = useState(
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
  );

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
      onPress: () => console.log("Order History"),
      showArrow: true,
    },
    {
      icon: Heart,
      label: "Favorite Foods",
      onPress: () => console.log("Favorite Foods"),
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
      onPress: () => console.log("App Settings"),
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
      style={({ pressed }) => ({
        backgroundColor: pressed
          ? isDark
            ? "#333333"
            : "#F0F0F0"
          : isDark
            ? "#1E1E1E"
            : "#FFFFFF",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
      })}
    >
      <Icon size={20} color={isDark ? "#FFFFFF" : "#000000"} />
      <Text
        style={{
          marginLeft: 16,
          flex: 1,
          fontSize: 16,
          fontFamily: "Inter_500Medium",
          color: isDark ? "#FFFFFF" : "#000000",
        }}
      >
        {label}
      </Text>
      {showArrow && (
        <ChevronRight size={18} color={isDark ? "#9CA3AF" : "#9B9B9B"} />
      )}
    </Pressable>
  );

  const renderOrderItem = (order) => (
    <View
      key={order.id}
      style={{
        backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 8,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Inter_600SemiBold",
              color: isDark ? "#FFFFFF" : "#000000",
              marginBottom: 4,
            }}
          >
            {order.items}
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontFamily: "Inter_400Regular",
              color: isDark ? "#9CA3AF" : "#6B7280",
              marginBottom: 2,
            }}
          >
            {order.shop} • {order.date}
          </Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Inter_600SemiBold",
              color: "#22C55E",
              marginBottom: 4,
            }}
          >
            ₹{order.total}
          </Text>
          <View
            style={{
              backgroundColor: "#F0FDF4",
              paddingHorizontal: 8,
              paddingVertical: 2,
              borderRadius: 6,
            }}
          >
            <Text
              style={{
                fontSize: 10,
                fontFamily: "Inter_600SemiBold",
                color: "#15803D",
              }}
            >
              {order.status}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? "#121212" : "#F8FDF8" }}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 16,
          paddingHorizontal: 20,
          paddingBottom: 16,
          backgroundColor: isDark ? "#121212" : "#F8FDF8",
        }}
      >
        <Text
          style={{
            fontSize: 28,
            fontFamily: "Inter_600SemiBold",
            color: isDark ? "#FFFFFF" : "#000000",
          }}
        >
          Profile
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Info */}
        <View style={{ alignItems: "center", marginBottom: 32 }}>
          <View style={{ position: "relative", marginBottom: 16 }}>
            <Image
              source={{ uri: profileImage }}
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                borderWidth: 4,
                borderColor: isDark ? "#1E1E1E" : "#FFFFFF",
              }}
              contentFit="cover"
            />
            <TouchableOpacity
              onPress={handleImagePicker}
              style={{
                position: "absolute",
                bottom: 4,
                right: 4,
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: "#22C55E",
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 2,
                borderColor: isDark ? "#121212" : "#F8FDF8",
              }}
            >
              <Camera size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <Text
            style={{
              fontSize: 24,
              fontFamily: "Inter_600SemiBold",
              color: isDark ? "#FFFFFF" : "#000000",
              marginBottom: 4,
            }}
          >
            Arjun Sharma
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Inter_400Regular",
              color: isDark ? "#9CA3AF" : "#6B7280",
              marginBottom: 2,
            }}
          >
            Student ID: 12205467
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Inter_400Regular",
              color: isDark ? "#9CA3AF" : "#6B7280",
            }}
          >
            B.Tech CSE • 3rd Year
          </Text>
        </View>

        {/* Account Section */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: "Inter_600SemiBold",
              color: isDark ? "#FFFFFF" : "#000000",
              marginBottom: 16,
            }}
          >
            Account
          </Text>
          {menuItems.map((item, index) => renderMenuItem(item, index))}
        </View>

        {/* Recent Orders */}
        <View style={{ marginBottom: 32 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontFamily: "Inter_600SemiBold",
                color: isDark ? "#FFFFFF" : "#000000",
              }}
            >
              Recent Orders
            </Text>
            <TouchableOpacity>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Inter_500Medium",
                  color: "#22C55E",
                }}
              >
                View All
              </Text>
            </TouchableOpacity>
          </View>
          {orderHistory.slice(0, 3).map(renderOrderItem)}
        </View>

        {/* Settings Section */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: "Inter_600SemiBold",
              color: isDark ? "#FFFFFF" : "#000000",
              marginBottom: 16,
            }}
          >
            Settings
          </Text>
          {settingsItems.map((item, index) => renderMenuItem(item, index))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={{
            backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
            borderRadius: 12,
            padding: 16,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 2,
          }}
          activeOpacity={0.7}
        >
          <LogOut size={20} color="#EF4444" />
          <Text
            style={{
              marginLeft: 12,
              fontSize: 16,
              fontFamily: "Inter_600SemiBold",
              color: "#EF4444",
            }}
          >
            Logout
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
