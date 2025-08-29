import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Pressable,
  useColorScheme,
  FlatList,
  Platform,
  Alert,
} from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { Search, Star, Plus, MapPin, Bell } from "lucide-react-native";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";
import { useState, useEffect } from "react";
import * as Haptics from 'expo-haptics';
import { addToCart, getCartItems } from '../../utils/cartUtils';
import { allShops, allFoods } from '../../data/mockData';

// Get data from centralized source
const topShops = allShops.slice(0, 4);

const trendingFoods = allFoods.slice(0, 4);

const bestOrderedFoods = allFoods.slice(4, 8).map(food => ({
  ...food,
  orders: Math.floor(Math.random() * 100) + 50
}));

const bestFoodStores = allShops.slice(0, 3).map(shop => ({
  ...shop,
  cuisine: shop.category,
  weeklyOrders: Math.floor(Math.random() * 1000) + 500
}));

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [searchText, setSearchText] = useState("");
  const [cartItems, setCartItems] = useState([]);

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

  const handleAddToCart = async (food) => {
    try {
      if (Platform.OS === 'ios') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      
      const updatedCart = await addToCart(food, 1);
      setCartItems(updatedCart);
      
      // Show subtle success feedback
      if (Platform.OS === 'ios') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      
    } catch (error) {
      Alert.alert("Error", "Failed to add item to cart. Please try again.");
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

  const handleSearch = () => {
    if (searchText.trim()) {
      router.push(`/(tabs)/search?q=${encodeURIComponent(searchText.trim())}`);
    }
  };

  const renderShopCard = (shop) => (
    <TouchableOpacity
      key={shop.id}
      onPress={() => router.push(`/(tabs)/shop/${shop.id}`)}
      style={{
        width: 160,
        marginRight: 16,
        backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
        borderRadius: 20,
        padding: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
      }}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: shop.image }}
        style={{
          width: "100%",
          height: 120,
          borderRadius: 16,
          marginBottom: 12,
        }}
        contentFit="cover"
      />
      <Text
        style={{
          fontSize: 16,
          fontFamily: "Inter_600SemiBold",
          color: isDark ? "#FFFFFF" : "#000000",
          marginBottom: 4,
        }}
      >
        {shop.name}
      </Text>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
        <Star size={14} color="#F59E0B" fill="#F59E0B" />
        <Text
          style={{
            fontSize: 14,
            fontFamily: "Inter_500Medium",
            color: isDark ? "#E5E7EB" : "#374151",
            marginLeft: 4,
          }}
        >
          {shop.rating}
        </Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <MapPin size={12} color={isDark ? "#9CA3AF" : "#6B7280"} />
        <Text
          style={{
            fontSize: 12,
            fontFamily: "Inter_400Regular",
            color: isDark ? "#9CA3AF" : "#6B7280",
            marginLeft: 4,
          }}
        >
          {shop.location}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderFoodCard = (food) => (
    <TouchableOpacity
      key={food.id}
      onPress={() => router.push(`/(tabs)/food/${food.id}`)}
      style={{
        width: 180,
        marginRight: 16,
        backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
        borderRadius: 20,
        padding: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
      }}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: food.image }}
        style={{
          width: "100%",
          height: 120,
          borderRadius: 16,
          marginBottom: 12,
        }}
        contentFit="cover"
      />
      <Text
        style={{
          fontSize: 16,
          fontFamily: "Inter_600SemiBold",
          color: isDark ? "#FFFFFF" : "#000000",
          marginBottom: 4,
        }}
      >
        {food.name}
      </Text>
      <Text
        style={{
          fontSize: 14,
          fontFamily: "Inter_500Medium",
          color: "#22C55E",
          marginBottom: 4,
        }}
      >
        ₹{food.price}
      </Text>
      <Text
        style={{
          fontSize: 12,
          fontFamily: "Inter_400Regular",
          color: isDark ? "#9CA3AF" : "#6B7280",
          marginBottom: 8,
        }}
      >
        {food.shop}
      </Text>
      <TouchableOpacity
        style={{
          backgroundColor: "#22C55E",
          borderRadius: 12,
          paddingVertical: 8,
          paddingHorizontal: 12,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
        activeOpacity={0.8}
        onPress={(e) => {
          e.stopPropagation();
          handleAddToCart(food);
        }}
      >
        <Plus size={16} color="#FFFFFF" />
        <Text
          style={{
            fontSize: 14,
            fontFamily: "Inter_600SemiBold",
            color: "#FFFFFF",
            marginLeft: 4,
          }}
        >
          Add to Cart
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
  
  const renderBestOrderedFoodCard = (item) => (
    <TouchableOpacity
      key={item.id}
      style={{
        width: 160,
        marginRight: 16,
        borderRadius: 12,
        backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        overflow: "hidden",
      }}
      onPress={() => router.push(`/food/${item.id}`)}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: item.image }}
        style={{ width: "100%", height: 120 }}
        contentFit="cover"
      />
      <View style={{ padding: 12 }}>
        <Text
          style={{
            fontSize: 14,
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
            fontSize: 12,
            fontFamily: "Inter_400Regular",
            color: isDark ? "#9CA3AF" : "#6B7280",
            marginBottom: 4,
          }}
          numberOfLines={1}
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
            {item.rating} • {item.orders} orders
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Inter_600SemiBold",
              color: "#22C55E",
            }}
          >
            ₹{item.price}
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: "#22C55E",
              borderRadius: 6,
              paddingHorizontal: 8,
              paddingVertical: 4,
            }}
            onPress={(e) => {
              e.stopPropagation();
              handleAddToCart(item);
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontFamily: "Inter_600SemiBold",
                color: "#FFFFFF",
              }}
            >
              Add
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
  
  const renderBestFoodStoreCard = (item) => (
    <TouchableOpacity
      key={item.id}
      style={{
        width: 240,
        marginRight: 16,
        borderRadius: 12,
        backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        overflow: "hidden",
      }}
      onPress={() => router.push(`/shop/${item.id}`)}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: item.image }}
        style={{ width: "100%", height: 140 }}
        contentFit="cover"
      />
      <View style={{ padding: 12 }}>
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
            fontSize: 12,
            fontFamily: "Inter_400Regular",
            color: isDark ? "#9CA3AF" : "#6B7280",
            marginBottom: 6,
          }}
          numberOfLines={1}
        >
          {item.cuisine}
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 6,
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
              marginRight: 8,
            }}
          >
            {item.rating}
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontFamily: "Inter_400Regular",
              color: isDark ? "#9CA3AF" : "#6B7280",
            }}
          >
            {item.weeklyOrders} orders this week
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <MapPin
            size={12}
            color={isDark ? "#9CA3AF" : "#6B7280"}
            style={{ marginRight: 4 }}
          />
          <Text
            style={{
              fontSize: 12,
              fontFamily: "Inter_400Regular",
              color: isDark ? "#9CA3AF" : "#6B7280",
            }}
            numberOfLines={1}
          >
            {item.location}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? "#121212" : "#F8FDF8" }}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Content */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View
          style={{
            paddingHorizontal: 20,
            backgroundColor: isDark ? "#121212" : "#F8FDF8",
            marginBottom: 32,
          }}
        >
          <View style={{ 
            flexDirection: "row", 
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                source={require('../../../assets/images/primary-logo.svg')}
                style={{
                  width: 120,
                  height: 90,
                  marginRight: 8,
                }}
                contentFit="fill"
              />
           
            </View>
            
            {/* Notification Icon */}
            <TouchableOpacity
              onPress={() => router.push('/notifications')}
              style={{
                padding: 8,
                borderRadius: 12,
                backgroundColor: isDark ? "#1E1E1E" : "#F3F4F6",
              }}
              activeOpacity={0.7}
            >
              <Bell size={24} color={isDark ? "#E5E7EB" : "#374151"} />
            </TouchableOpacity>
          </View>
        </View>
        {/* Hero Promo Card */}
        <View style={{ paddingHorizontal: 20, marginBottom: 32 }}>
          <View
            style={{
              backgroundColor: isDark ? "#1A2E1A" : "#E8F5E8",
              borderRadius: 20,
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
                fontSize: 24,
                fontFamily: "Inter_600SemiBold",
                color: isDark ? "#FFFFFF" : "#000000",
                marginBottom: 8,
              }}
            >
              50% off Momos this week!
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Inter_400Regular",
                color: isDark ? "#9CA3AF" : "#6B7280",
                marginBottom: 16,
              }}
            >
              Limited time offer on all momo varieties
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: "#22C55E",
                borderRadius: 12,
                paddingVertical: 12,
                paddingHorizontal: 20,
                alignSelf: "flex-start",
              }}
              activeOpacity={0.8}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "Inter_600SemiBold",
                  color: "#FFFFFF",
                }}
              >
                Order Now
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Top Shops Section */}
        <View style={{ marginBottom: 32 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 20,
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontFamily: "Inter_600SemiBold",
                color: isDark ? "#FFFFFF" : "#000000",
              }}
            >
              Top Shops
            </Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 20,
            }}
          >
            {topShops.map(renderShopCard)}
          </ScrollView>
        </View>

        {/* Best Ordered Food Today Section */}
        <View style={{ marginBottom: 24 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 20,
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontFamily: "Inter_600SemiBold",
                color: isDark ? "#FFFFFF" : "#000000",
              }}
            >
              Best Ordered Food Today
            </Text>
            <TouchableOpacity onPress={() => router.push("search")}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Inter_500Medium",
                  color: "#22C55E",
                }}
              >
                See All
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 20,
            }}
          >
            {bestOrderedFoods.map(renderBestOrderedFoodCard)}
          </ScrollView>
        </View>
        
        {/* Best Food Store of the Week Section */}
        <View style={{ marginBottom: 24 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 20,
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontFamily: "Inter_600SemiBold",
                color: isDark ? "#FFFFFF" : "#000000",
              }}
            >
              Best Food Store of the Week
            </Text>
            <TouchableOpacity onPress={() => router.push("shop")}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Inter_500Medium",
                  color: "#22C55E",
                }}
              >
                See All
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 20,
            }}
          >
            {bestFoodStores.map(renderBestFoodStoreCard)}
          </ScrollView>
        </View>
        
        {/* Trending Foods Section */}
        <View style={{ marginBottom: 24 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 20,
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontFamily: "Inter_600SemiBold",
                color: isDark ? "#FFFFFF" : "#000000",
              }}
            >
              Trending Foods
            </Text>
            <TouchableOpacity onPress={() => router.push("search")}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Inter_500Medium",
                  color: "#22C55E",
                }}
              >
                See All
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 20,
            }}
          >
            {trendingFoods.map(renderFoodCard)}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}