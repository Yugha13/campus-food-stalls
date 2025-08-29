import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Platform,
  Alert,
} from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { 
  ArrowLeft, 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingCart,
  Store,
  CreditCard
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
  });

  useEffect(() => {
    loadCart();
  }, []);

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
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

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
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    const updatedItems = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedItems);
    await saveCart(updatedItems);
  };

  const clearCart = () => {
    Alert.alert(
      "Clear Cart",
      "Are you sure you want to remove all items from your cart?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            setCartItems([]);
            await saveCart([]);
            if (Platform.OS === 'ios') {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
          }
        }
      ]
    );
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    
    // Navigate to checkout or place order
    router.push('/checkout');
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
              Cart ({getTotalItems()})
            </Text>
          </View>
          
          {cartItems.length > 0 && (
            <TouchableOpacity
              onPress={clearCart}
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

      {cartItems.length === 0 ? (
        /* Empty Cart */
        <View style={{ 
          flex: 1, 
          justifyContent: 'center', 
          alignItems: 'center',
          paddingHorizontal: 40,
        }}>
          <ShoppingCart size={64} color={isDark ? "#9CA3AF" : "#6B7280"} />
          <Text style={{
            fontSize: 20,
            fontFamily: "Inter_600SemiBold",
            color: isDark ? "#FFFFFF" : "#000000",
            marginTop: 16,
            textAlign: 'center',
          }}>
            Your cart is empty
          </Text>
          <Text style={{
            fontSize: 16,
            fontFamily: "Inter_400Regular",
            color: isDark ? "#9CA3AF" : "#6B7280",
            marginTop: 8,
            textAlign: 'center',
            lineHeight: 24,
          }}>
            Add some delicious food items to get started
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
              Browse Food
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* Cart Items */
        <>
          <ScrollView 
            style={{ flex: 1 }}
            contentContainerStyle={{ 
              paddingHorizontal: 20,
              paddingTop: 16,
              paddingBottom: 120,
            }}
            showsVerticalScrollIndicator={false}
          >
            {cartItems.map((item) => (
              <View
                key={item.id}
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
                    source={{ uri: item.image }}
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
                      {item.name}
                    </Text>
                    
                    <View style={{ 
                      flexDirection: "row", 
                      alignItems: "center", 
                      marginBottom: 8 
                    }}>
                      <Store size={14} color={isDark ? "#9CA3AF" : "#6B7280"} />
                      <Text style={{
                        fontSize: 14,
                        fontFamily: "Inter_400Regular",
                        color: isDark ? "#9CA3AF" : "#6B7280",
                        marginLeft: 4,
                      }}>
                        {item.shop}
                      </Text>
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
                        ₹{item.price * item.quantity}
                      </Text>
                      
                      <View style={{
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: isDark ? "#374151" : "#F3F4F6",
                        borderRadius: 8,
                        padding: 4,
                      }}>
                        <TouchableOpacity
                          onPress={() => updateQuantity(item.id, item.quantity - 1)}
                          style={{
                            padding: 8,
                            borderRadius: 6,
                          }}
                          activeOpacity={0.7}
                        >
                          <Minus size={16} color={isDark ? "#FFFFFF" : "#000000"} />
                        </TouchableOpacity>
                        
                        <Text style={{
                          fontSize: 16,
                          fontFamily: "Inter_600SemiBold",
                          color: isDark ? "#FFFFFF" : "#000000",
                          marginHorizontal: 16,
                          minWidth: 20,
                          textAlign: 'center',
                        }}>
                          {item.quantity}
                        </Text>
                        
                        <TouchableOpacity
                          onPress={() => updateQuantity(item.id, item.quantity + 1)}
                          style={{
                            padding: 8,
                            borderRadius: 6,
                          }}
                          activeOpacity={0.7}
                        >
                          <Plus size={16} color={isDark ? "#FFFFFF" : "#000000"} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                  
                  <TouchableOpacity
                    onPress={() => removeItem(item.id)}
                    style={{
                      padding: 8,
                      borderRadius: 8,
                      alignSelf: 'flex-start',
                    }}
                    activeOpacity={0.7}
                  >
                    <Trash2 size={18} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
          
          {/* Checkout Section */}
          <View style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: insets.bottom + 16,
            borderTopWidth: 1,
            borderTopColor: isDark ? "#374151" : "#E5E7EB",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 10,
          }}>
            <View style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}>
              <Text style={{
                fontSize: 16,
                fontFamily: "Inter_500Medium",
                color: isDark ? "#E5E7EB" : "#374151",
              }}>
                Total ({getTotalItems()} items)
              </Text>
              <Text style={{
                fontSize: 20,
                fontFamily: "Inter_600SemiBold",
                color: "#22C55E",
              }}>
                ₹{getTotalPrice()}
              </Text>
            </View>
            
            <TouchableOpacity
              onPress={handleCheckout}
              style={{
                backgroundColor: "#22C55E",
                paddingVertical: 16,
                borderRadius: 12,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
              activeOpacity={0.8}
            >
              <CreditCard size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={{
                fontSize: 16,
                fontFamily: "Inter_600SemiBold",
                color: "#FFFFFF",
              }}>
                Proceed to Checkout
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}