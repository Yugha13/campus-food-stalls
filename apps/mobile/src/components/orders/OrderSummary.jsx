import { View, Text } from "react-native";

export default function OrderSummary({ isDark, subtotal, convenienceFee, total, title = "Order Summary" }) {
  return (
    <View
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
      <Text
        style={{
          fontSize: 16,
          fontFamily: "Inter_600SemiBold",
          color: isDark ? "#FFFFFF" : "#000000",
          marginBottom: 12,
        }}
      >
        {title}
      </Text>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <Text
          style={{
            fontSize: 14,
            fontFamily: "Inter_400Regular",
            color: isDark ? "#E5E7EB" : "#374151",
          }}
        >
          Subtotal
        </Text>
        <Text
          style={{
            fontSize: 14,
            fontFamily: "Inter_500Medium",
            color: isDark ? "#FFFFFF" : "#000000",
          }}
        >
          ₹{subtotal}
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <Text
          style={{
            fontSize: 14,
            fontFamily: "Inter_400Regular",
            color: isDark ? "#E5E7EB" : "#374151",
          }}
        >
          Convenience Fee (3%)
        </Text>
        <Text
          style={{
            fontSize: 14,
            fontFamily: "Inter_500Medium",
            color: isDark ? "#FFFFFF" : "#000000",
          }}
        >
          ₹{convenienceFee}
        </Text>
      </View>

      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: isDark ? "#333333" : "#E5E7EB",
          paddingTop: 8,
          marginTop: 8,
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Inter_600SemiBold",
              color: isDark ? "#FFFFFF" : "#000000",
            }}
          >
            Total
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Inter_600SemiBold",
              color: "#22C55E",
            }}
          >
            ₹{total}
          </Text>
        </View>
      </View>
    </View>
  );
}
