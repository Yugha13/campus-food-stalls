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
import { useRouter, useLocalSearchParams } from "expo-router";
import { 
  ArrowLeft, 
  CreditCard,
  Smartphone,
  CheckCircle,
  Info
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

export default function CheckoutStep3() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { orderType, orderTime } = useLocalSearchParams();
  
  const [cartItems, setCartItems] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState("Online Payment");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  
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
    }
  };

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

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getConvenienceCharge = () => {
    return Math.round(getSubtotal() * 0.03);
  };

  const getTotalAmount = () => {
    return getSubtotal() + getConvenienceCharge();
  };

  const paymentMethods = [
    {
      id: "Online Payment",
      title: "Online Payment",
      subtitle: "Pay via UPI, Cards, or Wallets",
      icon: CreditCard,
      color: "#3B82F6"
    },
    {
      id: "Cash on Delivery",
      title: "Cash on Delivery",
      subtitle: "Pay when you receive",
      icon: Smartphone,
      color: "#22C55E"
    }
  ];

  const handlePaymentSelect = (method) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedPayment(method);
  };

  const placeOrder = async () => {
    if (cartItems.length === 0) {
      Alert.alert("Error", "Your cart is empty");
      return;
    }

    setIsPlacingOrder(true);

    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    // Create order object
    const order = {
      id: `ORD${Date.now()}`,
      items: cartItems,
      totalAmount: getTotalAmount(),
      convenienceCharge: getConvenienceCharge(),
      subtotal: getSubtotal(),
      status: "preparing",
      orderDate: new Date().toISOString(),
      orderType: orderType || "Dine-in",
      paymentMethod: selectedPayment,
      orderTime: orderTime || "ASAP",
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
    } finally {
      setIsPlacingOrder(false);
    }
  };

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
              Review & Pay
            </Text>
          </View>
          
          <View style={{
            backgroundColor: isDark ? "#1E1E1E" : "#F3F4F6",
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 12,
          }}>
            <Text style={{
              fontSize: 14,
              fontFamily: "Inter_500Medium",
              color: isDark ? "#9CA3AF" : "#6B7280",
            }}>
              Step 3 of 3
            </Text>
          </View>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={{
        paddingHorizontal: 20,
        paddingVertical: 16,
      }}>
        <View style={{
          height: 4,
          backgroundColor: isDark ? "#1E1E1E" : "#E5E7EB",
          borderRadius: 2,
          overflow: 'hidden',
        }}>
          <View style={{
            height: '100%',
            width: '100%',
            backgroundColor: "#22C55E",
            borderRadius: 2,
          }} />
        </View>
      </View>

      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ 
          paddingHorizontal: 20, 
          paddingTop: 20,
          paddingBottom: 160
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Order Summary */}
        <View style={{
          backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
          borderRadius: 16,
          padding: 20,
          marginBottom: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
        }}>
          <Text style={{
            fontSize: 18,
            fontFamily: "Inter_600SemiBold",
            color: isDark ? "#FFFFFF" : "#000000",
            marginBottom: 16,
          }}>
            Order Summary
          </Text>
          
          <View style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 12,
          }}>
            <Text style={{
              fontSize: 14,
              fontFamily: "Inter_500Medium",
              color: isDark ? "#9CA3AF" : "#6B7280",
            }}>
              Order Type:
            </Text>
            <Text style={{
              fontSize: 14,
              fontFamily: "Inter_600SemiBold",
              color: isDark ? "#FFFFFF" : "#000000",
            }}>
              {orderType}
            </Text>
          </View>
          
          <View style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 16,
          }}>
            <Text style={{
              fontSize: 14,
              fontFamily: "Inter_500Medium",
              color: isDark ? "#9CA3AF" : "#6B7280",
            }}>
              Timing:
            </Text>
            <Text style={{
              fontSize: 14,
              fontFamily: "Inter_600SemiBold",
              color: isDark ? "#FFFFFF" : "#000000",
            }}>
              {orderTime}
            </Text>
          </View>
          
          <View style={{
            borderTopWidth: 1,
            borderTopColor: isDark ? "#374151" : "#E5E7EB",
            paddingTop: 16,
          }}>
            {cartItems.map((item) => (
              <View
                key={item.id}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <View style={{ flex: 1, marginRight: 12 }}>
                  <Text style={{
                    fontSize: 14,
                    fontFamily: "Inter_500Medium",
                    color: isDark ? "#FFFFFF" : "#000000",
                    marginBottom: 2,
                  }}>
                    {item.name}
                  </Text>
                  <Text style={{
                    fontSize: 12,
                    fontFamily: "Inter_400Regular",
                    color: isDark ? "#9CA3AF" : "#6B7280",
                  }}>
                    Qty: {item.quantity}
                  </Text>
                </View>
                <Text style={{
                  fontSize: 14,
                  fontFamily: "Inter_600SemiBold",
                  color: "#22C55E",
                }}>
                  ₹{item.price * item.quantity}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Bill Breakdown */}
        <View style={{
          backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
          borderRadius: 16,
          padding: 20,
          marginBottom: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
        }}>
          <Text style={{
            fontSize: 18,
            fontFamily: "Inter_600SemiBold",
            color: isDark ? "#FFFFFF" : "#000000",
            marginBottom: 16,
          }}>
            Bill Details
          </Text>
          
          <View style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 12,
          }}>
            <Text style={{
              fontSize: 14,
              fontFamily: "Inter_400Regular",
              color: isDark ? "#E5E7EB" : "#374151",
            }}>
              Subtotal
            </Text>
            <Text style={{
              fontSize: 14,
              fontFamily: "Inter_500Medium",
              color: isDark ? "#FFFFFF" : "#000000",
            }}>
              ₹{getSubtotal()}
            </Text>
          </View>
          
          <View style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{
                fontSize: 14,
                fontFamily: "Inter_400Regular",
                color: isDark ? "#E5E7EB" : "#374151",
                marginRight: 6,
              }}>
                Convenience Fee (3%)
              </Text>
              <Info size={14} color={isDark ? "#9CA3AF" : "#6B7280"} />
            </View>
            <Text style={{
              fontSize: 14,
              fontFamily: "Inter_500Medium",
              color: isDark ? "#FFFFFF" : "#000000",
            }}>
              ₹{getConvenienceCharge()}
            </Text>
          </View>
          
          <View style={{
            borderTopWidth: 1,
            borderTopColor: isDark ? "#374151" : "#E5E7EB",
            paddingTop: 16,
            flexDirection: "row",
            justifyContent: "space-between",
          }}>
            <Text style={{
              fontSize: 16,
              fontFamily: "Inter_600SemiBold",
              color: isDark ? "#FFFFFF" : "#000000",
            }}>
              Total Amount
            </Text>
            <Text style={{
              fontSize: 18,
              fontFamily: "Inter_600SemiBold",
              color: "#22C55E",
            }}>
              ₹{getTotalAmount()}
            </Text>
          </View>
        </View>

        {/* Payment Methods */}
        <View>
          <Text style={{
            fontSize: 18,
            fontFamily: "Inter_600SemiBold",
            color: isDark ? "#FFFFFF" : "#000000",
            marginBottom: 16,
          }}>
            Payment Method
          </Text>
          
          <View style={{ gap: 12 }}>
            {paymentMethods.map((method) => {
              const isSelected = selectedPayment === method.id;
              const IconComponent = method.icon;
              
              return (
                <TouchableOpacity
                  key={method.id}
                  onPress={() => handlePaymentSelect(method.id)}
                  style={{
                    backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
                    borderRadius: 16,
                    padding: 16,
                    borderWidth: 2,
                    borderColor: isSelected ? method.color : (isDark ? "#374151" : "#E5E7EB"),
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: isSelected ? 0.1 : 0.05,
                    shadowRadius: 8,
                    elevation: isSelected ? 4 : 2,
                  }}
                  activeOpacity={0.7}
                >
                  <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}>
                    <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                      <View style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: `${method.color}${isSelected ? 'FF' : '20'}`,
                        justifyContent: "center",
                        alignItems: "center",
                        marginRight: 12,
                      }}>
                        <IconComponent 
                          size={20} 
                          color={isSelected ? "#FFFFFF" : method.color} 
                        />
                      </View>
                      
                      <View style={{ flex: 1 }}>
                        <Text style={{
                          fontSize: 16,
                          fontFamily: "Inter_600SemiBold",
                          color: isDark ? "#FFFFFF" : "#000000",
                          marginBottom: 2,
                        }}>
                          {method.title}
                        </Text>
                        <Text style={{
                          fontSize: 12,
                          fontFamily: "Inter_400Regular",
                          color: isDark ? "#9CA3AF" : "#6B7280",
                        }}>
                          {method.subtitle}
                        </Text>
                      </View>
                    </View>
                    
                    {isSelected && (
                      <View style={{
                        width: 20,
                        height: 20,
                        borderRadius: 10,
                        backgroundColor: method.color,
                        justifyContent: "center",
                        alignItems: "center",
                      }}>
                        <View style={{
                          width: 6,
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: "#FFFFFF",
                        }} />
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Place Order Button */}
      <View style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        paddingBottom: insets.bottom + 20,
        paddingTop: 20,
        backgroundColor: isDark ? "#121212" : "#F8FDF8",
        borderTopWidth: 1,
        borderTopColor: isDark ? "#1E1E1E" : "#E5E7EB",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 10,
      }}>
        <TouchableOpacity
          onPress={placeOrder}
          disabled={isPlacingOrder}
          style={{
            backgroundColor: isPlacingOrder ? "#9CA3AF" : "#22C55E",
            borderRadius: 16,
            paddingVertical: 18,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#22C55E",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: isPlacingOrder ? 0 : 0.3,
            shadowRadius: 8,
            elevation: isPlacingOrder ? 0 : 8,
          }}
          activeOpacity={0.8}
        >
          <CheckCircle size={22} color="#FFFFFF" style={{ marginRight: 12 }} />
          <Text style={{
            fontSize: 18,
            fontFamily: "Inter_600SemiBold",
            color: "#FFFFFF",
            marginRight: 16,
          }}>
            {isPlacingOrder ? "Placing Order..." : "Place Order"}
          </Text>
          <View style={{
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 12,
          }}>
            <Text style={{
              fontSize: 16,
              fontFamily: "Inter_600SemiBold",
              color: "#FFFFFF",
            }}>
              ₹{getTotalAmount()}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}