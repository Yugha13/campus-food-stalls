import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { Plus, Minus, Store, Trash2 } from "lucide-react-native";

export default function CartItem({
  item,
  isDark,
  onQuantityChange,
  onRemoveItem,
}) {
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
      <View style={{ flexDirection: "row" }}>
        <Image
          source={{ uri: item.image }}
          style={{
            width: 80,
            height: 80,
            borderRadius: 12,
            marginRight: 16,
          }}
          contentFit="cover"
        />

        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 4,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Inter_600SemiBold",
                color: isDark ? "#FFFFFF" : "#000000",
                flex: 1,
                marginRight: 8,
              }}
            >
              {item.name}
            </Text>
            <TouchableOpacity
              onPress={() => onRemoveItem(item.id)}
              style={{ padding: 4 }}
            >
              <Trash2 size={16} color={isDark ? "#9CA3AF" : "#6B7280"} />
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 4,
            }}
          >
            <Store size={12} color={isDark ? "#9CA3AF" : "#6B7280"} />
            <Text
              style={{
                fontSize: 12,
                fontFamily: "Inter_400Regular",
                color: isDark ? "#9CA3AF" : "#6B7280",
                marginLeft: 4,
                marginRight: 12,
              }}
            >
              {item.shop}
            </Text>
            <View
              style={{
                backgroundColor:
                  item.orderType === "Pickup" ? "#E0F2FE" : "#F0FDF4",
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 10,
                  fontFamily: "Inter_600SemiBold",
                  color: item.orderType === "Pickup" ? "#0369A1" : "#15803D",
                }}
              >
                {item.orderType}
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 8,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Inter_600SemiBold",
                color: "#22C55E",
              }}
            >
              🪙 {item.price * item.quantity}
            </Text>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity
                onPress={() => onQuantityChange(item.id, "decrease")}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  backgroundColor:
                    item.quantity > 1
                      ? "#22C55E"
                      : isDark
                      ? "#333333"
                      : "#E5E7EB",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                activeOpacity={0.7}
                disabled={item.quantity <= 1}
              >
                <Minus
                  size={16}
                  color={
                    item.quantity > 1
                      ? "#FFFFFF"
                      : isDark
                      ? "#666666"
                      : "#9CA3AF"
                  }
                />
              </TouchableOpacity>

              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "Inter_600SemiBold",
                  color: isDark ? "#FFFFFF" : "#000000",
                  marginHorizontal: 16,
                  minWidth: 20,
                  textAlign: "center",
                }}
              >
                {item.quantity}
              </Text>

              <TouchableOpacity
                onPress={() => onQuantityChange(item.id, "increase")}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  backgroundColor: "#22C55E",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                activeOpacity={0.7}
              >
                <Plus size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
