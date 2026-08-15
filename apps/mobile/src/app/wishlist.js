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
  Trash2,
  MapPin
} from "lucide-react-native";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold
} from "@expo-google-fonts/inter";
import { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { allFoods, allShops } from '../data/mockData';

export default function WishlistPage() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState('food'); // 'food' or 'shops'
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistShops, setWishlistShops] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold
  });

  const themeColors = {
    bg: isDark ? "#09090B" : "#F8FAFC",
    cardBg: isDark ? "#18181B" : "#FFFFFF",
    textPrimary: isDark ? "#FAFAFA" : "#0F172A",
    textSecondary: isDark ? "#A1A1AA" : "#64748B",
    primary: "#10B981",
    coin: "#F59E0B",
    border: isDark ? "#27272A" : "#E2E8F0",
  };

  useEffect(() => {
    loadWishlistAndCart();
  }, []);

  const loadWishlistAndCart = async () => {
    try {
      const [wishlistData, wishlistShopsData, cartData] = await Promise.all([
        AsyncStorage.getItem('wishlistItems'),
        AsyncStorage.getItem('wishlistShops'),
        AsyncStorage.getItem('cartItems')
      ]);
      
      let wItems = wishlistData ? JSON.parse(wishlistData) : ['1', '5'];
      let wShops = wishlistShopsData ? JSON.parse(wishlistShopsData) : ['1'];
      
      setWishlistItems(wItems);
      setWishlistShops(wShops);
      if (cartData) setCartItems(JSON.parse(cartData));
      
      if (!wishlistData) await AsyncStorage.setItem('wishlistItems', JSON.stringify(wItems));
      if (!wishlistShopsData) await AsyncStorage.setItem('wishlistShops', JSON.stringify(wShops));
    } catch (error) {
      console.error('Error loading wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveWishlist = async (key, items) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(items));
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

  const removeFromWishlist = async (id, isShop = false) => {
    if (Platform.OS === 'ios') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (isShop) {
      const updated = wishlistShops.filter(itemId => itemId !== id);
      setWishlistShops(updated);
      await saveWishlist('wishlistShops', updated);
    } else {
      const updated = wishlistItems.filter(itemId => itemId !== id);
      setWishlistItems(updated);
      await saveWishlist('wishlistItems', updated);
    }
  };

  const addToCart = async (food) => {
    if (Platform.OS === 'ios') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const existingItem = cartItems.find(item => item.id === food.id);
    let newCartItems;
    if (existingItem) {
      newCartItems = cartItems.map(item => item.id === food.id ? { ...item, quantity: item.quantity + 1 } : item);
    } else {
      newCartItems = [...cartItems, { ...food, quantity: 1, addedAt: new Date().toISOString() }];
    }
    setCartItems(newCartItems);
    await saveCart(newCartItems);
  };

  const clearWishlist = () => {
    Alert.alert(
      "Clear Favorites",
      `Are you sure you want to remove all ${activeTab}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            if (activeTab === 'food') {
              setWishlistItems([]);
              await saveWishlist('wishlistItems', []);
            } else {
              setWishlistShops([]);
              await saveWishlist('wishlistShops', []);
            }
            if (Platform.OS === 'ios') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }
        }
      ]
    );
  };

  const displayFoods = allFoods.filter(food => wishlistItems.includes(food.id));
  const displayShops = allShops.filter(shop => wishlistShops.includes(shop.id));

  const renderFoodItem = ({ item: food }) => {
    const isInCart = cartItems.find(item => item.id === food.id);
    return (
      <View style={{ backgroundColor: themeColors.cardBg, borderRadius: 24, padding: 12, marginBottom: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2, borderWidth: 1, borderColor: themeColors.border, flexDirection: "row" }}>
        <Image source={{ uri: food.image }} style={{ width: 100, height: 100, borderRadius: 16, marginRight: 16 }} contentFit="cover" />
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Text style={{ flex: 1, fontSize: 16, fontFamily: "Inter_600SemiBold", color: themeColors.textPrimary, marginBottom: 4 }} numberOfLines={1}>{food.name}</Text>
            <TouchableOpacity onPress={() => removeFromWishlist(food.id, false)} style={{ padding: 4 }}>
              <Heart size={20} color="#EF4444" fill="#EF4444" />
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
            <Store size={12} color={themeColors.textSecondary} />
            <Text style={{ fontSize: 13, fontFamily: "Inter_500Medium", color: themeColors.textSecondary, marginLeft: 4 }}>{food.shop}</Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={{ fontSize: 18, fontFamily: "Inter_700Bold", color: themeColors.coin }}>🪙 {food.price}</Text>
            <TouchableOpacity onPress={() => addToCart(food)} style={{ backgroundColor: themeColors.textPrimary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 100, flexDirection: "row", alignItems: "center" }} activeOpacity={0.8}>
              <Text style={{ fontSize: 14, fontFamily: "Inter_600SemiBold", color: themeColors.bg }}>{isInCart ? `In Cart (${isInCart.quantity})` : 'Add'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderShopItem = ({ item: shop }) => (
    <TouchableOpacity onPress={() => router.push(`/(tabs)/shop/${shop.id}`)} activeOpacity={0.9} style={{ backgroundColor: themeColors.cardBg, borderRadius: 24, padding: 12, marginBottom: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2, borderWidth: 1, borderColor: themeColors.border, flexDirection: "row" }}>
      <Image source={{ uri: shop.image }} style={{ width: 100, height: 100, borderRadius: 16, marginRight: 16 }} contentFit="cover" />
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Text style={{ flex: 1, fontSize: 18, fontFamily: "Inter_600SemiBold", color: themeColors.textPrimary, marginBottom: 6 }} numberOfLines={1}>{shop.name}</Text>
          <TouchableOpacity onPress={() => removeFromWishlist(shop.id, true)} style={{ padding: 4 }}>
            <Heart size={20} color="#EF4444" fill="#EF4444" />
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}>
          <MapPin size={12} color={themeColors.textSecondary} />
          <Text style={{ fontSize: 13, fontFamily: "Inter_500Medium", color: themeColors.textSecondary, marginLeft: 4 }}>{shop.location}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Star size={14} color="#F59E0B" fill="#F59E0B" />
          <Text style={{ fontSize: 14, fontFamily: "Inter_600SemiBold", color: themeColors.textPrimary, marginLeft: 4 }}>{shop.rating}</Text>
          <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: themeColors.textSecondary, marginHorizontal: 8 }} />
          <Text style={{ fontSize: 13, fontFamily: "Inter_500Medium", color: themeColors.textSecondary }}>{shop.deliveryTime}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (!fontsLoaded || isLoading) return null;

  const activeData = activeTab === 'food' ? displayFoods : displayShops;

  return (
    <View style={{ flex: 1, backgroundColor: themeColors.bg }}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Header */}
      <View style={{ paddingTop: insets.top + 16, paddingHorizontal: 20, paddingBottom: 16, backgroundColor: themeColors.bg, borderBottomWidth: 1, borderBottomColor: themeColors.border, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginRight: 8, borderRadius: 12, backgroundColor: themeColors.cardBg, borderWidth: 1, borderColor: themeColors.border }} activeOpacity={0.7}>
            <ArrowLeft size={20} color={themeColors.textPrimary} />
          </TouchableOpacity>
          <Text style={{ fontSize: 20, fontFamily: "Inter_600SemiBold", color: themeColors.textPrimary }}>Favorites</Text>
        </View>
        
        {activeData.length > 0 && (
          <TouchableOpacity onPress={clearWishlist} style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 100, backgroundColor: 'rgba(239, 68, 68, 0.1)' }} activeOpacity={0.7}>
            <Text style={{ fontSize: 14, fontFamily: "Inter_600SemiBold", color: "#EF4444" }}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Toggle */}
      <View style={{ paddingHorizontal: 24, marginTop: 24, marginBottom: 16 }}>
        <View style={{ flexDirection: 'row', backgroundColor: isDark ? '#1E1E1E' : '#F1F5F9', borderRadius: 100, padding: 4 }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setActiveTab('food')}
            style={{ flex: 1, paddingVertical: 12, borderRadius: 100, backgroundColor: activeTab === 'food' ? themeColors.textPrimary : 'transparent', alignItems: 'center' }}
          >
            <Text style={{ fontSize: 15, fontFamily: "Inter_600SemiBold", color: activeTab === 'food' ? themeColors.bg : themeColors.textSecondary }}>Food</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setActiveTab('shops')}
            style={{ flex: 1, paddingVertical: 12, borderRadius: 100, backgroundColor: activeTab === 'shops' ? themeColors.textPrimary : 'transparent', alignItems: 'center' }}
          >
            <Text style={{ fontSize: 15, fontFamily: "Inter_600SemiBold", color: activeTab === 'shops' ? themeColors.bg : themeColors.textSecondary }}>Shops</Text>
          </TouchableOpacity>
        </View>
      </View>

      {activeData.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40, marginTop: -50 }}>
          <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: isDark ? '#1E1E1E' : '#F1F5F9', justifyContent: 'center', alignItems: 'center', marginBottom: 24 }}>
            {activeTab === 'food' ? <Heart size={40} color="#EF4444" /> : <Store size={40} color={themeColors.textSecondary} />}
          </View>
          <Text style={{ fontSize: 22, fontFamily: "Inter_600SemiBold", color: themeColors.textPrimary, marginBottom: 8, textAlign: 'center' }}>No favorite {activeTab}</Text>
          <Text style={{ fontSize: 16, fontFamily: "Inter_400Regular", color: themeColors.textSecondary, textAlign: 'center', marginBottom: 32 }}>
            Save your favorite {activeTab === 'food' ? 'food items' : 'campus spots'} to easily find them later.
          </Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/search')} style={{ backgroundColor: themeColors.primary, paddingHorizontal: 32, paddingVertical: 16, borderRadius: 100, shadowColor: themeColors.primary, shadowOffset: {width:0, height:4}, shadowOpacity: 0.3, shadowRadius: 10 }} activeOpacity={0.8}>
            <Text style={{ fontSize: 16, fontFamily: "Inter_600SemiBold", color: "#FFFFFF" }}>Explore</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={activeData}
          renderItem={activeTab === 'food' ? renderFoodItem : renderShopItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 20 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}