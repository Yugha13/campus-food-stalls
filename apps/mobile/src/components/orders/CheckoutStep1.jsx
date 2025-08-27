import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";

export default function CheckoutStep1({
  isDark,
  checkoutItems,
  onUpdateOrderType,
  onContinue,
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
        Choose Order Type
      </Text>
      <Text
        style={{
          fontSize: 14,
          fontFamily: "Inter_400Regular",
          color: isDark ? "#9CA3AF" : "#6B7280",
          marginBottom: 24,
        }}
      >
        Select pickup or dine-in for each item
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
          <View style={{ flexDirection: "row", marginBottom: 16 }}>
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
                }}
              >
                {item.shop}
              </Text>
            </View>
          </View>

          <View
            style={{
              backgroundColor: isDark ? "#2A2A2A" : "#F3F4F6",
              borderRadius: 12,
              padding: 4,
              flexDirection: "row",
            }}
          >
            {["Pickup", "Dine-in"].map((type) => (
              <TouchableOpacity
                key={type}
                onPress={() => onUpdateOrderType(item.id, type)}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderRadius: 8,
                  backgroundColor:
                    item.selectedOrderType === type ? "#22C55E" : "transparent",
                  alignItems: "center",
                }}
                activeOpacity={0.7}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "Inter_600SemiBold",
                    color:
                      item.selectedOrderType === type
                        ? "#FFFFFF"
                        : isDark
                        ? "#9CA3AF"
                        : "#6B7280",
                  }}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      <TouchableOpacity
        onPress={onContinue}
        style={{
          backgroundColor: "#22C55E",
          borderRadius: 16,
          paddingVertical: 16,
          paddingHorizontal: 24,
          alignItems: "center",
          marginTop: 16,
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
          Continue to Timing
        </Text>
      </TouchableOpacity>
    </View>
  );
}
