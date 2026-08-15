import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Platform,
  useWindowDimensions,
  StyleSheet,
  Animated,
  Switch,
} from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter, useFocusEffect } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Search, Star, Plus, MapPin, Bell, ChevronRight, Flame, Sparkles, Bot, GraduationCap, Leaf } from "lucide-react-native";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";
import * as Haptics from 'expo-haptics';
import { addToCart, getCartItems } from '../../utils/cartUtils';
import { allShops, allFoods } from '../../data/mockData';
import ToastModal from '../../components/ui/ToastModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback } from 'react';

const ALL_CATEGORIES = ['🔥 Popular', '🍖 Non-Veg', '📚 Study Snacks', '⏱️ Quick Bites', '🥗 Healthy', '☕ Caffeine', '🍕 Pizza'];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { width: windowWidth } = useWindowDimensions();
  
  const [cartItems, setCartItems] = useState([]);
  const [isVegOnly, setIsVegOnly] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const [showToast, setShowToast] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState(null);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      const items = await getCartItems();
      setCartItems(items);
      const vegPref = await AsyncStorage.getItem('isVegOnly');
      if (vegPref !== null) {
        setIsVegOnly(JSON.parse(vegPref));
      }
    } catch (error) { console.error(error); }
  };

  const toggleVegOnly = async () => {
    try {
      if (Platform.OS === 'ios') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const newValue = !isVegOnly;
      setIsVegOnly(newValue);
      await AsyncStorage.setItem('isVegOnly', JSON.stringify(newValue));
    } catch (error) { console.error(error); }
  };

  // Filtered Data based on isVegOnly
  const displayedShops = isVegOnly ? allShops.filter(s => !s.isNonVeg) : allShops;
  const topShops = displayedShops.slice(0, 4);
  
  const displayedFoods = isVegOnly ? allFoods.filter(f => f.type === 'veg') : allFoods;
  const trendingFoods = displayedFoods.slice(0, 5);
  
  const healthyFoodsBase = displayedFoods.filter(food => food.category === 'Healthy');
  const healthyFoods = healthyFoodsBase.length > 0 ? healthyFoodsBase : displayedFoods.slice(2, 6);
  
  const nonVegFoods = allFoods.filter(f => f.type === 'non-veg').slice(0, 5);

  const handleAddToCart = async (food) => {
    try {
      if (Platform.OS === 'ios') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const updatedCart = await addToCart(food, 1);
      setCartItems(updatedCart);
      setLastAddedItem(food);
      setShowToast(true);
      if (Platform.OS === 'ios') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) { console.error(error); }
  };

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  if (!fontsLoaded) return null;

  const themeColors = {
    bg: isDark ? "#09090B" : "#F8FAFC",
    cardBg: isDark ? "#18181B" : "#FFFFFF",
    textPrimary: isDark ? "#FAFAFA" : "#0F172A",
    textSecondary: isDark ? "#A1A1AA" : "#64748B",
    primary: "#10B981", 
    border: isDark ? "#27272A" : "#E2E8F0",
  };

  const HEADER_IMAGE_HEIGHT = 380;

  const headerTranslateY = scrollY.interpolate({
    inputRange: [-100, 0, HEADER_IMAGE_HEIGHT],
    outputRange: [0, 0, -HEADER_IMAGE_HEIGHT / 2],
    extrapolate: 'clamp',
  });

  const headerScale = scrollY.interpolate({
    inputRange: [-100, 0],
    outputRange: [1.3, 1],
    extrapolateRight: 'clamp',
  });

  const SectionHeader = ({ title, icon: Icon, onSeeAll }) => (
    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", paddingHorizontal: 24, marginBottom: 20 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {Icon && <Icon size={24} color={themeColors.textPrimary} style={{ marginRight: 8 }} />}
        <Text style={{ fontSize: 22, fontFamily: "Inter_600SemiBold", color: themeColors.textPrimary, letterSpacing: -0.5 }}>{title}</Text>
      </View>
      {onSeeAll && (
        <TouchableOpacity onPress={onSeeAll} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: isDark ? '#27272A' : '#F1F5F9', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 100 }}>
          <Text style={{ fontSize: 13, fontFamily: "Inter_600SemiBold", color: themeColors.textPrimary, marginRight: 2 }}>All</Text>
          <ChevronRight size={14} color={themeColors.textPrimary} />
        </TouchableOpacity>
      )}
    </View>
  );

  const renderFoodCard = (food) => (
    <TouchableOpacity
      key={food.id}
      onPress={() => router.push(`/(tabs)/food/${food.id}`)}
      activeOpacity={0.9}
      style={{
        width: 170,
        backgroundColor: themeColors.cardBg,
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: themeColors.border,
      }}
    >
      <View style={{ width: '100%', height: 160 }}>
        <Image source={{ uri: food.image }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={StyleSheet.absoluteFillObject} />
        
        <View style={{ position: 'absolute', bottom: 12, left: 12, backgroundColor: 'rgba(255,255,255,0.25)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 100 }}>
          <Text style={{ fontSize: 13, fontFamily: "Inter_600SemiBold", color: "#FFF" }}>🪙 {food.price}</Text>
        </View>
      </View>
      
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 16, fontFamily: "Inter_600SemiBold", color: themeColors.textPrimary, marginBottom: 4, letterSpacing: -0.3 }} numberOfLines={1}>{food.name}</Text>
        <Text style={{ fontSize: 13, fontFamily: "Inter_500Medium", color: themeColors.textSecondary, marginBottom: 16 }} numberOfLines={1}>{food.shop}</Text>
        
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={(e) => { e.stopPropagation(); handleAddToCart(food); }}
          style={{
            backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.1)',
            flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
            paddingVertical: 10, borderRadius: 12,
          }}
        >
          <Plus size={16} color={themeColors.primary} style={{ marginRight: 4 }} />
          <Text style={{ fontSize: 14, fontFamily: "Inter_600SemiBold", color: themeColors.primary }}>Add</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: themeColors.bg }}>
      <StatusBar style="light" />

      {/* Background Parallax Image */}
      <Animated.View style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: HEADER_IMAGE_HEIGHT,
        transform: [{ translateY: headerTranslateY }, { scale: headerScale }],
        zIndex: 0,
      }}>
        <Image 
          source={require('../../../public/lpu.png')} 
          style={{ width: '100%', height: '100%' }} 
          contentFit="cover" 
        />
        <LinearGradient 
          colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0)']} 
          style={StyleSheet.absoluteFillObject} 
        />
      </Animated.View>

      <Animated.ScrollView 
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        scrollEventThrottle={16}
        style={{ flex: 1, zIndex: 1 }}
        showsVerticalScrollIndicator={false}
      >
        
        {/* Transparent Header Area Inside ScrollView */}
        <View style={{ paddingTop: insets.top + 16, paddingHorizontal: 24, height: HEADER_IMAGE_HEIGHT - 60, justifyContent: 'space-between' }}>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 100 }}>
              <GraduationCap size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={{ color: '#FFFFFF', fontFamily: "Inter_500Medium", fontSize: 13 }}>LPU Campus</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/notifications')} style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: 12, borderRadius: 100 }}>
              <Bell size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={{ paddingBottom: 40 }}>
            <Text style={{ fontSize: 16, fontFamily: "Inter_500Medium", color: "#E5E7EB", marginBottom: 6 }}>Welcome back, Student</Text>
            <Text style={{ fontSize: 34, fontFamily: "Inter_600SemiBold", color: "#FFFFFF", letterSpacing: -1, lineHeight: 40 }}>Grab a bite between classes.</Text>
          </View>

        </View>

        {/* Solid Content Area (Bottom Sheet Feel) */}
        <View style={{ backgroundColor: themeColors.bg, borderTopLeftRadius: 36, borderTopRightRadius: 36, paddingBottom: insets.bottom + 100 }}>
          
          {/* Overlapping Glass Search Bar */}
          <View style={{ paddingHorizontal: 24, marginTop: -32, marginBottom: 32 }}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => router.push('/(tabs)/search')}
              style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.15, shadowRadius: 24, elevation: 10 }}
            >
              <BlurView intensity={100} tint={isDark ? "dark" : "light"} style={{
                flexDirection: 'row', alignItems: 'center',
                borderRadius: 24, paddingHorizontal: 20, paddingVertical: 18,
                borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.8)',
                overflow: 'hidden',
                backgroundColor: isDark ? 'rgba(24, 24, 27, 0.8)' : 'rgba(255, 255, 255, 0.85)'
              }}>
                <Search size={22} color={isDark ? "#FAFAFA" : "#0F172A"} />
                <Text style={{ flex: 1, marginLeft: 16, fontSize: 16, fontFamily: "Inter_500Medium", color: isDark ? "#A1A1AA" : "#64748B" }}>
                  Search stalls & food...
                </Text>
                <View style={{ backgroundColor: themeColors.primary, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 100 }}>
                  <Text style={{ color: '#FFF', fontFamily: 'Inter_600SemiBold', fontSize: 14 }}>Find</Text>
                </View>
              </BlurView>
            </TouchableOpacity>
          </View>

          {/* Categories */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 32, gap: 12 }}>
            <TouchableOpacity onPress={toggleVegOnly} style={{
                backgroundColor: isVegOnly ? themeColors.primary : themeColors.cardBg,
                paddingHorizontal: 16, paddingVertical: 12, borderRadius: 100,
                borderWidth: 1, borderColor: isVegOnly ? 'transparent' : themeColors.border,
                flexDirection: 'row', alignItems: 'center'
              }}>
                <View style={{ width: 12, height: 12, borderRadius: 2, borderWidth: 1, borderColor: isVegOnly ? '#FFF' : themeColors.primary, justifyContent: 'center', alignItems: 'center', marginRight: 8, backgroundColor: '#FFF' }}>
                   <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: themeColors.primary }} />
                </View>
                <Text style={{ fontSize: 15, fontFamily: "Inter_600SemiBold", color: isVegOnly ? '#FFF' : themeColors.textPrimary }}>Pure Veg</Text>
            </TouchableOpacity>

            {ALL_CATEGORIES.filter(cat => !isVegOnly || cat !== '🍖 Non-Veg').map((cat, index) => (
              <TouchableOpacity key={index} style={{
                backgroundColor: themeColors.cardBg,
                paddingHorizontal: 20, paddingVertical: 12, borderRadius: 100,
                borderWidth: 1, borderColor: themeColors.border,
              }}>
                <Text style={{ fontSize: 15, fontFamily: "Inter_600SemiBold", color: themeColors.textPrimary }}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Magical AI Assistant Section */}
          <View style={{ paddingHorizontal: 24, marginBottom: 40 }}>
            <View style={{ borderRadius: 28, overflow: 'hidden', backgroundColor: themeColors.primary }}>
              <LinearGradient colors={['#10B981', '#059669', '#047857']} start={{x: 0, y: 0}} end={{x: 1, y: 1}} style={StyleSheet.absoluteFillObject} />
              <View style={{ position: 'absolute', top: -30, right: -20, width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.1)' }} />
              
              <View style={{ padding: 24, flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1, marginRight: 16 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <Sparkles size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
                    <Text style={{ fontSize: 14, fontFamily: "Inter_600SemiBold", color: "rgba(255,255,255,0.9)", textTransform: 'uppercase', letterSpacing: 1 }}>Campus AI</Text>
                  </View>
                  <Text style={{ fontSize: 24, fontFamily: "Inter_600SemiBold", color: "#FFFFFF", marginBottom: 8, lineHeight: 30, letterSpacing: -0.5 }}>
                    Can't decide what to eat?
                  </Text>
                  <Text style={{ fontSize: 14, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.9)", marginBottom: 16 }}>
                    Ask our AI to find the best momos, cheapest coffee, or fastest meals near the library.
                  </Text>
                  <TouchableOpacity activeOpacity={0.8} style={{ backgroundColor: "#FFFFFF", alignSelf: "flex-start", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 100, flexDirection: 'row', alignItems: 'center' }}>
                    <Bot size={18} color="#059669" style={{ marginRight: 6 }} />
                    <Text style={{ fontSize: 14, fontFamily: "Inter_600SemiBold", color: "#059669" }}>Ask AI Assistant</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          {/* Popular Campus Spots */}
          <View style={{ marginBottom: 40 }}>
            <SectionHeader title="Popular Campus Spots" icon={Star} onSeeAll={() => router.push({ pathname: "/(tabs)/search", params: { mode: "shop" }})} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} snapToInterval={windowWidth * 0.85 + 20} decelerationRate="fast" contentContainerStyle={{ paddingHorizontal: 24, gap: 20 }}>
              {topShops.map(shop => (
                <TouchableOpacity
                  key={shop.id}
                  onPress={() => router.push(`/(tabs)/shop/${shop.id}`)}
                  activeOpacity={0.9}
                  style={{
                    width: windowWidth * 0.85,
                    height: 240,
                    borderRadius: 32,
                    overflow: 'hidden',
                    backgroundColor: themeColors.cardBg,
                    borderWidth: 1, borderColor: themeColors.border,
                  }}
                >
                  <Image source={{ uri: shop.image }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
                  <LinearGradient colors={['transparent', 'rgba(0,0,0,0.9)']} style={StyleSheet.absoluteFillObject} />
                  
                  <View style={{ position: 'absolute', top: 16, right: 16, backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 100, flexDirection: 'row', alignItems: 'center' }}>
                    <Star size={14} color="#F59E0B" fill="#F59E0B" />
                    <Text style={{ color: '#FFF', fontSize: 13, fontFamily: "Inter_600SemiBold", marginLeft: 6 }}>{shop.rating}</Text>
                  </View>

                  <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 24 }}>
                    <Text style={{ fontSize: 24, fontFamily: "Inter_600SemiBold", color: "#FFFFFF", marginBottom: 6, letterSpacing: -0.5 }}>{shop.name}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <MapPin size={14} color="#A1A1AA" />
                      <Text style={{ fontSize: 14, fontFamily: "Inter_500Medium", color: "#E5E7EB", marginLeft: 6 }}>{shop.location}</Text>
                      <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: "#64748B", marginHorizontal: 10 }} />
                      <Text style={{ fontSize: 14, fontFamily: "Inter_500Medium", color: "#E5E7EB" }}>{shop.category}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Student Favorites */}
          <View style={{ marginBottom: 40 }}>
            <SectionHeader title="Student Favorites" icon={Flame} onSeeAll={() => router.push({ pathname: "/(tabs)/search", params: { mode: "food" }})} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, gap: 20 }}>
              {trendingFoods.map(food => renderFoodCard(food))}
            </ScrollView>
          </View>

          {/* Healthy Options */}
          <View style={{ marginBottom: 40 }}>
            <SectionHeader title="Healthy Options" icon={Leaf} onSeeAll={() => router.push({ pathname: "/(tabs)/search", params: { mode: "food" }})} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, gap: 20 }}>
              {healthyFoods.map(food => renderFoodCard(food))}
            </ScrollView>
          </View>

          {/* Non-Veg Options */}
          {!isVegOnly && (
            <View style={{ marginBottom: 40 }}>
              <SectionHeader title="Non-Veg Delights" icon={Flame} onSeeAll={() => router.push({ pathname: "/(tabs)/search", params: { mode: "food" }})} />
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, gap: 20 }}>
                {nonVegFoods.map(food => renderFoodCard(food))}
              </ScrollView>
            </View>
          )}

        </View>
      </Animated.ScrollView>

      {/* Global Toast */}
      <ToastModal visible={showToast} item={lastAddedItem} onClose={() => setShowToast(false)} />
    </View>
  );
}