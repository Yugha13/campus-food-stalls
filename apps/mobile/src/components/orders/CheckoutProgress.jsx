import { View } from "react-native";

export default function CheckoutProgress({ currentStep, isDark }) {
  return (
    <View
      style={{
        flexDirection: "row",
        paddingHorizontal: 20,
        paddingVertical: 16,
        gap: 8,
      }}
    >
      {[1, 2, 3].map((step) => (
        <View
          key={step}
          style={{
            flex: 1,
            height: 4,
            borderRadius: 2,
            backgroundColor:
              currentStep >= step
                ? "#22C55E"
                : isDark
                ? "#333333"
                : "#E5E7EB",
          }}
        />
      ))}
    </View>
  );
}
