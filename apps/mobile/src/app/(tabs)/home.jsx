import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  Pressable,
} from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { Search, Star, Plus, MapPin } from "lucide-react-native";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";
import { useState } from "react";

// Dummy data
const topShops = [
  {
    id: "1",
    name: "Cafe Beans",
    image: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=300&h=300&fit=crop",
    rating: 4.5,
    location: "Block A",
  },
  {
    id: "2", 
    name: "Pizza Corner",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&h=300&fit=crop",
    rating: 4.3,
    location: "Food Court",
  },
  {
    id: "3",
    name: "Burger Hub",
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=300&h=300&fit=crop",
    rating: 4.7,
    location: "Block B",
  },
  {
    id: "4",
    name: "Momos Point",
    image: "https://images.unsplash.com/photo-1496412705862-e0088f16f791?w=300&h=300&fit=crop",
    rating: 4.4,
    location: "Main Gate",
  },
];

const trendingFoods = [
  {
    id: "1",
    name: "Chicken Momos",
    image: "https://images.unsplash.com/photo-1496412705862-e0088f16f791?w=400&h=300&fit=crop",
    price: 80,
    shop: "Momos Point",
    rating: 4.6,
  },
  {
    id: "2",
    name: "Margherita Pizza",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop", 
    price: 180,
    shop: "Pizza Corner",
    rating: 4.4,
  },
  {
    id: "3",
    name: "Crispy Burger",
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop",
    price: 150,
    shop: "Burger Hub", 
    rating: 4.7,
  },
  {
    id: "4",
    name: "Cold Coffee",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop",
    price: 120,
    shop: "Cafe Beans",
    rating: 4.5,
  },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [searchText, setSearchText] = useState("");

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
          Add
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? "#121212" : "#F8FDF8" }}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 16,
          paddingHorizontal: 20,
          paddingBottom: 20,
          backgroundColor: isDark ? "#121212" : "#F8FDF8",
        }}
      >
        <Text
          style={{
            fontSize: 28,
            fontFamily: "Inter_600SemiBold",
            color: isDark ? "#FFFFFF" : "#000000",
            marginBottom: 16,
          }}
        >
          3P LPU
        </Text>

        {/* Search Bar */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
            borderRadius: 16,
            paddingHorizontal: 16,
            paddingVertical: 12,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <Search size={20} color={isDark ? "#9CA3AF" : "#6B7280"} />
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Search for food or shop..."
            placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
            style={{
              flex: 1,
              marginLeft: 12,
              fontSize: 16,
              fontFamily: "Inter_400Regular",
              color: isDark ? "#FFFFFF" : "#000000",
            }}
            onSubmitEditing={handleSearch}
          />
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 20,
        }}
        showsVerticalScrollIndicator={false}
      >
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

        {/* Trending Foods Section */}
        <View>
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