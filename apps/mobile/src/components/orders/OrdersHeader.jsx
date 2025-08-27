import { View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function OrdersHeader({ isDark }) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        paddingTop: insets.top + 16,
        paddingHorizontal: 20,
        paddingBottom: 16,
        backgroundColor: isDark ? "#121212" : "#F8FDF8",
        borderBottomWidth: 1,
        borderBottomColor: isDark ? "#333333" : "#F0F0F0",
      }}
    >
      <Text
        style={{
          fontSize: 28,
          fontFamily: "Inter_600SemiBold",
          color: isDark ? "#FFFFFF" : "#000000",
        }}
      >
        Orders
      </Text>
    </View>
  );
}
