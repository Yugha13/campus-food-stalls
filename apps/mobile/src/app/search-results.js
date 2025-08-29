import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  Platform,
  useWindowDimensions,
  FlatList,
  Animated,
} from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter, useLocalSearchParams } from "expo-router";
import { 
  Search, 
  ArrowLeft, 
  Filter,
  Star,
  MapPin,
  Clock,
  ShoppingCart,
  Store,
  Coffee,
  X,
  Heart,
  Plus
} from "lucide-react-native";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";
import { useState, useEffect, useMemo, useRef } from "react";
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import data from mockData
import { allShops, allFoods } from '../data/mockData';

export default function SearchResults() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { q, mode } = useLocalSearchParams();
  const { width: windowWidth } = useWindowDimensions();
  
  const [searchText, setSearchText] = useState(q || "");
  const [showFilters, setShowFilters] = useState(false);
  const [activeResultType, setActiveResultType] = useState('foods'); // Show foods by default
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoadingCart, setIsLoadingCart] = useState(true);
  
  // Filter states
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [foodType, setFoodType] = useState('all'); // 'all', 'veg', 'non-veg'
  const [prepTime, setPrepTime] = useState('all'); // 'all', '5-10', '10-20', '20+'
  const [selectedShops, setSelectedShops] = useState([]);
  
  // Animation refs
  const filterModalAnimation = useRef(new Animated.Value(0)).current;
  const floatingButtonPulse = useRef(new Animated.Value(1)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  
  // Load cart and wishlist from AsyncStorage
  useEffect(() => {
    loadCartAndWishlist();
  }, []);
  
  const loadCartAndWishlist = async () => {
    try {
      const [cartData, wishlistData] = await Promise.all([
        AsyncStorage.getItem('cartItems'),
        AsyncStorage.getItem('wishlistItems')
      ]);
      
      if (cartData) {
        setCartItems(JSON.parse(cartData));
      }
      
      if (wishlistData) {
        setWishlistItems(JSON.parse(wishlistData));
      }
    } catch (error) {
      console.error('Error loading cart and wishlist:', error);
    } finally {
      setIsLoadingCart(false);
    }
  };
  
  const saveCartToStorage = async (items) => {
    try {
      await AsyncStorage.setItem('cartItems', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };
  
  const saveWishlistToStorage = async (items) => {
    try {
      await AsyncStorage.setItem('wishlistItems', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving wishlist:', error);
    }
  };
  
  // Pulse animation for floating button
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(floatingButtonPulse, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(floatingButtonPulse, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    
    return () => pulse.stop();
  }, []);
  
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  // Search and filter results - Mode specific
  const searchResults = useMemo(() => {
    const searchLower = searchText.toLowerCase();
    
    // Apply filters based on mode
    if (mode === 'shop') {
      // Only show shops when in shop mode
      const shops = allShops.filter(shop =>
        shop.name.toLowerCase().includes(searchLower) ||
        shop.location.toLowerCase().includes(searchLower)
      );
      
      return { foods: [], shops };
    } else {
      // Only show foods when in food mode (default)
      const foods = allFoods.filter(food => {
        const matchesText = food.name.toLowerCase().includes(searchLower) ||
                           food.shop.toLowerCase().includes(searchLower);
        
        // Apply food-specific filters
        const matchesPrice = priceRange[0] <= food.price && food.price <= priceRange[1];
        const matchesFoodType = foodType === 'all' || food.type === foodType;
        const matchesPrepTime = prepTime === 'all' || 
          (prepTime === '5-10' && food.prepTime && food.prepTime.includes('5-10')) ||
          (prepTime === '10-20' && food.prepTime && (food.prepTime.includes('10-15') || food.prepTime.includes('15-20'))) ||
          (prepTime === '20+' && food.prepTime && food.prepTime.includes('20'));
        const matchesShops = selectedShops.length === 0 || 
          selectedShops.some(shopId => allShops.find(s => s.id === shopId)?.name === food.shop);
        
        return matchesText && matchesPrice && matchesFoodType && matchesPrepTime && matchesShops;
      });
      
      return { foods, shops: [] };
    }
  }, [searchText, mode, priceRange, foodType, prepTime, selectedShops]);

  const handleSearch = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    // Re-filter results with new search text
  };

  const addToCart = async (food) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    const existingItem = cartItems.find(item => item.id === food.id);
    let newCartItems;
    
    if (existingItem) {
      newCartItems = cartItems.map(item => 
        item.id === food.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      newCartItems = [...cartItems, { ...food, quantity: 1, addedAt: new Date().toISOString() }];
    }
    
    setCartItems(newCartItems);
    await saveCartToStorage(newCartItems);
  };

  const toggleWishlist = async (foodId) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    let newWishlistItems;
    
    if (wishlistItems.includes(foodId)) {
      newWishlistItems = wishlistItems.filter(id => id !== foodId);
    } else {
      newWishlistItems = [...wishlistItems, foodId];
    }
    
    setWishlistItems(newWishlistItems);
    await saveWishlistToStorage(newWishlistItems);
  };
  
  const showFilterModal = () => {
    setShowFilters(true);
    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(filterModalAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };
  
  const hideFilterModal = () => {
    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(filterModalAnimation, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowFilters(false);
    });
  };

  const handleShopPress = (shop) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    // Navigate to shop detail page
    router.push(`/(tabs)/shop/${shop.id}`);
  };

  const handleFoodPress = (food) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    // Navigate to food detail page (if exists) or add to cart
    router.push(`/(tabs)/food/${food.id}`);
  };

  const renderFoodItem = ({ item: food }) => {
    const isInWishlist = wishlistItems.includes(food.id);
    const isInCart = cartItems.find(item => item.id === food.id);
    
    return (
      <TouchableOpacity
        onPress={() => handleFoodPress(food)}
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
        }}
        activeOpacity={0.7}
      >
        <View style={{ flexDirection: "row" }}>
          <View style={{ position: 'relative' }}>
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
            
            {/* Wishlist button */}
            <TouchableOpacity
              onPress={() => toggleWishlist(food.id)}
              style={{
                position: 'absolute',
                top: 4,
                right: 16,
                backgroundColor: 'rgba(255,255,255,0.9)',
                borderRadius: 12,
                padding: 4,
              }}
              activeOpacity={0.7}
            >
              <Heart 
                size={16} 
                color={isInWishlist ? "#EF4444" : "#6B7280"} 
                fill={isInWishlist ? "#EF4444" : "transparent"}
              />
            </TouchableOpacity>
          </View>
          
          <View style={{ flex: 1 }}>
            <Text style={{
              fontSize: 16,
              fontFamily: "Inter_600SemiBold",
              color: isDark ? "#FFFFFF" : "#000000",
              marginBottom: 4,
            }}>
              {food.name}
            </Text>
            
            <View style={{ 
              flexDirection: "row", 
              alignItems: "center", 
              marginBottom: 4 
            }}>
              <Store size={14} color={isDark ? "#9CA3AF" : "#6B7280"} />
              <Text style={{
                fontSize: 14,
                fontFamily: "Inter_400Regular",
                color: isDark ? "#9CA3AF" : "#6B7280",
                marginLeft: 4,
              }}>
                {food.shop}
              </Text>
            </View>
            
            {/* UX Psychology - Trending info */}
            {food.trending && (
              <Text style={{
                fontSize: 12,
                fontFamily: "Inter_500Medium",
                color: "#F59E0B",
                marginBottom: 4,
              }}>
                {food.trending}
              </Text>
            )}
            
            <View style={{ 
              flexDirection: "row", 
              alignItems: "center", 
              justifyContent: "space-between",
              marginBottom: 8
            }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Star size={14} color="#F59E0B" fill="#F59E0B" />
                <Text style={{
                  fontSize: 14,
                  fontFamily: "Inter_500Medium",
                  color: isDark ? "#E5E7EB" : "#374151",
                  marginLeft: 4,
                }}>
                  {food.rating}
                </Text>
                
                <View style={{
                  backgroundColor: food.type === 'veg' ? "#22C55E" : "#EF4444",
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  borderRadius: 4,
                  marginLeft: 8,
                }}>
                  <Text style={{
                    fontSize: 10,
                    fontFamily: "Inter_500Medium",
                    color: "#FFFFFF",
                  }}>
                    {food.type === 'veg' ? 'VEG' : 'NON-VEG'}
                  </Text>
                </View>
              </View>
              
              <Text style={{
                fontSize: 16,
                fontFamily: "Inter_600SemiBold",
                color: "#22C55E",
              }}>
                ₹{food.price}
              </Text>
            </View>
            
            {/* Add to Cart Button */}
            <TouchableOpacity
              onPress={() => addToCart(food)}
              style={{
                backgroundColor: "#22C55E",
                borderRadius: 8,
                paddingVertical: 8,
                paddingHorizontal: 12,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
              activeOpacity={0.8}
            >
              <ShoppingCart size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={{
                fontSize: 14,
                fontFamily: "Inter_600SemiBold",
                color: "#FFFFFF",
              }}>
                {isInCart ? `Added (${isInCart.quantity})` : 'Add to Cart'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderShopItem = ({ item: shop }) => (
    <TouchableOpacity
      onPress={() => handleShopPress(shop)}
      style={{
        backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
        borderRadius: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        overflow: 'hidden',
      }}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: shop.image }}
        style={{
          width: "100%",
          height: 120,
        }}
        contentFit="cover"
      />
      
      <View style={{ padding: 16 }}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 8,
        }}>
          <Text style={{
            fontSize: 18,
            fontFamily: "Inter_600SemiBold",
            color: isDark ? "#FFFFFF" : "#000000",
            flex: 1,
          }}>
            {shop.name}
          </Text>
          
          {/* UX Psychology - Order count */}
          <View style={{
            backgroundColor: '#FEF3C7',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 12,
            marginLeft: 8,
          }}>
            <Text style={{
              fontSize: 10,
              fontFamily: 'Inter_600SemiBold',
              color: '#D97706',
            }}>
              🔥 HOT
            </Text>
          </View>
        </View>
        
        <View style={{ 
          flexDirection: "row", 
          alignItems: "center", 
          marginBottom: 8 
        }}>
          <Star size={16} color="#F59E0B" fill="#F59E0B" />
          <Text style={{
            fontSize: 14,
            fontFamily: "Inter_500Medium",
            color: isDark ? "#E5E7EB" : "#374151",
            marginLeft: 4,
            marginRight: 12,
          }}>
            {shop.rating}
          </Text>
          
          <MapPin size={14} color={isDark ? "#9CA3AF" : "#6B7280"} />
          <Text style={{
            fontSize: 14,
            fontFamily: "Inter_400Regular",
            color: isDark ? "#9CA3AF" : "#6B7280",
            marginLeft: 4,
          }}>
            {shop.location}
          </Text>
        </View>
        
        {/* UX Psychology - Prep time with urgency */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 12,
        }}>
          <Clock size={14} color="#22C55E" />
          <Text style={{
            fontSize: 14,
            fontFamily: 'Inter_500Medium',
            color: '#22C55E',
            marginLeft: 4,
          }}>
            ⏱ Ready in {shop.prepTime}
          </Text>
        </View>
        
        {/* UX Psychology - Social proof */}
        <Text style={{
          fontSize: 12,
          fontFamily: 'Inter_500Medium',
          color: '#F59E0B',
          marginBottom: 12,
        }}>
          🔥 {Math.floor(Math.random() * 50) + 30} students ordering now
        </Text>
        
        <View style={{ 
          flexDirection: "row", 
          flexWrap: "wrap",
          gap: 6,
        }}>
          <View style={{
            backgroundColor: isDark ? "#374151" : "#F3F4F6",
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 6,
          }}>
            <Text style={{
              fontSize: 12,
              fontFamily: "Inter_500Medium",
              color: isDark ? "#E5E7EB" : "#374151",
            }}>
              Popular for {shop.popular}
            </Text>
          </View>
          <View style={{
            backgroundColor: '#DCFCE7',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 6,
          }}>
            <Text style={{
              fontSize: 12,
              fontFamily: "Inter_500Medium",
              color: '#166534',
            }}>
              Fast Delivery
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (!fontsLoaded) {
    return (
      <View style={{ 
        flex: 1, 
        backgroundColor: isDark ? "#121212" : "#F8FDF8",
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Text style={{ color: isDark ? "#FFFFFF" : "#000000" }}>Loading...</Text>
      </View>
    );
  }

  const isLargeScreen = windowWidth >= 768;

  return (
    <View style={{ 
      flex: 1, 
      backgroundColor: isDark ? "#121212" : "#F8FDF8",
    }}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Sticky Header with Search */}
      <View style={{
        paddingTop: insets.top + 16,
        paddingHorizontal: 20,
        paddingBottom: 16,
        backgroundColor: isDark ? "#121212" : "#F8FDF8",
        borderBottomWidth: 1,
        borderBottomColor: isDark ? "#1E1E1E" : "#E5E7EB",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
        zIndex: 100,
      }}>
        {/* Header with back button */}
        <View style={{ 
          flexDirection: "row", 
          alignItems: "center", 
          marginBottom: 16 
        }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              padding: 8,
              marginRight: 8,
              borderRadius: 12,
            }}
            activeOpacity={0.7}
          >
            <ArrowLeft size={24} color={isDark ? "#FFFFFF" : "#000000"} />
          </TouchableOpacity>
          
          <Text style={{
            fontSize: 20,
            fontFamily: "Inter_600SemiBold",
            color: isDark ? "#FFFFFF" : "#000000",
            flex: 1,
          }}>
            Search Results
          </Text>
        </View>

        {/* Search Input - Clickable to redirect to search-page */}
        <View style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 16,
        }}>
          <TouchableOpacity
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
              borderRadius: 16,
              paddingHorizontal: 16,
              paddingVertical: 12,
              marginRight: 12,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 3,
            }}
            activeOpacity={0.7}
            onPress={() => {
              router.push({
                pathname: "search-page",
                params: { mode: mode || 'food' }
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
              {searchText || "Search..."}
            </Text>
            {searchText.length > 0 && (
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  setSearchText("");
                }}
                style={{ padding: 4 }}
              >
                <X size={16} color={isDark ? "#9CA3AF" : "#6B7280"} />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => setShowFilters(!showFilters)}
            style={{
              backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
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
            }}
            activeOpacity={0.7}
          >
            <Filter size={20} color={isDark ? "#9CA3AF" : "#6B7280"} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Results Content */}
      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ 
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 20 
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Food Results - Only show when in food mode */}
        {mode !== 'shop' && searchResults.foods.length > 0 && (
          <View style={{ marginBottom: 24 }}>
            <Text style={{
              fontFamily: "Inter_600SemiBold",
              fontSize: 18,
              color: isDark ? "#FFFFFF" : "#000000",
              marginBottom: 16,
              marginTop: 20,
            }}>
              Food Results ({searchResults.foods.length})
            </Text>
            
            <FlatList
              data={searchResults.foods}
              renderItem={renderFoodItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            />
          </View>
        )}
        
        {/* Shop Results - Only show when in shop mode */}
        {mode === 'shop' && searchResults.shops.length > 0 && (
          <View style={{ marginBottom: 24 }}>
            <Text style={{
              fontFamily: "Inter_600SemiBold",
              fontSize: 18,
              color: isDark ? "#FFFFFF" : "#000000",
              marginBottom: 16,
              marginTop: 20,
            }}>
              Shop Results ({searchResults.shops.length})
            </Text>
            
            <FlatList
              data={searchResults.shops}
              renderItem={renderShopItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            />
          </View>
        )}
        
        {/* No Results - Mode specific messages */}
        {((mode === 'shop' && searchResults.shops.length === 0) || 
          (mode !== 'shop' && searchResults.foods.length === 0)) && (
          <View style={{ 
            flex: 1, 
            justifyContent: 'center', 
            alignItems: 'center',
            paddingTop: 60
          }}>
            {mode === 'shop' ? (
              <Store size={48} color={isDark ? "#9CA3AF" : "#6B7280"} />
            ) : (
              <Coffee size={48} color={isDark ? "#9CA3AF" : "#6B7280"} />
            )}
            <Text style={{
              fontSize: 18,
              fontFamily: "Inter_500Medium",
              color: isDark ? "#9CA3AF" : "#6B7280",
              marginTop: 16,
              textAlign: 'center',
            }}>
              No {mode === 'shop' ? 'shops' : 'food items'} found
            </Text>
            <Text style={{
              fontSize: 14,
              fontFamily: "Inter_400Regular",
              color: isDark ? "#9CA3AF" : "#6B7280",
              marginTop: 8,
              textAlign: 'center',
            }}>
              Try searching with different keywords
            </Text>
          </View>
        )}
      </ScrollView>
      
      {/* Floating Filter Button */}
      <Animated.View
        style={{
          position: 'absolute',
          bottom: insets.bottom + 20,
          right: 20,
          transform: [{ scale: floatingButtonPulse }],
        }}
      >
        <TouchableOpacity
          onPress={showFilterModal}
          style={{
            backgroundColor: '#22C55E',
            width: 56,
            height: 56,
            borderRadius: 28,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#22C55E',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 8,
            // Enhanced glowing effect
            borderWidth: 3,
            borderColor: 'rgba(34, 197, 94, 0.4)',
          }}
          activeOpacity={0.8}
        >
          <Filter size={24} color="#FFFFFF" />
        </TouchableOpacity>
        
        {/* Glowing ring animation */}
        <Animated.View
          style={{
            position: 'absolute',
            top: -4,
            left: -4,
            right: -4,
            bottom: -4,
            borderRadius: 32,
            borderWidth: 2,
            borderColor: 'rgba(34, 197, 94, 0.2)',
            transform: [{ scale: floatingButtonPulse }],
          }}
        />
      </Animated.View>
      
      {/* Filter Modal */}
      {showFilters && (
        <>
          {/* Animated Overlay */}
          <Animated.View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              opacity: overlayOpacity,
              zIndex: 90,
            }}
          >
            <TouchableOpacity
              style={{ flex: 1 }}
              activeOpacity={1}
              onPress={hideFilterModal}
            />
          </Animated.View>
          
          {/* Animated Filter Content */}
          <Animated.View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              paddingHorizontal: 20,
              paddingTop: 20,
              paddingBottom: insets.bottom + 20,
              maxHeight: '80%',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 10,
              zIndex: 100,
              transform: [
                {
                  translateY: filterModalAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [400, 0],
                  }),
                },
                {
                  scale: filterModalAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.9, 1],
                  }),
                },
              ],
              opacity: filterModalAnimation,
            }}
          >
            {/* Filter Header */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 24,
            }}>
              <Text style={{
                fontSize: 20,
                fontFamily: 'Inter_600SemiBold',
                color: isDark ? '#FFFFFF' : '#000000',
              }}>
                Filters
              </Text>
              
              <TouchableOpacity
                onPress={hideFilterModal}
                style={{
                  padding: 4,
                  borderRadius: 8,
                }}
              >
                <X size={24} color={isDark ? '#9CA3AF' : '#6B7280'} />
              </TouchableOpacity>
            </View>
            
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              {/* Price Range Filter */}
              <View style={{ marginBottom: 24 }}>
                <Text style={{
                  fontSize: 16,
                  fontFamily: 'Inter_600SemiBold',
                  color: isDark ? '#FFFFFF' : '#000000',
                  marginBottom: 12,
                }}>
                  Price Range
                </Text>
                
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 8,
                }}>
                  <Text style={{
                    fontSize: 14,
                    fontFamily: 'Inter_500Medium',
                    color: '#22C55E',
                  }}>
                    ₹{priceRange[0]}
                  </Text>
                  <Text style={{
                    fontSize: 14,
                    fontFamily: 'Inter_500Medium',
                    color: '#22C55E',
                  }}>
                    ₹{priceRange[1]}
                  </Text>
                </View>
                
                {/* Price Range Buttons */}
                <View style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: 8,
                }}>
                  {[
                    { label: 'Under ₹50', range: [0, 50] },
                    { label: '₹50-100', range: [50, 100] },
                    { label: '₹100-200', range: [100, 200] },
                    { label: '₹200+', range: [200, 500] },
                  ].map((option) => (
                    <TouchableOpacity
                      key={option.label}
                      onPress={() => setPriceRange(option.range)}
                      style={{
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        borderRadius: 20,
                        backgroundColor: 
                          priceRange[0] === option.range[0] && priceRange[1] === option.range[1]
                            ? '#22C55E'
                            : isDark ? '#374151' : '#F3F4F6',
                        borderWidth: 1,
                        borderColor: 
                          priceRange[0] === option.range[0] && priceRange[1] === option.range[1]
                            ? '#22C55E'
                            : 'transparent',
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={{
                        fontSize: 14,
                        fontFamily: 'Inter_500Medium',
                        color: 
                          priceRange[0] === option.range[0] && priceRange[1] === option.range[1]
                            ? '#FFFFFF'
                            : isDark ? '#E5E7EB' : '#374151',
                      }}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              {/* Food Type Filter */}
              <View style={{ marginBottom: 24 }}>
                <Text style={{
                  fontSize: 16,
                  fontFamily: 'Inter_600SemiBold',
                  color: isDark ? '#FFFFFF' : '#000000',
                  marginBottom: 12,
                }}>
                  Food Type
                </Text>
                
                <View style={{
                  flexDirection: 'row',
                  gap: 12,
                }}>
                  {[
                    { label: 'All', value: 'all' },
                    { label: 'Vegetarian', value: 'veg' },
                    { label: 'Non-Vegetarian', value: 'non-veg' },
                  ].map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      onPress={() => setFoodType(option.value)}
                      style={{
                        flex: 1,
                        paddingVertical: 12,
                        borderRadius: 12,
                        backgroundColor: 
                          foodType === option.value
                            ? '#22C55E'
                            : isDark ? '#374151' : '#F3F4F6',
                        alignItems: 'center',
                        borderWidth: 1,
                        borderColor: 
                          foodType === option.value
                            ? '#22C55E'
                            : 'transparent',
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={{
                        fontSize: 14,
                        fontFamily: 'Inter_600SemiBold',
                        color: 
                          foodType === option.value
                            ? '#FFFFFF'
                            : isDark ? '#E5E7EB' : '#374151',
                      }}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              {/* Prep Time Filter */}
              <View style={{ marginBottom: 24 }}>
                <Text style={{
                  fontSize: 16,
                  fontFamily: 'Inter_600SemiBold',
                  color: isDark ? '#FFFFFF' : '#000000',
                  marginBottom: 12,
                }}>
                  Preparation Time
                </Text>
                
                <View style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: 8,
                }}>
                  {[
                    { label: 'All', value: 'all' },
                    { label: '5-10 min', value: '5-10' },
                    { label: '10-20 min', value: '10-20' },
                    { label: '20+ min', value: '20+' },
                  ].map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      onPress={() => setPrepTime(option.value)}
                      style={{
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        borderRadius: 20,
                        backgroundColor: 
                          prepTime === option.value
                            ? '#22C55E'
                            : isDark ? '#374151' : '#F3F4F6',
                        borderWidth: 1,
                        borderColor: 
                          prepTime === option.value
                            ? '#22C55E'
                            : 'transparent',
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={{
                        fontSize: 14,
                        fontFamily: 'Inter_500Medium',
                        color: 
                          prepTime === option.value
                            ? '#FFFFFF'
                            : isDark ? '#E5E7EB' : '#374151',
                      }}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              {/* Shops Filter */}
              <View style={{ marginBottom: 24 }}>
                <Text style={{
                  fontSize: 16,
                  fontFamily: 'Inter_600SemiBold',
                  color: isDark ? '#FFFFFF' : '#000000',
                  marginBottom: 12,
                }}>
                  Shops ({selectedShops.length} selected)
                </Text>
                
                <View style={{
                  maxHeight: 200,
                }}>
                  <ScrollView
                    style={{
                      backgroundColor: isDark ? '#374151' : '#F9FAFB',
                      borderRadius: 12,
                      padding: 12,
                    }}
                    showsVerticalScrollIndicator={false}
                  >
                    {allShops.slice(0, 10).map((shop) => {
                      const isSelected = selectedShops.includes(shop.id);
                      return (
                        <TouchableOpacity
                          key={shop.id}
                          onPress={() => {
                            if (isSelected) {
                              setSelectedShops(selectedShops.filter(id => id !== shop.id));
                            } else {
                              setSelectedShops([...selectedShops, shop.id]);
                            }
                          }}
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingVertical: 8,
                            paddingHorizontal: 4,
                          }}
                          activeOpacity={0.7}
                        >
                          <View style={{
                            width: 20,
                            height: 20,
                            borderRadius: 4,
                            borderWidth: 2,
                            borderColor: isSelected ? '#22C55E' : (isDark ? '#6B7280' : '#D1D5DB'),
                            backgroundColor: isSelected ? '#22C55E' : 'transparent',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 12,
                          }}>
                            {isSelected && (
                              <Text style={{
                                fontSize: 12,
                                fontFamily: 'Inter_600SemiBold',
                                color: '#FFFFFF',
                              }}>
                                ✓
                              </Text>
                            )}
                          </View>
                          
                          <View style={{ flex: 1 }}>
                            <Text style={{
                              fontSize: 14,
                              fontFamily: 'Inter_500Medium',
                              color: isDark ? '#FFFFFF' : '#000000',
                            }}>
                              {shop.name}
                            </Text>
                            <Text style={{
                              fontSize: 12,
                              fontFamily: 'Inter_400Regular',
                              color: isDark ? '#9CA3AF' : '#6B7280',
                            }}>
                              {shop.location} • {shop.popular}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>
              </View>
            </ScrollView>
            
            {/* Apply Filters Button */}
            <View style={{
              flexDirection: 'row',
              gap: 12,
              marginTop: 16,
            }}>
              <TouchableOpacity
                onPress={() => {
                  // Reset filters
                  setPriceRange([0, 500]);
                  setFoodType('all');
                  setPrepTime('all');
                  setSelectedShops([]);
                }}
                style={{
                  flex: 1,
                  paddingVertical: 16,
                  borderRadius: 12,
                  backgroundColor: isDark ? '#374151' : '#F3F4F6',
                  alignItems: 'center',
                }}
                activeOpacity={0.7}
              >
                <Text style={{
                  fontSize: 16,
                  fontFamily: 'Inter_600SemiBold',
                  color: isDark ? '#E5E7EB' : '#374151',
                }}>
                  Reset
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => {
                  hideFilterModal();
                  // Apply filters logic here
                }}
                style={{
                  flex: 2,
                  paddingVertical: 16,
                  borderRadius: 12,
                  backgroundColor: '#22C55E',
                  alignItems: 'center',
                }}
                activeOpacity={0.8}
              >
                <Text style={{
                  fontSize: 16,
                  fontFamily: 'Inter_600SemiBold',
                  color: '#FFFFFF',
                }}>
                  Apply Filters
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </>
      )}
    </View>
  );
}