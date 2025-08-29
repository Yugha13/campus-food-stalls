import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { 
  ArrowLeft, 
  Store, 
  Package,
  Truck,
  ChevronRight
} from "lucide-react-native";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";
import { useState } from "react";
import * as Haptics from 'expo-haptics';

export default function CheckoutStep1() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  const [selectedOrderType, setSelectedOrderType] = useState("Dine-in"); // Default to Dine-in
  
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

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

  const orderTypes = [
    {
      id: "Dine-in",
      title: "Dine-in",
      subtitle: "Eat at the restaurant",
      icon: Store,
      color: "#22C55E"
    },
    {
      id: "Pickup",
      title: "Pickup",
      subtitle: "Collect from restaurant",
      icon: Package,
      color: "#3B82F6"
    },
    {
      id: "Delivery",
      title: "Delivery",
      subtitle: "Delivered to your location",
      icon: Truck,
      color: "#F59E0B"
    }
  ];

  const handleOrderTypeSelect = (orderType) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedOrderType(orderType);
  };

  const handleContinue = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    // Navigate to step 2 with selected order type
    router.push({
      pathname: '/checkout-step2',
      params: { orderType: selectedOrderType }
    });
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
              Order Type
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
              Step 1 of 3
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
            width: '33.33%',
            backgroundColor: "#22C55E",
            borderRadius: 2,
          }} />
        </View>
      </View>

      {/* Content */}
      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}>
        <Text style={{
          fontSize: 16,
          fontFamily: "Inter_400Regular",
          color: isDark ? "#9CA3AF" : "#6B7280",
          marginBottom: 24,
          lineHeight: 24,
        }}>
          Choose how you'd like to receive your order. Dine-in is pre-selected for your convenience.
        </Text>

        {/* Order Type Options */}
        <View style={{ gap: 16 }}>
          {orderTypes.map((orderType) => {
            const isSelected = selectedOrderType === orderType.id;
            const IconComponent = orderType.icon;
            
            return (
              <TouchableOpacity
                key={orderType.id}
                onPress={() => handleOrderTypeSelect(orderType.id)}
                style={{
                  backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
                  borderRadius: 16,
                  padding: 20,
                  borderWidth: 2,
                  borderColor: isSelected ? orderType.color : (isDark ? "#374151" : "#E5E7EB"),
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
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      backgroundColor: `${orderType.color}${isSelected ? 'FF' : '20'}`,
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: 16,
                    }}>
                      <IconComponent 
                        size={24} 
                        color={isSelected ? "#FFFFFF" : orderType.color} 
                      />
                    </View>
                    
                    <View style={{ flex: 1 }}>
                      <Text style={{
                        fontSize: 18,
                        fontFamily: "Inter_600SemiBold",
                        color: isDark ? "#FFFFFF" : "#000000",
                        marginBottom: 4,
                      }}>
                        {orderType.title}
                      </Text>
                      <Text style={{
                        fontSize: 14,
                        fontFamily: "Inter_400Regular",
                        color: isDark ? "#9CA3AF" : "#6B7280",
                      }}>
                        {orderType.subtitle}
                      </Text>
                    </View>
                  </View>
                  
                  {isSelected && (
                    <View style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      backgroundColor: orderType.color,
                      justifyContent: "center",
                      alignItems: "center",
                    }}>
                      <View style={{
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: "#FFFFFF",
                      }} />
                    </View>
                  )}
                </View>
                
                {orderType.id === "Dine-in" && (
                  <View style={{
                    marginTop: 12,
                    paddingTop: 12,
                    borderTopWidth: 1,
                    borderTopColor: isDark ? "#374151" : "#E5E7EB",
                  }}>
                    <Text style={{
                      fontSize: 12,
                      fontFamily: "Inter_500Medium",
                      color: "#22C55E",
                    }}>
                      ✨ Recommended • Quick & Easy
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Continue Button */}
      <View style={{
        paddingHorizontal: 20,
        paddingBottom: insets.bottom + 20,
        paddingTop: 20,
        backgroundColor: isDark ? "#121212" : "#F8FDF8",
      }}>
        <TouchableOpacity
          onPress={handleContinue}
          style={{
            backgroundColor: "#22C55E",
            borderRadius: 16,
            paddingVertical: 16,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#22C55E",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
          activeOpacity={0.8}
        >
          <Text style={{
            fontSize: 16,
            fontFamily: "Inter_600SemiBold",
            color: "#FFFFFF",
            marginRight: 8,
          }}>
            Continue to Timing
          </Text>
          <ChevronRight size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}