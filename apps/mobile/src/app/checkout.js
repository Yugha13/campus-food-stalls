import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Platform,
  Alert,
  TextInput,
} from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  CreditCard,
  Store,
  CheckCircle,
  Users,
  Calendar
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

export default function CheckoutPage() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [orderType, setOrderType] = useState("Dine-in"); // Default to Dine-in
  const [deliveryAddress, setDeliveryAddress] = useState("Block A, Room 205");
  const [paymentMethod, setPaymentMethod] = useState("Online Payment");
  const [specialInstructions, setSpecialInstructions] = useState("");
  
  // Set current time as default
  const [orderTime, setOrderTime] = useState(() => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  });
  
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

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getConvenienceCharge = () => {
    return Math.round(getTotalPrice() * 0.03);
  };

  const getFinalTotal = () => {
    return getTotalPrice() + getConvenienceCharge();
  };

  const placeOrder = async () => {
    if (cartItems.length === 0) {
      Alert.alert("Error", "Your cart is empty");
      return;
    }

    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    // Create order object
    const order = {
      id: `ORD${Date.now()}`,
      items: cartItems,
      totalAmount: getFinalTotal(),
      convenienceCharge: getConvenienceCharge(),
      subtotal: getTotalPrice(),
      status: "preparing",
      orderDate: new Date().toISOString(),
      orderType: orderType,
      deliveryAddress: orderType === "Delivery" ? deliveryAddress : null,
      paymentMethod: paymentMethod,
      specialInstructions: specialInstructions,
      orderTime: orderTime,
      estimatedDelivery: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes from now
    };

    try {
      // Save order to order history
      const existingOrders = await AsyncStorage.getItem('orderHistory');
      const orders = existingOrders ? JSON.parse(existingOrders) : [];
      orders.unshift(order); // Add to beginning of array
      await AsyncStorage.setItem('orderHistory', JSON.stringify(orders));

      // Clear cart
      await AsyncStorage.setItem('cartItems', JSON.stringify([]));

      if (Platform.OS === 'ios') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      // Navigate to order details
      router.replace(`/order-details/${order.id}`);
    } catch (error) {
      console.error('Error placing order:', error);
      Alert.alert("Error", "Failed to place order. Please try again.");
    }
  };

  const orderTypes = ["Dine-in", "Pickup", "Delivery"];
  const paymentMethods = ["Online Payment", "Cash on Delivery"];

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
          alignItems: "center"
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
          }}>
            Checkout
          </Text>
        </View>
      </View>

      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ 
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: 120,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Order Type Selection */}
        <View style={{
          backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
          borderRadius: 16,
          padding: 16,
          marginBottom: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
        }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
            <Store size={20} color={isDark ? "#22C55E" : "#22C55E"} />
            <Text style={{
              fontSize: 16,
              fontFamily: "Inter_600SemiBold",
              color: isDark ? "#FFFFFF" : "#000000",
              marginLeft: 8,
            }}>
              Order Type
            </Text>
          </View>
          
          <View style={{ flexDirection: "row", gap: 8 }}>
            {orderTypes.map((type) => (
              <TouchableOpacity
                key={type}
                onPress={() => setOrderType(type)}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderRadius: 12,
                  borderWidth: 1.5,
                  borderColor: orderType === type ? "#22C55E" : (isDark ? "#374151" : "#E5E7EB"),
                  backgroundColor: orderType === type ? "rgba(34, 197, 94, 0.1)" : "transparent",
                }}
                activeOpacity={0.7}
              >
                <Text style={{
                  fontSize: 14,
                  fontFamily: "Inter_600SemiBold",
                  color: orderType === type ? "#22C55E" : (isDark ? "#FFFFFF" : "#000000"),
                  textAlign: "center",
                }}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Order Time */}
        <View style={{
          backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
          borderRadius: 16,
          padding: 16,
          marginBottom: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
        }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
            <Clock size={20} color={isDark ? "#22C55E" : "#22C55E"} />
            <Text style={{
              fontSize: 16,
              fontFamily: "Inter_600SemiBold",
              color: isDark ? "#FFFFFF" : "#000000",
              marginLeft: 8,
            }}>
              Order Time
            </Text>
          </View>
          
          <Text style={{
            fontSize: 16,
            fontFamily: "Inter_500Medium",
            color: "#22C55E",
            backgroundColor: isDark ? "#374151" : "#F3F4F6",
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 12,
            textAlign: "center",
          }}>
            Now ({orderTime})
          </Text>
        </View>

        {/* Delivery Address (only for delivery) */}
        {orderType === "Delivery" && (
          <View style={{
            backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
            borderRadius: 16,
            padding: 16,
            marginBottom: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
          }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
              <MapPin size={20} color={isDark ? "#22C55E" : "#22C55E"} />
              <Text style={{
                fontSize: 16,
                fontFamily: "Inter_600SemiBold",
                color: isDark ? "#FFFFFF" : "#000000",
                marginLeft: 8,
              }}>
                Delivery Address
              </Text>
            </View>
            
            <TextInput
              value={deliveryAddress}
              onChangeText={setDeliveryAddress}
              placeholder="Enter your delivery address"
              placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
              style={{
                fontSize: 16,
                fontFamily: "Inter_400Regular",
                color: isDark ? "#FFFFFF" : "#000000",
                backgroundColor: isDark ? "#374151" : "#F3F4F6",
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: isDark ? "#4B5563" : "#D1D5DB",
              }}
              multiline
            />
          </View>
        )}

        {/* Payment Method */}
        <View style={{
          backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
          borderRadius: 16,
          padding: 16,
          marginBottom: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
        }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
            <CreditCard size={20} color={isDark ? "#22C55E" : "#22C55E"} />
            <Text style={{
              fontSize: 16,
              fontFamily: "Inter_600SemiBold",
              color: isDark ? "#FFFFFF" : "#000000",
              marginLeft: 8,
            }}>
              Payment Method
            </Text>
          </View>
          
          <View style={{ gap: 8 }}>
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method}
                onPress={() => setPaymentMethod(method)}
                style={{
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderRadius: 12,
                  borderWidth: 1.5,
                  borderColor: paymentMethod === method ? "#22C55E" : (isDark ? "#374151" : "#E5E7EB"),
                  backgroundColor: paymentMethod === method ? "rgba(34, 197, 94, 0.1)" : "transparent",
                  flexDirection: "row",
                  alignItems: "center",
                }}
                activeOpacity={0.7}
              >
                <View style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: paymentMethod === method ? "#22C55E" : (isDark ? "#9CA3AF" : "#D1D5DB"),
                  backgroundColor: paymentMethod === method ? "#22C55E" : "transparent",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                }}>
                  {paymentMethod === method && (
                    <CheckCircle size={12} color="#FFFFFF" />
                  )}
                </View>
                <Text style={{
                  fontSize: 14,
                  fontFamily: "Inter_500Medium",
                  color: paymentMethod === method ? "#22C55E" : (isDark ? "#FFFFFF" : "#000000"),
                }}>
                  {method}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Special Instructions */}
        <View style={{
          backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
          borderRadius: 16,
          padding: 16,
          marginBottom: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
        }}>
          <Text style={{
            fontSize: 16,
            fontFamily: "Inter_600SemiBold",
            color: isDark ? "#FFFFFF" : "#000000",
            marginBottom: 12,
          }}>
            Special Instructions (Optional)
          </Text>
          
          <TextInput
            value={specialInstructions}
            onChangeText={setSpecialInstructions}
            placeholder="Add any special instructions for your order..."
            placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
            style={{
              fontSize: 14,
              fontFamily: "Inter_400Regular",
              color: isDark ? "#FFFFFF" : "#000000",
              backgroundColor: isDark ? "#374151" : "#F3F4F6",
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: isDark ? "#4B5563" : "#D1D5DB",
              minHeight: 80,
              textAlignVertical: "top",
            }}
            multiline
          />
        </View>

        {/* Order Summary */}
        <View style={{
          backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
          borderRadius: 16,
          padding: 16,
          marginBottom: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
        }}>
          <Text style={{
            fontSize: 16,
            fontFamily: "Inter_600SemiBold",
            color: isDark ? "#FFFFFF" : "#000000",
            marginBottom: 12,
          }}>
            Order Summary
          </Text>
          
          {cartItems.map((item) => (
            <View
              key={item.id}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <Text style={{
                fontSize: 14,
                fontFamily: "Inter_400Regular",
                color: isDark ? "#E5E7EB" : "#374151",
                flex: 1,
              }}>
                {item.name} × {item.quantity}
              </Text>
              <Text style={{
                fontSize: 14,
                fontFamily: "Inter_500Medium",
                color: isDark ? "#FFFFFF" : "#000000",
              }}>
                ₹{item.price * item.quantity}
              </Text>
            </View>
          ))}
          
          <View style={{
            height: 1,
            backgroundColor: isDark ? "#374151" : "#E5E7EB",
            marginVertical: 12,
          }} />
          
          <View style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
          }}>
            <Text style={{
              fontSize: 14,
              fontFamily: "Inter_400Regular",
              color: isDark ? "#9CA3AF" : "#6B7280",
            }}>
              Subtotal
            </Text>
            <Text style={{
              fontSize: 14,
              fontFamily: "Inter_500Medium",
              color: isDark ? "#FFFFFF" : "#000000",
            }}>
              ₹{getTotalPrice()}
            </Text>
          </View>
          
          <View style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}>
            <Text style={{
              fontSize: 14,
              fontFamily: "Inter_400Regular",
              color: isDark ? "#9CA3AF" : "#6B7280",
            }}>
              Convenience charge (3%)
            </Text>
            <Text style={{
              fontSize: 14,
              fontFamily: "Inter_500Medium",
              color: isDark ? "#FFFFFF" : "#000000",
            }}>
              ₹{getConvenienceCharge()}
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
              color: isDark ? "#FFFFFF" : "#000000",
            }}>
              Total
            </Text>
            <Text style={{
              fontSize: 20,
              fontFamily: "Inter_600SemiBold",
              color: "#22C55E",
            }}>
              ₹{getFinalTotal()}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Place Order Button */}
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
        <TouchableOpacity
          onPress={placeOrder}
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
          <CheckCircle size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={{
            fontSize: 16,
            fontFamily: "Inter_600SemiBold",
            color: "#FFFFFF",
          }}>
            Place Order (₹{getFinalTotal()})
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}