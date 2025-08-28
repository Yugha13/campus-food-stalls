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

// Dummy wishlist data
const wishlistItems = [
  {
    id: "1",
    name: "Chicken Momos",
    image: "https://images.unsplash.com/photo-1626776876729-bab4369a5a23?w=500&h=500&fit=crop",
    price: 120,
    shop: "Momos Point",
    rating: 4.8,
  },
  {
    id: "2",
    name: "Margherita Pizza",
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500&h=500&fit=crop",
    price: 180,
    shop: "Pizza Corner",
    rating: 4.6,
  },
  {
    id: "3",
    name: "Cold Coffee",
    image: "https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=500&h=500&fit=crop",
    price: 80,
    shop: "Campus Cafe",
    rating: 4.7,
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
  
  const [showWishlist, setShowWishlist] = useState(false);

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
      label: "Wishlist",
      onPress: () => setShowWishlist(!showWishlist),
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

  const renderWishlistItem = (item) => (
    <View
      key={item.id}
      style={{
        backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        overflow: "hidden",
      }}
    >
      <View style={{ flexDirection: "row" }}>
        <Image
          source={{ uri: item.image }}
          style={{ width: 100, height: 100 }}
          contentFit="cover"
        />
        <View style={{ flex: 1, padding: 12 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "Inter_600SemiBold",
                  color: isDark ? "#FFFFFF" : "#000000",
                  marginBottom: 4,
                }}
                numberOfLines={1}
              >
                {item.name}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Inter_400Regular",
                  color: isDark ? "#9CA3AF" : "#6B7280",
                  marginBottom: 4,
                }}
              >
                {item.shop}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    color: "#F59E0B",
                    marginRight: 4,
                  }}
                >
                  ★
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: "Inter_500Medium",
                    color: isDark ? "#D1D5DB" : "#4B5563",
                  }}
                >
                  {item.rating}
                </Text>
              </View>
            </View>
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Inter_600SemiBold",
                color: "#22C55E",
              }}
            >
              ₹{item.price}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 4,
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "#22C55E",
                borderRadius: 6,
                paddingHorizontal: 12,
                paddingVertical: 6,
                flex: 1,
                marginRight: 8,
                alignItems: "center",
              }}
              onPress={() => console.log("Add to cart", item.id)}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "Inter_600SemiBold",
                  color: "#FFFFFF",
                }}
              >
                Add to Cart
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                borderWidth: 1,
                borderColor: "#EF4444",
                borderRadius: 6,
                paddingHorizontal: 12,
                paddingVertical: 6,
                alignItems: "center",
              }}
              onPress={() => console.log("Remove from wishlist", item.id)}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "Inter_600SemiBold",
                  color: "#EF4444",
                }}
              >
                Remove
              </Text>
            </TouchableOpacity>
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
        {/* Profile Info - Enhanced UI */}
        <View style={{ marginBottom: 32 }}>
          <View 
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <View style={{ position: "relative", marginRight: 16 }}>
              <Image
                source={{ uri: profileImage }}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  borderWidth: 3,
                  borderColor: "#22C55E",
                }}
                contentFit="cover"
              />
              <TouchableOpacity
                onPress={handleImagePicker}
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  backgroundColor: "#22C55E",
                  borderRadius: 20,
                  padding: 8,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 3,
                  elevation: 3,
                }}
              >
                <Camera size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 22,
                  fontFamily: "Inter_600SemiBold",
                  color: isDark ? "#FFFFFF" : "#000000",
                  marginBottom: 4,
                }}
              >
                Arjun Sharma
              </Text>
              <View 
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 6,
                }}
              >
                <View 
                  style={{
                    backgroundColor: isDark ? "#333333" : "#E5E7EB",
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 4,
                    marginRight: 8,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: "Inter_500Medium",
                      color: isDark ? "#D1D5DB" : "#4B5563",
                    }}
                  >
                    ID: 12205467
                  </Text>
                </View>
                <View 
                  style={{
                    backgroundColor: "#ECFDF5",
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 4,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: "Inter_500Medium",
                      color: "#047857",
                    }}
                  >
                    B.Tech CSE
                  </Text>
                </View>
              </View>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Inter_500Medium",
                  color: "#22C55E",
                }}
              >
                3rd Year • 6th Semester
              </Text>
            </View>
          </View>
          
          {/* Quick Stats */}
          <View 
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
              borderRadius: 12,
              padding: 16,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <View style={{ alignItems: "center" }}>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: "Inter_600SemiBold",
                  color: "#22C55E",
                  marginBottom: 4,
                }}
              >
                {orderHistory.length}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "Inter_400Regular",
                  color: isDark ? "#9CA3AF" : "#6B7280",
                }}
              >
                Orders
              </Text>
            </View>
            
            <View 
              style={{
                height: 30,
                width: 1,
                backgroundColor: isDark ? "#333333" : "#E5E7EB",
              }}
            />
            
            <View style={{ alignItems: "center" }}>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: "Inter_600SemiBold",
                  color: "#22C55E",
                  marginBottom: 4,
                }}
              >
                {wishlistItems.length}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "Inter_400Regular",
                  color: isDark ? "#9CA3AF" : "#6B7280",
                }}
              >
                Wishlist
              </Text>
            </View>
            
            <View 
              style={{
                height: 30,
                width: 1,
                backgroundColor: isDark ? "#333333" : "#E5E7EB",
              }}
            />
            
            <View style={{ alignItems: "center" }}>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: "Inter_600SemiBold",
                  color: "#22C55E",
                  marginBottom: 4,
                }}
              >
                ₹600
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "Inter_400Regular",
                  color: isDark ? "#9CA3AF" : "#6B7280",
                }}
              >
                Total Spent
              </Text>
            </View>
          </View>
        </View>

        {/* Account Section - Enhanced UI */}
        <View style={{ marginBottom: 32 }}>
          <View 
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <View 
              style={{
                width: 4,
                height: 20,
                backgroundColor: "#22C55E",
                borderRadius: 2,
                marginRight: 8,
              }}
            />
            <Text
              style={{
                fontSize: 18,
                fontFamily: "Inter_600SemiBold",
                color: isDark ? "#FFFFFF" : "#000000",
              }}
            >
              Account
            </Text>
          </View>
          
          <View 
            style={{
              backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
              borderRadius: 16,
              padding: 4,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 6,
              elevation: 2,
            }}
          >
            {menuItems.map((item, index) => (
              <Pressable
                key={index}
                onPress={item.onPress}
                style={({ pressed }) => ({
                  backgroundColor: pressed
                    ? isDark
                      ? "#333333"
                      : "#F0F0F0"
                    : "transparent",
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: index < menuItems.length - 1 ? 0 : 0,
                  flexDirection: "row",
                  alignItems: "center",
                  borderBottomWidth: index < menuItems.length - 1 ? 1 : 0,
                  borderBottomColor: isDark ? "#333333" : "#F0F0F0",
                })}
              >
                <View 
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: isDark ? "#333333" : "#F0F9F4",
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 16,
                  }}
                >
                  <item.icon size={18} color="#22C55E" />
                </View>
                <Text
                  style={{
                    flex: 1,
                    fontSize: 16,
                    fontFamily: "Inter_500Medium",
                    color: isDark ? "#FFFFFF" : "#000000",
                  }}
                >
                  {item.label}
                </Text>
                {item.showArrow && (
                  <ChevronRight size={18} color={isDark ? "#9CA3AF" : "#9B9B9B"} />
                )}
              </Pressable>
            ))}
        </View>

        {/* Wishlist Section */}
        {showWishlist && (
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
                My Wishlist
              </Text>
              <TouchableOpacity onPress={() => setShowWishlist(false)}>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "Inter_500Medium",
                    color: "#22C55E",
                  }}
                >
                  Hide
                </Text>
              </TouchableOpacity>
            </View>
            {wishlistItems.map(renderWishlistItem)}
          </View>
        )}

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

        {/* Settings Section - Enhanced UI */}
        <View style={{ marginBottom: 32 }}>
          <View 
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <View 
              style={{
                width: 4,
                height: 20,
                backgroundColor: "#22C55E",
                borderRadius: 2,
                marginRight: 8,
              }}
            />
            <Text
              style={{
                fontSize: 18,
                fontFamily: "Inter_600SemiBold",
                color: isDark ? "#FFFFFF" : "#000000",
              }}
            >
              Settings
            </Text>
          </View>
          
          <View 
            style={{
              backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
              borderRadius: 16,
              padding: 4,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 6,
              elevation: 2,
              marginBottom: 24,
            }}
          >
            {settingsItems.map((item, index) => (
              <Pressable
                key={index}
                onPress={item.onPress}
                style={({ pressed }) => ({
                  backgroundColor: pressed
                    ? isDark
                      ? "#333333"
                      : "#F0F0F0"
                    : "transparent",
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: index < settingsItems.length - 1 ? 0 : 0,
                  flexDirection: "row",
                  alignItems: "center",
                  borderBottomWidth: index < settingsItems.length - 1 ? 1 : 0,
                  borderBottomColor: isDark ? "#333333" : "#F0F0F0",
                })}
              >
                <View 
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: isDark ? "#333333" : "#F0F9F4",
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 16,
                  }}
                >
                  <item.icon size={18} color="#22C55E" />
                </View>
                <Text
                  style={{
                    flex: 1,
                    fontSize: 16,
                    fontFamily: "Inter_500Medium",
                    color: isDark ? "#FFFFFF" : "#000000",
                  }}
                >
                  {item.label}
                </Text>
                {item.showArrow && (
                  <ChevronRight size={18} color={isDark ? "#9CA3AF" : "#9B9B9B"} />
                )}
              </Pressable>
            ))}
          </View>
        </View>

        {/* Logout Button - Enhanced UI */}
        <TouchableOpacity
          style={{
            backgroundColor: isDark ? "rgba(239, 68, 68, 0.1)" : "rgba(239, 68, 68, 0.05)",
            borderRadius: 12,
            padding: 16,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 16,
          }}
          activeOpacity={0.7}
        >
          <View 
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: isDark ? "rgba(239, 68, 68, 0.2)" : "rgba(239, 68, 68, 0.1)",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 12,
            }}
          >
            <LogOut size={18} color="#EF4444" />
          </View>
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Inter_600SemiBold",
              color: "#EF4444",
            }}
          >
            Logout from Account
          </Text>
        </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
