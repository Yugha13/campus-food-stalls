import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Platform,
  Alert,
  StyleSheet
} from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import { 
  ArrowLeft, 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingCart,
  Store,
  Wallet
} from "lucide-react-native";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold
} from "@expo-google-fonts/inter";
import { useState, useCallback } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { useFocusEffect } from "expo-router";

export default function CartPage() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
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

  useFocusEffect(
    useCallback(() => {
      loadCart();
    }, [])
  );

  const loadCart = async () => {
    try {
      const cartData = await AsyncStorage.getItem('cartItems');
      if (cartData) {
        setCartItems(JSON.parse(cartData));
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveCart = async (items) => {
    try {
      await AsyncStorage.setItem('cartItems', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (Platform.OS === 'ios') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (newQuantity <= 0) {
      removeItem(itemId);
      return;
    }

    const updatedItems = cartItems.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    
    setCartItems(updatedItems);
    await saveCart(updatedItems);
  };

  const removeItem = async (itemId) => {
    if (Platform.OS === 'ios') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const updatedItems = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedItems);
    await saveCart(updatedItems);
  };

  const clearCart = () => {
    Alert.alert(
      "Clear Cart",
      "Are you sure you want to remove all items from your cart?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            setCartItems([]);
            await saveCart([]);
            if (Platform.OS === 'ios') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }
        }
      ]
    );
  };

  const getTotalPrice = () => cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const getTotalItems = () => cartItems.reduce((total, item) => total + item.quantity, 0);
  const getConvenienceFee = () => Math.round(getTotalPrice() * 0.03);
  const getFinalTotal = () => getTotalPrice() + getConvenienceFee();

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    
    const currentHour = new Date().getHours();
    if (currentHour < 9 || currentHour >= 22) {
      Alert.alert(
        "Checkout Not Available",
        "Checkout is only available between 9:00 AM and 10:00 PM.",
        [{ text: "OK", style: "default" }]
      );
      return;
    }
    
    router.push('/checkout-step1');
  };

  if (!fontsLoaded || isLoading) return null;

  return (
    <View style={{ flex: 1, backgroundColor: themeColors.bg }}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Header */}
      <View style={{ paddingTop: insets.top + 16, paddingHorizontal: 20, paddingBottom: 16, backgroundColor: themeColors.bg, borderBottomWidth: 1, borderBottomColor: themeColors.border, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginRight: 8, borderRadius: 12, backgroundColor: themeColors.cardBg, borderWidth: 1, borderColor: themeColors.border }} activeOpacity={0.7}>
            <ArrowLeft size={20} color={themeColors.textPrimary} />
          </TouchableOpacity>
          <Text style={{ fontSize: 20, fontFamily: "Inter_600SemiBold", color: themeColors.textPrimary }}>Cart ({getTotalItems()})</Text>
        </View>
        
        {cartItems.length > 0 && (
          <TouchableOpacity onPress={clearCart} style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 100, backgroundColor: 'rgba(239, 68, 68, 0.1)' }} activeOpacity={0.7}>
            <Text style={{ fontSize: 14, fontFamily: "Inter_600SemiBold", color: "#EF4444" }}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {cartItems.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 }}>
          <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: isDark ? '#1E1E1E' : '#F1F5F9', justifyContent: 'center', alignItems: 'center', marginBottom: 24 }}>
            <ShoppingCart size={40} color={themeColors.textSecondary} />
          </View>
          <Text style={{ fontSize: 22, fontFamily: "Inter_600SemiBold", color: themeColors.textPrimary, marginBottom: 8, textAlign: 'center' }}>Your cart is empty</Text>
          <Text style={{ fontSize: 16, fontFamily: "Inter_400Regular", color: themeColors.textSecondary, textAlign: 'center', marginBottom: 32 }}>Add some delicious food items to get started with your order.</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/search')} style={{ backgroundColor: themeColors.primary, paddingHorizontal: 32, paddingVertical: 16, borderRadius: 100, shadowColor: themeColors.primary, shadowOffset: {width:0, height:4}, shadowOpacity: 0.3, shadowRadius: 10 }} activeOpacity={0.8}>
            <Text style={{ fontSize: 16, fontFamily: "Inter_600SemiBold", color: "#FFFFFF" }}>Explore Food</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 250 }} showsVerticalScrollIndicator={false}>
            {cartItems.map((item) => (
              <View key={item.id} style={{ backgroundColor: themeColors.cardBg, borderRadius: 24, padding: 12, marginBottom: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2, borderWidth: 1, borderColor: themeColors.border }}>
                <View style={{ flexDirection: "row" }}>
                  <Image source={{ uri: item.image }} style={{ width: 90, height: 90, borderRadius: 16, marginRight: 16 }} contentFit="cover" />
                  
                  <View style={{ flex: 1, justifyContent: 'space-between', paddingVertical: 4 }}>
                    <View>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Text style={{ flex: 1, fontSize: 16, fontFamily: "Inter_600SemiBold", color: themeColors.textPrimary, marginBottom: 4 }} numberOfLines={1}>{item.name}</Text>
                        <TouchableOpacity onPress={() => removeItem(item.id)} style={{ padding: 4, backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: 8 }}>
                          <Trash2 size={16} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                      <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Store size={12} color={themeColors.textSecondary} />
                        <Text style={{ fontSize: 13, fontFamily: "Inter_500Medium", color: themeColors.textSecondary, marginLeft: 4 }}>{item.shop}</Text>
                      </View>
                    </View>
                    
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
                      <Text style={{ fontSize: 18, fontFamily: "Inter_700Bold", color: themeColors.coin }}>🪙 {item.price * item.quantity}</Text>
                      
                      <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: isDark ? "#27272A" : "#F1F5F9", borderRadius: 100, padding: 4 }}>
                        <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity - 1)} style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: themeColors.cardBg, justifyContent: 'center', alignItems: 'center', shadowColor: "#000", shadowOffset: {width:0,height:1}, shadowOpacity:0.1, shadowRadius:2 }} activeOpacity={0.7}>
                          <Minus size={14} color={themeColors.textPrimary} />
                        </TouchableOpacity>
                        <Text style={{ fontSize: 15, fontFamily: "Inter_600SemiBold", color: themeColors.textPrimary, marginHorizontal: 12, minWidth: 20, textAlign: 'center' }}>{item.quantity}</Text>
                        <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity + 1)} style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: themeColors.cardBg, justifyContent: 'center', alignItems: 'center', shadowColor: "#000", shadowOffset: {width:0,height:1}, shadowOpacity:0.1, shadowRadius:2 }} activeOpacity={0.7}>
                          <Plus size={14} color={themeColors.textPrimary} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
          
          {/* Bottom Checkout Section */}
          <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: themeColors.cardBg, paddingHorizontal: 24, paddingTop: 20, paddingBottom: insets.bottom + 16, borderTopWidth: 1, borderTopColor: themeColors.border, shadowColor: "#000", shadowOffset: { width: 0, height: -10 }, shadowOpacity: 0.05, shadowRadius: 20, elevation: 15 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 12 }}>
              <Text style={{ fontSize: 15, fontFamily: "Inter_500Medium", color: themeColors.textSecondary }}>Subtotal</Text>
              <Text style={{ fontSize: 15, fontFamily: "Inter_600SemiBold", color: themeColors.textPrimary }}>🪙 {getTotalPrice()}</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 16 }}>
              <Text style={{ fontSize: 15, fontFamily: "Inter_500Medium", color: themeColors.textSecondary }}>Platform Fee</Text>
              <Text style={{ fontSize: 15, fontFamily: "Inter_600SemiBold", color: themeColors.textPrimary }}>🪙 {getConvenienceFee()}</Text>
            </View>
            
            <View style={{ height: 1, backgroundColor: themeColors.border, marginBottom: 16 }} />
            
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <Text style={{ fontSize: 18, fontFamily: "Inter_700Bold", color: themeColors.textPrimary }}>Total</Text>
              <Text style={{ fontSize: 24, fontFamily: "Inter_700Bold", color: themeColors.coin }}>🪙 {getFinalTotal()}</Text>
            </View>
            
            <TouchableOpacity onPress={handleCheckout} style={{ backgroundColor: themeColors.textPrimary, paddingVertical: 18, borderRadius: 100, flexDirection: "row", justifyContent: "center", alignItems: "center", shadowColor: themeColors.textPrimary, shadowOffset: {width:0, height:8}, shadowOpacity: 0.2, shadowRadius: 15 }} activeOpacity={0.9}>
              <Wallet size={20} color={themeColors.bg} style={{ marginRight: 10 }} />
              <Text style={{ fontSize: 16, fontFamily: "Inter_600SemiBold", color: themeColors.bg }}>Pay with LPU Wallet</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}