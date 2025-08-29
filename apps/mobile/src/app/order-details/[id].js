import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Platform,
  Alert,
  Linking,
} from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter, useLocalSearchParams } from "expo-router";
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle,
  Truck,
  Package,
  MapPin,
  Star,
  RefreshCw,
  Phone,
  Store,
  CreditCard,
  Calendar,
  Plus,
  User
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

// Dummy order data for demo (in real app this would come from API/storage)
const dummyOrderData = {
  "ORD1725002400000": {
    id: "ORD1725002400000",
    items: [
      {
        id: "1",
        name: "Chicken Momos",
        image: "https://images.unsplash.com/photo-1496412705862-e0088f16f791?w=400&h=300&fit=crop",
        price: 80,
        quantity: 2,
        shop: "Momos Point"
      },
      {
        id: "5",
        name: "Cold Coffee",
        image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop",
        price: 120,
        quantity: 1,
        shop: "Cafe Beans"
      }
    ],
    subtotal: 280,
    convenienceCharge: 8,
    totalAmount: 288,
    status: "delivered",
    orderDate: "2024-08-28T14:30:00.000Z",
    deliveryDate: "2024-08-28T15:15:00.000Z",
    orderType: "Delivery",
    deliveryAddress: "Block A, Room 205",
    paymentMethod: "Online Payment",
    orderTime: "2:30 PM",
    specialInstructions: "Please deliver to the back door",
  }
};

