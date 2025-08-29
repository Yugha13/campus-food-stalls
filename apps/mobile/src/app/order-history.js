import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Platform,
  FlatList,
} from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle,
  Truck,
  Package,
  MapPin,
  Star,
  RefreshCw,
  Phone
} from "lucide-react-native";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";
import { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Dummy order data
const dummyOrders = [
  {
    id: "ORD001",
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
    totalAmount: 280,
    status: "delivered",
    orderDate: "2024-08-28T14:30:00.000Z",
    deliveryDate: "2024-08-28T15:15:00.000Z",
    deliveryAddress: "Block A, Room 205",
    paymentMethod: "Online Payment",
    orderId: "ORD001"
  },
  {
    id: "ORD002",
    items: [
      {
        id: "3",
        name: "Margherita Pizza",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop",
        price: 180,
        quantity: 1,
        shop: "Pizza Corner"
      }
    ],
    totalAmount: 180,
    status: "preparing",
    orderDate: "2024-08-29T13:45:00.000Z",
    estimatedDelivery: "2024-08-29T14:30:00.000Z",
    deliveryAddress: "Block A, Room 205",
    paymentMethod: "Cash on Delivery",
    orderId: "ORD002"
  },
  {
    id: "ORD003",
    items: [
      {
        id: "7",
        name: "Crispy Burger",
        image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop",
        price: 150,
        quantity: 1,
        shop: "Burger Hub"
      },
      {
        id: "19",
        name: "Masala Chai",
        image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&h=300&fit=crop",
        price: 20,
        quantity: 2,
        shop: "Chai Tapri"
      }
    ],
    totalAmount: 190,
    status: "on_the_way",
    orderDate: "2024-08-29T12:20:00.000Z",
    estimatedDelivery: "2024-08-29T13:10:00.000Z",
    deliveryAddress: "Block A, Room 205",
    paymentMethod: "Online Payment",
    orderId: "ORD003"
  }
];

const getStatusInfo = (status) => {
  switch (status) {
    case 'preparing':
      return {
        color: '#F59E0B',
        icon: Clock,
        text: 'Preparing',
        description: 'Your order is being prepared'
      };
    case 'on_the_way':
      return {
        color: '#3B82F6',
        icon: Truck,
        text: 'On the way',
        description: 'Your order is on the way'
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

export default function OrderHistoryPage() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  const [orders, setOrders] = useState(dummyOrders);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' or 'past'
  
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  // Separate orders into upcoming and past
  const upcomingOrders = orders.filter(order => 
    order.status === 'preparing' || order.status === 'on_the_way' || order.status === 'confirmed'
  );
  
  const pastOrders = orders.filter(order => 
    order.status === 'delivered' || order.status === 'cancelled'
  );

  const renderOrderItem = ({ item: order }) => {
    const statusInfo = getStatusInfo(order.status);
    const StatusIcon = statusInfo.icon;
    
    return (
      <TouchableOpacity
        style={{
          backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
          borderRadius: 16,
          padding: 16,
          marginBottom: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
        }}
        activeOpacity={0.7}
        onPress={() => {
          // Navigate to order details
          router.push(`/order-details/${order.id}`);
        }}
      >
        {/* Order Header */}
        <View style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}>
          <Text style={{
            fontSize: 16,
            fontFamily: "Inter_600SemiBold",
            color: isDark ? "#FFFFFF" : "#000000",
          }}>
            Order #{order.orderId}
          </Text>
          
          <View style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: `${statusInfo.color}20`,
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 12,
          }}>
            <StatusIcon size={14} color={statusInfo.color} />
            <Text style={{
              fontSize: 12,
              fontFamily: "Inter_600SemiBold",
              color: statusInfo.color,
              marginLeft: 4,
            }}>
              {statusInfo.text}
            </Text>
          </View>
        </View>
        
        {/* Order Items */}
        <View style={{ marginBottom: 12 }}>
          {order.items.slice(0, 2).map((item, index) => (
            <View key={item.id} style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: index < order.items.length - 1 ? 8 : 0,
            }}>
              <Image
                source={{ uri: item.image }}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  marginRight: 12,
                }}
                contentFit="cover"
              />
              
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontSize: 14,
                  fontFamily: "Inter_500Medium",
                  color: isDark ? "#FFFFFF" : "#000000",
                }}>
                  {item.name} x{item.quantity}
                </Text>
                <Text style={{
                  fontSize: 12,
                  fontFamily: "Inter_400Regular",
                  color: isDark ? "#9CA3AF" : "#6B7280",
                }}>
                  {item.shop}
                </Text>
              </View>
              
              <Text style={{
                fontSize: 14,
                fontFamily: "Inter_500Medium",
                color: "#22C55E",
              }}>
                ₹{item.price * item.quantity}
              </Text>
            </View>
          ))}
          
          {order.items.length > 2 && (
            <Text style={{
              fontSize: 12,
              fontFamily: "Inter_400Regular",
              color: isDark ? "#9CA3AF" : "#6B7280",
              marginTop: 4,
            }}>
              +{order.items.length - 2} more items
            </Text>
          )}
        </View>
        
        {/* Order Details */}
        <View style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}>
          <Text style={{
            fontSize: 14,
            fontFamily: "Inter_500Medium",
            color: isDark ? "#E5E7EB" : "#374151",
          }}>
            Total Amount
          </Text>
          <Text style={{
            fontSize: 16,
            fontFamily: "Inter_600SemiBold",
            color: "#22C55E",
          }}>
            ₹{order.totalAmount}
          </Text>
        </View>
        
        <View style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}>
          <Text style={{
            fontSize: 12,
            fontFamily: "Inter_400Regular",
            color: isDark ? "#9CA3AF" : "#6B7280",
          }}>
            Ordered on {formatDate(order.orderDate)}
          </Text>
          
          <Text style={{
            fontSize: 12,
            fontFamily: "Inter_400Regular",
            color: isDark ? "#9CA3AF" : "#6B7280",
          }}>
            {order.paymentMethod}
          </Text>
        </View>
        
        {/* Status Description */}
        <Text style={{
          fontSize: 12,
          fontFamily: "Inter_400Regular",
          color: statusInfo.color,
          marginBottom: 8,
        }}>
          {statusInfo.description}
        </Text>
        
        {/* Delivery Info */}
        <View style={{
          flexDirection: "row",
          alignItems: "center",
        }}>
          <MapPin size={12} color={isDark ? "#9CA3AF" : "#6B7280"} />
          <Text style={{
            fontSize: 12,
            fontFamily: "Inter_400Regular",
            color: isDark ? "#9CA3AF" : "#6B7280",
            marginLeft: 4,
          }}>
            {order.deliveryAddress}
          </Text>
        </View>
        
        {/* Action Buttons */}
        {order.status === 'on_the_way' && (
          <View style={{
            flexDirection: "row",
            marginTop: 12,
            gap: 8,
          }}>
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: "#22C55E",
                paddingVertical: 8,
                borderRadius: 8,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
              activeOpacity={0.8}
            >
              <Truck size={14} color="#FFFFFF" style={{ marginRight: 4 }} />
              <Text style={{
                fontSize: 12,
                fontFamily: "Inter_600SemiBold",
                color: "#FFFFFF",
              }}>
                Track Order
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: isDark ? "#374151" : "#F3F4F6",
                paddingVertical: 8,
                borderRadius: 8,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
              activeOpacity={0.8}
            >
              <Phone size={14} color={isDark ? "#E5E7EB" : "#374151"} style={{ marginRight: 4 }} />
              <Text style={{
                fontSize: 12,
                fontFamily: "Inter_600SemiBold",
                color: isDark ? "#E5E7EB" : "#374151",
              }}>
                Call Delivery
              </Text>
            </TouchableOpacity>
          </View>
        )}
        
        {order.status === 'delivered' && (
          <TouchableOpacity
            style={{
              backgroundColor: "#F59E0B",
              paddingVertical: 8,
              borderRadius: 8,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 12,
            }}
            activeOpacity={0.8}
          >
            <Star size={14} color="#FFFFFF" style={{ marginRight: 4 }} />
            <Text style={{
              fontSize: 12,
              fontFamily: "Inter_600SemiBold",
              color: "#FFFFFF",
            }}>
              Rate Order
            </Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
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
          marginBottom: 16,
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
            Order History
          </Text>
        </View>
        
        {/* Tab Selector */}
        <View style={{
          flexDirection: "row",
          backgroundColor: isDark ? "#1E1E1E" : "#F3F4F6",
          borderRadius: 12,
          padding: 4,
        }}>
          <TouchableOpacity
            onPress={() => setActiveTab('upcoming')}
            style={{
              flex: 1,
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderRadius: 8,
              backgroundColor: activeTab === 'upcoming' 
                ? (isDark ? "#374151" : "#FFFFFF") 
                : "transparent",
            }}
            activeOpacity={0.7}
          >
            <Text style={{
              fontSize: 14,
              fontFamily: "Inter_600SemiBold",
              color: activeTab === 'upcoming'
                ? (isDark ? "#FFFFFF" : "#000000")
                : (isDark ? "#9CA3AF" : "#6B7280"),
              textAlign: "center",
            }}>
              Upcoming ({upcomingOrders.length})
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => setActiveTab('past')}
            style={{
              flex: 1,
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderRadius: 8,
              backgroundColor: activeTab === 'past' 
                ? (isDark ? "#374151" : "#FFFFFF") 
                : "transparent",
            }}
            activeOpacity={0.7}
          >
            <Text style={{
              fontSize: 14,
              fontFamily: "Inter_600SemiBold",
              color: activeTab === 'past'
                ? (isDark ? "#FFFFFF" : "#000000")
                : (isDark ? "#9CA3AF" : "#6B7280"),
              textAlign: "center",
            }}>
              Past ({pastOrders.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {orders.length === 0 ? (
        /* Empty Orders */
        <View style={{ 
          flex: 1, 
          justifyContent: 'center', 
          alignItems: 'center',
          paddingHorizontal: 40,
        }}>
          <Package size={64} color={isDark ? "#9CA3AF" : "#6B7280"} />
          <Text style={{
            fontSize: 20,
            fontFamily: "Inter_600SemiBold",
            color: isDark ? "#FFFFFF" : "#000000",
            marginTop: 16,
            textAlign: 'center',
          }}>
            No orders yet
          </Text>
          <Text style={{
            fontSize: 16,
            fontFamily: "Inter_400Regular",
            color: isDark ? "#9CA3AF" : "#6B7280",
            marginTop: 8,
            textAlign: 'center',
            lineHeight: 24,
          }}>
            Your order history will appear here once you place your first order
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
              Start Ordering
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* Order List */
        <FlatList
          data={activeTab === 'upcoming' ? upcomingOrders : pastOrders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: insets.bottom + 20,
          }}
          showsVerticalScrollIndicator={false}
          refreshing={isLoading}
          onRefresh={() => {
            setIsLoading(true);
            // Simulate API call
            setTimeout(() => {
              setIsLoading(false);
            }, 1000);
          }}
          ListEmptyComponent={() => (
            <View style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 60,
            }}>
              <Package size={48} color={isDark ? "#6B7280" : "#9CA3AF"} />
              <Text style={{
                fontSize: 16,
                fontFamily: "Inter_600SemiBold",
                color: isDark ? "#9CA3AF" : "#6B7280",
                marginTop: 16,
                textAlign: 'center',
              }}>
                {activeTab === 'upcoming' ? 'No upcoming orders' : 'No past orders'}
              </Text>
              <Text style={{
                fontSize: 14,
                fontFamily: "Inter_400Regular",
                color: isDark ? "#6B7280" : "#9CA3AF",
                marginTop: 8,
                textAlign: 'center',
              }}>
                {activeTab === 'upcoming' 
                  ? 'Orders you place will appear here' 
                  : 'Your completed orders will appear here'}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}