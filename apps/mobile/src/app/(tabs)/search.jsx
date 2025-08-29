import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  Pressable,
  Platform,
  useWindowDimensions,
  Animated,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Search, Star, Plus, MapPin, ChevronLeft, Filter, ChevronDown, ChevronUp, X, Coffee, Store, ShoppingCart, ChevronRight, Heart, ArrowRight } from "lucide-react-native";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";
import { useState, useEffect, useRef } from "react";

// Dummy data - same as home page
export const allShops = [
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

export const allFoods = [
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

// Location options
const locationOptions = [
  "BH1", "BH6", "BH4", "Apartment", "GH1", "GH2", "GH4", "Library", "Main Gate"
];

// Price range options
const priceRangeOptions = [
  { label: "Under ₹50", min: 0, max: 50 },
  { label: "₹50 - ₹100", min: 50, max: 100 },
  { label: "₹100 - ₹200", min: 100, max: 200 },
  { label: "₹200+", min: 200, max: Infinity }
];

// Common misspellings and corrections for search suggestions
const searchCorrections = {
  "piza": "pizza",
  "burgr": "burger",
  "cofee": "coffee",
  "momo": "momos",
  "sandwch": "sandwich",
  "cafe": "cafe",
  "resturant": "restaurant",
  "biryni": "biryani",
  "chiken": "chicken",
  "veggie": "veg"
};

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { q } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { width: windowWidth } = useWindowDimensions();
  const [searchText, setSearchText] = useState(q || "");
  const [searchResults, setSearchResults] = useState({ foods: [], shops: [] });
  const [activeMode, setActiveMode] = useState("food"); // Default mode is food
  const toggleAnim = useRef(new Animated.Value(0)).current;
  
  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [hasActiveFilters, setHasActiveFilters] = useState(false);
  
  // Search suggestions states
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [correctedQuery, setCorrectedQuery] = useState("");
  const [hasCorrection, setHasCorrection] = useState(false);

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  useEffect(() => {
    if (searchText.trim()) {
      // Generate suggestions when user types
      generateSuggestions(searchText);
      performSearch(searchText);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
      setCorrectedQuery("");
      setHasCorrection(false);
      // Show all foods or shops based on active mode when search is empty
      setSearchResults({ 
        foods: activeMode === "food" ? allFoods : [], 
        shops: activeMode === "shop" ? allShops : [] 
      });
    }
  }, [searchText, activeMode, selectedLocation, selectedPriceRange]);
  
  // Update hasActiveFilters whenever filters change
  useEffect(() => {
    setHasActiveFilters(selectedLocation !== "" || selectedPriceRange !== null);
  }, [selectedLocation, selectedPriceRange]);

  // Generate search suggestions based on input
  const generateSuggestions = (query) => {
    if (!query.trim()) {
      setShowSuggestions(false);
      setSuggestions([]);
      return;
    }
    
    const searchLower = query.toLowerCase();
    let suggestionsArray = [];
    let corrected = "";
    let hasCorrection = false;
    
    // Check for spelling corrections
    for (const [misspelled, correction] of Object.entries(searchCorrections)) {
      if (searchLower.includes(misspelled)) {
        corrected = query.replace(new RegExp(misspelled, 'gi'), correction);
        hasCorrection = true;
        break;
      }
    }
    
    // Generate suggestions based on mode
    if (activeMode === "food") {
      // Add food-based suggestions
      suggestionsArray = allFoods
        .filter(food => 
          food.name.toLowerCase().includes(searchLower) || 
          food.shop.toLowerCase().includes(searchLower))
        .map(food => food.name)
        .slice(0, 5);
        
      // Add some shop suggestions that serve this food
      const relatedShops = allFoods
        .filter(food => food.name.toLowerCase().includes(searchLower))
        .map(food => `${food.name} from ${food.shop}`)
        .slice(0, 2);
        
      suggestionsArray = [...new Set([...suggestionsArray, ...relatedShops])];
    } else {
      // Add shop-based suggestions
      suggestionsArray = allShops
        .filter(shop => 
          shop.name.toLowerCase().includes(searchLower) || 
          shop.location.toLowerCase().includes(searchLower))
        .map(shop => shop.name)
        .slice(0, 5);
        
      // Add location-based suggestions
      const locationSuggestions = allShops
        .filter(shop => shop.location.toLowerCase().includes(searchLower))
        .map(shop => `${shop.name} in ${shop.location}`)
        .slice(0, 2);
        
      suggestionsArray = [...new Set([...suggestionsArray, ...locationSuggestions])];
    }
    
    // If we have a spelling correction, add it as the first suggestion
    if (hasCorrection && corrected) {
      suggestionsArray = [corrected, ...suggestionsArray.filter(s => s !== corrected)];
    }
    
    // Limit to 5 suggestions
    suggestionsArray = suggestionsArray.slice(0, 5);
    
    setShowSuggestions(suggestionsArray.length > 0);
    setSuggestions(suggestionsArray);
    setCorrectedQuery(corrected);
    setHasCorrection(hasCorrection);
  };
  
  const performSearch = (query) => {
    const searchLower = query.toLowerCase();
    setShowSuggestions(false);
    
    // Filter foods based on search text and active filters
    const matchingFoods = activeMode === "food" ? allFoods.filter(food => {
      // Text search
      const matchesText = food.name.toLowerCase().includes(searchLower) || 
                         food.shop.toLowerCase().includes(searchLower);
      
      // Price filter
      const matchesPrice = selectedPriceRange === null || 
                          (food.price >= selectedPriceRange.min && 
                           food.price <= selectedPriceRange.max);
      
      // Location filter - for food, we check the shop's location
      // This would require a more complex data model in a real app
      // Here we're just checking if the shop name contains the location for simplicity
      const matchesLocation = selectedLocation === "" || 
                             food.shop.includes(selectedLocation);
      
      return matchesText && matchesPrice && matchesLocation;
    }) : [];
    
    // Filter shops based on search text and active filters
    const matchingShops = activeMode === "shop" ? allShops.filter(shop => {
      // Text search
      const matchesText = shop.name.toLowerCase().includes(searchLower) ||
                         shop.location.toLowerCase().includes(searchLower);
      
      // Location filter
      const matchesLocation = selectedLocation === "" || 
                             shop.location.includes(selectedLocation);
      
      return matchesText && matchesLocation;
    }) : [];
    
    setSearchResults({ foods: matchingFoods, shops: matchingShops });
  };
  
  const clearFilters = () => {
    setSelectedLocation("");
    setSelectedPriceRange(null);
    
    // Add haptic feedback when clearing filters
    if (Platform.OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };
  
  const toggleMode = (mode) => {
    if (mode !== activeMode) {
      // Add haptic feedback when changing modes
      if (Platform.OS === 'ios') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      
      setActiveMode(mode);
      
      // Enhanced animation with smoother transition
      Animated.timing(toggleAnim, {
        toValue: mode === "food" ? 0 : 1,
        duration: 200, // Faster 200ms transition as per requirements
        useNativeDriver: false,
        easing: Animated.Easing.inOut(Animated.Easing.ease), // Add ease-in-out for smoother feel
      }).start();
      
      // Re-run search with new mode
      if (searchText.trim()) {
        performSearch(searchText);
      }
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  const handleSearch = () => {
    setShowSuggestions(false);
    performSearch(searchText);
  };
  
  const handleSuggestionSelect = (suggestion) => {
    setSearchText(suggestion);
    setShowSuggestions(false);
    performSearch(suggestion);
  };

  const renderFoodItem = (food) => (
    <TouchableOpacity
      style={{
        backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
        borderRadius: 16,
        padding: 12,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        width: isLargeScreen ? "48%" : "100%",
        marginHorizontal: isLargeScreen ? 4 : 0,
      }}
      activeOpacity={0.7}
      onPress={() => router.push(`/(tabs)/food/${food.id}`)}
    >
      <View style={{ position: "relative" }}>
            <Image
              source={{ uri: food.image }}
              style={{
                width: "100%",
                height: 120,
                borderRadius: 12,
                marginBottom: 12,
              }}
              contentFit="cover"
            />
            <View style={{ 
              position: "absolute", 
              top: 8, 
              right: 8, 
              flexDirection: "row" 
            }}>
              <TouchableOpacity
                style={{
                  backgroundColor: "rgba(255,255,255,0.9)",
                  borderRadius: 20,
                  padding: 6,
                  marginRight: 6,
                }}
                activeOpacity={0.8}
                onPress={() => {
                  if (Platform.OS === 'ios') Haptics.selectionAsync();
                  // Add to wishlist functionality
                }}
              >
                <Heart size={16} color="#FF4B4B" />
              </TouchableOpacity>
            </View>
          </View>
      <View style={{ padding: 4 }}>
        <Text
          style={{
            fontSize: 16,
            fontFamily: "Inter_600SemiBold",
            color: isDark ? "#FFFFFF" : "#000000",
            marginBottom: 4,
          }}
          numberOfLines={1}
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
            marginBottom: 12,
          }}
          numberOfLines={1}
        >
          {food.shop}
        </Text>
        
        {/* Entire card is now clickable to view details */}
        
        {/* Add to Cart Button */}
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
          onPress={() => {
            if (Platform.OS === 'ios') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            // Add to cart functionality
          }}
        >
          <ShoppingCart size={16} color="#FFFFFF" />
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
      </View>
    </TouchableOpacity>
  );

  const renderShopItem = (shop) => (
    <TouchableOpacity
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
        width: isLargeScreen ? "48%" : "100%",
        marginHorizontal: isLargeScreen ? 4 : 0,
      }}
      activeOpacity={0.7}
    >
      <View style={{ position: "relative" }}>
        <Image
          source={{ uri: shop.image }}
          style={{
            width: "100%",
            height: 120,
            borderRadius: 12,
            marginBottom: 12,
          }}
          contentFit="cover"
        />
        <View style={{ 
          position: "absolute", 
          top: 8, 
          right: 8, 
          flexDirection: "row" 
        }}>
          <TouchableOpacity
             style={{
               backgroundColor: "rgba(255,255,255,0.9)",
               borderRadius: 20,
               padding: 6,
             }}
             activeOpacity={0.8}
             onPress={() => {
               if (Platform.OS === 'ios') Haptics.selectionAsync();
               // Add to wishlist functionality
             }}
           >
             <Heart size={16} color="#FF4B4B" />
           </TouchableOpacity>
        </View>
      </View>
      <View style={{ padding: 4 }}>
        <Text
          style={{
            fontSize: 16,
            fontFamily: "Inter_600SemiBold",
            color: isDark ? "#FFFFFF" : "#000000",
            marginBottom: 4,
          }}
          numberOfLines={1}
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
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
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
        
        {/* View Shop Button */}
        <TouchableOpacity
          onPress={() => router.push(`/(tabs)/shop/${shop.id}`)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#F3F4F6",
            borderRadius: 12,
            paddingVertical: 10,
            paddingHorizontal: 12,
          }}
          activeOpacity={0.7}
        >
          <Text style={{ 
            fontFamily: "Inter_500Medium", 
            fontSize: 14, 
            color: "#374151" 
          }}>
            View Shop
          </Text>
          <ArrowRight size={16} color="#374151" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const hasResults = 
    (activeMode === "food" && searchResults.foods.length > 0) || 
    (activeMode === "shop" && searchResults.shops.length > 0);
  const showEmptyState = searchText.trim() && !hasResults;

  // Determine if we're on a tablet/desktop or phone based on screen width
  const isLargeScreen = windowWidth >= 768;
  
  // Adjust layout based on screen size
  const containerPadding = isLargeScreen ? 40 : 20;
  const cardWidth = isLargeScreen ? (windowWidth - (containerPadding * 2) - 16) / 2 : "100%";
  
  return (
    <View style={{ 
      flex: 1, 
      backgroundColor: isDark ? "#121212" : "#F8FDF8",
    }}>
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
        </View>

        {/* Enhanced Mode Selector with Pill Switch Feel */}
        <View style={{
          marginBottom: 24,
          maxWidth: isLargeScreen ? 600 : "100%",
          alignSelf: "center",
          width: "100%",
        }}>
          <View style={{
            backgroundColor: isDark ? "#1E1E1E" : "#F0F0F0",
            borderRadius: 16,
            flexDirection: "row",
            height: 60,
            marginBottom: 16,
            overflow: "hidden",
          }}>
            <Animated.View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: "50%",
                borderRadius: 16,
                transform: [{
                  translateX: toggleAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, "100%"],
                  }),
                }, {
                  // Add scale animation for tactile pill switch feel
                  scale: toggleAnim.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [1, 1.05, 1],
                  }),
                }],
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
                overflow: 'hidden',
              }}
            >
              <LinearGradient
                colors={['#22C55E', '#16A34A', '#15803D']} 
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  width: '100%',
                  height: '100%',
                }}
              />
            </Animated.View>
            {/* Add gradient overlay for smoother transition */}
            <Animated.View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: toggleAnim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0.15, 0.1, 0],
                }),
                backgroundColor: "rgba(34, 197, 94, 0.2)", // Enhanced green glow
              }}
            />
            <Pressable
              onPress={() => {
                toggleMode("food");
                // Add haptic feedback for tactile response
                if (Platform.OS === 'ios') {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                }
              }}
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
                zIndex: 1,
                paddingVertical: 12,
              }}
              android_ripple={{ color: "rgba(0,0,0,0.1)" }}
            >
              <Animated.View style={{
                transform: [{
                  scale: activeMode === "food" ? toggleAnim.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [1.1, 1, 0.9],
                  }) : 1
                }],
                opacity: activeMode === "food" ? toggleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0.7],
                }) : toggleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.7, 1],
                }),
                flexDirection: "row",
                alignItems: "center",
              }}>
                <Coffee 
                  size={20} 
                  color={activeMode === "food" ? "#FFFFFF" : (isDark ? "#9CA3AF" : "#6B7280")} 
                  style={{ marginRight: 8 }}
                />
                <Text
                  style={{
                    fontFamily: "Inter_600SemiBold",
                    fontSize: 16,
                    color: activeMode === "food" ? "#FFFFFF" : (isDark ? "#9CA3AF" : "#6B7280"),
                  }}
                >
                  Food
                </Text>
              </Animated.View>
            </Pressable>
            <Pressable
              onPress={() => {
                toggleMode("shop");
                // Add haptic feedback for tactile response
                if (Platform.OS === 'ios') {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                }
              }}
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
                zIndex: 1,
                paddingVertical: 12,
              }}
              android_ripple={{ color: "rgba(0,0,0,0.1)" }}
            >
              <Animated.View style={{
                transform: [{
                  scale: activeMode === "shop" ? toggleAnim.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0.9, 1, 1.1],
                  }) : 1
                }],
                opacity: activeMode === "shop" ? toggleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.7, 1],
                }) : toggleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0.7],
                }),
                flexDirection: "row",
                alignItems: "center",
              }}>
                <Store 
                  size={20} 
                  color={activeMode === "shop" ? "#FFFFFF" : (isDark ? "#9CA3AF" : "#6B7280")} 
                  style={{ marginRight: 8 }}
                />
                <Text
                  style={{
                    fontFamily: "Inter_600SemiBold",
                    fontSize: 16,
                    color: activeMode === "shop" ? "#FFFFFF" : (isDark ? "#9CA3AF" : "#6B7280"),
                  }}
                >
                  Shop
                </Text>
              </Animated.View>
            </Pressable>
          </View>
        </View>
      
        {/* Search Bar - Tap to navigate to search page */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <TouchableOpacity
            style={{
              flex: 1,
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
              marginRight: 12,
            }}
            activeOpacity={0.7}
            onPress={() => {
              // Navigate to the search page with current mode as parameter
              router.push({
                pathname: "search-page",
                params: { mode: activeMode }
              });
              
              // Add haptic feedback for tactile response
              if (Platform.OS === 'ios') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
            }}
          >
            <Search size={20} color={isDark ? "#9CA3AF" : "#6B7280"} />
            <Text
              style={{
                flex: 1,
                marginLeft: 12,
                fontSize: 16,
                fontFamily: "Inter_400Regular",
                color: isDark ? "#9CA3AF" : "#6B7280",
              }}
            >
              {activeMode === "food" ? "Search for food items..." : "Search for shops..."}
            </Text>
          </TouchableOpacity>
          
          {/* Filter Button */}
          <TouchableOpacity
            onPress={() => {
              setShowFilters(!showFilters);
              // Add haptic feedback when toggling filters
              if (Platform.OS === 'ios') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              }
            }}
            style={{
              backgroundColor: hasActiveFilters ? "#22C55E" : (isDark ? "#1E1E1E" : "#FFFFFF"),
              width: 48,
              height: 48,
              borderRadius: 16,
              justifyContent: "center",
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 3,
              transform: [{ scale: 1 }], // For the pressed animation
            }}
            activeOpacity={0.7}
          >
            <Filter size={20} color={hasActiveFilters ? "#FFFFFF" : (isDark ? "#9CA3AF" : "#6B7280")} />
          </TouchableOpacity>
          
          {/* Filter Bottom Sheet */}
          {showFilters && (
            <Animated.View
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "auto",
                maxHeight: "80%",
                backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                padding: 20,
                paddingBottom: insets.bottom + 20,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 10,
                zIndex: 100,
              }}
            >
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 18, color: isDark ? "#FFFFFF" : "#000000" }}>
                  Filter
                </Text>
                <TouchableOpacity onPress={() => setShowFilters(false)}>
                  <X size={20} color={isDark ? "#9CA3AF" : "#6B7280"} />
                </TouchableOpacity>
              </View>
              
              <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: 20 }}
                showsVerticalScrollIndicator={false}
              >
                {/* Category Filter */}
                <TouchableOpacity 
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingVertical: 16,
                    borderBottomWidth: 1,
                    borderBottomColor: isDark ? "#374151" : "#E5E7EB",
                  }}
                >
                  <Text style={{ fontFamily: "Inter_500Medium", fontSize: 16, color: isDark ? "#E5E7EB" : "#374151" }}>
                    Category
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={{ fontFamily: "Inter_400Regular", fontSize: 14, color: isDark ? "#9CA3AF" : "#6B7280", marginRight: 8 }}>
                      View All
                    </Text>
                    <ChevronRight size={16} color={isDark ? "#9CA3AF" : "#6B7280"} />
                  </View>
                </TouchableOpacity>
                
                {/* Services Filter */}
                <TouchableOpacity 
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingVertical: 16,
                    borderBottomWidth: 1,
                    borderBottomColor: isDark ? "#374151" : "#E5E7EB",
                  }}
                >
                  <Text style={{ fontFamily: "Inter_500Medium", fontSize: 16, color: isDark ? "#E5E7EB" : "#374151" }}>
                    Services
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={{ fontFamily: "Inter_400Regular", fontSize: 14, color: isDark ? "#9CA3AF" : "#6B7280", marginRight: 8 }}>
                      View All
                    </Text>
                    <ChevronRight size={16} color={isDark ? "#9CA3AF" : "#6B7280"} />
                  </View>
                </TouchableOpacity>
                
                {/* Status Filter */}
                <TouchableOpacity 
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingVertical: 16,
                    borderBottomWidth: 1,
                    borderBottomColor: isDark ? "#374151" : "#E5E7EB",
                  }}
                >
                  <Text style={{ fontFamily: "Inter_500Medium", fontSize: 16, color: isDark ? "#E5E7EB" : "#374151" }}>
                    Status
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={{ fontFamily: "Inter_400Regular", fontSize: 14, color: isDark ? "#9CA3AF" : "#6B7280", marginRight: 8 }}>
                      View All
                    </Text>
                    <ChevronRight size={16} color={isDark ? "#9CA3AF" : "#6B7280"} />
                  </View>
                </TouchableOpacity>
                
                {/* Price Range Slider */}
                <View style={{ marginTop: 16, marginBottom: 24 }}>
                  <Text style={{ fontFamily: "Inter_500Medium", fontSize: 16, color: isDark ? "#E5E7EB" : "#374151", marginBottom: 16 }}>
                    Price
                  </Text>
                  
                  {/* Slider Track */}
                  <View style={{ 
                    height: 6, 
                    backgroundColor: isDark ? "#374151" : "#E5E7EB", 
                    borderRadius: 3, 
                    marginBottom: 8,
                    position: "relative",
                  }}>
                    {/* Active Track */}
                    <View style={{
                      position: "absolute",
                      left: "20%",
                      right: "40%",
                      height: 6,
                      backgroundColor: "#22C55E",
                      borderRadius: 3,
                    }} />
                    
                    {/* Thumb 1 */}
                    <View style={{
                      position: "absolute",
                      left: "20%",
                      top: -7,
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      backgroundColor: "#22C55E",
                      borderWidth: 2,
                      borderColor: "#FFFFFF",
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      elevation: 2,
                    }} />
                    
                    {/* Thumb 2 */}
                    <View style={{
                      position: "absolute",
                      left: "60%",
                      top: -7,
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      backgroundColor: "#22C55E",
                      borderWidth: 2,
                      borderColor: "#FFFFFF",
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      elevation: 2,
                    }} />
                  </View>
                  
                  {/* Price Range Labels */}
                  <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
                    <Text style={{ fontFamily: "Inter_500Medium", fontSize: 14, color: isDark ? "#E5E7EB" : "#374151" }}>
                      ₹ 0
                    </Text>
                    <Text style={{ fontFamily: "Inter_500Medium", fontSize: 14, color: isDark ? "#E5E7EB" : "#374151" }}>
                      ₹ 500
                    </Text>
                  </View>
                </View>
              </ScrollView>
              
              {/* Apply Button */}
              <TouchableOpacity
                onPress={() => {
                  setShowFilters(false);
                  performSearch(searchText);
                  if (Platform.OS === 'ios') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                }}
                style={{
                  paddingVertical: 16,
                  borderRadius: 12,
                  backgroundColor: "#22C55E",
                  alignItems: "center",
                  marginTop: 10,
                }}
              >
                <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 16, color: "#FFFFFF" }}>
                  Apply
                </Text>
              </TouchableOpacity>
            </Animated.View>
          )}
          
          {/* Overlay when filter is open */}
          {showFilters && (
            <TouchableOpacity
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0,0,0,0.5)",
                zIndex: 90,
              }}
              activeOpacity={1}
              onPress={() => setShowFilters(false)}
            />
          )}
        </View>
        
        {/* Search Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <View style={{
            backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
            borderRadius: 16,
            marginHorizontal: isLargeScreen ? containerPadding : 20,
            marginBottom: 16,
            paddingVertical: 8,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
            position: "absolute",
            top: insets.top + 160, // Position below search bar
            left: 0,
            right: 0,
            zIndex: 10,
            maxWidth: isLargeScreen ? 600 : "100%",
            alignSelf: isLargeScreen ? "center" : undefined,
            width: isLargeScreen ? "100%" : undefined,
          }}>
            {hasCorrection && correctedQuery && (
              <TouchableOpacity
                onPress={() => {
                  handleSuggestionSelect(correctedQuery);
                  // Add haptic feedback when selecting a suggestion
                  if (Platform.OS === 'ios') {
                    Haptics.selectionAsync();
                  }
                }}
                style={{
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  flexDirection: "row",
                  alignItems: "center",
                }}
                activeOpacity={0.6}
              >
                <Search size={16} color={"#22C55E"} style={{ marginRight: 12 }} />
                <Text style={{
                  fontFamily: "Inter_500Medium",
                  fontSize: 14,
                  color: "#22C55E",
                }}>
                  Did you mean: <Text style={{ fontFamily: "Inter_600SemiBold" }}>{correctedQuery}</Text>
                </Text>
              </TouchableOpacity>
            )}
            
            {suggestions.map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  handleSuggestionSelect(suggestion);
                  // Add haptic feedback when selecting a suggestion
                  if (Platform.OS === 'ios') {
                    Haptics.selectionAsync();
                  }
                }}
                style={{
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: index % 2 === 0 ? (isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)") : "transparent",
                }}
                activeOpacity={0.6}
              >
                <Search size={16} color={isDark ? "#9CA3AF" : "#6B7280"} style={{ marginRight: 12 }} />
                <Text style={{
                  fontFamily: "Inter_400Regular",
                  fontSize: 14,
                  color: isDark ? "#E5E7EB" : "#374151",
                }}>
                  {suggestion}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        
      

      </View>

      {/* Search Results */}
      <ScrollView
        style={{ flex: 1, paddingHorizontal: containerPadding }}
        contentContainerStyle={{
          paddingTop: 16,
          paddingBottom: insets.bottom + 20,
          alignItems: isLargeScreen ? "center" : "stretch",
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Active Filters Display */}
        {hasActiveFilters && !showFilters && (
          <View style={{
            flexDirection: "row",
            flexWrap: "wrap",
            marginBottom: 16,
            maxWidth: isLargeScreen ? 600 : "100%",
            alignSelf: "center",
            width: "100%",
          }}>
            {selectedLocation && (
              <TouchableOpacity
                onPress={() => setSelectedLocation("")}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: isDark ? "#2D3748" : "#F3F4F6",
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 8,
                  marginRight: 8,
                  marginBottom: 8,
                }}
                activeOpacity={0.7}
              >
                <Text style={{
                  fontFamily: "Inter_500Medium",
                  fontSize: 12,
                  color: isDark ? "#E5E7EB" : "#374151",
                  marginRight: 4,
                }}>
                  {selectedLocation}
                </Text>
                <X size={14} color={isDark ? "#9CA3AF" : "#6B7280"} />
              </TouchableOpacity>
            )}
            
            {selectedPriceRange && (
              <TouchableOpacity
                onPress={() => setSelectedPriceRange(null)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: isDark ? "#2D3748" : "#F3F4F6",
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 8,
                  marginRight: 8,
                  marginBottom: 8,
                }}
                activeOpacity={0.7}
              >
                <Text style={{
                  fontFamily: "Inter_500Medium",
                  fontSize: 12,
                  color: isDark ? "#E5E7EB" : "#374151",
                  marginRight: 4,
                }}>
                  {selectedPriceRange.label}
                </Text>
                <X size={14} color={isDark ? "#9CA3AF" : "#6B7280"} />
              </TouchableOpacity>
            )}
            
            <TouchableOpacity
              onPress={clearFilters}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 12,
                paddingVertical: 8,
              }}
              activeOpacity={0.6}
            >
              <Text style={{
                fontFamily: "Inter_500Medium",
                fontSize: 12,
                color: "#22C55E",
              }}>
                Clear All
              </Text>
            </TouchableOpacity>
          </View>
        )}
        
        {/* Empty State */}
        {showEmptyState && (
          <View style={{
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 40,
            maxWidth: isLargeScreen ? 600 : "100%",
            alignSelf: "center",
            width: "100%",
          }}>
            <Search size={48} color={isDark ? "#4B5563" : "#D1D5DB"} style={{ marginBottom: 16 }} />
            <Text style={{
              fontFamily: "Inter_600SemiBold",
              fontSize: 18,
              color: isDark ? "#E5E7EB" : "#374151",
              marginBottom: 8,
              textAlign: "center",
            }}>
              No {activeMode === "food" ? "food items" : "shops"} found
            </Text>
            <Text style={{
              fontFamily: "Inter_400Regular",
              fontSize: 14,
              color: isDark ? "#9CA3AF" : "#6B7280",
              textAlign: "center",
              maxWidth: 300,
            }}>
              Try adjusting your search or filters to find what you're looking for
            </Text>
          </View>
        )}
        
        {/* Food Results */}
        {activeMode === "food" && searchResults.foods.length > 0 && (
          <View style={{
            maxWidth: isLargeScreen ? 600 : "100%",
            alignSelf: "center",
            width: "100%",
          }}>
            <Text style={{
              fontFamily: "Inter_600SemiBold",
              fontSize: 18,
              color: isDark ? "#FFFFFF" : "#000000",
              marginBottom: 16,
            }}>
              {searchText.trim() ? "Food Results" : "All Foods"}
            </Text>
            
            {/* Wrap items in a row for large screens */}
            <View style={{
              flexDirection: isLargeScreen ? "row" : "column",
              flexWrap: isLargeScreen ? "wrap" : "nowrap",
              justifyContent: isLargeScreen ? "space-between" : "flex-start",
            }}>
              {searchResults.foods.map((food) => (
                <View key={food.id} style={{ 
                  width: isLargeScreen ? "48%" : "100%",
                  marginBottom: 16
                }}>
                  {renderFoodItem(food)}
                </View>
              ))}
            </View>
          </View>
        )}
        
        {/* Shop Results */}
        {activeMode === "shop" && searchResults.shops.length > 0 && (
          <View style={{
            maxWidth: isLargeScreen ? 600 : "100%",
            alignSelf: "center",
            width: "100%",
          }}>
            <Text style={{
              fontFamily: "Inter_600SemiBold",
              fontSize: 18,
              color: isDark ? "#FFFFFF" : "#000000",
              marginBottom: 16,
            }}>
              {searchText.trim() ? "Shop Results" : "All Shops"}
            </Text>
            
            {/* Wrap items in a row for large screens */}
            <View style={{
              flexDirection: isLargeScreen ? "row" : "column",
              flexWrap: isLargeScreen ? "wrap" : "nowrap",
              justifyContent: isLargeScreen ? "space-between" : "flex-start",
            }}>
              {searchResults.shops.map((shop) => (
                <View key={shop.id} style={{ 
                  width: isLargeScreen ? "48%" : "100%",
                  marginBottom: 16
                }}>
                  {renderShopItem(shop)}
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}