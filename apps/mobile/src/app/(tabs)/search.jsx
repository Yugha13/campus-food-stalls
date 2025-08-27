import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Search, Star, Plus, MapPin, ChevronLeft } from "lucide-react-native";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";
import { useState, useEffect } from "react";

// Dummy data - same as home page
const allShops = [
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

const allFoods = [
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
  {
    id: "5",
    name: "Veg Momos",
    image: "https://images.unsplash.com/photo-1496412705862-e0088f16f791?w=400&h=300&fit=crop",
    price: 60,
    shop: "Momos Point",
    rating: 4.3,
  },
  {
    id: "6",
    name: "Chicken Burger",
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop",
    price: 180,
    shop: "Burger Hub",
    rating: 4.6,
  },
];

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { q } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [searchText, setSearchText] = useState(q || "");
  const [searchResults, setSearchResults] = useState({ foods: [], shops: [] });

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  useEffect(() => {
    if (searchText.trim()) {
      performSearch(searchText);
    } else {
      setSearchResults({ foods: [], shops: [] });
    }
  }, [searchText]);

  const performSearch = (query) => {
    const searchLower = query.toLowerCase();
    
    const matchingFoods = allFoods.filter(food => 
      food.name.toLowerCase().includes(searchLower) || 
      food.shop.toLowerCase().includes(searchLower)
    );
    
    const matchingShops = allShops.filter(shop => 
      shop.name.toLowerCase().includes(searchLower) ||
      shop.location.toLowerCase().includes(searchLower)
    );
    
    setSearchResults({ foods: matchingFoods, shops: matchingShops });
  };

  if (!fontsLoaded) {
    return null;
  }

  const handleSearch = () => {
    performSearch(searchText);
  };

  const renderFoodItem = (food) => (
    <TouchableOpacity
      key={food.id}
      onPress={() => router.push(`/(tabs)/food/${food.id}`)}
      style={{
        flexDirection: "row",
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
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: food.image }}
        style={{
          width: 80,
          height: 80,
          borderRadius: 12,
          marginRight: 16,
        }}
        contentFit="cover"
      />
      <View style={{ flex: 1 }}>
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
      </View>
      <TouchableOpacity
        style={{
          backgroundColor: "#22C55E",
          borderRadius: 12,
          paddingVertical: 8,
          paddingHorizontal: 12,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          alignSelf: "center",
        }}
        activeOpacity={0.8}
      >
        <Plus size={16} color="#FFFFFF" />
        <Text
          style={{
            fontSize: 12,
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

  const renderShopItem = (shop) => (
    <TouchableOpacity
      key={shop.id}
      onPress={() => router.push(`/(tabs)/shop/${shop.id}`)}
      style={{
        flexDirection: "row",
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
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: shop.image }}
        style={{
          width: 80,
          height: 80,
          borderRadius: 12,
          marginRight: 16,
        }}
        contentFit="cover"
      />
      <View style={{ flex: 1 }}>
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
      </View>
    </TouchableOpacity>
  );

  const hasResults = searchResults.foods.length > 0 || searchResults.shops.length > 0;
  const showEmptyState = searchText.trim() && !hasResults;

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
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ marginRight: 16 }}
          >
            <ChevronLeft size={24} color={isDark ? "#FFFFFF" : "#000000"} />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 24,
              fontFamily: "Inter_600SemiBold",
              color: isDark ? "#FFFFFF" : "#000000",
            }}
          >
            Search
          </Text>
        </View>

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
            autoFocus
          />
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {showEmptyState && (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: 60,
            }}
          >
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: isDark ? "#1E1E1E" : "#F8F9FA",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              <Search size={32} color={isDark ? "#6B7280" : "#9CA3AF"} />
            </View>

            <Text
              style={{
                fontSize: 20,
                fontFamily: "Inter_600SemiBold",
                color: isDark ? "#FFFFFF" : "#000000",
                marginBottom: 8,
                textAlign: "center",
              }}
            >
              No results found
            </Text>

            <Text
              style={{
                fontSize: 16,
                fontFamily: "Inter_400Regular",
                color: isDark ? "#9CA3AF" : "#6B7280",
                textAlign: "center",
                lineHeight: 24,
                paddingHorizontal: 40,
              }}
            >
              Try searching for a different food or shop name
            </Text>
          </View>
        )}

        {/* Food Results */}
        {searchResults.foods.length > 0 && (
          <View style={{ marginBottom: 32 }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: "Inter_600SemiBold",
                color: isDark ? "#FFFFFF" : "#000000",
                marginBottom: 16,
              }}
            >
              Foods ({searchResults.foods.length})
            </Text>
            {searchResults.foods.map(renderFoodItem)}
          </View>
        )}

        {/* Shop Results */}
        {searchResults.shops.length > 0 && (
          <View>
            <Text
              style={{
                fontSize: 18,
                fontFamily: "Inter_600SemiBold",
                color: isDark ? "#FFFFFF" : "#000000",
                marginBottom: 16,
              }}
            >
              Shops ({searchResults.shops.length})
            </Text>
            {searchResults.shops.map(renderShopItem)}
          </View>
        )}
      </ScrollView>
    </View>
  );
}