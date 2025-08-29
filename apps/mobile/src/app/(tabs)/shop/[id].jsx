import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Pressable,
  Platform,
  Alert,
  Dimensions,
  Animated,
} from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter, useLocalSearchParams } from "expo-router";
import { 
  ChevronLeft, 
  Star, 
  MapPin, 
  Plus, 
  Clock, 
  Phone, 
  Users, 
  Heart,
  Share2
} from "lucide-react-native";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";
import { useState, useEffect, useRef } from "react";
import * as Haptics from 'expo-haptics';
import { addToCart, getCartItems } from '../../../utils/cartUtils';
import { allShops, getFoodsByShop } from '../../../data/mockData';



const reviews = [
  {
    id: "1",
    name: "Rahul Singh",
    rating: 5,
    comment: "Amazing food quality and quick service. Highly recommended!",
    date: "2 days ago",
  },
  {
    id: "2",
    name: "Priya Sharma",
    rating: 4,
    comment: "Good taste but can improve packaging. Overall satisfied.",
    date: "1 week ago",
  },
  {
    id: "3",
    name: "Amit Kumar",
    rating: 4,
    comment: "Nice ambiance and friendly staff. Will visit again.",
    date: "2 weeks ago",
  },
];

export default function ShopScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [activeTab, setActiveTab] = useState("Menu");
  const [cartItems, setCartItems] = useState([]);
  const [orderType, setOrderType] = useState("Pickup");
  const [isLiked, setIsLiked] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const { width } = Dimensions.get('window');

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  useEffect(() => {
    loadCartItems();
  }, []);

  const loadCartItems = async () => {
    try {
      const items = await getCartItems();
      setCartItems(items);
    } catch (error) {
      console.error('Error loading cart items:', error);
    }
  };

  const handleAddToCart = async (menuItem) => {
    try {
      if (Platform.OS === 'ios') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      
      // Convert menu item to food format for cart
      const foodItem = {
        id: menuItem.id,
        name: menuItem.name,
        image: menuItem.image,
        price: menuItem.price,
        shop: shop.name,
        rating: shop.rating || 4.0,
        description: menuItem.description
      };
      
      const updatedCart = await addToCart(foodItem, 1);
      setCartItems(updatedCart);
      
      // Show success feedback
      if (Platform.OS === 'ios') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      
    } catch (error) {
      Alert.alert("Error", "Failed to add item to cart. Please try again.");
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  const shop = allShops.find(s => s.id === id);
  const menuItems = getFoodsByShop(id);
  
  if (!shop) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Shop not found</Text>
      </View>
    );
  }

  const tabs = ["Menu", "About", "Reviews"];

  const renderMenuItem = (item) => (
    <TouchableOpacity
      key={item.id}
      onPress={() => router.push(`/(tabs)/food/${item.id}`)}
      style={{
        backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
        borderRadius: 20,
        marginBottom: 16,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
      }}
      activeOpacity={0.7}
    >
      <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
        <View style={{ position: "relative", marginRight: 16 }}>
          <Image
            source={{ uri: item.image }}
            style={{
              width: 100,
              height: 100,
              borderRadius: 16,
            }}
            contentFit="cover"
          />
          
          {/* Wishlist Heart Overlay */}
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              if (Platform.OS === 'ios') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
              // Add to wishlist functionality here
            }}
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Heart size={14} color="#EF4444" />
          </TouchableOpacity>
        </View>
        
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: "Inter_600SemiBold",
              color: isDark ? "#FFFFFF" : "#000000",
              marginBottom: 4,
            }}
          >
            {item.name}
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Inter_600SemiBold",
              color: "#22C55E",
              marginBottom: 8,
            }}
          >
            ₹{item.price}
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Inter_400Regular",
              color: isDark ? "#D1D5DB" : "#4B5563",
              marginBottom: 12,
              lineHeight: 20,
            }}
            numberOfLines={2}
          >
            {item.description}
          </Text>
          
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              handleAddToCart(item);
            }}
            style={{
              backgroundColor: "#22C55E",
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 12,
              flexDirection: "row",
              alignItems: "center",
              alignSelf: "flex-start",
              shadowColor: "#22C55E",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 4,
            }}
            activeOpacity={0.8}
          >
            <Plus size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Inter_600SemiBold",
                color: "#FFFFFF",
              }}
            >
              Add to Cart
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderReview = (review) => (
    <View
      key={review.id}
      style={{
        backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: "#22C55E",
            justifyContent: "center",
            alignItems: "center",
            marginRight: 12,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Inter_600SemiBold",
              color: "#FFFFFF",
            }}
          >
            {review.name.charAt(0)}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Inter_600SemiBold",
              color: isDark ? "#FFFFFF" : "#000000",
              marginBottom: 2,
            }}
          >
            {review.name}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                color={i < review.rating ? "#F59E0B" : "#D1D5DB"}
                fill={i < review.rating ? "#F59E0B" : "none"}
              />
            ))}
            <Text
              style={{
                fontSize: 12,
                fontFamily: "Inter_400Regular",
                color: isDark ? "#9CA3AF" : "#6B7280",
                marginLeft: 8,
              }}
            >
              {review.date}
            </Text>
          </View>
        </View>
      </View>
      <Text
        style={{
          fontSize: 14,
          fontFamily: "Inter_400Regular",
          color: isDark ? "#E5E7EB" : "#374151",
          lineHeight: 20,
        }}
      >
        {review.comment}
      </Text>
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "Menu":
        return (
          <View>
            {menuItems.map(renderMenuItem)}
          </View>
        );
      case "About":
        return (
          <View
            style={{
              backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
              borderRadius: 16,
              padding: 20,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Inter_400Regular",
                color: isDark ? "#E5E7EB" : "#374151",
                lineHeight: 24,
                marginBottom: 20,
              }}
            >
              {shop.description}
            </Text>
            
            <View style={{ marginBottom: 16 }}>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                <Clock size={16} color={isDark ? "#9CA3AF" : "#6B7280"} />
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "Inter_600SemiBold",
                    color: isDark ? "#FFFFFF" : "#000000",
                    marginLeft: 8,
                  }}
                >
                  Open Hours
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Inter_400Regular",
                  color: isDark ? "#E5E7EB" : "#374151",
                  marginLeft: 24,
                }}
              >
                {shop.openHours}
              </Text>
            </View>

            <View>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                <Phone size={16} color={isDark ? "#9CA3AF" : "#6B7280"} />
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "Inter_600SemiBold",
                    color: isDark ? "#FFFFFF" : "#000000",
                    marginLeft: 8,
                  }}
                >
                  Contact
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Inter_400Regular",
                  color: isDark ? "#E5E7EB" : "#374151",
                  marginLeft: 24,
                }}
              >
                {shop.contact}
              </Text>
            </View>
          </View>
        );
      case "Reviews":
        return (
          <View>
            {reviews.map(renderReview)}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? "#000000" : "#F8FDF8" }}>
      <StatusBar style={isDark ? "light" : "dark"} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Enhanced Hero Section */}
        <View style={{ position: "relative", height: 280 }}>
          <Image
            source={{ uri: shop.image }}
            style={{
              width: "100%",
              height: 280,
            }}
            contentFit="cover"
          />
          
          {/* Gradient Overlay */}
          <View style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.3)",
          }} />
          
          {/* Header Actions */}
          <View style={{
            position: "absolute",
            top: insets.top + 16,
            left: 20,
            right: 20,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                justifyContent: "center",
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              <ChevronLeft size={20} color="#000000" />
            </TouchableOpacity>
            
            <View style={{ flexDirection: "row", gap: 12 }}>
              <TouchableOpacity
                onPress={() => {
                  setIsLiked(!isLiked);
                  if (Platform.OS === 'ios') {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }
                }}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  justifyContent: "center",
                  alignItems: "center",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 3,
                }}
              >
                <Heart 
                  size={20} 
                  color={isLiked ? "#EF4444" : "#000000"} 
                  fill={isLiked ? "#EF4444" : "none"}
                />
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => {
                  if (Platform.OS === 'ios') {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }
                }}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  justifyContent: "center",
                  alignItems: "center",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 3,
                }}
              >
                <Share2 size={20} color="#000000" />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Shop Info Overlay */}
          <View style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: 20,
          }}>
            <Text
              style={{
                fontSize: 28,
                fontFamily: "Inter_600SemiBold",
                color: "#FFFFFF",
                marginBottom: 8,
                textShadowColor: "rgba(0, 0, 0, 0.7)",
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 3,
              }}
            >
              {shop.name}
            </Text>
            
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
              <View style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "rgba(34, 197, 94, 0.9)",
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 8,
                marginRight: 12,
              }}>
                <Star size={14} color="#FFFFFF" fill="#FFFFFF" />
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "Inter_600SemiBold",
                    color: "#FFFFFF",
                    marginLeft: 4,
                  }}
                >
                  {shop.rating}
                </Text>
              </View>
              
              <View style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 8,
              }}>
                <MapPin size={14} color="#FFFFFF" />
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "Inter_500Medium",
                    color: "#FFFFFF",
                    marginLeft: 4,
                  }}
                >
                  {shop.location}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Main Content */}
        <View style={{ paddingHorizontal: 20, paddingTop: 24 }}>
          {/* Quick Stats */}
          <View style={{
            flexDirection: "row",
            backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
            borderRadius: 20,
            padding: 20,
            marginBottom: 24,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 5,
          }}>
            <View style={{ flex: 1, alignItems: "center" }}>
              <Clock size={20} color="#22C55E" />
              <Text style={{
                fontSize: 12,
                fontFamily: "Inter_600SemiBold",
                color: "#22C55E",
                marginTop: 4,
              }}>
                25-30 min
              </Text>
              <Text style={{
                fontSize: 10,
                fontFamily: "Inter_400Regular",
                color: isDark ? "#9CA3AF" : "#6B7280",
              }}>
                Delivery
              </Text>
            </View>
            
            <View style={{ width: 1, backgroundColor: isDark ? "#374151" : "#E5E7EB", marginHorizontal: 16 }} />
            
            <View style={{ flex: 1, alignItems: "center" }}>
              <Star size={20} color="#F59E0B" fill="#F59E0B" />
              <Text style={{
                fontSize: 12,
                fontFamily: "Inter_600SemiBold",
                color: isDark ? "#FFFFFF" : "#000000",
                marginTop: 4,
              }}>
                {shop.rating}
              </Text>
              <Text style={{
                fontSize: 10,
                fontFamily: "Inter_400Regular",
                color: isDark ? "#9CA3AF" : "#6B7280",
              }}>
                Rating
              </Text>
            </View>
            
            <View style={{ width: 1, backgroundColor: isDark ? "#374151" : "#E5E7EB", marginHorizontal: 16 }} />
            
            <View style={{ flex: 1, alignItems: "center" }}>
              <Users size={20} color="#3B82F6" />
              <Text style={{
                fontSize: 12,
                fontFamily: "Inter_600SemiBold",
                color: isDark ? "#FFFFFF" : "#000000",
                marginTop: 4,
              }}>
                1000+
              </Text>
              <Text style={{
                fontSize: 10,
                fontFamily: "Inter_400Regular",
                color: isDark ? "#9CA3AF" : "#6B7280",
              }}>
                Orders
              </Text>
            </View>
          </View>

         

          {/* Tabs */}
          <View
            style={{
              flexDirection: "row",
              backgroundColor: isDark ? "#1E1E1E" : "#F3F4F6",
              borderRadius: 16,
              padding: 4,
              marginBottom: 20,
            }}
          >
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderRadius: 12,
                  backgroundColor: activeTab === tab 
                    ? isDark ? "#FFFFFF" : "#FFFFFF"
                    : "transparent",
                  alignItems: "center",
                }}
                activeOpacity={0.7}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "Inter_600SemiBold",
                    color: activeTab === tab 
                      ? "#000000"
                      : isDark ? "#9CA3AF" : "#6B7280",
                  }}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tab Content */}
          {renderTabContent()}
        </View>
      </ScrollView>
    </View>
  );
}