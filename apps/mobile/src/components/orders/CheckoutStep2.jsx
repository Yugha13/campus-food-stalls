import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { timeSlots } from "../../utils/ordersData";

export default function CheckoutStep2({
  isDark,
  checkoutItems,
  onUpdateTiming,
  onContinue,
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
        Choose Timing
      </Text>
      <Text
        style={{
          fontSize: 14,
          fontFamily: "Inter_400Regular",
          color: isDark ? "#9CA3AF" : "#6B7280",
          marginBottom: 24,
        }}
      >
        When would you like your food to be ready?
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
              <View
                style={{
                  backgroundColor:
                    item.selectedOrderType === "Pickup" ? "#E0F2FE" : "#F0FDF4",
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 8,
                  alignSelf: "flex-start",
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
            </View>
          </View>

          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {timeSlots.map((time) => (
              <TouchableOpacity
                key={time}
                onPress={() => onUpdateTiming(item.id, time)}
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  borderRadius: 8,
                  backgroundColor:
                    item.selectedTiming === time
                      ? "#22C55E"
                      : isDark
                      ? "#2A2A2A"
                      : "#F3F4F6",
                  borderWidth: 1,
                  borderColor:
                    item.selectedTiming === time
                      ? "#22C55E"
                      : isDark
                      ? "#333333"
                      : "#E5E7EB",
                }}
                activeOpacity={0.7}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: "Inter_500Medium",
                    color:
                      item.selectedTiming === time
                        ? "#FFFFFF"
                        : isDark
                        ? "#E5E7EB"
                        : "#374151",
                  }}
                >
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      <View style={{ flexDirection: "row", gap: 12, marginTop: 16 }}>
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
          onPress={onContinue}
          style={{
            flex: 1,
            backgroundColor: "#22C55E",
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
              color: "#FFFFFF",
            }}
          >
            Review Order
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
