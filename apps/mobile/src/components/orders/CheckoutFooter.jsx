import { View, Text, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import OrderSummary from "./OrderSummary";

export default function CheckoutFooter({
  isDark,
  subtotal,
  tax,
  total,
  onCheckout,
}) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: isDark ? "#121212" : "#F8FDF8",
        paddingHorizontal: 20,
        paddingBottom: insets.bottom + 20,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: isDark ? "#333333" : "#E5E7EB",
      }}
    >
     

      <TouchableOpacity
        onPress={onCheckout}
        style={{
          backgroundColor: "#22C55E",
          borderRadius: 16,
          paddingVertical: 16,
          paddingHorizontal: 24,
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
        <Text
          style={{
            fontSize: 16,
            fontFamily: "Inter_600SemiBold",
            color: "#FFFFFF",
            marginRight: 8,
          }}
        >
          Proceed to Checkout
        </Text>
        <Text
          style={{
            fontSize: 16,
            fontFamily: "Inter_600SemiBold",
            color: "#FFFFFF",
          }}
        >
          🪙 {subtotal}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
