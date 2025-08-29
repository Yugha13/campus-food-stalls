import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Platform,
  useWindowDimensions,
  Animated,
  Pressable,
} from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter, useLocalSearchParams } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Search, 
  Filter, 
  Heart, 
  Package, 
  X, 
  ChevronRight,
  Star,
  MapPin,
  ArrowRight,
  ShoppingCart,
  Coffee,
  Store
} from "lucide-react-native";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";
import { useState, useEffect, useRef } from "react";
import * as Haptics from 'expo-haptics';
import { addToCart, getCartItems } from '../../utils/cartUtils';
import { allShops, allFoods } from '../../data/mockData';

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { q, mode } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { width: windowWidth } = useWindowDimensions();
  const [searchText, setSearchText] = useState(q || "");
  const [searchResults, setSearchResults] = useState({ foods: [], shops: [] });
  const [activeMode, setActiveMode] = useState(mode || "food");
  const [cartItems, setCartItems] = useState([]);
  const toggleAnim = useRef(new Animated.Value(mode === "shop" ? 1 : 0)).current;
  
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [hasActiveFilters, setHasActiveFilters] = useState(false);
  
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  useEffect(() => {
    loadCartItems();
  }, []);

  useEffect(() => {
    if (searchText.trim()) {
      performSearch(searchText);
    } else {
      setSearchResults({ 
        foods: activeMode === "food" ? allFoods.slice(0, 10) : [], 
        shops: activeMode === "shop" ? allShops.slice(0, 10) : [] 
      });
    }
  }, [searchText, activeMode, selectedLocation, selectedPriceRange]);

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
      
      if (Platform.OS === 'ios') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const performSearch = (query) => {
    const searchLower = query.toLowerCase();
    
    const matchingFoods = activeMode === "food" ? allFoods.filter(food => {
      const matchesText = food.name.toLowerCase().includes(searchLower) || 
                         food.shop.toLowerCase().includes(searchLower);
      const matchesPrice = selectedPriceRange === null || 
                          (food.price >= selectedPriceRange.min && 
                           food.price <= selectedPriceRange.max);
      const matchesLocation = selectedLocation === "" || 
                             food.shop.includes(selectedLocation);
      
      return matchesText && matchesPrice && matchesLocation;
    }) : [];
    
    const matchingShops = activeMode === "shop" ? allShops.filter(shop => {
      const matchesText = shop.name.toLowerCase().includes(searchLower) ||
                         shop.location.toLowerCase().includes(searchLower) ||
                         shop.category.toLowerCase().includes(searchLower);
      const matchesLocation = selectedLocation === "" || 
                             shop.location.includes(selectedLocation);
      
      return matchesText && matchesLocation;
    }) : [];
    
    setSearchResults({ foods: matchingFoods, shops: matchingShops });
  };

  const toggleMode = (mode) => {
    if (mode !== activeMode) {
      if (Platform.OS === 'ios') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      
      setActiveMode(mode);
      
      Animated.timing(toggleAnim, {
        toValue: mode === "food" ? 0 : 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
      
      if (searchText.trim()) {
        performSearch(searchText);
      }
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  const isLargeScreen = windowWidth >= 768;

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
          <Image
            source={require('../../../assets/images/primary-logo.svg')}
            style={{
              width: 32,
              height: 32,
              marginRight: 10,
            }}
            contentFit="contain"
          />
          <Text style={{
            flex: 1,
            fontSize: 24,
            fontFamily: "Inter_600SemiBold",
            color: isDark ? "#FFFFFF" : "#000000",
          }}>
            Tap2Eat
          </Text>
          
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <TouchableOpacity
              onPress={() => router.push('/wishlist')}
              style={{
                padding: 8,
                borderRadius: 12,
                backgroundColor: isDark ? "#1E1E1E" : "#F3F4F6",
              }}
              activeOpacity={0.7}
            >
              <Heart size={20} color={isDark ? "#E5E7EB" : "#374151"} />
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => router.push('/order-history')}
              style={{
                padding: 8,
                borderRadius: 12,
                backgroundColor: isDark ? "#1E1E1E" : "#F3F4F6",
              }}
              activeOpacity={0.7}
            >
              <Package size={20} color={isDark ? "#E5E7EB" : "#374151"} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Mode Selector */}
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
            
            <Pressable
              onPress={() => toggleMode("food")}
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
                zIndex: 1,
                paddingVertical: 12,
              }}
            >
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
            </Pressable>
            
            <Pressable
              onPress={() => toggleMode("shop")}
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
                zIndex: 1,
                paddingVertical: 12,
              }}
            >
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
            </Pressable>
          </View>
        </View>
      
        {/* Search Bar - Navigate to search page */}
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
              router.push({
                pathname: "search-page",
                params: { mode: activeMode }
              });
              
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
        </View>
      </View>

      {/* Results */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
        {activeMode === "food" && searchResults.foods.length > 0 && (
          <View style={{ gap: 16 }}>
            {searchResults.foods.slice(0, 20).map(food => (
              <TouchableOpacity
                key={food.id}
                style={{
                  backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
                  borderRadius: 16,
                  padding: 12,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 3,
                }}
                activeOpacity={0.7}
                onPress={() => router.push(`/(tabs)/food/${food.id}`)}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    source={{ uri: food.image }}
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 12,
                      marginRight: 12,
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
                      }}
                      numberOfLines={1}
                    >
                      {food.shop}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={{
                      backgroundColor: "#22C55E",
                      borderRadius: 12,
                      padding: 8,
                    }}
                    activeOpacity={0.8}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleAddToCart(food);
                    }}
                  >
                    <ShoppingCart size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {activeMode === "shop" && searchResults.shops.length > 0 && (
          <View style={{ gap: 16 }}>
            {searchResults.shops.slice(0, 20).map(shop => (
              <TouchableOpacity
                key={shop.id}
                style={{
                  backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
                  borderRadius: 16,
                  padding: 16,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 3,
                }}
                activeOpacity={0.7}
                onPress={() => router.push(`/(tabs)/shop/${shop.id}`)}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    source={{ uri: shop.image }}
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 12,
                      marginRight: 12,
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
                  <ArrowRight size={16} color={isDark ? "#9CA3AF" : "#6B7280"} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}