import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Platform,
  Alert,
  FlatList,
} from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { 
  ArrowLeft, 
  Heart, 
  ShoppingCart,
  Store,
  Star,
  Trash2
} from "lucide-react-native";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";
import { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

// Import data from mockData
import { allFoods } from '../data/mockData';

export default function WishlistPage() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  const [wishlistItems, setWishlistItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  useEffect(() => {
    loadWishlistAndCart();
  }, []);

  const loadWishlistAndCart = async () => {
    try {
      const [wishlistData, cartData] = await Promise.all([
        AsyncStorage.getItem('wishlistItems'),
        AsyncStorage.getItem('cartItems')
      ]);
      
      let wishlistIds = [];
      if (wishlistData) {
        wishlistIds = JSON.parse(wishlistData);
      } else {
        // Add default items to wishlist if it's empty
        const defaultWishlistIds = ['1', '5']; // Cold Coffee and Chicken Momos
        wishlistIds = defaultWishlistIds;
        await AsyncStorage.setItem('wishlistItems', JSON.stringify(defaultWishlistIds));
      }
      
      setWishlistItems(wishlistIds);
      
      if (cartData) {
        setCartItems(JSON.parse(cartData));
      }
    } catch (error) {
      console.error('Error loading wishlist and cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveWishlist = async (items) => {
    try {
      await AsyncStorage.setItem('wishlistItems', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving wishlist:', error);
    }
  };

  const saveCart = async (items) => {
    try {
      await AsyncStorage.setItem('cartItems', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  const removeFromWishlist = async (foodId) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    const updatedWishlist = wishlistItems.filter(id => id !== foodId);
    setWishlistItems(updatedWishlist);
    await saveWishlist(updatedWishlist);
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
    await saveCart(newCartItems);
  };

  const clearWishlist = () => {
    Alert.alert(
      "Clear Wishlist",
      "Are you sure you want to remove all items from your wishlist?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            setWishlistItems([]);
            await saveWishlist([]);
            if (Platform.OS === 'ios') {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
          }
        }
      ]
    );
  };

  // Get wishlist food items
  const wishlistFoods = allFoods.filter(food => wishlistItems.includes(food.id));

  const renderWishlistItem = ({ item: food }) => {
    const isInCart = cartItems.find(item => item.id === food.id);
    
    return (
      <View
        style={{
          backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
          borderRadius: 16,
          padding: 16,
          marginBottom: 12,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
        }}
      >
        <View style={{ flexDirection: "row" }}>
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
            
            <View style={{ 
              flexDirection: "row", 
              alignItems: "center", 
              marginBottom: 8 
            }}>
              <Star size={14} color="#F59E0B" fill="#F59E0B" />
              <Text style={{
                fontSize: 14,
                fontFamily: "Inter_500Medium",
                color: isDark ? "#E5E7EB" : "#374151",
                marginLeft: 4,
                marginRight: 12,
              }}>
                {food.rating}
              </Text>
              
              <View style={{
                backgroundColor: food.type === 'veg' ? "#22C55E" : "#EF4444",
                paddingHorizontal: 6,
                paddingVertical: 2,
                borderRadius: 4,
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
            
            <View style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
              <Text style={{
                fontSize: 18,
                fontFamily: "Inter_600SemiBold",
                color: "#22C55E",
              }}>
                ₹{food.price}
              </Text>
              
              <TouchableOpacity
                onPress={() => addToCart(food)}
                style={{
                  backgroundColor: "#22C55E",
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 8,
                  flexDirection: "row",
                  alignItems: "center",
                }}
                activeOpacity={0.8}
              >
                <ShoppingCart size={14} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={{
                  fontSize: 14,
                  fontFamily: "Inter_600SemiBold",
                  color: "#FFFFFF",
                }}>
                  {isInCart ? `In Cart (${isInCart.quantity})` : 'Add to Cart'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <TouchableOpacity
            onPress={() => removeFromWishlist(food.id)}
            style={{
              padding: 8,
              borderRadius: 8,
              alignSelf: 'flex-start',
            }}
            activeOpacity={0.7}
          >
            <Heart size={18} color="#EF4444" fill="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (!fontsLoaded || isLoading) {
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

  return (
    <View style={{ 
      flex: 1, 
      backgroundColor: isDark ? "#121212" : "#F8FDF8",
    }}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Header */}
      <View style={{
        paddingTop: insets.top + 16,
        paddingHorizontal: 20,
        paddingBottom: 16,
        backgroundColor: isDark ? "#121212" : "#F8FDF8",
        borderBottomWidth: 1,
        borderBottomColor: isDark ? "#1E1E1E" : "#E5E7EB",
      }}>
        <View style={{ 
          flexDirection: "row", 
          alignItems: "center", 
          justifyContent: "space-between" 
        }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
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
            }}>
              Wishlist ({wishlistFoods.length})
            </Text>
          </View>
          
          {wishlistFoods.length > 0 && (
            <TouchableOpacity
              onPress={clearWishlist}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 8,
              }}
              activeOpacity={0.7}
            >
              <Text style={{
                fontSize: 14,
                fontFamily: "Inter_500Medium",
                color: "#EF4444",
              }}>
                Clear All
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {wishlistFoods.length === 0 ? (
        /* Empty Wishlist */
        <View style={{ 
          flex: 1, 
          justifyContent: 'center', 
          alignItems: 'center',
          paddingHorizontal: 40,
        }}>
          <Heart size={64} color={isDark ? "#9CA3AF" : "#6B7280"} />
          <Text style={{
            fontSize: 20,
            fontFamily: "Inter_600SemiBold",
            color: isDark ? "#FFFFFF" : "#000000",
            marginTop: 16,
            textAlign: 'center',
          }}>
            Your wishlist is empty
          </Text>
          <Text style={{
            fontSize: 16,
            fontFamily: "Inter_400Regular",
            color: isDark ? "#9CA3AF" : "#6B7280",
            marginTop: 8,
            textAlign: 'center',
            lineHeight: 24,
          }}>
            Save your favorite food items to order them later
          </Text>
          
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/search')}
            style={{
              backgroundColor: "#22C55E",
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 12,
              marginTop: 24,
            }}
            activeOpacity={0.8}
          >
            <Text style={{
              fontSize: 16,
              fontFamily: "Inter_600SemiBold",
              color: "#FFFFFF",
            }}>
              Explore Food
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* Wishlist Items */
        <FlatList
          data={wishlistFoods}
          renderItem={renderWishlistItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: insets.bottom + 20,
          }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}