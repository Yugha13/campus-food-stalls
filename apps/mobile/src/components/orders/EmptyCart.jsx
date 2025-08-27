import { View, Text, TouchableOpacity } from "react-native";
import { ShoppingBag } from "lucide-react-native";
import { useRouter } from "expo-router";

export default function EmptyCart({ isDark }) {
  const router = useRouter();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 40,
        backgroundColor: isDark ? "#121212" : "#F8FDF8",
      }}
    >
      <View
        style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: isDark ? "#1A2E1A" : "#F0FDF4",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <ShoppingBag size={32} color="#22C55E" />
      </View>
      <Text
        style={{
          fontSize: 20,
          fontFamily: "Inter_600SemiBold",
          color: isDark ? "#FFFFFF" : "#000000",
          marginBottom: 8,
          textAlign: "center",
        }}
      >
        Your Cart is Empty
      </Text>
      <Text
        style={{
          fontSize: 16,
          fontFamily: "Inter_400Regular",
          color: isDark ? "#9CA3AF" : "#6B7280",
          textAlign: "center",
          lineHeight: 24,
          marginBottom: 32,
        }}
      >
        Add some delicious food items to get started
      </Text>
      <TouchableOpacity
        onPress={() => router.push("/(tabs)/home")}
        style={{
          backgroundColor: "#22C55E",
          borderRadius: 12,
          paddingVertical: 12,
          paddingHorizontal: 24,
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
          Browse Menu
        </Text>
      </TouchableOpacity>
    </View>
  );
}
