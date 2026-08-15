import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { Clock, CheckCircle } from "lucide-react-native";
import OrderSummary from "./OrderSummary";

export default function CheckoutStep3({
  isDark,
  checkoutItems,
  subtotal,
  tax,
  total,
  onPlaceOrder,
  onBack,
}) {
  return (
    <View>
      <Text
        style={{
          fontSize: 20,
          fontFamily: "Inter_600SemiBold",
          color: isDark ? "#FFFFFF" : "#000000",
          marginBottom: 8,
        }}
      >
        Order Summary
      </Text>
      <Text
        style={{
          fontSize: 14,
          fontFamily: "Inter_400Regular",
          color: isDark ? "#9CA3AF" : "#6B7280",
          marginBottom: 24,
        }}
      >
        Review your order details before placing
      </Text>

      {checkoutItems.map((item) => (
        <View
          key={item.id}
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
        >
          <View style={{ flexDirection: "row" }}>
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
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "Inter_600SemiBold",
                  color: isDark ? "#FFFFFF" : "#000000",
                  marginBottom: 4,
                }}
              >
                {item.name} (x{item.quantity})
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Inter_400Regular",
                  color: isDark ? "#9CA3AF" : "#6B7280",
                  marginBottom: 8,
                }}
              >
                {item.shop}
              </Text>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <View
                  style={{
                    backgroundColor:
                      item.selectedOrderType === "Pickup"
                        ? "#E0F2FE"
                        : "#F0FDF4",
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 8,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: "Inter_600SemiBold",
                      color:
                        item.selectedOrderType === "Pickup"
                          ? "#0369A1"
                          : "#15803D",
                    }}
                  >
                    {item.selectedOrderType}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Clock size={12} color={isDark ? "#9CA3AF" : "#6B7280"} />
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: "Inter_500Medium",
                      color: isDark ? "#9CA3AF" : "#6B7280",
                      marginLeft: 4,
                    }}
                  >
                    {item.selectedTiming}
                  </Text>
                </View>
              </View>
            </View>
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Inter_600SemiBold",
                color: "#22C55E",
              }}
            >
              🪙 {item.price * item.quantity}
            </Text>
          </View>
        </View>
      ))}

      <OrderSummary isDark={isDark} subtotal={subtotal} tax={tax} total={total} title="" />

      <View
        style={{
          backgroundColor: isDark ? "#1A2E1A" : "#F0FDF4",
          borderRadius: 12,
          padding: 16,
          marginBottom: 24,
          borderWidth: 1,
          borderColor: "#22C55E",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <CheckCircle size={16} color="#22C55E" />
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Inter_600SemiBold",
              color: "#22C55E",
              marginLeft: 8,
            }}
          >
            Notification Setup
          </Text>
        </View>
        <Text
          style={{
            fontSize: 12,
            fontFamily: "Inter_400Regular",
            color: isDark ? "#9CA3AF" : "#6B7280",
            lineHeight: 16,
          }}
        >
          You'll receive notifications when your food is ready for pickup/dine-in at each respective timing.
        </Text>
      </View>

      <View style={{ flexDirection: "row", gap: 12 }}>
        <TouchableOpacity
          onPress={onBack}
          style={{
            flex: 1,
            backgroundColor: isDark ? "#2A2A2A" : "#F3F4F6",
            borderRadius: 16,
            paddingVertical: 16,
            paddingHorizontal: 24,
            alignItems: "center",
          }}
          activeOpacity={0.8}
        >
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Inter_600SemiBold",
              color: isDark ? "#E5E7EB" : "#374151",
            }}
          >
            Back
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onPlaceOrder}
          style={{
            flex: 2,
            backgroundColor: "#22C55E",
            borderRadius: 16,
            paddingVertical: 16,
            paddingHorizontal: 24,
            alignItems: "center",
            shadowColor: "#22C55E",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
          activeOpacity={0.8}
        >
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Inter_600SemiBold",
              color: "#FFFFFF",
            }}
          >
            Place Order 🪙 {total}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