const getStatusInfo = (status) => {
  switch (status) {
    case 'preparing':
      return {
        color: '#F59E0B',
        icon: Clock,
        text: 'Preparing',
        description: 'Your order is being prepared by the restaurant'
      };
    case 'on_the_way':
      return {
        color: '#3B82F6',
        icon: Truck,
        text: 'On the way',
        description: 'Your order is on the way to your location'
      };
    case 'delivered':
      return {
        color: '#22C55E',
        icon: CheckCircle,
        text: 'Delivered',
        description: 'Order delivered successfully'
      };
    case 'cancelled':
      return {
        color: '#EF4444',
        icon: RefreshCw,
        text: 'Cancelled',
        description: 'Order was cancelled'
      };
    default:
      return {
        color: '#6B7280',
        icon: Package,
        text: 'Unknown',
        description: 'Status unknown'
      };
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function OrderDetailsPage() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  useEffect(() => {
    loadOrderDetails();
  }, [id]);

  const loadOrderDetails = async () => {
    try {
      // First try to load from order history
      const orderHistory = await AsyncStorage.getItem('orderHistory');
      if (orderHistory) {
        const orders = JSON.parse(orderHistory);
        const foundOrder = orders.find(o => o.id === id);
        if (foundOrder) {
          setOrder(foundOrder);
          setIsLoading(false);
          return;
        }
      }
      
      // If not found in storage, use dummy data (for demo purposes)
      const dummyOrder = dummyOrderData[id];
      if (dummyOrder) {
        setOrder(dummyOrder);
      }
    } catch (error) {
      console.error('Error loading order details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addItemToCart = async (item) => {
    try {
      if (Platform.OS === 'ios') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }

      const cartData = await AsyncStorage.getItem('cartItems');
      const cartItems = cartData ? JSON.parse(cartData) : [];
      
      const existingItem = cartItems.find(cartItem => cartItem.id === item.id);
      let newCartItems;
      
      if (existingItem) {
        newCartItems = cartItems.map(cartItem => 
          cartItem.id === item.id 
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        newCartItems = [...cartItems, { ...item, quantity: 1, addedAt: new Date().toISOString() }];
      }
      
      await AsyncStorage.setItem('cartItems', JSON.stringify(newCartItems));
      
      if (Platform.OS === 'ios') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      
      Alert.alert("Success", `${item.name} added to cart!`);
    } catch (error) {
      console.error('Error adding item to cart:', error);
      Alert.alert("Error", "Failed to add item to cart. Please try again.");
    }
  };

  const showRatingModal = (item) => {
    Alert.alert(
      "Rate Order",
      `How would you rate ${item.name}?`,
      [
        { text: "⭐", onPress: () => submitRating(item, 1) },
        { text: "⭐⭐", onPress: () => submitRating(item, 2) },
        { text: "⭐⭐⭐", onPress: () => submitRating(item, 3) },
        { text: "⭐⭐⭐⭐", onPress: () => submitRating(item, 4) },
        { text: "⭐⭐⭐⭐⭐", onPress: () => submitRating(item, 5) },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  const submitRating = (item, rating) => {
    if (Platform.OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    Alert.alert("Thank you!", `You rated ${item.name} ${rating} star${rating > 1 ? 's' : ''}!`);
  };

  const callRestaurant = () => {
    const phoneNumber = "+919876543210";
    Linking.openURL(`tel:${phoneNumber}`);
  };

  if (!fontsLoaded || isLoading) {
    return (
      <View style={{ 
        flex: 1, 
        backgroundColor: isDark ? "#121212" : "#F8FDF8",
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Text style={{ color: isDark ? "#FFFFFF" : "#000000" }}>Loading order details...</Text>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={{ 
        flex: 1, 
        backgroundColor: isDark ? "#121212" : "#F8FDF8",
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Package size={64} color={isDark ? "#9CA3AF" : "#6B7280"} />
        <Text style={{
          fontSize: 18,
          fontFamily: "Inter_600SemiBold",
          color: isDark ? "#FFFFFF" : "#000000",
          marginTop: 16,
        }}>
          Order not found
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            backgroundColor: "#22C55E",
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 12,
            marginTop: 16,
          }}
        >
          <Text style={{
            fontSize: 16,
            fontFamily: "Inter_600SemiBold",
            color: "#FFFFFF",
          }}>
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const statusInfo = getStatusInfo(order.status);
  const StatusIcon = statusInfo.icon;
  const isPastOrder = order.status === 'delivered' || order.status === 'cancelled';

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
              Order Details
            </Text>
          </View>
          
          <TouchableOpacity
            onPress={callRestaurant}
            style={{
              padding: 8,
              borderRadius: 12,
              backgroundColor: "#22C55E",
            }}
          >
            <Phone size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ 
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Order Status Card */}
        <View style={{
          backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
          borderRadius: 16,
          padding: 20,
          marginBottom: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
        }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
            <View style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: `${statusInfo.color}20`,
              alignItems: "center",
              justifyContent: "center",
              marginRight: 12,
            }}>
              <StatusIcon size={24} color={statusInfo.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{
                fontSize: 18,
                fontFamily: "Inter_600SemiBold",
                color: statusInfo.color,
                marginBottom: 2,
              }}>
                {statusInfo.text}
              </Text>
              <Text style={{
                fontSize: 14,
                fontFamily: "Inter_400Regular",
                color: isDark ? "#9CA3AF" : "#6B7280",
              }}>
                {statusInfo.description}
              </Text>
            </View>
          </View>
          
          <View style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: isDark ? "#374151" : "#F3F4F6",
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 12,
          }}>
            <View>
              <Text style={{
                fontSize: 12,
                fontFamily: "Inter_400Regular",
                color: isDark ? "#9CA3AF" : "#6B7280",
                marginBottom: 2,
              }}>
                Order ID
              </Text>
              <Text style={{
                fontSize: 14,
                fontFamily: "Inter_600SemiBold",
                color: isDark ? "#FFFFFF" : "#000000",
              }}>
                {order.id}
              </Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={{
                fontSize: 12,
                fontFamily: "Inter_400Regular",
                color: isDark ? "#9CA3AF" : "#6B7280",
                marginBottom: 2,
              }}>
                {order.status === 'delivered' ? 'Delivered' : 'Ordered'} on
              </Text>
              <Text style={{
                fontSize: 14,
                fontFamily: "Inter_600SemiBold",
                color: isDark ? "#FFFFFF" : "#000000",
              }}>
                {formatDate(order.orderDate)}
              </Text>
            </View>
          </View>
        </View>

        {/* Order Details */}
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
            marginBottom: 16,
          }}>
            Order Information
          </Text>
          
          <View style={{ gap: 12 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Store size={16} color={isDark ? "#9CA3AF" : "#6B7280"} />
              <Text style={{
                fontSize: 14,
                fontFamily: "Inter_400Regular",
                color: isDark ? "#9CA3AF" : "#6B7280",
                marginLeft: 8,
                flex: 1,
              }}>
                Order Type:
              </Text>
              <Text style={{
                fontSize: 14,
                fontFamily: "Inter_600SemiBold",
                color: isDark ? "#FFFFFF" : "#000000",
              }}>
                {order.orderType}
              </Text>
            </View>
            
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Clock size={16} color={isDark ? "#9CA3AF" : "#6B7280"} />
              <Text style={{
                fontSize: 14,
                fontFamily: "Inter_400Regular",
                color: isDark ? "#9CA3AF" : "#6B7280",
                marginLeft: 8,
                flex: 1,
              }}>
                Order Time:
              </Text>
              <Text style={{
                fontSize: 14,
                fontFamily: "Inter_600SemiBold",
                color: isDark ? "#FFFFFF" : "#000000",
              }}>
                {order.orderTime}
              </Text>
            </View>
            
            {order.deliveryAddress && (
              <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                <MapPin size={16} color={isDark ? "#9CA3AF" : "#6B7280"} style={{ marginTop: 2 }} />
                <Text style={{
                  fontSize: 14,
                  fontFamily: "Inter_400Regular",
                  color: isDark ? "#9CA3AF" : "#6B7280",
                  marginLeft: 8,
                  flex: 1,
                }}>
                  Delivery Address:
                </Text>
                <Text style={{
                  fontSize: 14,
                  fontFamily: "Inter_600SemiBold",
                  color: isDark ? "#FFFFFF" : "#000000",
                  flex: 2,
                  textAlign: "right",
                }}>
                  {order.deliveryAddress}
                </Text>
              </View>
            )}
            
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <CreditCard size={16} color={isDark ? "#9CA3AF" : "#6B7280"} />
              <Text style={{
                fontSize: 14,
                fontFamily: "Inter_400Regular",
                color: isDark ? "#9CA3AF" : "#6B7280",
                marginLeft: 8,
                flex: 1,
              }}>
                Payment:
              </Text>
              <Text style={{
                fontSize: 14,
                fontFamily: "Inter_600SemiBold",
                color: isDark ? "#FFFFFF" : "#000000",
              }}>
                {order.paymentMethod}
              </Text>
            </View>
          </View>
          
          {order.specialInstructions && (
            <>
              <View style={{
                height: 1,
                backgroundColor: isDark ? "#374151" : "#E5E7EB",
                marginVertical: 16,
              }} />
              
              <View>
                <Text style={{
                  fontSize: 14,
                  fontFamily: "Inter_600SemiBold",
                  color: isDark ? "#FFFFFF" : "#000000",
                  marginBottom: 8,
                }}>
                  Special Instructions:
                </Text>
                <Text style={{
                  fontSize: 14,
                  fontFamily: "Inter_400Regular",
                  color: isDark ? "#E5E7EB" : "#374151",
                  lineHeight: 20,
                }}>
                  {order.specialInstructions}
                </Text>
              </View>
            </>
          )}
        </View>

        {/* Order Items */}
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
            marginBottom: 16,
          }}>
            Order Items ({order.items.length})
          </Text>
          
          {order.items.map((item) => (
            <View
              key={item.id}
              style={{
                flexDirection: "row",
                marginBottom: 16,
                paddingBottom: 16,
                borderBottomWidth: 1,
                borderBottomColor: isDark ? "#374151" : "#E5E7EB",
              }}
            >
              <Image
                source={{ uri: item.image }}
                style={{
                  width: 60,
                  height: 60,
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
                  <Store size={12} color={isDark ? "#9CA3AF" : "#6B7280"} />
                  <Text style={{
                    fontSize: 12,
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
                    fontSize: 16,
                    fontFamily: "Inter_600SemiBold",
                    color: "#22C55E",
                  }}>
                    ₹{item.price} × {item.quantity}
                  </Text>
                  
                  {isPastOrder && (
                    <View style={{ flexDirection: "row", gap: 8 }}>
                      <TouchableOpacity
                        onPress={() => addItemToCart(item)}
                        style={{
                          backgroundColor: "#22C55E",
                          paddingHorizontal: 12,
                          paddingVertical: 6,
                          borderRadius: 8,
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                        activeOpacity={0.8}
                      >
                        <Plus size={12} color="#FFFFFF" style={{ marginRight: 4 }} />
                        <Text style={{
                          fontSize: 12,
                          fontFamily: "Inter_600SemiBold",
                          color: "#FFFFFF",
                        }}>
                          Add to Cart
                        </Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        onPress={() => showRatingModal(item)}
                        style={{
                          backgroundColor: "#F59E0B",
                          paddingHorizontal: 12,
                          paddingVertical: 6,
                          borderRadius: 8,
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                        activeOpacity={0.8}
                      >
                        <Star size={12} color="#FFFFFF" style={{ marginRight: 4 }} />
                        <Text style={{
                          fontSize: 12,
                          fontFamily: "Inter_600SemiBold",
                          color: "#FFFFFF",
                        }}>
                          Rate
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Bill Summary */}
        <View style={{
          backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
          borderRadius: 16,
          padding: 16,
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
            marginBottom: 16,
          }}>
            Bill Summary
          </Text>
          
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
              ₹{order.subtotal || order.totalAmount - (order.convenienceCharge || 0)}
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
              ₹{order.convenienceCharge || Math.round((order.subtotal || order.totalAmount) * 0.03)}
            </Text>
          </View>
          
          <View style={{
            height: 1,
            backgroundColor: isDark ? "#374151" : "#E5E7EB",
            marginBottom: 12,
          }} />
          
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
              Total Paid
            </Text>
            <Text style={{
              fontSize: 20,
              fontFamily: "Inter_600SemiBold",
              color: "#22C55E",
            }}>
              ₹{order.totalAmount}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}