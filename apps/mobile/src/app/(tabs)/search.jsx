import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Platform,
  useWindowDimensions,
  Animated,
  TextInput,
  StyleSheet
} from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter, useLocalSearchParams } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Search, 
  Star,
  MapPin,
  ShoppingCart,
  Coffee,
  Store,
  ChevronRight
} from "lucide-react-native";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";
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
  
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  useEffect(() => {
    loadCartItems();
  }, []);

  useEffect(() => {
    performSearch(searchText);
  }, [searchText, activeMode]);

  const loadCartItems = async () => {
    try {
      const items = await getCartItems();
      setCartItems(items);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddToCart = async (food) => {
    try {
      if (Platform.OS === 'ios') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const updatedCart = await addToCart(food, 1);
      setCartItems(updatedCart);
      if (Platform.OS === 'ios') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error(error);
    }
  };

  const performSearch = (query) => {
    const searchLower = query?.toLowerCase() || "";
    
    if (!searchLower.trim()) {
      setSearchResults({ 
        foods: activeMode === "food" ? allFoods.slice(0, 10) : [], 
        shops: activeMode === "shop" ? allShops.slice(0, 10) : [] 
      });
      return;
    }
    
    const matchingFoods = activeMode === "food" ? allFoods.filter(food => 
      food.name.toLowerCase().includes(searchLower) || 
      food.shop.toLowerCase().includes(searchLower)
    ) : [];
    
    const matchingShops = activeMode === "shop" ? allShops.filter(shop => 
      shop.name.toLowerCase().includes(searchLower) ||
      shop.location.toLowerCase().includes(searchLower)
    ) : [];
    
    setSearchResults({ foods: matchingFoods, shops: matchingShops });
  };

  const toggleMode = (mode) => {
    if (mode !== activeMode) {
      if (Platform.OS === 'ios') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setActiveMode(mode);
    }
  };

  if (!fontsLoaded) return null;

  const themeColors = {
    bg: isDark ? "#09090B" : "#F8FAFC",
    cardBg: isDark ? "#18181B" : "#FFFFFF",
    textPrimary: isDark ? "#FAFAFA" : "#0F172A",
    textSecondary: isDark ? "#A1A1AA" : "#64748B",
    primary: "#10B981", 
    primaryLight: isDark ? "rgba(16, 185, 129, 0.2)" : "#D1FAE5",
    border: isDark ? "#27272A" : "#F1F5F9",
  };

  // Card dimensions for 2 columns
  const padding = 20;
  const gap = 16;
  const cardWidth = (windowWidth - (padding * 2) - gap) / 2;

  return (
    <View style={{ flex: 1, backgroundColor: themeColors.bg, paddingTop: insets.top }}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Header Area */}
      <View style={{ paddingHorizontal: padding, paddingTop: 16, paddingBottom: 12 }}>
        
        {/* Search Bar */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            router.push({ pathname: "search-page", params: { mode: activeMode } });
            if (Platform.OS === 'ios') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: themeColors.cardBg,
            borderRadius: 100,
            paddingHorizontal: 20,
            paddingVertical: 14,
            borderWidth: 1,
            borderColor: themeColors.border,
            shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
            marginBottom: 20,
          }}
        >
          <Search size={20} color={themeColors.textSecondary} />
          <Text style={{ flex: 1, marginLeft: 12, fontSize: 16, fontFamily: "Inter_400Regular", color: searchText ? themeColors.textPrimary : themeColors.textSecondary }}>
            {searchText || (activeMode === "food" ? "Search for delicious food..." : "Search for campus shops...")}
          </Text>
        </TouchableOpacity>

        {/* Mode Selector (Sleek Pills) */}
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity
            onPress={() => toggleMode('food')}
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 12,
              borderRadius: 100,
              backgroundColor: activeMode === 'food' ? themeColors.textPrimary : themeColors.cardBg,
              borderWidth: 1,
              borderColor: activeMode === 'food' ? 'transparent' : themeColors.border,
            }}
          >
            <Coffee size={18} color={activeMode === 'food' ? themeColors.bg : themeColors.textSecondary} style={{ marginRight: 8 }} />
            <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 15, color: activeMode === 'food' ? themeColors.bg : themeColors.textSecondary }}>Food</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => toggleMode('shop')}
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 12,
              borderRadius: 100,
              backgroundColor: activeMode === 'shop' ? themeColors.textPrimary : themeColors.cardBg,
              borderWidth: 1,
              borderColor: activeMode === 'shop' ? 'transparent' : themeColors.border,
            }}
          >
            <Store size={18} color={activeMode === 'shop' ? themeColors.bg : themeColors.textSecondary} style={{ marginRight: 8 }} />
            <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 15, color: activeMode === 'shop' ? themeColors.bg : themeColors.textSecondary }}>Shops</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Grid Results */}
      <ScrollView 
        style={{ flex: 1 }} 
        contentContainerStyle={{ padding: padding, paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: gap }}>
          
          {/* FOOD CARDS */}
          {activeMode === "food" && searchResults.foods.map(food => (
            <TouchableOpacity
              key={food.id}
              activeOpacity={0.8}
              onPress={() => router.push(`/(tabs)/food/${food.id}`)}
              style={{
                width: cardWidth,
                backgroundColor: themeColors.cardBg,
                borderRadius: 24,
                overflow: 'hidden',
                borderWidth: 1,
                borderColor: themeColors.border,
                shadowColor: "#000", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.05, shadowRadius: 14, elevation: 3,
              }}
            >
              <View style={{ width: '100%', height: cardWidth }}>
                <Image source={{ uri: food.image }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.6)']}
                  style={StyleSheet.absoluteFillObject}
                />
                {/* Floating Add to Cart */}
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={(e) => { e.stopPropagation(); handleAddToCart(food); }}
                  style={{
                    position: 'absolute',
                    bottom: 12, right: 12,
                    backgroundColor: themeColors.primary,
                    width: 36, height: 36,
                    borderRadius: 18,
                    justifyContent: 'center', alignItems: 'center',
                    shadowColor: themeColors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
                  }}
                >
                  <ShoppingCart size={16} color="#FFF" />
                </TouchableOpacity>
              </View>
              
              <View style={{ padding: 12 }}>
                <Text style={{ fontSize: 15, fontFamily: "Inter_600SemiBold", color: themeColors.textPrimary, marginBottom: 4 }} numberOfLines={1}>
                  {food.name}
                </Text>
                <Text style={{ fontSize: 13, fontFamily: "Inter_500Medium", color: themeColors.textSecondary, marginBottom: 8 }} numberOfLines={1}>
                  {food.shop}
                </Text>
                <Text style={{ fontSize: 16, fontFamily: "Inter_600SemiBold", color: themeColors.primary }}>
                  ₹{food.price}
                </Text>
              </View>
            </TouchableOpacity>
          ))}

          {/* SHOP CARDS */}
          {activeMode === "shop" && searchResults.shops.map(shop => (
            <TouchableOpacity
              key={shop.id}
              activeOpacity={0.8}
              onPress={() => router.push(`/(tabs)/shop/${shop.id}`)}
              style={{
                width: cardWidth,
                backgroundColor: themeColors.cardBg,
                borderRadius: 24,
                overflow: 'hidden',
                borderWidth: 1,
                borderColor: themeColors.border,
                shadowColor: "#000", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.05, shadowRadius: 14, elevation: 3,
              }}
            >
              <View style={{ width: '100%', height: cardWidth }}>
                <Image source={{ uri: shop.image }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
                <View style={{
                  position: 'absolute',
                  top: 12, left: 12,
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  paddingHorizontal: 8, paddingVertical: 4,
                  borderRadius: 100,
                  flexDirection: 'row', alignItems: 'center'
                }}>
                  <Star size={12} color="#F59E0B" fill="#F59E0B" />
                  <Text style={{ color: '#FFF', fontSize: 12, fontFamily: "Inter_600SemiBold", marginLeft: 4 }}>{shop.rating}</Text>
                </View>
              </View>
              
              <View style={{ padding: 12 }}>
                <Text style={{ fontSize: 15, fontFamily: "Inter_600SemiBold", color: themeColors.textPrimary, marginBottom: 6 }} numberOfLines={1}>
                  {shop.name}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                  <MapPin size={12} color={themeColors.textSecondary} />
                  <Text style={{ fontSize: 12, fontFamily: "Inter_400Regular", color: themeColors.textSecondary, marginLeft: 4 }} numberOfLines={1}>
                    {shop.location}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Store size={12} color={themeColors.textSecondary} />
                  <Text style={{ fontSize: 12, fontFamily: "Inter_400Regular", color: themeColors.textSecondary, marginLeft: 4 }} numberOfLines={1}>
                    {shop.category}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}

          {((activeMode === "food" && searchResults.foods.length === 0) || 
            (activeMode === "shop" && searchResults.shops.length === 0)) && (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 60, width: '100%' }}>
              <Text style={{ fontSize: 16, fontFamily: "Inter_500Medium", color: themeColors.textSecondary }}>No results found</Text>
            </View>
          )}

        </View>
      </ScrollView>
    </View>
  );
}